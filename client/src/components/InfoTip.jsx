import { useState } from 'react'

export default function InfoTip({ description, source }) {
  const [visible, setVisible] = useState(false)

  return (
    <span
      style={{ position: 'relative', display: 'inline-block', cursor: 'help', marginLeft: 5, verticalAlign: 'middle' }}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      <span style={{ color: 'var(--text3)', fontSize: '0.7rem', userSelect: 'none' }}>ⓘ</span>
      {visible && (
        <div style={{
          position: 'absolute',
          bottom: 'calc(100% + 8px)',
          left: '50%',
          transform: 'translateX(-50%)',
          background: '#111827',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 10,
          padding: '11px 14px',
          lineHeight: 1.55,
          width: 240,
          zIndex: 500,
          boxShadow: '0 8px 32px rgba(0,0,0,0.7)',
          pointerEvents: 'none'
        }}>
          {description && (
            <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>{description}</div>
          )}
          {source && (
            <div style={{
              marginTop: 8, paddingTop: 8,
              borderTop: '1px solid rgba(255,255,255,0.08)',
              fontSize: '0.72rem', color: '#64748b'
            }}>
              Data: {source}
            </div>
          )}
        </div>
      )}
    </span>
  )
}
