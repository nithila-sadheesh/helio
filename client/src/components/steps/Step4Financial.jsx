import InfoTip from '../InfoTip.jsx'

const MAINTENANCE_PER_YEAR = 100

export default function Step4Financial({ financial, panels }) {
  const { electricityRate, annualUsageKwh, annualElectricityCost, utilityName } = financial
  const monthlyBill = Math.round(annualElectricityCost / 12)

  const grossSavings = panels.annualSavings
  const netSavings = grossSavings - MAINTENANCE_PER_YEAR
  const paybackNet = Math.round((panels.netCostAfterTaxCredit / netSavings) * 10) / 10
  const savings25Net = Math.round(netSavings * 25 - panels.netCostAfterTaxCredit)

  const rateContext = electricityRate < 0.10 ? 'Below national average'
    : electricityRate < 0.15 ? 'Near national average'
    : electricityRate < 0.20 ? 'Above average — strong solar case'
    : 'High cost — excellent solar ROI'

  return (
    <div className="step-section" style={{ animationDelay: '240ms' }}>
      <div className="step-header">
        <div className="step-title">Financial Analysis</div>
      </div>

      <div className="card">
        {/* Current spend — prominent */}
        <div style={{
          background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.15)',
          borderRadius: 11, padding: '18px 20px', marginBottom: 20,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16
        }}>
          <div>
            <div style={{ fontSize: '0.76rem', color: 'var(--text3)', marginBottom: 4 }}>
              You currently spend
              <InfoTip description="Based on your state's average annual household electricity consumption." source="US EIA 2023 state-level data" />
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', fontWeight: 900, color: 'var(--red)', lineHeight: 1 }}>
              ${annualElectricityCost.toLocaleString()}
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text2)', marginTop: 4 }}>per year on electricity</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text3)', marginBottom: 3 }}>Monthly bill</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 700 }}>${monthlyBill}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text3)', marginTop: 3 }}>
              {utilityName}
              <InfoTip description={rateContext} source="NREL Utility Rate Database" />
            </div>
          </div>
        </div>

        <div className="stat-grid" style={{ marginBottom: 20 }}>
          <div className="stat-card">
            <div className="stat-label">
              Rate
              <InfoTip description="Your local residential electricity rate in dollars per kilowatt-hour." source="NREL Utility Rate Database" />
            </div>
            <div className="stat-value">${electricityRate.toFixed(3)}</div>
            <div className="stat-sub">per kWh</div>
          </div>
          <div className="stat-card stat-blue">
            <div className="stat-label">Annual Usage</div>
            <div className="stat-value">{annualUsageKwh.toLocaleString()}</div>
            <div className="stat-sub">kWh / year</div>
          </div>
        </div>

        {/* With solar */}
        <div style={{
          background: 'rgba(16,185,129,0.07)', border: '1px solid rgba(16,185,129,0.15)',
          borderRadius: 11, padding: '18px 20px'
        }}>
          <div style={{ fontSize: '0.76rem', color: 'var(--text3)', marginBottom: 14 }}>
            With solar panels installed
          </div>
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text3)', marginBottom: 3 }}>Gross electricity savings</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--green)' }}>
                +${grossSavings.toLocaleString()}/yr
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text3)', marginBottom: 3 }}>
                Maintenance cost
                <InfoTip description="Estimated annual costs for panel cleaning, inspection, and minor repairs. Does not include inverter replacement (~$1,500 once around year 10-15)." source="Industry average for residential systems" />
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--text2)' }}>
                -${MAINTENANCE_PER_YEAR}/yr
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text3)', marginBottom: 3 }}>Net annual savings</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 800, color: 'var(--green)' }}>
                ${netSavings.toLocaleString()}/yr
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', paddingTop: 14, borderTop: '1px solid rgba(16,185,129,0.15)' }}>
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text3)' }}>Payback period (net)</div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem' }}>{paybackNet} years</div>
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text3)' }}>25-year net savings</div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem', color: savings25Net > 0 ? 'var(--green)' : 'var(--red)' }}>
                ${savings25Net.toLocaleString()}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text3)' }}>Federal tax credit (30%)</div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem', color: 'var(--green)' }}>
                -${(panels.systemCostEstimate - panels.netCostAfterTaxCredit).toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
