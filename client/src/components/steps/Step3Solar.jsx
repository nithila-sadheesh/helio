import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import InfoTip from '../InfoTip.jsx'

const MONTH_COLORS = {
  Jan: '#60A5FA', Feb: '#7DD3FC', Mar: '#86EFAC', Apr: '#4ADE80',
  May: '#FACC15', Jun: '#F59E0B', Jul: '#F59E0B', Aug: '#FB923C',
  Sep: '#FCD34D', Oct: '#86EFAC', Nov: '#7DD3FC', Dec: '#60A5FA'
}

const SEASONS = [
  { name: 'Spring', months: ['Mar','Apr','May'], icon: '🌱' },
  { name: 'Summer', months: ['Jun','Jul','Aug'], icon: '☀️' },
  { name: 'Autumn', months: ['Sep','Oct','Nov'], icon: '🍂' },
  { name: 'Winter', months: ['Dec','Jan','Feb'], icon: '❄️' }
]

function CustomTooltip({ active, payload, label }) {
  if (active && payload?.length) {
    return (
      <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 10, padding: '9px 14px', fontSize: '0.83rem' }}>
        <div style={{ fontWeight: 600, marginBottom: 3 }}>{label}</div>
        <div style={{ color: 'var(--solar)' }}>{payload[0].value} kWh/kWp</div>
      </div>
    )
  }
  return null
}

export default function Step3Solar({ solar }) {
  const seasonalData = SEASONS.map(s => {
    const months = solar.monthlyYield.filter(m => s.months.includes(m.month))
    const avg = months.length ? Math.round(months.reduce((a, m) => a + m.yield, 0) / months.length * 10) / 10 : 0
    return { ...s, avg }
  })

  return (
    <div className="step-section" style={{ animationDelay: '160ms' }}>
      <div className="step-header">
        <div className="step-title">Solar Resource</div>
      </div>

      <div className="card">
        <div className="stat-grid" style={{ marginBottom: 22 }}>
          <div className="stat-card stat-solar">
            <div className="stat-label">
              Annual Yield
              <InfoTip
                description="Electricity output per kWp of installed capacity per year. A 4 kWp system here would produce 4 × this value in kWh annually."
                source="PVGIS EU Joint Research Centre"
              />
            </div>
            <div className="stat-value">{solar.annualYieldKwhPerKwp.toLocaleString()}</div>
            <div className="stat-sub">kWh per kWp / year</div>
          </div>
          <div className="stat-card stat-solar">
            <div className="stat-label">
              Peak Sun Hours
              <InfoTip
                description="Average daily hours of equivalent full-intensity sunlight. More peak sun hours means more electricity produced per panel per day."
                source="PVGIS EU Joint Research Centre"
              />
            </div>
            <div className="stat-value">{solar.peakSunHoursPerDay}</div>
            <div className="stat-sub">hours / day (avg)</div>
          </div>
          <div className="stat-card stat-blue">
            <div className="stat-label">
              Annual Irradiation
              <InfoTip
                description="Total solar energy reaching 1 m² of ground per year. This is a raw measure of solar resource before any panel losses are applied."
                source="PVGIS EU Joint Research Centre"
              />
            </div>
            <div className="stat-value">{solar.annualIrradiation.toLocaleString()}</div>
            <div className="stat-sub">kWh/m² / year</div>
          </div>
          <div className="stat-card" style={{ border: `1px solid ${solar.shadingLoss < 10 ? 'rgba(16,185,129,0.25)' : solar.shadingLoss < 18 ? 'rgba(245,158,11,0.25)' : 'rgba(239,68,68,0.25)'}` }}>
            <div className="stat-label">
              Shading Loss
              <InfoTip
                description="Percentage of solar energy blocked by the surrounding horizon — nearby trees, hills, or buildings. Lower is better."
                source="PVGIS horizon profile scan"
              />
            </div>
            <div className="stat-value" style={{ color: solar.shadingLoss < 10 ? 'var(--green)' : solar.shadingLoss < 18 ? 'var(--solar)' : 'var(--red)' }}>
              {solar.shadingLoss}%
            </div>
            <div className="stat-sub">{solar.shadingLoss < 10 ? 'Minimal obstruction' : solar.shadingLoss < 18 ? 'Moderate' : 'Significant — investigate'}</div>
          </div>
        </div>

        {solar.monthlyYield.length > 0 && (
          <>
            <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: 10, color: 'var(--text2)' }}>
              Monthly Production per kWp
            </div>
            <div style={{ height: 180 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={solar.monthlyYield} margin={{ top: 4, right: 0, left: -22, bottom: 0 }}>
                  <XAxis dataKey="month" tick={{ fill: 'var(--text3)', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: 'var(--text3)', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                  <Bar dataKey="yield" radius={[3, 3, 0, 0]}>
                    {solar.monthlyYield.map(m => (
                      <Cell key={m.month} fill={MONTH_COLORS[m.month] || '#F59E0B'} fillOpacity={0.82} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginTop: 18 }}>
          {seasonalData.map(s => (
            <div key={s.name} style={{ background: 'var(--surface2)', borderRadius: 9, padding: '12px 10px', textAlign: 'center' }}>
              <div style={{ fontSize: '1.3rem', marginBottom: 4 }}>{s.icon}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text3)', marginBottom: 3 }}>{s.name}</div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--solar)', fontSize: '1.1rem' }}>{s.avg}</div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text3)' }}>kWh/kWp/mo</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
