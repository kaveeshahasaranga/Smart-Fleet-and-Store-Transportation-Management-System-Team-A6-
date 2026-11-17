import { useEffect, useId, useRef } from 'react';
export default function Modal({ title, onClose, children }) {
  const ref = useRef(null);
  const titleId = useId();
  useEffect(() => {
    const dialog = ref.current;
    dialog.showModal();
    return () => dialog.close();
  }, []);
  return <dialog ref={ref} className="modal" aria-labelledby={titleId} onCancel={onClose} onClick={e => { if (e.target === ref.current) onClose(); }}>
    <div className="section-heading"><h2 id={titleId}>{title}</h2><button type="button" className="icon-button" onClick={onClose} aria-label="Close dialog">×</button></div>
    {children}
  </dialog>;
}
