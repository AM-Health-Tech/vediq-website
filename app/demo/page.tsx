import type { Metadata } from 'next';
import DemoForm from './DemoForm';

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

        <DemoForm />
      </section>
    </main>
  );
}
