export default function EmptyState() {
    return (
      <div style={{
        display:        'flex',
        flexDirection:  'column',
        alignItems:     'center',
        justifyContent: 'center',
        padding:        '80px 32px',
        gap:            '12px',
        textAlign:      'center',
      }}>
        <div style={{ fontSize: '40px', marginBottom: '8px' }}>⚡</div>
        <h3 style={{
          fontFamily: 'Syne, sans-serif',
          fontSize:   '18px',
          fontWeight: 700,
          color:      'var(--text)',
        }}>Ready to analyze</h3>
        <p style={{
          fontSize:  '14px',
          color:     'var(--text-muted)',
          maxWidth:  '360px',
          lineHeight: 1.6,
        }}>
          Paste a company URL above, select your service type and tone, and get three research-backed outreach messages in under 30 seconds.
        </p>
      </div>
    )
  }