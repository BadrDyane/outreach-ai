export default function ExplanationPanel({ explanation }) {
    if (!explanation) return null
  
    return (
      <div style={{
        background:   'var(--bg-card)',
        border:       '1px solid var(--border)',
        borderLeft:   '3px solid var(--accent)',
        borderRadius: 'var(--radius)',
        padding:      '20px 24px',
        marginBottom: '16px',
      }}>
        <div style={{
          display:      'flex',
          alignItems:   'center',
          gap:          '8px',
          marginBottom: '12px',
        }}>
          <span style={{ fontSize: '14px' }}>🧠</span>
          <span style={{
            fontSize:      '11px',
            color:         'var(--accent)',
            fontFamily:    'DM Mono, monospace',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            fontWeight:    600,
          }}>Why These Messages</span>
        </div>
        <p style={{
          fontSize:   '13px',
          color:      'var(--text-muted)',
          lineHeight: 1.7,
          fontFamily: 'DM Sans, sans-serif',
        }}>{explanation}</p>
      </div>
    )
  }