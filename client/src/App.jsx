import { useState } from 'react'
import Landing from './components/Landing.jsx'
import LoadingScreen from './components/LoadingScreen.jsx'
import Report from './components/Report.jsx'
import { analyzeAddress } from './api.js'

export default function App() {
  const [page, setPage] = useState('landing')
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [address, setAddress] = useState('')

  async function handleAnalyze(addr) {
    setAddress(addr)
    setError(null)
    setPage('loading')
    try {
      const result = await analyzeAddress(addr)
      setData(result)
      setPage('report')
    } catch (err) {
      setError(err.message || 'Analysis failed. Please try again.')
      setPage('landing')
    }
  }

  function handleReset() {
    setPage('landing')
    setData(null)
    setError(null)
  }

  if (page === 'loading') return <LoadingScreen address={address} />
  if (page === 'report' && data) return <Report data={data} onReset={handleReset} />
  return <Landing onAnalyze={handleAnalyze} error={error} />
}
