const PANEL_ICONS = {
  'Monocrystalline': '▣',
  'Bifacial Monocrystalline': '◈',
  'Polycrystalline': '▦'
}

function PanelTypeCard({ option, recommended }) {
  return (
    <div style={{
      background: recommended ? 'rgba(245,158,11,0.07)' : 'var(--surface2)',
      border: `1px solid ${recommended ? 'rgba(245,158,11,0.28)' : 'var(--border)'}`,
      borderRadius: 11, padding: '18px 20px', flex: 1, minWidth: 200, position: 'relative',
      transition: 'transform 0.22s cubic-bezier(0.34,1.4,0.64,1), box-shadow 0.22s ease',
      cursor: 'default'
    }}
    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 14px 40px rgba(0,0,0,0.5)' }}
    onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}
    >
      {recommended && (
        <div style={{ marginBottom: 10 }}>
          <span className="badge badge-solar">Recommended</span>
        </div>
      )}
      <div style={{ fontSize: '1.5rem', marginBottom: 8, color: recommended ? 'var(--solar)' : 'var(--text2)' }}>{PANEL_ICONS[option.type] || '▣'}</div>
      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', marginBottom: 4 }}>{option.type}</div>
      <div style={{ display: 'inline-block', background: recommended ? 'var(--solar-glow)' : 'var(--surface3)', color: recommended ? 'var(--solar-light)' : 'var(--text3)', padding: '2px 9px', borderRadius: 5, fontSize: '0.75rem', fontWeight: 600, marginBottom: 10 }}>
        {Math.round(option.efficiency * 100)}% efficiency
      </div>
      <div style={{ fontSize: '0.82rem', color: 'var(--text2)', lineHeight: 1.6, marginBottom: 8 }}>{option.description}</div>
      <div style={{ fontSize: '0.76rem', color: 'var(--text3)' }}>Best for: {option.bestFor}</div>
    </div>
  )
}

export default function Step6Panels({ panels }) {
  const metrics = [
    { label: 'Panels Recommended', value: panels.recommendedPanels, sub: `${panels.panelWattage}W per panel`, color: 'var(--solar)', cls: 'stat-solar' },
    { label: 'Annual Production', value: `${panels.annualProductionKwh.toLocaleString()} kWh`, sub: 'electricity per year', color: 'var(--solar)', cls: 'stat-solar' },
    { label: 'Energy Offset', value: `${panels.offsetPercent}%`, sub: 'of annual home usage', color: 'var(--green)', cls: 'stat-green' },
    { label: 'System Size', value: `${panels.systemSizeKwp} kWp`, sub: 'total installed capacity', color: 'var(--blue-light)', cls: 'stat-blue' },
  ]

  return (
    <div className="step-section" style={{ animationDelay: '400ms' }}>
      <div className="step-header">
        <div className="step-title">Panel Recommendation</div>
      </div>

      <div className="card">
        {/* Big metrics grid — full width */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 16,
          marginBottom: 32
        }}>
          {metrics.map(m => (
            <div key={m.label} className={`stat-card ${m.cls}`} style={{ padding: '22px 18px' }}>
              <div className="stat-label">{m.label}</div>
              <div className="stat-value" style={{ fontSize: '2.4rem', color: m.color, lineHeight: 1, marginTop: 4 }}>
                {m.value}
              </div>
              <div className="stat-sub" style={{ marginTop: 6 }}>{m.sub}</div>
            </div>
          ))}
        </div>

        {/* Cost summary row */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14,
          padding: '18px 20px',
          background: 'rgba(245,158,11,0.05)',
          border: '1px solid rgba(245,158,11,0.15)',
          borderRadius: 12, marginBottom: 28
        }}>
          {[
            { label: 'System Cost', value: `$${panels.systemCostEstimate.toLocaleString()}`, sub: 'before tax credit', color: 'var(--text)' },
            { label: 'Net Cost (after 30% credit)', value: `$${panels.netCostAfterTaxCredit.toLocaleString()}`, sub: 'federal ITC applied', color: 'var(--solar)' },
            { label: 'Simple Payback', value: `${panels.simplePaybackYears} yrs`, sub: 'break-even point', color: 'var(--green)' },
          ].map(m => (
            <div key={m.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text3)', marginBottom: 4 }}>{m.label}</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 800, color: m.color }}>{m.value}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text3)', marginTop: 2 }}>{m.sub}</div>
            </div>
          ))}
        </div>

        {/* Panel type options */}
        <div style={{ fontSize: '0.88rem', fontWeight: 700, marginBottom: 14, color: 'var(--text2)' }}>Technology Options</div>
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
          {panels.options.map(opt => (
            <PanelTypeCard key={opt.type} option={opt} recommended={opt.type === panels.recommendedType} />
          ))}
        </div>
      </div>
    </div>
  )
}
