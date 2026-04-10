import { useState } from 'react'

export default function MessageCard({ message, onSave, saving }) {
  const [copied, setCopied] = useState(false)
  const [saved,  setSaved]  = useState(false)

  const wordCount = message.trim().split(/\s+/).length

  const handleCopy = () => {
    navigator.clipboard.writeText(message)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSave = async () => {
    const ok = await onSave()
    if (ok) { setSaved(true); setTimeout(() => setSaved(false), 2000) }
  }

  return (
    <div style={{
      background:   'var(--bg-input)',
      borderRadius: 'var(--radius-sm)',
      padding:      '20px',
      position:     'relative',
    }}>
      <pre style={{
        fontFamily:  'DM Sans, sans-serif',
        fontSize:    '14px',
        lineHeight:  1.7,
        color:       'var(--text)',
        whiteSpace:  'pre-wrap',
        wordBreak:   'break-word',
        marginBottom:'16px',
      }}>{message}</pre>

      <div style={{
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'space-between',
        borderTop:      '1px solid var(--border)',
        paddingTop:     '12px',
      }}>
        <span style={{
          fontSize:   '11px',
          color:      'var(--text-dim)',
          fontFamily: 'DM Mono, monospace',
        }}>{wordCount} words</span>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={handleSave} disabled={saving || saved} style={{
            padding:      '6px 14px',
            background:   saved ? 'rgba(0,200,150,0.1)' : 'transparent',
            border:       `1px solid ${saved ? 'var(--border-accent)' : 'var(--border)'}`,
            borderRadius: 'var(--radius-sm)',
            color:        saved ? 'var(--accent)' : 'var(--text-muted)',
            fontSize:     '12px',
            fontWeight:   500,
            cursor:       saving ? 'not-allowed' : 'pointer',
            fontFamily:   'DM Sans, sans-serif',
            transition:   'all 0.15s',
          }}>
            {saved ? '✓ Saved' : saving ? 'Saving...' : 'Save Lead'}
          </button>

          <button onClick={handleCopy} style={{
            padding:      '6px 14px',
            background:   copied ? 'var(--accent)' : 'var(--bg-card)',
            border:       `1px solid ${copied ? 'var(--accent)' : 'var(--border)'}`,
            borderRadius: 'var(--radius-sm)',
            color:        copied ? '#000' : 'var(--text)',
            fontSize:     '12px',
            fontWeight:   600,
            cursor:       'pointer',
            fontFamily:   'DM Sans, sans-serif',
            transition:   'all 0.15s',
          }}>
            {copied ? '✓ Copied' : 'Copy'}
          </button>
        </div>
      </div>
    </div>
  )
}