import { useState, useEffect } from 'react'

const MESSAGES = [
  'Locating your property...',
  'Fetching building footprint from OpenStreetMap...',
  'Calculating roof area and orientation...',
  'Querying PVGIS for solar irradiance data...',
  'Analyzing seasonal sunshine patterns...',
  'Computing horizon shading profile...',
  'Looking up local electricity rates (NREL)...',
  'Calculating solar suitability score...',
  'Modeling panel recommendations...',
  'Estimating CO2 savings and environmental impact...',
  'Finalizing your solar report...'
]

const RAY_COUNT = 12

export default function LoadingScreen({ address }) {
  const [msgIdx, setMsgIdx] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIdx(i => Math.min(i + 1, MESSAGES.length - 1))
      setProgress(p => Math.min(p + 100 / MESSAGES.length, 92))
    }, 1400)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="loading-screen">
      <div className="sun-loader">
        <div className="sun-rays">
          {Array.from({ length: RAY_COUNT }).map((_, i) => (
            <div
              key={i}
              className="sun-ray"
              style={{ transform: `rotate(${i * (360 / RAY_COUNT)}deg)` }}
            />
          ))}
        </div>
        <div className="sun-core" />
      </div>

      <div style={{ textAlign: 'center' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 600, marginBottom: 8 }}>
          {MESSAGES[msgIdx]}
        </div>
        <div style={{ fontSize: '0.83rem', color: 'var(--text3)', maxWidth: 340, margin: '0 auto' }}>
          {address}
        </div>
      </div>

      <div style={{ width: 320 }}>
        <div className="progress-bar-track">
          <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text3)', marginTop: 8 }}>
          <span>Analyzing...</span>
          <span>{Math.round(progress)}%</span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, color: 'var(--text3)', fontSize: '0.8rem', textAlign: 'center' }}>
        <div>The sun produces enough energy in 1 hour to power Earth for a year.</div>
      </div>
    </div>
  )
}
