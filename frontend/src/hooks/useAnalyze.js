import { useState } from 'react'
import client from '../api/client'

export function useAnalyze() {
  const [loading, setLoading]           = useState(false)
  const [loadingStage, setLoadingStage] = useState(null)
  const [result, setResult]             = useState(null)
  const [error, setError]               = useState(null)

  const analyze = async (url, serviceType, tone) => {
    setLoading(true)
    setLoadingStage('extracting')
    setError(null)
    setResult(null)

    const stageTimer = setTimeout(() => setLoadingStage('generating'), 3000)

    try {
      const { data } = await client.post('/analyze', {
        url,
        service_type: serviceType,
        tone,
      })
      setResult(data)
    } catch (err) {
      const detail = err.response?.data?.detail
      setError(detail || 'Something went wrong. Check the URL and try again.')
    } finally {
      clearTimeout(stageTimer)
      setLoading(false)
      setLoadingStage(null)
    }
  }

  return { analyze, loading, loadingStage, result, setResult, error, setError }
}