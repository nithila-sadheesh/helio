import { useEffect, useState } from 'react'

const SCORE_COLORS = {
  Excellent: '#10B981',
  'Very Good': '#22C55E',
  Good: '#F59E0B',
  Fair: '#F97316'
}

const FACTOR_LABELS = {
  solarResource: 'Solar Resource',
  roofArea: 'Roof Area',
  shading: 'Shading',
  electricityRate: 'Electricity Rate',
  orientation: 'Orientation'
}

const FACTOR_MAX = {
  solarResource: 3.5, roofArea: 2, shading: 1.5, electricityRate: 1.5, orientation: 1.5
}

function ScoreGauge({ score, rating }) {
  const [animated, setAnimated] = useState(0)
  const radius = 80
  const stroke = 12
  const nr = radius - stroke / 2
  const circ = nr * 2 * Math.PI
  const color = SCORE_COLORS[rating] || '#F59E0B'

  useEffect(() => {
    const t = setTimeout(() => setAnimated(score), 250)
    return () => clearTimeout(t)
  }, [score])

  return (
    <div style={{ position: 'relative', width: 190, height: 190, flexShrink: 0, margin: '0 auto' }}>
      <svg width={190} height={190} viewBox="0 0 190 190">
        <circle cx={95} cy={95} r={nr} fill="none" stroke="var(--surface3)" strokeWidth={stroke}
          strokeDasharray={`${circ * 0.75} ${circ * 0.25}`} strokeDashoffset={circ * 0.125}
          strokeLinecap="round" transform="rotate(135, 95, 95)" />
        <circle cx={95} cy={95} r={nr} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={`${(animated / 10) * circ * 0.75} ${circ - (animated / 10) * circ * 0.75}`}
          strokeDashoffset={-(circ * 0.125)}
          strokeLinecap="round" transform="rotate(135, 95, 95)"
          style={{ transition: 'stroke-dasharray 1.3s cubic-bezier(0.34, 1.4, 0.64, 1)', filter: `drop-shadow(0 0 8px ${color}80)` }}
        />
        <text x="95" y="90" textAnchor="middle" fill={color} fontFamily="'Space Grotesk', sans-serif" fontWeight="900" fontSize="44">{score}</text>
        <text x="95" y="110" textAnchor="middle" fill="var(--text3)" fontSize="12" fontFamily="var(--font)">out of 10</text>
        <text x="95" y="132" textAnchor="middle" fill={color} fontFamily="'Space Grotesk', sans-serif" fontWeight="700" fontSize="13">{rating}</text>
      </svg>
    </div>
  )
}

export default function Step5Score({ score }) {
  const color = SCORE_COLORS[score.rating] || '#F59E0B'

  return (
    <div className="step-section" style={{ animationDelay: '320ms' }}>
      <div className="step-header">
        <div className="step-title">Solar Suitability Score</div>
      </div>

      <div className="card card-solar">
        <ScoreGauge score={score.total} rating={score.rating} />

        {/* Factor pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 22, justifyContent: 'center' }}>
          {Object.entries(score.breakdown).map(([key, val]) => {
            const max = FACTOR_MAX[key] || 2
            const pct = Math.round((val / max) * 100)
            return (
              <div key={key} style={{
                background: 'var(--surface2)', border: '1px solid var(--border)',
                borderRadius: 8, padding: '6px 12px', display: 'flex', gap: 10, alignItems: 'center'
              }}>
                <div style={{
                  width: 32, height: 4, borderRadius: 2, background: 'var(--surface3)', position: 'relative', overflow: 'hidden'
                }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 2 }} />
                </div>
                <span style={{ fontSize: '0.77rem', color: 'var(--text2)' }}>{FACTOR_LABELS[key]}</span>
                <span style={{ fontSize: '0.77rem', color, fontWeight: 700 }}>{val}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
