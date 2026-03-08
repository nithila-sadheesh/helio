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
      borderRadius: 11, padding: '16px 18px', flex: 1, minWidth: 180, position: 'relative'
    }}>
      {recommended && (
        <div style={{ marginBottom: 10 }}>
          <span className="badge badge-solar">Recommended</span>
        </div>
      )}
      <div style={{ fontSize: '1.3rem', marginBottom: 6, color: recommended ? 'var(--solar)' : 'var(--text2)' }}>{PANEL_ICONS[option.type] || '▣'}</div>
      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.95rem', marginBottom: 3 }}>{option.type}</div>
      <div style={{ display: 'inline-block', background: recommended ? 'var(--solar-glow)' : 'var(--surface3)', color: recommended ? 'var(--solar-light)' : 'var(--text3)', padding: '2px 9px', borderRadius: 5, fontSize: '0.75rem', fontWeight: 600, marginBottom: 9 }}>
        {Math.round(option.efficiency * 100)}% efficiency
      </div>
      <div style={{ fontSize: '0.8rem', color: 'var(--text2)', lineHeight: 1.55, marginBottom: 7 }}>{option.description}</div>
      <div style={{ fontSize: '0.75rem', color: 'var(--text3)' }}>Best for: {option.bestFor}</div>
    </div>
  )
}

export default function Step6Panels({ panels }) {
  return (
    <div className="step-section" style={{ animationDelay: '400ms' }}>
      <div className="step-header">
        <div className="step-title">Panel Recommendation</div>
      </div>

      <div className="card">
        {/* Panel count — hero */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 28, marginBottom: 24,
          flexWrap: 'wrap'
        }}>
          <div style={{ textAlign: 'center', minWidth: 120 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '5rem', fontWeight: 900, color: 'var(--solar)', lineHeight: 1 }}>
              {panels.recommendedPanels}
            </div>
            <div style={{ fontSize: '0.88rem', color: 'var(--text2)', fontWeight: 600, marginTop: 4 }}>panels recommended</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text3)', marginTop: 2 }}>{panels.panelWattage}W each</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 2 }}>Annual Production</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 800, color: 'var(--solar)' }}>
                {panels.annualProductionKwh.toLocaleString()} kWh
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 2 }}>Usage Offset</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 800, color: 'var(--green)' }}>
                {panels.offsetPercent}%
              </div>
            </div>
          </div>
        </div>

        {/* Panel type options */}
        <div style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: 12, color: 'var(--text2)' }}>Technology Options</div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {panels.options.map(opt => (
            <PanelTypeCard key={opt.type} option={opt} recommended={opt.type === panels.recommendedType} />
          ))}
        </div>
      </div>
    </div>
  )
}
