const iconPaths = {
  booking: 'M4 5h16v15H4z M8 3v4 M16 3v4 M7 11h4 M7 15h7',
  box: 'm12 3 9 5-9 5-9-5 9-5z M3 8v9l9 5 9-5V8 M12 13v9',
  clock: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z M12 7v5l3 2',
  email: 'M3 5h18v14H3z M3 7l9 6 9-6',
  key: 'M21 2l-2 2m-7.5 7.5a5 5 0 1 1-7.1 7.1 5 5 0 0 1 7.1-7.1z M14 10l4-4 3 3-4 4 M17 7l2 2',
  lock: 'M5 10h14v11H5z M8 10V7a4 4 0 1 1 8 0v3',
  tracking: 'M4 6h6 M4 12h10 M4 18h6 M15 5l5 3-5 3 M15 13l5 3-5 3',
};

export function Icon({ name, className = '' }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.7"
      viewBox="0 0 24 24"
    >
      <path d={iconPaths[name] || iconPaths.box} />
    </svg>
  );
}

function Brand() {
  return (
    <a className="auth-brand" href="/" aria-label="FleetFlow home">
      <span className="brand-mark" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M3 7h11v10H3zM14 10h4l3 3v4h-7zM7 19a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM18 19a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
        </svg>
      </span>
      <span>FleetFlow</span>
    </a>
  );
}

export default function AuthLayout({ eyebrow, title, description, features, children, support = false }) {
  return (
    <div className="auth-shell">
      <aside className="auth-intro">
        <Brand />
        <div className="intro-content">
          <span className="eyebrow"><Icon name="box" /> {eyebrow}</span>
          <h1>{title}</h1>
          <p className="intro-description">{description}</p>
          <div className="feature-list">
            {features.map((feature) => (
              <div className="feature-card" key={feature.title}>
                <span className="feature-icon"><Icon name={feature.icon} /></span>
                <span>
                  <strong>{feature.title}</strong>
                  <small>{feature.description}</small>
                </span>
              </div>
            ))}
          </div>
        </div>
        <p className="intro-footnote">Smart Fleet and Store Transportation Management System</p>
      </aside>
      <section className="auth-content" aria-label="Account access">
        <div className="auth-content-inner">
          {children}
          {support && (
            <p className="support-note">
              <span aria-hidden="true">◉</span> Trouble signing in? Contact Central Dispatch (Ext. 402)
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
