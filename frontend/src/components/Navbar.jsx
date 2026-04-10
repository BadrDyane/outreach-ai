export default function Navbar({ leadsCount, onToggleSidebar }) {
    return (
      <nav style={{
        position:       'sticky',
        top:            0,
        zIndex:         100,
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'space-between',
        padding:        '0 32px',
        height:         '60px',
        background:     'rgba(13,17,23,0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom:   '1px solid var(--border)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width:        '28px',
            height:       '28px',
            borderRadius: '8px',
            background:   'var(--accent)',
            display:      'flex',
            alignItems:   'center',
            justifyContent: 'center',
            fontSize:     '14px',
          }}>⚡</div>
          <span style={{
            fontFamily:  'Syne, sans-serif',
            fontWeight:  700,
            fontSize:    '18px',
            color:       'var(--text)',
            letterSpacing: '-0.02em',
          }}>
            Outreach<span style={{ color: 'var(--accent)' }}>AI</span>
          </span>
        </div>
  
        <button
          onClick={onToggleSidebar}
          style={{
            display:      'flex',
            alignItems:   'center',
            gap:          '8px',
            padding:      '7px 14px',
            background:   leadsCount > 0 ? 'var(--accent-dim)' : 'transparent',
            border:       `1px solid ${leadsCount > 0 ? 'var(--border-accent)' : 'var(--border)'}`,
            borderRadius: 'var(--radius-sm)',
            color:        leadsCount > 0 ? 'var(--accent)' : 'var(--text-muted)',
            fontSize:     '13px',
            fontWeight:   500,
            cursor:       'pointer',
            fontFamily:   'DM Sans, sans-serif',
            transition:   'all 0.15s',
          }}
        >
          <span>Saved Leads</span>
          {leadsCount > 0 && (
            <span style={{
              background:   'var(--accent)',
              color:        '#000',
              borderRadius: '10px',
              padding:      '1px 7px',
              fontSize:     '11px',
              fontWeight:   700,
              fontFamily:   'DM Mono, monospace',
            }}>{leadsCount}</span>
          )}
        </button>
      </nav>
    )
  }