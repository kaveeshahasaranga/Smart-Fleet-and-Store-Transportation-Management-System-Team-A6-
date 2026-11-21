const iconPaths = {
  booking: 'M4 5h16v15H4z M8 3v4 M16 3v4 M7 11h4',
  list: 'M9 6h11 M9 12h11 M9 18h11 M4 6h.01 M4 12h.01 M4 18h.01',
  clock: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z M12 7v5l3 2',
  box: 'm12 3 9 5-9 5-9-5 9-5z M3 8v9l9 5 9-5V8 M12 13v9',
  store: 'M3 10h18 M5 10v10h14V10 M4 10l1-6h14l1 6 M9 14h6v6',
  user: 'M20 21a8 8 0 0 0-16 0 M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  arrow: 'M5 12h14 M13 6l6 6-6 6',
  back: 'M19 12H5 M11 18l-6-6 6-6',
  phone: 'M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.4 19.4 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7l.4 2.8a2 2 0 0 1-.6 1.7L7.5 9.6a16 16 0 0 0 6 6l1.4-1.4a2 2 0 0 1 1.7-.6l2.8.4a2 2 0 0 1 1.6 1.9z',
  truck: 'M3 7h11v10H3z M14 10h4l3 3v4h-7z M7 19a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z M18 19a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z',
  bell: 'M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9 M10 21h4',
};

export default function PortalIcon({ name }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d={iconPaths[name] || iconPaths.box} />
    </svg>
  );
}
