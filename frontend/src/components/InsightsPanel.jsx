const PAIN_COLORS = {
    ux:          { bg: 'var(--pain-ux)',      text: 'var(--pain-ux-text)',      label: 'UX' },
    automation:  { bg: 'var(--pain-auto)',    text: 'var(--pain-auto-text)',    label: 'Automation' },
    cta:         { bg: 'var(--pain-cta)',     text: 'var(--pain-cta-text)',     label: 'CTA' },
    content:     { bg: 'var(--pain-content)', text: 'var(--pain-content-text)', label: 'Content' },
    performance: { bg: 'var(--pain-perf)',    text: 'var(--pain-perf-text)',    label: 'Performance' },
  }
  
  const SEVERITY_COLORS = {
    high:   'var(--severity-high)',
    medium: 'var(--severity-medium)',
    low:    'var(--severity-low)',
  }
  
  export default function InsightsPanel({ profile }) {
    if (!profile) return null
  
    return (
      <div style={{
        background:   'var(--bg-card)',
        border:       '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        padding:      '24px 28px',
        marginBottom: '16px',
      }}>
        {/* Header row */}
        <div style={{
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'space-between',
          marginBottom:   '20px',
        }}>
          <div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'DM Mono, monospace', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '4px' }}>
              What We Found
            </div>
            <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '22px', fontWeight: 700, color: 'var(--text)' }}>
              {profile.name}
            </h2>
          </div>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            {/* Tone badge */}
            <span className="badge" style={{
              background: 'rgba(0,200,150,0.1)',
              color:      'var(--accent)',
              border:     '1px solid var(--border-accent)',
            }}>{profile.detected_tone}</span>
            {/* Pricing badge */}
            {profile.pricing_tier !== 'unknown' && (
              <span className="badge" style={{
                background: 'rgba(125,133,144,0.1)',
                color:      'var(--text-muted)',
                border:     '1px solid var(--border)',
              }}>{profile.pricing_tier} tier</span>
            )}
          </div>
        </div>
  
        {/* Description */}
        {profile.description && (
          <p style={{
            fontSize:     '13px',
            color:        'var(--text-muted)',
            lineHeight:   1.6,
            marginBottom: '20px',
            borderLeft:   '2px solid var(--border-accent)',
            paddingLeft:  '12px',
          }}>{profile.description}</p>
        )}
  
        {/* Tech stack */}
        {profile.tech_stack?.length > 0 && (
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-dim)', fontFamily: 'DM Mono, monospace', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '8px' }}>
              Tech Stack
            </div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {profile.tech_stack.map((t, i) => (
                <span key={i} className="badge" style={{
                  background: 'var(--bg-input)',
                  color:      'var(--text)',
                  border:     '1px solid var(--border)',
                  fontWeight: 400,
                }}>{t}</span>
              ))}
            </div>
          </div>
        )}
  
        {/* Target audience + Location */}
        <div style={{ display: 'flex', gap: '24px', marginBottom: '20px', flexWrap: 'wrap' }}>
          {profile.target_audience && (
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-dim)', fontFamily: 'DM Mono, monospace', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '4px' }}>Audience</div>
              <span style={{ fontSize: '13px', color: 'var(--text)' }}>{profile.target_audience}</span>
            </div>
          )}
          {profile.location && (
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-dim)', fontFamily: 'DM Mono, monospace', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '4px' }}>Location</div>
              <span style={{ fontSize: '13px', color: 'var(--text)' }}>{profile.location}</span>
            </div>
          )}
        </div>
  
        {/* Pain points */}
        {profile.pain_points?.length > 0 && (
          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-dim)', fontFamily: 'DM Mono, monospace', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '10px' }}>
              Detected Pain Points
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {profile.pain_points.map((pp, i) => {
                const colors = PAIN_COLORS[pp.category] || PAIN_COLORS.ux
                return (
                  <div key={i} style={{
                    display:      'flex',
                    alignItems:   'flex-start',
                    gap:          '10px',
                    padding:      '10px 14px',
                    background:   colors.bg,
                    borderRadius: 'var(--radius-sm)',
                    border:       `1px solid ${colors.text}22`,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: '100px', flexShrink: 0 }}>
                      <span className="badge" style={{
                        background: `${colors.text}20`,
                        color:      colors.text,
                      }}>{colors.label}</span>
                      <span style={{
                        width:        '6px',
                        height:       '6px',
                        borderRadius: '50%',
                        background:   SEVERITY_COLORS[pp.severity],
                        flexShrink:   0,
                      }} title={pp.severity} />
                    </div>
                    <span style={{
                      fontSize:   '12px',
                      color:      'var(--text-muted)',
                      lineHeight: 1.5,
                      fontFamily: 'DM Sans, sans-serif',
                    }}>{pp.signal}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    )
  }