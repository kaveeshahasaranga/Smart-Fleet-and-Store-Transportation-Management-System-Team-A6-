const paths = {
  truck: <><path d="M3 6h11v11H3zM14 10h4l3 4v3h-7"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></>,
  van: <><path d="M4 17V8h16v9M4 12h16M7 8l2-3h6l2 3M4 17h16"/><circle cx="7" cy="17" r="1.5"/><circle cx="17" cy="17" r="1.5"/></>,
  grid: <path d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z"/>,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="1"/><path d="M7 2v6M17 2v6M3 10h18"/></>,
  store: <><path d="M3 10l2-7h14l2 7M4 11v10h16V11M9 21v-7h6v7M8 3l-1 7M12 3v7M16 3l1 7"/><path d="M3 10q2 4 4 0 3 4 5 0 3 4 5 0 2 4 4 0"/></>,
  route: <><circle cx="6" cy="4" r="2"/><circle cx="18" cy="20" r="2"/><path d="M6 6v11a3 3 0 0 0 6 0V7a3 3 0 0 1 6 0v11"/></>,
  search: <><circle cx="10" cy="10" r="6"/><path d="M15 15l6 6"/></>,
  download: <><path d="M12 3v12m-4-4 4 4 4-4M4 15v5h16v-5"/></>,
  user: <><circle cx="12" cy="7" r="3"/><path d="M5 21v-3a7 7 0 0 1 14 0v3z"/></>,
  bell: <><path d="M5 17h14l-2-4V9a5 5 0 0 0-10 0v4zM10 21h4"/></>,
  help: <><circle cx="12" cy="12" r="9"/><path d="M9 9a3 3 0 1 1 4 3l-1 1v2M12 17v1"/></>,
  depot: <><circle cx="12" cy="12" r="3"/><circle cx="4" cy="4" r="2"/><circle cx="20" cy="4" r="2"/><circle cx="4" cy="20" r="2"/><circle cx="20" cy="20" r="2"/><path d="m6 6 4 4m4 4 4 4m-8-4-4 4m8-8 4-4"/></>,
};
export default function Icon({ name, size=18 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name] || paths.grid}</svg>;
}
