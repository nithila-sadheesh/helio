import { useState, useEffect, useRef } from 'react'
import Step1Map from './steps/Step1Map.jsx'
import Step2Roof from './steps/Step2Roof.jsx'
import Step3Solar from './steps/Step3Solar.jsx'
import Step4Financial from './steps/Step4Financial.jsx'
import Step5Score from './steps/Step5Score.jsx'
import Step6Panels from './steps/Step6Panels.jsx'
import Step7Simulation from './steps/Step7Simulation.jsx'
import Step8Installers from './steps/Step8Installers.jsx'
import { getInstallers, getActionPlan } from '../api.js'

const SIDEBAR_STEPS = [
  { id: 'step-1', label: 'Location' },
  { id: 'step-2', label: 'Roof Analysis' },
  { id: 'step-3', label: 'Solar Resource' },
  { id: 'step-4', label: 'Financial' },
  { id: 'step-5', label: 'Score' },
  { id: 'step-6', label: 'Panels' },
  { id: 'step-7', label: 'Simulate' },
  { id: 'step-8', label: 'Installers' }
]

export default function Report({ data, onReset }) {
  const [activeStep, setActiveStep] = useState('step-1')
  const [installers, setInstallers] = useState(null)
  const [installersLoading, setInstallersLoading] = useState(true)
  const [installersError, setInstallersError] = useState(null)
  const [planSteps, setPlanSteps] = useState(null)
  const [planLoading, setPlanLoading] = useState(false)
  const [planGenerated, setPlanGenerated] = useState(false)
  const [planError, setPlanError] = useState(null)
  const [doneSteps, setDoneSteps] = useState({})
  const [rmVisible, setRmVisible] = useState({})

  const roadmapWrapRef = useRef(null)
  const rmSpineGlowRef = useRef(null)

  const { location, roof, solar, financial, score, panels, environmental } = data

  useEffect(() => {
    getInstallers({
      lat: location.lat, lon: location.lon,
      city: location.city, state: location.state, stateCode: location.stateCode,
      usableArea: roof.usableArea, panelType: panels.recommendedType,
      annualProductionKwh: panels.annualProductionKwh, systemSizeKwp: panels.systemSizeKwp
    }).then(r => {
      setInstallers(r.installers)
      setInstallersLoading(false)
    }).catch(err => {
      setInstallersError(err.message)
      setInstallersLoading(false)
    })
  }, [])

  // Sidebar active step tracker
  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => { entries.forEach(e => { if (e.isIntersecting) setActiveStep(e.target.id) }) },
      { threshold: 0.2, rootMargin: '-10% 0px -60% 0px' }
    )
    SIDEBAR_STEPS.forEach(s => { const el = document.getElementById(s.id); if (el) obs.observe(el) })
    return () => obs.disconnect()
  }, [])

  // Scroll-triggered fade-in for step sections
  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => { entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in-view'); obs.unobserve(e.target) } }) },
      { threshold: 0.06 }
    )
    document.querySelectorAll('.step-section').forEach(s => obs.observe(s))
    return () => obs.disconnect()
  }, [planGenerated])

  // Roadmap row visibility (staggered slide-in)
  useEffect(() => {
    if (!planGenerated || !planSteps) return
    const obs = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            const idx = parseInt(e.target.dataset.rmIdx)
            setRmVisible(prev => ({ ...prev, [idx]: true }))
          }
        })
      },
      { threshold: 0.12 }
    )
    document.querySelectorAll('.rm-row[data-rm-idx]').forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [planGenerated, planSteps])

  // Roadmap neon spine scroll animation
  useEffect(() => {
    if (!planGenerated) return
    const handleScroll = () => {
      if (!roadmapWrapRef.current || !rmSpineGlowRef.current) return
      const rect = roadmapWrapRef.current.getBoundingClientRect()
      const viewH = window.innerHeight
      const progress = Math.max(0, Math.min(1, (viewH - rect.top) / (rect.height + viewH * 0.5)))
      rmSpineGlowRef.current.style.height = `${progress * 100}%`
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [planGenerated])

  function scrollTo(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  async function handleGeneratePlan() {
    if (planLoading || planGenerated) return
    setPlanLoading(true)
    setPlanError(null)
    try {
      const topInstaller = installers?.find(i => i.recommended)?.name || installers?.[0]?.name
      const r = await getActionPlan({ location, roof, solar, financial, score, panels, installerName: topInstaller })
      setPlanSteps(r.steps)
      setPlanGenerated(true)
    } catch (err) {
      setPlanError(err.message)
    } finally {
      setPlanLoading(false)
    }
  }

  const co2Tons = (environmental.annualCO2SavedKg / 1000).toFixed(1)
  const trees = environmental.treesEquivalent

  return (
    <div>
      {/* Print-only header — comprehensive */}
      <div className="print-header">
        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '2rem', fontWeight: 900, color: '#b45309', marginBottom: 6 }}>helio.</div>
        <div style={{ fontSize: '1rem', color: '#444', marginBottom: 4 }}>{location.display}</div>
        <div style={{ fontSize: '0.82rem', color: '#888', marginBottom: 20 }}>
          Solar Report — {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 24, paddingBottom: 20, borderBottom: '2px solid #ddd' }}>
          {[
            { label: 'Suitability Score', val: `${score.total}/10 (${score.rating})` },
            { label: 'CO2 Eliminated', val: `${co2Tons}t/yr` },
            { label: 'Annual Savings', val: `$${panels.annualSavings.toLocaleString()}` },
            { label: 'Recommended Panels', val: `${panels.recommendedPanels} panels` }
          ].map(m => (
            <div key={m.label}>
              <div style={{ fontSize: '0.68rem', color: '#888', letterSpacing: '0.05em', marginBottom: 3 }}>{m.label}</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#111' }}>{m.val}</div>
            </div>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 20, fontSize: '0.82rem', color: '#444' }}>
          {[
            { label: 'System Size', val: `${panels.systemSizeKwp} kWp` },
            { label: 'Annual Production', val: `${panels.annualProductionKwh.toLocaleString()} kWh` },
            { label: 'Energy Offset', val: `${panels.offsetPercent}%` },
            { label: 'Net Cost (after 30% credit)', val: `$${panels.netCostAfterTaxCredit.toLocaleString()}` },
            { label: 'Simple Payback', val: `${panels.simplePaybackYears} years` },
            { label: '25-Year Net Savings', val: `$${panels.savings25Year.toLocaleString()}` },
            { label: 'Roof Orientation', val: `${roof.orientation}` },
            { label: 'Peak Sun Hours', val: `${solar.peakSunHoursPerDay} hrs/day` },
            { label: 'Trees Equivalent', val: `${trees} trees/yr` },
          ].map(m => (
            <div key={m.label} style={{ borderLeft: '3px solid #f59e0b', paddingLeft: 10 }}>
              <div style={{ fontSize: '0.68rem', color: '#888' }}>{m.label}</div>
              <div style={{ fontWeight: 700, color: '#111' }}>{m.val}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="report-topbar no-print">
        <button className="btn btn-ghost" style={{ fontSize: '0.82rem', padding: '6px 14px' }} onClick={onReset}>
          New Analysis
        </button>
      </div>

      <div className="report-layout">
        <nav className="sidebar no-print">
          <div className="sidebar-logo">helio.</div>
          <div className="sidebar-env">
            <div className="sidebar-env-value">{co2Tons}t</div>
            <div className="sidebar-env-unit">CO2 / year</div>
            <div className="sidebar-env-label">{trees} trees equivalent</div>
          </div>
          <div className="sidebar-nav">
            {SIDEBAR_STEPS.map(s => (
              <button
                key={s.id}
                className={`sidebar-item ${activeStep === s.id ? 'active' : ''}`}
                onClick={() => scrollTo(s.id)}
              >
                {s.label}
              </button>
            ))}
          </div>
          <button
            className="sidebar-gen-btn"
            onClick={() => { handleGeneratePlan(); setTimeout(() => scrollTo('action-plan'), 200) }}
            disabled={planLoading}
          >
            {planLoading ? 'Generating...' : planGenerated ? 'Plan Ready' : 'Generate Action Plan'}
          </button>
        </nav>

        <div className="report-content">
          {/* Environmental impact hero */}
          <div className="step-section" style={{
            background: 'linear-gradient(135deg, rgba(16,185,129,0.11), rgba(16,185,129,0.04))',
            border: '1px solid rgba(16,185,129,0.18)',
            borderRadius: 16, padding: '26px 30px', marginBottom: 36,
            display: 'flex', gap: 48, alignItems: 'center', flexWrap: 'wrap'
          }}>
            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text3)', letterSpacing: '0.09em', marginBottom: 8 }}>
                Your potential impact
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.8rem', fontWeight: 900, color: 'var(--green)', lineHeight: 1 }}>
                {co2Tons}t
              </div>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--green-light)', marginTop: 5 }}>
                of CO2 eliminated every year
              </div>
              <div style={{ fontSize: '0.77rem', color: 'var(--text3)', marginTop: 4 }}>
                equivalent to planting {trees} trees annually
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              <div style={{ fontSize: '0.73rem', color: 'var(--text3)' }}>Over 25 years</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 800, color: 'var(--green)' }}>
                {(environmental.co2Over25Years / 1000).toFixed(0)}t CO2 eliminated
              </div>
              <div style={{ marginTop: 6, fontSize: '0.73rem', color: 'var(--text3)' }}>Annual electricity savings</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 800, color: 'var(--solar)' }}>
                ${panels.annualSavings.toLocaleString()}
              </div>
            </div>
          </div>

          <div id="step-1"><Step1Map location={location} /></div>
          <div id="step-2"><Step2Roof roof={roof} /></div>
          <div id="step-3"><Step3Solar solar={solar} /></div>
          <div id="step-4"><Step4Financial financial={financial} panels={panels} /></div>
          <div id="step-5"><Step5Score score={score} /></div>
          <div id="step-6"><Step6Panels panels={panels} /></div>
          <div id="step-7"><Step7Simulation panels={panels} financial={financial} solar={solar} /></div>
          <div id="step-8">
            <Step8Installers installers={installers} loading={installersLoading} error={installersError} />
          </div>

          {/* Action plan */}
          <div id="action-plan" className="action-plan-section step-section">
            <div className="step-header">
              <div className="step-title">Your Solar Action Plan</div>
              <div className="step-subtitle">Click any step to mark it complete</div>
            </div>

            {!planGenerated && !planLoading && (
              <button className="generate-btn no-print" onClick={handleGeneratePlan}>
                Generate My Action Plan
              </button>
            )}

            {planLoading && (
              <div style={{ textAlign: 'center', padding: '28px 0' }} className="no-print">
                <div className="spinner" />
                <div style={{ color: 'var(--text2)', fontSize: '0.86rem' }}>Building your personalized roadmap...</div>
              </div>
            )}

            {planError && (
              <div className="no-print" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, padding: '13px 17px', color: '#fca5a5', fontSize: '0.87rem' }}>
                {planError}
              </div>
            )}

            {planGenerated && planSteps && (
              <>
                {/* Curved roadmap with neon spine */}
                <div className="roadmap-wrap" ref={roadmapWrapRef}>
                  <div className="rm-spine no-print">
                    <div className="rm-spine-track" />
                    <div className="rm-spine-glow" ref={rmSpineGlowRef} />
                  </div>

                  {planSteps.map((step, i) => {
                    const isLeft = i % 2 === 0
                    return (
                      <div
                        key={i}
                        className={`rm-row ${rmVisible[i] ? 'rm-visible' : ''}`}
                        data-rm-idx={String(i)}
                        style={{ '--rm-delay': `${i * 0.1}s` }}
                      >
                        {isLeft ? (
                          <>
                            <div
                              className={`rm-card rm-card-left ${doneSteps[i] ? 'rm-done' : ''}`}
                              onClick={() => setDoneSteps(prev => ({ ...prev, [i]: !prev[i] }))}
                            >
                              {step.timeline && <div className="rm-week">{step.timeline}</div>}
                              <div className="rm-title">{step.title}</div>
                              <ul className="rm-bullets">
                                {(step.bullets || (step.description ? [step.description] : [])).map((b, j) => (
                                  <li key={j}>{b}</li>
                                ))}
                              </ul>
                            </div>
                            <div className="rm-node">
                              <div className={`rm-node-circle ${doneSteps[i] ? 'rm-node-done' : ''}`}>
                                {doneSteps[i] ? '✓' : i + 1}
                              </div>
                            </div>
                            <div className="rm-spacer" />
                          </>
                        ) : (
                          <>
                            <div className="rm-spacer" />
                            <div className="rm-node">
                              <div className={`rm-node-circle ${doneSteps[i] ? 'rm-node-done' : ''}`}>
                                {doneSteps[i] ? '✓' : i + 1}
                              </div>
                            </div>
                            <div
                              className={`rm-card rm-card-right ${doneSteps[i] ? 'rm-done' : ''}`}
                              onClick={() => setDoneSteps(prev => ({ ...prev, [i]: !prev[i] }))}
                            >
                              {step.timeline && <div className="rm-week">{step.timeline}</div>}
                              <div className="rm-title">{step.title}</div>
                              <ul className="rm-bullets">
                                {(step.bullets || (step.description ? [step.description] : [])).map((b, j) => (
                                  <li key={j}>{b}</li>
                                ))}
                              </ul>
                            </div>
                          </>
                        )}
                      </div>
                    )
                  })}
                </div>

                <button
                  className="no-print"
                  onClick={() => window.print()}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '10px 20px', borderRadius: 9, marginTop: 24,
                    border: '1px solid var(--border2)', background: 'var(--surface2)',
                    color: 'var(--text2)', cursor: 'pointer', fontSize: '0.85rem',
                    fontWeight: 600, transition: 'all 0.15s', fontFamily: 'var(--font)'
                  }}
                >
                  Download Report as PDF
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
