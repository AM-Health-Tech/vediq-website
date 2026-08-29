import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Request a demo — Vediq',
  description: 'Tell us about your practice, ACO or plan and what you are trying to solve, and we will follow up to set up a demo.',
};

export default function DemoPage() {
  return (
    <main>
      <section className="section shell">
        <div className="intro">
          <span>Request a demo</span>
          <h2>Tell us where<br />you need help.</h2>
          <p>Share a few details about your organization and what you&apos;re trying to solve. Submitting opens your email client with this pre-filled to send to <strong>info@vediq.net</strong> — for now, that&apos;s how requests reach us directly.</p>
        </div>

        <form className="demo-form" action="mailto:info@vediq.net?subject=Vediq%20demo%20request" method="post" encType="text/plain">
          <div className="field">
            <label htmlFor="firstName">First name*</label>
            <input id="firstName" name="First name" type="text" required />
          </div>
          <div className="field">
            <label htmlFor="lastName">Last name*</label>
            <input id="lastName" name="Last name" type="text" required />
          </div>

          <div className="field">
            <label htmlFor="email">Work email*</label>
            <input id="email" name="Work email" type="email" required />
          </div>
          <div className="field">
            <label htmlFor="title">Job title</label>
            <input id="title" name="Job title" type="text" />
          </div>

          <div className="field field-wide">
            <label htmlFor="problem">What are you trying to solve?</label>
            <textarea id="problem" name="What are you trying to solve" rows={3} />
          </div>

          <div className="field">
            <label htmlFor="orgName">Organization name*</label>
            <input id="orgName" name="Organization name" type="text" required />
          </div>
          <div className="field">
            <label htmlFor="orgType">Organization type*</label>
            <select id="orgType" name="Organization type" defaultValue="" required>
              <option value="" disabled>Please select</option>
              <option value="Independent or group practice">Independent or group practice</option>
              <option value="ACO (REACH, LEAD or MSSP)">ACO (REACH, LEAD or MSSP)</option>
              <option value="Medicare Advantage plan">Medicare Advantage plan</option>
              <option value="Medicaid managed care organization">Medicaid managed care organization</option>
              <option value="Health system">Health system</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="field">
            <label htmlFor="region">State / region</label>
            <input id="region" name="State or region" type="text" />
          </div>
          <div className="field">
            <label htmlFor="source">How did you hear about Vediq?</label>
            <select id="source" name="How did you hear about Vediq" defaultValue="">
              <option value="" disabled>Please select</option>
              <option value="Referral">Referral</option>
              <option value="LinkedIn">LinkedIn</option>
              <option value="Conference or event">Conference or event</option>
              <option value="Search">Search</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <button type="submit" className="button dark demo-submit">
            Request a demo <b>↗</b>
          </button>
        </form>
      </section>
    </main>
  );
}
