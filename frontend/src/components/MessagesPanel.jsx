import { useState } from 'react'
import MessageCard from './MessageCard'

const TABS = [
  { key: 'cold_dm',    label: 'Cold DM',    icon: '⚡' },
  { key: 'cold_email', label: 'Cold Email',  icon: '✉' },
  { key: 'value_led',  label: 'Value-Led',   icon: '💡' },
]

export default function MessagesPanel({ messages, onSave, saving }) {
  const [activeTab, setActiveTab] = useState('cold_dm')

  return (
    <div style={{
      background:   'var(--bg-card)',
      border:       '1px solid var(--border)',
      borderRadius: 'var(--radius)',
      padding:      '24px 28px',
      marginBottom: '16px',
    }}>
      <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'DM Mono, monospace', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '16px' }}>
        Outreach Messages
      </div>

      {/* Tabs */}
      <div style={{
        display:      'flex',
        gap:          '4px',
        marginBottom: '20px',
        background:   'var(--bg-input)',
        borderRadius: 'var(--radius-sm)',
        padding:      '4px',
      }}>
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              flex:         1,
              padding:      '8px 12px',
              background:   activeTab === tab.key ? 'var(--bg-card)' : 'transparent',
              border:       activeTab === tab.key ? '1px solid var(--border)' : '1px solid transparent',
              borderRadius: 'var(--radius-sm)',
              color:        activeTab === tab.key ? 'var(--text)' : 'var(--text-muted)',
              fontSize:     '13px',
              fontWeight:   activeTab === tab.key ? 600 : 400,
              cursor:       'pointer',
              fontFamily:   'DM Sans, sans-serif',
              transition:   'all 0.15s',
              display:      'flex',
              alignItems:   'center',
              justifyContent: 'center',
              gap:          '6px',
            }}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Active message */}
      <MessageCard
        message={messages[activeTab]}
        onSave={onSave}
        saving={saving}
      />
    </div>
  )
}