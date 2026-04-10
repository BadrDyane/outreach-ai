import { useState, useEffect } from 'react'
import client from '../api/client'

export function useLeads() {
  const [leads, setLeads]     = useState([])
  const [saving, setSaving]   = useState(false)

  useEffect(() => {
    client.get('/leads')
      .then(r => setLeads(r.data))
      .catch(() => {})
  }, [])

  const saveLead = async (url, result, serviceType, tone) => {
    setSaving(true)
    try {
      const { data } = await client.post('/leads', {
        url,
        company_name:  result.company_profile.name,
        service_type:  serviceType,
        tone,
        profile_json:  JSON.stringify(result.company_profile),
        messages_json: JSON.stringify(result.messages),
        explanation:   result.explanation,
      })
      setLeads(prev => [data, ...prev])
      return true
    } catch {
      return false
    } finally {
      setSaving(false)
    }
  }

  const deleteLead = async (id) => {
    try {
      await client.delete(`/leads/${id}`)
      setLeads(prev => prev.filter(l => l.id !== id))
    } catch {}
  }

  return { leads, saveLead, deleteLead, saving }
}