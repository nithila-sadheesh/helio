import InfoTip from '../InfoTip.jsx'

const M2_TO_SQFT = 10.764

const ORIENTATIONS = {
  S:   { color: '#10B981', quality: 'Optimal',   desc: 'Best possible — faces full south sun in Northern Hemisphere.' },
  SSE: { color: '#22C55E', quality: 'Excellent',  desc: 'Near-optimal with minimal production loss.' },
  SSW: { color: '#22C55E', quality: 'Excellent',  desc: 'Near-optimal with minimal production loss.' },
  SE:  { color: '#F59E0B', quality: 'Very Good',  desc: 'Good morning sun, ~10% below south-facing optimal.' },
  SW:  { color: '#F59E0B', quality: 'Very Good',  desc: 'Good afternoon sun, ~10% below optimal.' },
  ESE: { color: '#F97316', quality: 'Fair',        desc: 'Limited to morning sun, notable production reduction.' },
  WSW: { color: '#F97316', quality: 'Fair',        desc: 'Limited to afternoon sun, notable production reduction.' },
  E:   { color: '#F97316', quality: 'Fair',        desc: 'Morning sun only — significant production reduction.' },
  W:   { color: '#F97316', quality: 'Fair',        desc: 'Afternoon sun only — significant production reduction.' },
  N:   { color: '#EF4444', quality: 'Poor',        desc: 'Minimal direct sunlight. Optimizers recommended.' },
  NE:  { color: '#EF4444', quality: 'Poor',        desc: 'Very limited direct sun exposure.' },
  NW:  { color: '#EF4444', quality: 'Poor',        desc: 'Very limited direct sun exposure.' }
}

function CompassRose({ orientation }) {
  const dirs = ['N','NE','E','SE','S','SW','W','NW']
  return (
    <div style={{ position: 'relative', width: 110, height: 110, flexShrink: 0 }}>
      <svg viewBox="0 0 110 110" width="110" height="110">
        <circle cx="55" cy="55" r="50" fill="var(--surface2)" stroke="var(--border)" strokeWidth="1" />
        {dirs.map((d, i) => {
          const a = i * 45 * Math.PI / 180
          const r = 36
          const x = 55 + r * Math.sin(a)
          const y = 55 - r * Math.cos(a)
          const isActive = d === orientation
          return (
            <g key={d}>
              <circle cx={x} cy={y} r={isActive ? 9 : 6} fill={isActive ? '#F59E0B' : 'var(--surface3)'} style={{ filter: isActive ? 'drop-shadow(0 0 5px rgba(245,158,11,0.7))' : 'none' }} />
              <text x={x} y={y + 3.5} textAnchor="middle" fontSize={isActive ? 7 : 6} fill={isActive ? '#000' : 'var(--text3)'} fontWeight={isActive ? '800' : '400'} fontFamily="var(--font-display)">{d}</text>
            </g>
          )
        })}
        <line x1="55" y1="55" x2={55 + 18 * Math.sin(dirs.indexOf(orientation) * 45 * Math.PI / 180)} y2={55 - 18 * Math.cos(dirs.indexOf(orientation) * 45 * Math.PI / 180)} stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="55" cy="55" r="2.5" fill="#F59E0B" />
      </svg>
    </div>
  )
}

export default function Step2Roof({ roof }) {
  const ori = ORIENTATIONS[roof.orientation] || ORIENTATIONS['S']
  const totalSqft = Math.round(roof.totalArea * M2_TO_SQFT)
  const usableSqft = Math.round(roof.usableArea * M2_TO_SQFT)

  return (
    <div className="step-section" style={{ animationDelay: '80ms' }}>
      <div className="step-header">
        <div className="step-title">Roof Analysis</div>
      </div>

      <div className="card">
        <div className="stat-grid" style={{ marginBottom: 22 }}>
          <div className="stat-card stat-solar">
            <div className="stat-label">
              Total Roof Area
              <InfoTip description="Building footprint area calculated from the polygon geometry." source="OpenStreetMap Overpass API" />
            </div>
            <div className="stat-value">{totalSqft.toLocaleString()}</div>
            <div className="stat-sub">sq ft ({roof.totalArea} m²)</div>
          </div>
          <div className="stat-card stat-green">
            <div className="stat-label">
              Usable Solar Area
              <InfoTip description="75% of total footprint after accounting for setbacks, HVAC, chimneys, and minimum clearances." source="Standard solar installation guidelines" />
            </div>
            <div className="stat-value">{usableSqft.toLocaleString()}</div>
            <div className="stat-sub">sq ft ({roof.usableArea} m²)</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Max Panels Possible</div>
            <div className="stat-value">{Math.floor(roof.usableArea / 1.7)}</div>
            <div className="stat-sub">400W panels (1.7 m² each)</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 20, alignItems: 'center', paddingTop: 18, borderTop: '1px solid var(--border)', flexWrap: 'wrap' }}>
          <CompassRose orientation={roof.orientation} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text3)', letterSpacing: '0.06em', marginBottom: 7 }}>
              Primary Slope Facing
              <InfoTip description="Estimated from the longest wall of the building footprint. The slope faces perpendicular to the ridge." source="OpenStreetMap building geometry" />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 800, color: ori.color }}>
                {roof.orientation}
              </span>
              <span className="badge badge-solar">{ori.quality}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
