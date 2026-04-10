export default function LoadingState({ stage }) {
    const messages = {
      extracting: { text: 'Analyzing website...', sub: 'Extracting company signals and pain points' },
      generating: { text: 'Generating messages...', sub: 'Building personalized outreach with AI' },
    }
    const current = messages[stage] || messages.extracting
  
    return (
      <div style={{
        display:        'flex',
        flexDirection:  'column',
        alignItems:     'center',
        justifyContent: 'center',
        padding:        '80px 32px',
        gap:            '16px',
      }}>
        {/* Animated ring */}
        <div style={{
          width:        '48px',
          height:       '48px',
          borderRadius: '50%',
          border:       '3px solid var(--border)',
          borderTop:    '3px solid var(--accent)',
          animation:    'spin 0.8s linear infinite',
        }} />
  
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  
        <div style={{ textAlign: 'center' }}>
          <div style={{
            fontFamily: 'Syne, sans-serif',
            fontSize:   '16px',
            fontWeight: 600,
            color:      'var(--text)',
            marginBottom: '6px',
          }}>{current.text}</div>
          <div style={{
            fontSize:   '13px',
            color:      'var(--text-muted)',
            fontFamily: 'DM Mono, monospace',
          }}>{current.sub}</div>
        </div>
  
        {/* Stage dots */}
        <div style={{ display: 'flex', gap: '6px', marginTop: '8px' }}>
          {['extracting', 'generating'].map((s, i) => (
            <div key={i} style={{
              width:        '6px',
              height:       '6px',
              borderRadius: '50%',
              background:   stage === s ? 'var(--accent)' : 'var(--border)',
              transition:   'background 0.3s',
            }} />
          ))}
        </div>
      </div>
    )
  }