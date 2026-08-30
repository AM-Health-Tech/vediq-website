'use client';

import { FormEvent, useState } from 'react';

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

export default function DemoForm() {
  const [status, setStatus] = useState<FormStatus>('idle');
  const [message, setMessage] = useState('');

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('submitting');
    setMessage('');

    const form = event.currentTarget;
    const data = new FormData(form);
    const payload = {
      firstName: data.get('firstName'),
      lastName: data.get('lastName'),
      workEmail: data.get('workEmail'),
      organizationName: data.get('organizationName'),
      organizationType: data.get('organizationType'),
      problem: data.get('problem'),
      website: data.get('website'),
    };

    try {
      const response = await fetch('/api/demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await response.json().catch(() => ({})) as { error?: string };
      if (!response.ok) throw new Error(result.error || 'We could not send your request.');

      form.reset();
      setStatus('success');
      setMessage('Thank you. Your request has been sent to the Vediq team.');
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'We could not send your request. Please try again.');
    }
  }

  return (
    <form className="demo-form" onSubmit={submit}>
      <div className="field">
        <label htmlFor="firstName">First name*</label>
        <input id="firstName" name="firstName" type="text" autoComplete="given-name" maxLength={80} required />
      </div>
      <div className="field">
        <label htmlFor="lastName">Last name*</label>
        <input id="lastName" name="lastName" type="text" autoComplete="family-name" maxLength={80} required />
      </div>
      <div className="field">
        <label htmlFor="workEmail">Work email*</label>
        <input id="workEmail" name="workEmail" type="email" autoComplete="email" maxLength={254} required />
      </div>
      <div className="field">
        <label htmlFor="organizationName">Organization name*</label>
        <input id="organizationName" name="organizationName" type="text" autoComplete="organization" maxLength={160} required />
      </div>
      <div className="field field-wide">
        <label htmlFor="organizationType">Organization type*</label>
        <select id="organizationType" name="organizationType" defaultValue="" required>
          <option value="" disabled>Please select</option>
          <option value="Independent or group practice">Independent or group practice</option>
          <option value="ACO (REACH, LEAD or MSSP)">ACO (REACH, LEAD or MSSP)</option>
          <option value="Medicare Advantage plan">Medicare Advantage plan</option>
          <option value="Medicaid managed care organization">Medicaid managed care organization</option>
          <option value="Health system">Health system</option>
          <option value="Other">Other</option>
        </select>
      </div>
      <div className="field field-wide">
        <label htmlFor="problem">What are you trying to solve?</label>
        <textarea id="problem" name="problem" rows={4} maxLength={2000} />
      </div>
      <div className="form-honeypot" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <button type="submit" className="button dark demo-submit" disabled={status === 'submitting'}>
        {status === 'submitting' ? 'Sending…' : 'Request a demo'} <b>↗</b>
      </button>
      <p className="form-note">Your request is sent directly to <strong>info@vediq.net</strong>. Please do not include protected health information (PHI).</p>
      <div className={`form-status ${status}`} role="status" aria-live="polite">
        {message}
      </div>
    </form>
  );
}
