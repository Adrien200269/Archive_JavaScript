'use client'

export default function LoadingSpinner({ text = 'Loading…' }: { text?: string }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '1.5rem',
      padding: '3rem',
    }}>
      <div className="spinner-ring">
        <style>{`
          .spinner-ring {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            border: 3px solid var(--border, #e0e0e0);
            border-top-color: var(--blue, #3b82f6);
            animation: spin 0.8s linear infinite;
          }
          @keyframes spin { to { transform: rotate(360deg) } }

          .spinner-dots {
            display: flex;
            gap: 6px;
          }
          .spinner-dots span {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: var(--blue, #3b82f6);
            animation: bounce 1.4s ease-in-out infinite both;
          }
          .spinner-dots span:nth-child(1) { animation-delay: -0.32s }
          .spinner-dots span:nth-child(2) { animation-delay: -0.16s }
          .spinner-dots span:nth-child(3) { animation-delay: 0s }
          @keyframes bounce {
            0%, 80%, 100% { transform: scale(0) }
            40% { transform: scale(1) }
          }

          .spinner-pulse {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            background: var(--blue, #3b82f6);
            animation: pulse 1.5s ease-in-out infinite;
          }
          @keyframes pulse {
            0%, 100% { transform: scale(0.8); opacity: 0.5 }
            50% { transform: scale(1.2); opacity: 1 }
          }
        `}</style>
      </div>
      <div className="spinner-dots">
        <span /><span /><span />
      </div>
      <p style={{
        color: 'var(--muted)',
        fontSize: '0.85rem',
        margin: 0,
        animation: 'fadeInOut 2s ease-in-out infinite',
      }}>
        {text}
      </p>
      <style>{`
        @keyframes fadeInOut {
          0%, 100% { opacity: 0.5 }
          50% { opacity: 1 }
        }
      `}</style>
    </div>
  )
}
