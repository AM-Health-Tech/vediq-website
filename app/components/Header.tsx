import Link from 'next/link';

export default function Header() {
  return (
    <header className="top">
      <div className="shell nav">
        <Link className="logo" href="/">
          Vediq<i>●</i>
        </Link>

        <input type="checkbox" id="nav-toggle" className="nav-toggle-input" />

        <div className="nav-right">
          <nav className="desktop-nav" aria-label="Main navigation">
            <div className="nav-item">
              <Link href="/#sidecar" className="nav-trigger">
                Products
                <svg className="caret" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
              <div className="dropdown">
                <div className="dropdown-panel">
                  <Link href="/#sidecar">
                    <strong>Point-of-care sidecar</strong>
                    <small>Ambient RAF recapture, gap closure and coding support at the encounter</small>
                  </Link>
                  <Link href="/#command">
                    <strong>Management command center</strong>
                    <small>Retrospective analytics, work management and scheduling</small>
                  </Link>
                </div>
              </div>
            </div>
            <Link href="/#programs">Programs</Link>
            <Link href="/#who-we-are">Who We Are</Link>
          </nav>

          <Link className="button dark" href="/demo">
            Request a demo <b>↗</b>
          </Link>
        </div>

        <label htmlFor="nav-toggle" className="nav-toggle-btn" aria-label="Toggle menu">
          <span></span>
          <span></span>
          <span></span>
        </label>
      </div>
    </header>
  );
}
