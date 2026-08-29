import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact — Vediq',
  description: 'Email the Vediq team directly, or request a demo for your practice, ACO or plan.',
};

export default function ContactPage() {
  return (
    <main>
      <section className="section shell">
        <div className="intro">
          <span>Contact</span>
          <h2>Reach us<br />directly.</h2>
          <p>For a quick question, email us below. For a structured walkthrough of your program, request a demo instead.</p>
        </div>
        <div className="contact-grid single">
          <article>
            <small>Email</small>
            <a href="mailto:info@vediq.net">info@vediq.net</a>
          </article>
        </div>
        <a className="button dark contact-cta" href="/demo">
          Request a demo <b>↗</b>
        </a>
      </section>
    </main>
  );
}
