import { Link } from 'react-router-dom';
import PortalIcon from '../common/PortalIcon.jsx';

export default function PortalFooter() {
  return (
    <footer className="portal-footer">
      <div className="footer-main">
        <section className="footer-brand">
          <Link className="footer-logo" to="/handover">
            <span className="footer-brand-mark"><PortalIcon name="truck" /></span>
            <strong>FleetFlow</strong>
          </Link>
          <p>Simplifying fleet operations, store scheduling and delivery coordination.</p>
          <span className="cloud-status"><i /> All Cloud Logistics Systems Operational</span>
        </section>
        <nav className="footer-links" aria-label="Quick links">
          <h2><span aria-hidden="true">◉</span> Quick links</h2>
          <a href="#home">Home</a>
          <a href="#features">Features</a>
          <a href="#how-it-works">How It Works</a>
          <a href="#contact">Contact</a>
        </nav>
        <nav className="footer-links" aria-label="Platform links">
          <h2><span aria-hidden="true">▦</span> Platform</h2>
          <Link to="/signin"><span aria-hidden="true">↪</span> Sign In</Link>
          <Link to="/signup"><span aria-hidden="true">♙</span> Sign Up</Link>
          <Link to="/handover"><span aria-hidden="true">▤</span> Store Portal <small>Portal App</small></Link>
        </nav>
        <nav className="footer-links" aria-label="Support and legal">
          <h2><span aria-hidden="true">♧</span> Support &amp; legal</h2>
          <a href="#help"><span aria-hidden="true">ⓘ</span> Help Center</a>
          <a href="#support"><span aria-hidden="true">◉</span> Contact Support</a>
          <a href="#privacy"><span aria-hidden="true">⛨</span> Privacy Policy</a>
          <a href="#terms"><span aria-hidden="true">▤</span> Terms of Service</a>
        </nav>
      </div>
      <div className="footer-meta">
        <span>© 2026 FleetFlow. All rights reserved.</span>
        <div><span className="platform-badge">☁ &nbsp;ENTERPRISE LOGISTICS CLOUD PLATFORM</span><span className="encryption-badge">♙ &nbsp;256-bit TLS Encrypted</span></div>
      </div>
    </footer>
  );
}
