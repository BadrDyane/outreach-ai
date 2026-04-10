export default function LeadsHistory({ leads, onSelect, onDelete, onClose }) {
    return (
      <div style={{
        position:      'fixed',
        top:           0,
        right:         0,
        height:        '100vh',
        width:         '320px',
        background:    'var(--bg-card)',
        borderLeft:    '1px solid var(--border)',
        zIndex:        200,
        display:       'flex',
        flexDirection: 'column',
        boxShadow:     '-8px 0 32px rgba(0,0,0,0.4)',
      }}>
        {/* Header */}
        <div style={{
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'space-between',
          padding:        '20px 20px 16px',
          borderBottom:   '1px solid var(--border)',
          flexShrink:     0,
        }}>
          <span style={{
            fontFamily: 'Syne, sans-serif',
            fontSize:   '15px',
            fontWeight: 700,
            color:      'var(--text)',
          }}>Saved Leads</span>
          <button onClick={onClose} style={{
            background:   'transparent',
            border:       'none',
            color:        'var(--text-muted)',
            fontSize:     '18px',
            cursor:       'pointer',
            padding:      '2px 6px',
            borderRadius: 'var(--radius-sm)',
          }}>✕</button>
        </div>
  
        {/* List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
          {leads.length === 0 ? (
            <div style={{
              textAlign:  'center',
              padding:    '40px 16px',
              color:      'var(--text-muted)',
              fontSize:   '13px',
              fontFamily: 'DM Mono, monospace',
            }}>No saved leads yet</div>
          ) : (
            leads.map(lead => (
              <div key={lead.id} style={{
                position:     'relative',
                marginBottom: '8px',
              }}>
                {/* Clickable card — excludes delete button area */}
                <div
                  onClick={() => onSelect(lead)}
                  style={{
                    padding:      '12px 40px 12px 12px',
                    background:   'var(--bg-input)',
                    borderRadius: 'var(--radius-sm)',
                    border:       '1px solid var(--border)',
                    cursor:       'pointer',
                    transition:   'border-color 0.15s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-accent)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                >
                  <div style={{
                    fontFamily:   'Syne, sans-serif',
                    fontSize:     '13px',
                    fontWeight:   700,
                    color:        'var(--text)',
                    marginBottom: '6px',
                    paddingRight: '8px',
                  }}>{lead.company_name}</div>
  
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    <span className="badge" style={{
                      background: 'rgba(0,200,150,0.08)',
                      color:      'var(--accent)',
                      fontWeight: 400,
                    }}>{lead.service_type}</span>
                    <span className="badge" style={{
                      background: 'transparent',
                      color:      'var(--text-dim)',
                      fontWeight: 400,
                      border:     '1px solid var(--border)',
                    }}>{lead.tone}</span>
                  </div>
  
                  <div style={{
                    fontSize:   '10px',
                    color:      'var(--text-dim)',
                    fontFamily: 'DM Mono, monospace',
                    marginTop:  '6px',
                  }}>{new Date(lead.created_at).toLocaleDateString()}</div>
                </div>
  
                {/* Delete button — absolutely positioned, outside the card's onClick */}
                <button
                  onClick={() => onDelete(lead.id)}
                  style={{
                    position:     'absolute',
                    top:          '10px',
                    right:        '10px',
                    background:   'transparent',
                    border:       'none',
                    color:        'var(--text-dim)',
                    fontSize:     '14px',
                    cursor:       'pointer',
                    padding:      '2px 5px',
                    borderRadius: 'var(--radius-sm)',
                    lineHeight:   1,
                    zIndex:       1,
                    transition:   'color 0.15s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--severity-high)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--text-dim)'}
                >✕</button>
              </div>
            ))
          )}
        </div>
      </div>
    )
  }