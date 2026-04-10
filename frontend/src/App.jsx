import { useState } from 'react'
import Navbar          from './components/Navbar'
import InputPanel      from './components/InputPanel'
import InsightsPanel   from './components/InsightsPanel'
import MessagesPanel   from './components/MessagesPanel'
import ExplanationPanel from './components/ExplanationPanel'
import LeadsHistory    from './components/LeadsHistory'
import LoadingState    from './components/LoadingState'
import EmptyState      from './components/EmptyState'
import { useAnalyze }  from './hooks/useAnalyze'
import { useLeads }    from './hooks/useLeads'

export default function App() {
  const { analyze, loading, loadingStage, result, setResult, error, setError } = useAnalyze()
  const { leads, saveLead, deleteLead, saving }           = useLeads()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [currentUrl, setCurrentUrl]   = useState('')
  const [currentService, setCurrentService] = useState('automation')
  const [currentTone, setCurrentTone] = useState('professional')

  const handleAnalyze = (url, service, tone) => {
    setCurrentUrl(url)
    setCurrentService(service)
    setCurrentTone(tone)
    analyze(url, service, tone)
  }

  const handleSave = () => {
    if (!result) return false
    return saveLead(currentUrl, result, currentService, currentTone)
  }

  const handleSelectLead = (lead) => {
    try {
      const restored = {
        company_profile: JSON.parse(lead.profile_json),
        messages:        JSON.parse(lead.messages_json),
        explanation:     lead.explanation || '',
      }
      setResult(restored)
      setCurrentUrl(lead.url)
      setCurrentService(lead.service_type)
      setCurrentTone(lead.tone)
    } catch {
      // malformed saved data — just close
    }
    setSidebarOpen(false)
  }

  return (
    <>
      <Navbar
        leadsCount={leads.length}
        onToggleSidebar={() => setSidebarOpen(o => !o)}
      />

      <main style={{
        maxWidth: '760px',
        margin:   '0 auto',
        padding:  '32px 20px 80px',
      }}>
        <InputPanel onAnalyze={handleAnalyze} loading={loading} />

        {/* Error state */}
        {error && !loading && (
          <div style={{
            padding:      '16px 20px',
            background:   'rgba(239,68,68,0.08)',
            border:       '1px solid rgba(239,68,68,0.3)',
            borderRadius: 'var(--radius)',
            color:        'var(--severity-high)',
            fontSize:     '13px',
            fontFamily:   'DM Mono, monospace',
            marginBottom: '16px',
          }}>⚠ {error}</div>
        )}

        {/* Loading state */}
        {loading && <LoadingState stage={loadingStage} />}

        {/* Results */}
        {!loading && result && (
          <>
            <InsightsPanel  profile={result.company_profile} />
            <MessagesPanel
              messages={result.messages}
              onSave={handleSave}
              saving={saving}
            />
            <ExplanationPanel explanation={result.explanation} />
          </>
        )}

        {/* Empty state */}
        {!loading && !result && !error && <EmptyState />}
      </main>

      {/* Sidebar overlay */}
      {sidebarOpen && (
        <>
          <div
            onClick={() => setSidebarOpen(false)}
            style={{
              position:   'fixed',
              inset:      0,
              background: 'rgba(0,0,0,0.5)',
              zIndex:     190,
            }}
          />
          <LeadsHistory
            leads={leads}
            onSelect={handleSelectLead}
            onDelete={deleteLead}
            onClose={() => setSidebarOpen(false)}
          />
        </>
      )}
    </>
  )
}