import PortalFooter from './PortalFooter.jsx';
import PortalSidebar from './PortalSidebar.jsx';
import PortalTopBar from './PortalTopBar.jsx';
import './portal-layout.css';

export default function PortalLayout({
  children,
  activeItem = 'handover',
  storeName,
  storeStatus,
  showFooter = true,
  topBarProps = {},
  sidebarItems,
}) {
  return (
    <div className="portal-shell">
      <PortalTopBar {...topBarProps} />
      <div className="portal-body">
        <PortalSidebar activeItem={activeItem} items={sidebarItems} storeName={storeName} storeStatus={storeStatus} />
        <main className="portal-main">{children}</main>
      </div>
      {showFooter && <PortalFooter />}
    </div>
  );
}
