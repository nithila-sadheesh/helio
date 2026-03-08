import { useState } from 'react'

const FEATURES = [
  {
    icon: '🏠',
    cls: 'fi-solar',
    title: 'Roof Analysis',
    desc: 'Building footprint detection calculates your exact usable roof area, orientation, and shading profile.'
  },
  {
    icon: '☀️',
    cls: 'fi-solar',
    title: 'Solar Resource Mapping',
    desc: 'EU Joint Research Centre PVGIS data delivers precise annual sunshine hours and seasonal production forecasts.'
  },
  {
    icon: '🌿',
    cls: 'fi-green',
    title: 'Environmental Impact',
    desc: 'Quantify your CO2 reduction in tons and trees equivalent — sustainability is the focus throughout.'
  },
  {
    icon: '💡',
    cls: 'fi-blue',
    title: 'Financial Modeling',
    desc: 'Real utility rate data from NREL with system cost estimates, 30% federal tax credit, and 25-year ROI.'
  },
  {
    icon: '⚡',
    cls: 'fi-solar',
    title: 'Suitability Score',
    desc: 'A data-driven 1–10 score weighing solar resource, roof geometry, shading, and your electricity price.'
  },
  {
    icon: '📋',
    cls: 'fi-blue',
    title: 'Action Plan',
    desc: 'A personalized step-by-step roadmap to get your solar system planned, financed, and installed.'
  }
]

export default function Landing({ onAnalyze, error }) {
  const [address, setAddress] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!address.trim()) return
    setLoading(true)
    await onAnalyze(address.trim())
    setLoading(false)
  }

  return (
    <div className="landing">
      <div className="landing-hero">
        {/* Sunrise background — landing page only */}
        <div className="sunrise-orb" />
        <div className="sunrise-halo" />
        <div className="sunrise-rays" />

        <div className="landing-hero-content">
          <div className="logo">helio.</div>
          <div className="landing-tagline">
            the <del>sky's</del> <span className="tagline-replace">roof's</span> the limit
          </div>
          <p className="landing-sub">
            Enter any address and get a comprehensive solar panel effectiveness report —
            from roof analysis to CO2 impact to a personalized action plan.
          </p>

          <form className="address-form" onSubmit={handleSubmit}>
            <input
              className="address-input"
              type="text"
              value={address}
              onChange={e => setAddress(e.target.value)}
              placeholder="123 Main Street, San Francisco, CA"
              autoFocus
            />
            <button className="analyze-btn" type="submit" disabled={loading || !address.trim()}>
              {loading ? 'Analyzing...' : 'Analyze My Home'}
            </button>
          </form>

          {error && <div className="error-msg">{error}</div>}
        </div>
      </div>

      <div className="feature-grid">
        {FEATURES.map(f => (
          <div key={f.title} className="feature-card">
            <div className={`feature-icon ${f.cls}`}>{f.icon}</div>
            <div>
              <div className="feature-title">{f.title}</div>
              <div className="feature-desc">{f.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
