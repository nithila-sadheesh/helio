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
  const radius = 84
  const stroke = 13
  const nr = radius - stroke / 2
  const circ = nr * 2 * Math.PI
  const color = SCORE_COLORS[rating] || '#F59E0B'

  useEffect(() => {
    const t = setTimeout(() => setAnimated(score), 300)
    return () => clearTimeout(t)
  }, [score])

  return (
    <div style={{ position: 'relative', width: 200, height: 200, flexShrink: 0, margin: '0 auto' }}>
      <svg width={200} height={200} viewBox="0 0 200 200">
        {/* Track arc */}
        <circle cx={100} cy={100} r={nr} fill="none" stroke="var(--surface3)" strokeWidth={stroke}
          strokeDasharray={`${circ * 0.75} ${circ * 0.25}`} strokeDashoffset={circ * 0.125}
          strokeLinecap="round" transform="rotate(135, 100, 100)" />
        {/* Progress arc */}
        <circle cx={100} cy={100} r={nr} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={`${(animated / 10) * circ * 0.75} ${circ - (animated / 10) * circ * 0.75}`}
          strokeDashoffset={-(circ * 0.125)}
          strokeLinecap="round" transform="rotate(135, 100, 100)"
          style={{ transition: 'stroke-dasharray 1.4s cubic-bezier(0.34, 1.4, 0.64, 1)', filter: `drop-shadow(0 0 10px ${color}90)` }}
        />
        <text x="100" y="95" textAnchor="middle" fill={color} fontFamily="'Space Grotesk', sans-serif" fontWeight="900" fontSize="48">{score}</text>
        <text x="100" y="116" textAnchor="middle" fill="var(--text3)" fontSize="13" fontFamily="var(--font)">out of 10</text>
        <text x="100" y="140" textAnchor="middle" fill={color} fontFamily="'Space Grotesk', sans-serif" fontWeight="700" fontSize="14">{rating}</text>
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
        <div className="gauge-wrapper">
          <ScoreGauge score={score.total} rating={score.rating} />

          <div className="gauge-breakdown">
            {Object.entries(score.breakdown).map(([key, val]) => {
              const max = FACTOR_MAX[key] || 2
              const pct = (val / max) * 100
              return (
                <div key={key} className="breakdown-item">
                  <div className="breakdown-label">
                    <span>{FACTOR_LABELS[key]}</span>
                    <span style={{ color, fontWeight: 700 }}>{val} / {max}</span>
                  </div>
                  <div className="breakdown-bar-track">
                    <div className="breakdown-bar-fill" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
