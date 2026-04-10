import { useState } from 'react'

const SERVICES = [
  { value: 'automation',  label: 'Business Automation' },
  { value: 'chatbot',     label: 'AI Chatbot' },
  { value: 'scraping',    label: 'Web Scraping' },
  { value: 'dashboard',   label: 'Data Dashboard' },
  { value: 'saas_mvp',    label: 'SaaS MVP' },
]

const TONES = [
  { value: 'professional', label: 'Professional' },
  { value: 'casual',       label: 'Casual' },
  { value: 'bold',         label: 'Bold' },
]

export default function InputPanel({ onAnalyze, loading }) {
  const [url,     setUrl]     = useState('')
  const [service, setService] = useState('automation')
  const [tone,    setTone]    = useState('professional')
  const [urlError, setUrlError] = useState('')

  const validate = (val) => {
    if (!val.startsWith('http://') && !val.startsWith('https://')) {
      setUrlError('URL must start with https://')
      return false
    }
    setUrlError('')
    return true
  }

  const handleSubmit = () => {
    if (!url.trim()) { setUrlError('Please enter a URL'); return }
    if (!validate(url.trim())) return
    onAnalyze(url.trim(), service, tone)
  }

  const handleKey = (e) => {
    if (e.key === 'Enter') handleSubmit()
  }

  const selectStyle = {
    padding:      '11px 14px',
    background:   'var(--bg-input)',
    border:       '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)',
    color:        'var(--text)',
    fontSize:     '13px',
    fontFamily:   'DM Sans, sans-serif',
    cursor:       'pointer',
    outline:      'none',
    appearance:   'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%237D8590' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
    backgroundRepeat:   'no-repeat',
    backgroundPosition: 'right 12px center',
    paddingRight: '32px',
  }

  return (
    <div style={{
      background:   'var(--bg-card)',
      border:       '1px solid var(--border)',
      borderRadius: 'var(--radius)',
      padding:      '28px 32px',
      marginBottom: '20px',
    }}>
      <h2 style={{
        fontFamily:    'Syne, sans-serif',
        fontSize:      '15px',
        fontWeight:    700,
        color:         'var(--text-muted)',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        marginBottom:  '18px',
      }}>Analyze a Lead</h2>

      {/* URL input row */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <input
            type="text"
            placeholder="https://company.com"
            value={url}
            onChange={e => { setUrl(e.target.value); setUrlError('') }}
            onKeyDown={handleKey}
            disabled={loading}
            style={{
              width:        '100%',
              padding:      '12px 14px',
              background:   'var(--bg-input)',
              border:       `1px solid ${urlError ? 'var(--severity-high)' : 'var(--border)'}`,
              borderRadius: 'var(--radius-sm)',
              color:        'var(--text)',
              fontSize:     '14px',
              fontFamily:   'DM Mono, monospace',
              outline:      'none',
              transition:   'border-color 0.15s',
            }}
            onFocus={e => !urlError && (e.target.style.borderColor = 'var(--border-accent)')}
            onBlur={e  => !urlError && (e.target.style.borderColor = 'var(--border)')}
          />
          {urlError && (
            <span style={{
              position:  'absolute',
              bottom:    '-20px',
              left:      0,
              fontSize:  '11px',
              color:     'var(--severity-high)',
              fontFamily:'DM Mono, monospace',
            }}>{urlError}</span>
          )}
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading || !url.trim()}
          style={{
            padding:      '12px 24px',
            background:   loading ? 'var(--accent-dim)' : 'var(--accent)',
            border:       'none',
            borderRadius: 'var(--radius-sm)',
            color:        loading ? 'var(--accent)' : '#000',
            fontSize:     '14px',
            fontWeight:   700,
            fontFamily:   'Syne, sans-serif',
            cursor:       loading ? 'not-allowed' : 'pointer',
            whiteSpace:   'nowrap',
            transition:   'all 0.15s',
            minWidth:     '110px',
          }}
        >
          {loading ? 'Analyzing...' : 'Analyze →'}
        </button>
      </div>

      {/* Selects row */}
      <div style={{
        display:   'flex',
        gap:       '10px',
        marginTop: urlError ? '28px' : '14px',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', flex: 1 }}>
          <label style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'DM Mono, monospace', letterSpacing: '0.05em' }}>
            YOUR SERVICE
          </label>
          <select value={service} onChange={e => setService(e.target.value)} style={selectStyle} disabled={loading}>
            {SERVICES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', flex: 1 }}>
          <label style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'DM Mono, monospace', letterSpacing: '0.05em' }}>
            MESSAGE TONE
          </label>
          <select value={tone} onChange={e => setTone(e.target.value)} style={selectStyle} disabled={loading}>
            {TONES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>
      </div>
    </div>
  )
}