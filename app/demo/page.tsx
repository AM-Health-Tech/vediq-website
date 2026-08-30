import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Request a demo — Vediq',
  description: 'Request a focused walkthrough of Vediq for your primary care or value-based care workflow.',
};

export default function DemoPage() {
  return (
    <main>
      <section className="section shell">
        <div className="intro">
          <span>Request a demo</span>
          <h2>See Vediq in<br />your workflow.</h2>
          <p>Request a focused walkthrough of the Vediq sidecar and command center. We&apos;ll discuss your organization, current EHR workflow and value-based care priorities.</p>
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

          <button type="submit" className="button dark demo-submit">
            Request a demo <b>↗</b>
          </button>
          <p className="form-note">This currently opens your email app with the request addressed to <strong>info@vediq.net</strong>. Please do not include protected health information (PHI).</p>
        </form>
      </section>
    </main>
  );
}
