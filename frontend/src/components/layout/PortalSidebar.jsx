import { Link } from 'react-router-dom';
import PortalIcon from '../common/PortalIcon.jsx';

const defaultItems = [
  { id: 'bookings-create', label: 'Create Booking', icon: 'booking', href: '#create-booking' },
  { id: 'bookings-list', label: 'My Bookings', icon: 'list', href: '#my-bookings' },
  { id: 'schedule', label: 'Schedule', icon: 'clock', href: '#schedule' },
  { id: 'handover', label: 'Goods Handover', icon: 'box', to: '/handover' },
];

export default function PortalSidebar({
  activeItem = 'handover',
  items = defaultItems,
  storeName = 'Nugegoda Store',
  storeStatus = 'Active Facility',
}) {
  return (
    <aside className="portal-sidebar">
      <nav aria-label="Store portal">
        {items.map((item) => {
          const className = item.id === activeItem ? 'selected' : '';
          const content = <><PortalIcon name={item.icon} />{item.label}</>;
          return item.to
            ? <Link className={className} key={item.id} to={item.to}>{content}</Link>
            : <a className={className} href={item.href} key={item.id}>{content}</a>;
        })}
      </nav>
      <div className="store-chip">
        <PortalIcon name="store" />
        <span><strong>{storeName}</strong><small>{storeStatus}</small></span>
        <i />
      </div>
    </aside>
  );
}
