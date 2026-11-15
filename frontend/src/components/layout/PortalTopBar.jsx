import { Link } from 'react-router-dom';
import PortalIcon from '../common/PortalIcon.jsx';

const defaultLinks = [
  { label: 'Home', href: '#home', active: true },
  { label: 'Features', href: '#features' },
  { label: 'Booking', href: '#booking' },
  { label: 'Contact', href: '#contact' },
  { label: 'About', href: '#about' },
];

function BrandMark() {
  return (
    <span className="portal-brand-mark">
      <PortalIcon name="truck" />
    </span>
  );
}

export default function PortalTopBar({ brandName = 'FleetFlow', links = defaultLinks, brandTo = '/handover' }) {
  return (
    <header className="portal-header">
      <Link className="portal-logo" to={brandTo}><BrandMark /><strong>{brandName}</strong></Link>
      <nav className="portal-top-nav" aria-label="Main navigation">
        {links.map((link) => (
          <a className={link.active ? 'active' : ''} href={link.href} key={link.label}>{link.label}</a>
        ))}
      </nav>
      <div className="portal-header-actions">
        <button aria-label="Account" type="button"><PortalIcon name="user" /></button>
        <button aria-label="Notifications" type="button"><PortalIcon name="bell" /></button>
      </div>
    </header>
  );
}
