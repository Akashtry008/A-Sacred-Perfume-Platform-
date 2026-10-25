import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { CheckCircle2, AlertCircle, Info, X, ShieldAlert, Flame } from 'lucide-react';

const ToastContext = createContext(undefined);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const [alertModal, setAlertModal] = useState(null);
  const lastToastRef = useRef({ message: '', time: 0 });

  // 1. Toast Notifications (Rich Devotional Toast with Strict Deduplication)
  const showToast = useCallback((message, type = 'success') => {
    if (!message) return;
    const now = Date.now();

    // Prevent duplicate toast with identical message within 1500ms
    if (lastToastRef.current.message === message && now - lastToastRef.current.time < 1500) {
      return;
    }
    lastToastRef.current = { message, time: now };

    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => {
      // If identical message is already currently displayed, do not add a duplicate
      if (prev.some((t) => t.message === message)) {
        return prev;
      }
      return [...prev, { id, type, message }];
    });

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // 2. Custom Platform Alert / Confirm Modal Dialog (Replaces Google/Browser native popups)
  const showAlert = useCallback(({
    title = 'Sacred Notification',
    message,
    type = 'info', // 'success', 'warning', 'error', 'info'
    confirmText = 'Understood',
    cancelText = null,
    onConfirm = null,
    onCancel = null,
  }) => {
    setAlertModal({
      title,
      message,
      type,
      confirmText,
      cancelText,
      onConfirm: () => {
        setAlertModal(null);
        if (onConfirm) onConfirm();
      },
      onCancel: () => {
        setAlertModal(null);
        if (onCancel) onCancel();
      },
    });
  }, []);

  const closeAlert = () => setAlertModal(null);

  return (
    <ToastContext.Provider value={{ showToast, showAlert, closeAlert }}>
      {children}

      {/* =========================================================================
          DEVOTIONAL TOAST NOTIFICATIONS CONTAINER (Bottom Right)
          ========================================================================= */}
      <div
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          maxWidth: '400px',
          width: 'calc(100vw - 48px)',
          pointerEvents: 'none',
        }}
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            style={{
              pointerEvents: 'auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '14px 18px',
              borderRadius: '10px',
              boxShadow: '0 12px 32px rgba(28, 25, 23, 0.22), 0 0 0 1px rgba(200, 130, 42, 0.3)',
              backgroundColor: '#1C1917',
              color: '#FAF7F2',
              borderLeft:
                toast.type === 'success'
                  ? '4px solid #C8822A'
                  : toast.type === 'error'
                  ? '4px solid #DC2626'
                  : '4px solid #EAB308',
              animation: 'fadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {toast.type === 'success' && <CheckCircle2 size={18} color="#E8A856" />}
              {toast.type === 'error' && <AlertCircle size={18} color="#F87171" />}
              {toast.type === 'info' && <Flame size={18} color="#FBBF24" />}
              <span style={{ fontSize: '0.85rem', fontWeight: 500, lineHeight: 1.4 }}>
                {toast.message}
              </span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              style={{
                background: 'none',
                border: 'none',
                color: '#A8A29E',
                padding: '4px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
              }}
              aria-label="Dismiss notification"
            >
              <X size={15} />
            </button>
          </div>
        ))}
      </div>

      {/* =========================================================================
          CUSTOM PLATFORM DIALOG / POPUP MODAL (Replaces Google popups)
          ========================================================================= */}
      {alertModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            backgroundColor: 'rgba(28, 25, 23, 0.65)',
            backdropFilter: 'blur(6px)',
            animation: 'fadeIn 0.2s ease-out',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget && !alertModal.cancelText) {
              closeAlert();
            }
          }}
        >
          <div
            style={{
              backgroundColor: '#FAF7F2',
              borderRadius: '16px',
              border: '1.5px solid #C8822A',
              boxShadow: '0 24px 48px -12px rgba(28, 25, 23, 0.35), 0 0 0 1px rgba(200, 130, 42, 0.2)',
              width: '100%',
              maxWidth: '440px',
              overflow: 'hidden',
              animation: 'fadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            {/* Header Accent Band */}
            <div
              style={{
                background: 'linear-gradient(135deg, #1C1917 0%, #2D241E 100%)',
                padding: '16px 22px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid rgba(200, 130, 42, 0.3)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Flame size={16} color="#E8A856" />
                <span style={{ color: '#FAF7F2', fontWeight: 600, fontSize: '0.92rem', fontFamily: 'Georgia, serif' }}>
                  {alertModal.title}
                </span>
              </div>
              <button
                onClick={closeAlert}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#A8A29E',
                  cursor: 'pointer',
                  padding: '4px',
                }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '24px 22px' }}>
              <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    backgroundColor:
                      alertModal.type === 'error'
                        ? '#FEE2E2'
                        : alertModal.type === 'warning'
                        ? '#FEF3C7'
                        : '#FEF3E2',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {alertModal.type === 'error' ? (
                    <ShieldAlert size={20} color="#DC2626" />
                  ) : alertModal.type === 'warning' ? (
                    <AlertCircle size={20} color="#D97706" />
                  ) : alertModal.type === 'success' ? (
                    <CheckCircle2 size={20} color="#C8822A" />
                  ) : (
                    <Info size={20} color="#C8822A" />
                  )}
                </div>

                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: '#38302B', lineHeight: 1.55 }}>
                    {alertModal.message}
                  </p>
                </div>
              </div>

              {/* Actions Row */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '24px' }}>
                {alertModal.cancelText && (
                  <button
                    onClick={alertModal.onCancel}
                    className="btn btn-secondary"
                    style={{
                      padding: '8px 18px',
                      fontSize: '0.85rem',
                      borderRadius: '8px',
                    }}
                  >
                    {alertModal.cancelText}
                  </button>
                )}
                <button
                  onClick={alertModal.onConfirm}
                  className="btn btn-primary"
                  style={{
                    padding: '8px 22px',
                    fontSize: '0.85rem',
                    borderRadius: '8px',
                  }}
                >
                  {alertModal.confirmText}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
