function Stars({ rating }) {
  const full = Math.floor(rating)
  const half = rating % 1 >= 0.5
  return (
    <div className="installer-rating">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={`star ${i < full ? '' : i === full && half ? 'half' : 'empty'}`}>
          {i < full ? '★' : i === full && half ? '⯨' : '☆'}
        </span>
      ))}
      <span style={{ marginLeft: 5, fontSize: '0.8rem', color: 'var(--text2)' }}>{rating.toFixed(1)}</span>
    </div>
  )
}

function InstallerCard({ installer, index }) {
  return (
    <div
      className={`installer-card ${installer.recommended ? 'recommended' : ''}`}
      style={{ animationDelay: `${index * 80}ms`, animation: 'fadeUp 0.4s ease both' }}
    >
      {installer.recommended && (
        <div style={{ marginBottom: 10 }}>
          <span className="badge badge-solar">Top Match</span>
        </div>
      )}
      <div className="installer-name">{installer.name}</div>
      <div style={{ fontSize: '0.8rem', color: 'var(--text3)', marginBottom: 10 }}>
        {installer.distanceKm} km away
      </div>
      <Stars rating={installer.aiRating || 4.0} />
      <div className="installer-eval">{installer.aiEvaluation}</div>
      {installer.specialties?.length > 0 && (
        <div className="installer-tags">
          {installer.specialties.map(s => (
            <span key={s} className="installer-tag">{s}</span>
          ))}
        </div>
      )}
    </div>
  )
}

export default function Step8Installers({ installers, loading, error }) {
  return (
    <div className="step-section" style={{ animationDelay: '560ms' }}>
      <div className="step-header">
        <div className="step-title">Local Solar Installers</div>
      </div>

      <div className="card">
        {loading && (
          <div style={{ textAlign: 'center', padding: '36px 0' }}>
            <div className="spinner" />
            <div style={{ color: 'var(--text2)', fontSize: '0.88rem', marginTop: 14 }}>
              Finding and evaluating local installers...
            </div>
          </div>
        )}

        {error && (
          <div style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.18)', borderRadius: 10, padding: '13px 17px', color: '#fca5a5', fontSize: '0.87rem' }}>
            Could not load installer data: {error}
          </div>
        )}

        {!loading && !error && installers && (
          <div className="installer-cards">
            {installers.map((ins, i) => (
              <InstallerCard key={i} installer={ins} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
