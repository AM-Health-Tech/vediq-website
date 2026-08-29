import Link from 'next/link';

export default function Footer() {
  return (
    <footer>
      <div className="shell footer-grid">
        <Link className="logo" href="/">
          Vediq<i>●</i>
        </Link>
        <p>
          Identify the issue.
          <br />
          Close it in care.
          <br />
          Improve performance.
        </p>
        <div>
          <small>Contact</small>
          <Link href="/demo">Request a demo</Link>
          <Link href="/contact">Contact us</Link>
          <a href="mailto:info@vediq.net">info@vediq.net</a>
        </div>
        <div>
          <small>Explore</small>
          <Link href="/#sidecar">Sidecar</Link>
          <Link href="/#command">Command center</Link>
          <Link href="/#who-we-are">Who We Are</Link>
        </div>
      </div>
      <div className="shell legal">
        <span>© 2026 Vediq Ltd.</span>
        <span>For providers, ACOs and managed care organizations</span>
      </div>
    </footer>
  );
}
