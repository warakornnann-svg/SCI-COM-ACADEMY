import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ToastContainer: React.FC = () => {
  const { state, dispatch } = useApp();

  if (state.notifications.length === 0) return null;

  return (
    <div className="toast-container">
      {state.notifications.map((n) => {
        const getIcon = () => {
          switch (n.type) {
            case 'success':
              return <CheckCircle2 size={18} color="var(--color-success)" />;
            case 'error':
              return <AlertCircle size={18} color="var(--color-error)" />;
            case 'warning':
              return <AlertCircle size={18} color="var(--color-warning)" />;
            default:
              return <Info size={18} color="var(--color-info)" />;
          }
        };

        return (
          <div key={n.id} className={`toast toast-${n.type}`}>
            <div style={{ flexShrink: 0, marginTop: '2px' }}>{getIcon()}</div>
            <div style={{ flex: 1, fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)' }}>
              {n.message}
            </div>
            <button
              className="btn btn-ghost btn-icon sm"
              onClick={() => dispatch({ type: 'DISMISS_NOTIFICATION', payload: n.id })}
              aria-label="ปิดการแจ้งเตือน"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default ToastContainer;
