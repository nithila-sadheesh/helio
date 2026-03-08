import { useState, useMemo } from 'react'

const PANEL_TYPES = [
  { label: 'Monocrystalline', efficiency: 0.22, price: 1200 },
  { label: 'Bifacial Mono', efficiency: 0.24, price: 1350 },
  { label: 'Polycrystalline', efficiency: 0.17, price: 950 }
]

const CO2_FACTOR = 0.386
const MAINTENANCE = 100

function MetricRow({ label, value, sub, color }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '12px 0', borderBottom: '1px solid var(--border)'
    }}>
      <div>
        <div style={{ fontSize: '0.9rem', fontWeight: 500 }}>{label}</div>
        {sub && <div style={{ fontSize: '0.75rem', color: 'var(--text3)' }}>{sub}</div>}
      </div>
      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem', color: color || 'var(--text)' }}>
        {value}
      </div>
    </div>
  )
}

export default function Step7Simulation({ panels, financial, solar }) {
  const [numPanels, setNumPanels] = useState(panels.recommendedPanels)
  const [panelTypeIdx, setPanelTypeIdx] = useState(0)
  const [rate, setRate] = useState(financial.electricityRate)

  const results = useMemo(() => {
    const pt = PANEL_TYPES[panelTypeIdx]
    const kwp = numPanels * 0.4
    const annualProduction = Math.round(kwp * solar.annualYieldKwhPerKwp)
    const annualSavings = Math.round(annualProduction * rate)
    const netSavings = annualSavings - MAINTENANCE
    const co2Saved = Math.round(annualProduction * CO2_FACTOR)
    const systemCost = numPanels * pt.price
    const netCost = Math.round(systemCost * 0.7)
    const payback = netSavings > 0 ? Math.round((netCost / netSavings) * 10) / 10 : 99
    const savings25 = Math.round(netSavings * 25 - netCost)
    const trees = Math.round(co2Saved / 21)
    const offsetPct = Math.round((annualProduction / financial.annualUsageKwh) * 100)

    return { annualProduction, annualSavings, netSavings, co2Saved, systemCost, netCost, payback, savings25, trees, offsetPct, kwp: Math.round(kwp * 10) / 10 }
  }, [numPanels, panelTypeIdx, rate, solar, financial])

  return (
    <div className="step-section" style={{ animationDelay: '480ms' }}>
      <div className="step-header">
        <div className="step-title">Interactive Simulation</div>
        <div className="step-subtitle">Adjust panels, type, and rate to see real-time impact</div>
      </div>

      <div className="card">
        <div className="sim-layout">
          {/* Controls */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            <div style={{ fontWeight: 600, marginBottom: -12 }}>Configure Your System</div>

            {/* Panel count */}
            <div className="slider-group">
              <div className="slider-label">
                <span>Number of Panels</span>
                <span>{numPanels} panels ({results.kwp} kWp)</span>
              </div>
              <input
                type="range"
                min={2}
                max={panels.maxPanels}
                value={numPanels}
                onChange={e => setNumPanels(Number(e.target.value))}
                style={{ accentColor: 'var(--solar)' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text3)' }}>
                <span>2 panels</span>
                <span>{panels.maxPanels} max</span>
              </div>
            </div>

            {/* Electricity rate */}
            <div className="slider-group">
              <div className="slider-label">
                <span>Electricity Rate</span>
                <span>${rate.toFixed(3)}/kWh</span>
              </div>
              <input
                type="range"
                min={0.08}
                max={0.40}
                step={0.001}
                value={rate}
                onChange={e => setRate(Number(e.target.value))}
                style={{ accentColor: 'var(--solar)' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text3)' }}>
                <span>$0.08/kWh</span>
                <span>$0.40/kWh</span>
              </div>
            </div>

            {/* Panel type */}
            <div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text2)', marginBottom: 10 }}>Panel Technology</div>
              <div style={{ display: 'flex', flex: 1, gap: 8 }}>
                {PANEL_TYPES.map((pt, i) => (
                  <button
                    key={pt.label}
                    onClick={() => setPanelTypeIdx(i)}
                    style={{
                      flex: 1, padding: '10px 8px', borderRadius: 10, border: '1px solid',
                      borderColor: panelTypeIdx === i ? 'rgba(245,158,11,0.5)' : 'var(--border)',
                      background: panelTypeIdx === i ? 'var(--solar-glow2)' : 'var(--surface2)',
                      color: panelTypeIdx === i ? 'var(--solar-light)' : 'var(--text2)',
                      cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600, lineHeight: 1.3
                    }}
                  >
                    <div>{pt.label}</div>
                    <div style={{ color: 'var(--text3)', fontWeight: 400, marginTop: 3 }}>{Math.round(pt.efficiency * 100)}% eff.</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Offset indicator */}
            <div style={{ background: 'var(--surface2)', borderRadius: 12, padding: '14px 16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: 8 }}>
                <span style={{ color: 'var(--text2)' }}>Energy Offset</span>
                <span style={{ color: 'var(--solar)', fontWeight: 700 }}>{results.offsetPct}%</span>
              </div>
              <div style={{ height: 8, background: 'var(--surface3)', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${Math.min(results.offsetPct, 100)}%`,
                  background: results.offsetPct >= 100 ? 'var(--green)' : 'linear-gradient(90deg, var(--solar), var(--solar-light))',
                  borderRadius: 4, transition: 'width 0.3s ease'
                }} />
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text3)', marginTop: 6 }}>
                {results.offsetPct >= 100 ? 'Full offset — may generate surplus' : `${100 - results.offsetPct}% still from grid`}
              </div>
            </div>
          </div>

          {/* Results */}
          <div>
            <div style={{ fontWeight: 600, marginBottom: 16 }}>Live Results</div>

            <MetricRow
              label="Annual Solar Production"
              value={`${results.annualProduction.toLocaleString()} kWh`}
              sub="electricity generated per year"
              color="var(--solar)"
            />
            <MetricRow
              label="Annual Savings"
              value={`$${results.netSavings.toLocaleString()}`}
              sub="net after $100/yr maintenance"
              color="var(--green)"
            />
            <MetricRow
              label="CO2 Eliminated"
              value={`${results.co2Saved.toLocaleString()} kg`}
              sub="per year (US grid avg)"
              color="var(--green)"
            />
            <MetricRow
              label="Trees Equivalent"
              value={`${results.trees} trees`}
              sub="planted annually"
              color="var(--green)"
            />
            <MetricRow
              label="System Cost (net)"
              value={`$${results.netCost.toLocaleString()}`}
              sub="after 30% federal tax credit"
            />
            <MetricRow
              label="Payback Period"
              value={`${results.payback} yrs`}
              sub="simple break-even"
              color="var(--blue-light)"
            />
            <MetricRow
              label="25-Year Net Savings"
              value={results.savings25 > 0 ? `$${results.savings25.toLocaleString()}` : 'Negative ROI'}
              sub="lifetime financial return"
              color={results.savings25 > 0 ? 'var(--green)' : 'var(--red)'}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
