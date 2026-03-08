import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import Anthropic from '@anthropic-ai/sdk'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
const NREL_KEY = process.env.NREL_API_KEY || 'DEMO_KEY'
const PORT = process.env.PORT || 3001

// ── State annual electricity usage (kWh/year, EIA 2023) ──────────────────────
const STATE_USAGE = {
  AL: 14883, AK: 6716, AZ: 11816, AR: 13364, CA: 6535, CO: 8156,
  CT: 8171, DE: 10050, FL: 13695, GA: 13159, HI: 6416, ID: 11880,
  IL: 8908, IN: 11231, IA: 9155, KS: 11168, KY: 12735, LA: 14655,
  ME: 6601, MD: 11222, MA: 7047, MI: 8729, MN: 9002, MS: 13685,
  MO: 11234, MT: 9383, NE: 10348, NV: 10568, NH: 7015, NJ: 8333,
  NM: 7281, NY: 6803, NC: 12893, ND: 11236, OH: 10064, OK: 12543,
  OR: 9383, PA: 9473, RI: 7062, SC: 14154, SD: 10424, TN: 14491,
  TX: 13584, UT: 9021, VT: 7173, VA: 13135, WA: 10763, WV: 13104,
  WI: 8985, WY: 13340
}

// ── Geometry utilities ────────────────────────────────────────────────────────
function calcPolygonArea(coords) {
  if (!coords || coords.length < 3) return null
  const R = 6371000
  const lat0 = (coords[0].lat * Math.PI) / 180
  const pts = coords.map(c => ({
    x: ((c.lon - coords[0].lon) * Math.PI / 180) * Math.cos(lat0) * R,
    y: (c.lat - coords[0].lat) * (Math.PI / 180) * R
  }))
  let area = 0
  for (let i = 0; i < pts.length; i++) {
    const j = (i + 1) % pts.length
    area += pts[i].x * pts[j].y - pts[j].x * pts[i].y
  }
  return Math.abs(area / 2)
}

function calcOrientation(coords) {
  if (!coords || coords.length < 2) return 'Unknown'
  let maxLen = 0
  let wallBearing = 0
  for (let i = 0; i < coords.length - 1; i++) {
    const lat = ((coords[i].lat + coords[i + 1].lat) / 2) * (Math.PI / 180)
    const dx = (coords[i + 1].lon - coords[i].lon) * Math.cos(lat) * 111320
    const dy = (coords[i + 1].lat - coords[i].lat) * 110540
    const len = Math.sqrt(dx * dx + dy * dy)
    if (len > maxLen) {
      maxLen = len
      wallBearing = (Math.atan2(dx, dy) * 180) / Math.PI
    }
  }
  // Slopes are perpendicular to the wall (ridge)
  const s1 = ((wallBearing + 90) % 360 + 360) % 360
  const s2 = ((wallBearing - 90) % 360 + 360) % 360
  const d1 = Math.abs(((s1 - 180 + 180) % 360) - 180)
  const d2 = Math.abs(((s2 - 180 + 180) % 360) - 180)
  const slope = d1 < d2 ? s1 : s2
  const dirs = ['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSW','SW','WSW','W','WNW','NW','NNW']
  return dirs[Math.round(slope / 22.5) % 16]
}

function orientationFactor(orientation) {
  const map = {
    S: 1.0, SSE: 0.97, SSW: 0.97, SE: 0.9, SW: 0.9,
    ESE: 0.75, WSW: 0.75, E: 0.65, W: 0.65,
    ENE: 0.5, WNW: 0.5, NE: 0.4, NW: 0.4,
    NNE: 0.3, NNW: 0.3, N: 0.25
  }
  return map[orientation] ?? 0.7
}

// ── Solar suitability score ───────────────────────────────────────────────────
function calcSuitabilityScore({ annualYield, usableArea, shadingLoss, electricityRate, orientation }) {
  const solarPts = Math.min((annualYield / 1600) * 3.5, 3.5)
  const areaPts = Math.min((usableArea / 60) * 2, 2)
  const shadePts = Math.max(0, (1 - shadingLoss / 30) * 1.5)
  const ratePts = Math.min((electricityRate / 0.25) * 1.5, 1.5)
  const orientPts = orientationFactor(orientation) * 1.5
  const total = Math.min(10, solarPts + areaPts + shadePts + ratePts + orientPts)
  return {
    total: Math.round(total * 10) / 10,
    breakdown: {
      solarResource: Math.round(solarPts * 10) / 10,
      roofArea: Math.round(areaPts * 10) / 10,
      shading: Math.round(shadePts * 10) / 10,
      electricityRate: Math.round(ratePts * 10) / 10,
      orientation: Math.round(orientPts * 10) / 10
    },
    rating: total >= 8 ? 'Excellent' : total >= 6 ? 'Very Good' : total >= 4 ? 'Good' : 'Fair'
  }
}

// ── Panel recommendation ──────────────────────────────────────────────────────
function calcPanelRecommendation({ usableArea, annualYield, annualUsage, electricityRate }) {
  const PANEL_W = 400
  const PANEL_KWP = 0.4
  const PANEL_AREA = 1.7
  const COVERAGE = 0.78
  const COST_PER_KWP = 3100
  const CO2_FACTOR = 0.386
  const TAX_CREDIT = 0.30

  const maxPanels = Math.floor((usableArea * COVERAGE) / PANEL_AREA)

  // Panels to offset 100% of usage
  const needed100 = Math.ceil(annualUsage / (PANEL_KWP * annualYield))
  const recommendedPanels = Math.min(Math.max(needed100, 4), maxPanels)

  const systemKwp = recommendedPanels * PANEL_KWP
  const annualProduction = systemKwp * annualYield
  const MAINTENANCE_PER_YEAR = 100
  const annualSavings = annualProduction * electricityRate
  const annualNetSavings = annualSavings - MAINTENANCE_PER_YEAR
  const systemCost = systemKwp * COST_PER_KWP
  const netCost = systemCost * (1 - TAX_CREDIT)
  const payback = netCost / annualNetSavings
  const savings25yr = annualNetSavings * 25 - netCost
  const co2Annual = annualProduction * CO2_FACTOR

  // Choose recommended panel type
  let type = 'Monocrystalline'
  let efficiency = 0.22
  if (usableArea > 80 && annualYield > 1200) {
    type = 'Bifacial Monocrystalline'
    efficiency = 0.24
  }

  return {
    recommendedType: type,
    efficiency,
    panelWattage: PANEL_W,
    panelAreaM2: PANEL_AREA,
    maxPanels,
    recommendedPanels,
    systemSizeKwp: Math.round(systemKwp * 10) / 10,
    annualProductionKwh: Math.round(annualProduction),
    annualSavings: Math.round(annualSavings),
    maintenanceCostPerYear: MAINTENANCE_PER_YEAR,
    systemCostEstimate: Math.round(systemCost),
    netCostAfterTaxCredit: Math.round(netCost),
    simplePaybackYears: Math.round(payback * 10) / 10,
    savings25Year: Math.round(savings25yr),
    offsetPercent: Math.round((annualProduction / annualUsage) * 100),
    options: [
      {
        type: 'Monocrystalline',
        efficiency: 0.22,
        description: 'Premium silicon cells with highest efficiency. Best performance in limited space.',
        bestFor: 'Small to medium roofs, high-sun regions'
      },
      {
        type: 'Bifacial Monocrystalline',
        efficiency: 0.24,
        description: 'Captures light on both sides. Ideal for large roofs with reflective surroundings.',
        bestFor: 'Large roofs, snowy climates, commercial'
      },
      {
        type: 'Polycrystalline',
        efficiency: 0.17,
        description: 'Cost-effective multi-crystal silicon. Good balance of performance and price.',
        bestFor: 'Budget-conscious, large roof area'
      }
    ],
    environmental: {
      annualCO2SavedKg: Math.round(co2Annual),
      treesEquivalent: Math.round(co2Annual / 21),
      carsOffRoad: Math.round((co2Annual / 4600) * 100) / 100,
      homesPowered: Math.round((annualProduction / 10500) * 100) / 100,
      co2Over25Years: Math.round(co2Annual * 25)
    }
  }
}

// ── External API helpers ──────────────────────────────────────────────────────
async function geocode(address) {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&addressdetails=1&limit=1`
  const res = await fetch(url, {
    headers: { 'User-Agent': 'HelioSolarApp/1.0 (hackathon project)' }
  })
  const data = await res.json()
  if (!data.length) throw new Error('Address not found')
  const r = data[0]
  const addr = r.address || {}
  const stateCode = (addr['ISO3166-2-lvl4'] || '').replace('US-', '') ||
    Object.entries({ CA:'California',TX:'Texas',NY:'New York',FL:'Florida',WA:'Washington',OR:'Oregon',CO:'Colorado',AZ:'Arizona',NV:'Nevada',GA:'Georgia',NC:'North Carolina',VA:'Virginia',IL:'Illinois',OH:'Ohio',PA:'Pennsylvania',MA:'Massachusetts',MD:'Maryland',NJ:'New Jersey',MI:'Michigan',MN:'Minnesota' })
      .find(([,v]) => v === addr.state)?.[0] || ''
  return {
    lat: parseFloat(r.lat),
    lon: parseFloat(r.lon),
    display: r.display_name,
    city: addr.city || addr.town || addr.village || addr.county || '',
    state: addr.state || '',
    stateCode: stateCode.toUpperCase(),
    country: addr.country_code?.toUpperCase() || 'US'
  }
}

async function getBuildingPolygon(lat, lon) {
  const query = `[out:json][timeout:20];way(around:120,${lat},${lon})[building];out geom;`
  const res = await fetch('https://overpass-api.de/api/interpreter', {
    method: 'POST',
    body: query,
    headers: { 'Content-Type': 'text/plain' }
  })
  const data = await res.json()
  if (!data.elements?.length) return null
  const way = data.elements[0]
  const coords = way.geometry?.map(g => ({ lat: g.lat, lon: g.lon })) || []
  return coords
}

async function getSolarData(lat, lon) {
  const [calcRes, horizRes] = await Promise.allSettled([
    fetch(`https://re.jrc.ec.europa.eu/api/v5_2/PVcalc?lat=${lat}&lon=${lon}&peakpower=1&loss=14&aspect=0&angle=35&outputformat=json`).then(r => r.json()),
    fetch(`https://re.jrc.ec.europa.eu/api/v5_2/printhorizon?lat=${lat}&lon=${lon}&outputformat=json`).then(r => r.json())
  ])

  let annualYield = 1200, monthlyYield = [], shadingLoss = 8, irradiation = 1500

  if (calcRes.status === 'fulfilled' && calcRes.value?.outputs) {
    const out = calcRes.value.outputs
    annualYield = out.totals?.fixed?.E_y || 1200
    irradiation = out.totals?.fixed?.['H(i)_y'] || 1500
    monthlyYield = (out.monthly?.fixed || []).map(m => ({
      month: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][m.month - 1],
      yield: Math.round(m.E_m * 10) / 10,
      irradiation: Math.round((m['H(i)_m'] || 0) * 10) / 10
    }))
  }

  if (horizRes.status === 'fulfilled' && horizRes.value?.outputs?.horizon_profile) {
    const profile = horizRes.value.outputs.horizon_profile
    // Southern azimuths (roughly -90 to +90 in PVGIS convention where 0=South)
    const southern = profile.filter(p => Math.abs(p.A_hor || 0) <= 90)
    const avgH = southern.length
      ? southern.reduce((s, p) => s + (p.H_hor || 0), 0) / southern.length
      : profile.reduce((s, p) => s + (p.H_hor || 0), 0) / (profile.length || 1)
    shadingLoss = Math.min(Math.round(avgH * 3 * 10) / 10, 22)
  }

  return {
    annualYieldKwhPerKwp: Math.round(annualYield * 10) / 10,
    monthlyYield,
    peakSunHoursPerDay: Math.round((annualYield / 365) * 100) / 100,
    annualIrradiation: Math.round(irradiation * 10) / 10,
    shadingLoss
  }
}

async function getElectricityRate(lat, lon) {
  try {
    const url = `https://developer.nrel.gov/api/utility_rates/v3.json?api_key=${NREL_KEY}&lat=${lat}&lon=${lon}`
    const res = await fetch(url)
    const data = await res.json()
    const rate = data.outputs?.residential
    const utility = data.outputs?.utility_name || 'Local Utility'
    return {
      rate: rate && rate > 0 ? Math.round(rate * 1000) / 1000 : 0.16,
      utilityName: utility
    }
  } catch {
    return { rate: 0.16, utilityName: 'Local Utility' }
  }
}

// ── Routes ────────────────────────────────────────────────────────────────────
app.get('/api/analyze', async (req, res) => {
  const { address } = req.query
  if (!address) return res.status(400).json({ error: 'address is required' })

  try {
    const location = await geocode(address)
    const { lat, lon, stateCode } = location

    const [polygonResult, solarResult, rateResult] = await Promise.allSettled([
      getBuildingPolygon(lat, lon),
      getSolarData(lat, lon),
      getElectricityRate(lat, lon)
    ])

    const polygon = polygonResult.status === 'fulfilled' ? polygonResult.value : null
    const solar = solarResult.status === 'fulfilled' ? solarResult.value : {
      annualYieldKwhPerKwp: 1200, monthlyYield: [], peakSunHoursPerDay: 3.3, annualIrradiation: 1400, shadingLoss: 10
    }
    const { rate, utilityName } = rateResult.status === 'fulfilled' ? rateResult.value : { rate: 0.16, utilityName: 'Local Utility' }

    // Roof calculations
    const totalArea = polygon ? calcPolygonArea(polygon) : 150
    const usableArea = Math.round(totalArea * 0.75)
    const orientation = polygon ? calcOrientation(polygon) : 'S'
    const sourceNote = polygon ? 'Calculated from building footprint (OpenStreetMap)' : 'Estimated from typical home size'

    // Financial
    const annualUsage = STATE_USAGE[stateCode] || 10500
    const annualCost = Math.round(annualUsage * rate)

    // Score
    const score = calcSuitabilityScore({
      annualYield: solar.annualYieldKwhPerKwp,
      usableArea,
      shadingLoss: solar.shadingLoss,
      electricityRate: rate,
      orientation
    })

    // Panels
    const panels = calcPanelRecommendation({
      usableArea,
      annualYield: solar.annualYieldKwhPerKwp,
      annualUsage,
      electricityRate: rate
    })

    res.json({
      location: { ...location },
      roof: {
        totalArea: Math.round(totalArea),
        usableArea,
        orientation,
        coverageFactor: 0.75,
        sourceNote
      },
      solar,
      financial: {
        electricityRate: rate,
        annualUsageKwh: annualUsage,
        annualElectricityCost: annualCost,
        utilityName,
        currency: 'USD'
      },
      score,
      panels,
      environmental: panels.environmental
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message || 'Analysis failed' })
  }
})

app.post('/api/installers', async (req, res) => {
  const { city, state, usableArea, panelType, annualProductionKwh, systemSizeKwp } = req.body

  try {
    const prompt = `You are a solar energy expert with up-to-date knowledge of solar installation companies across the United States.

Find 3 real, established solar installation companies that actually serve ${city}, ${state}. These must be REAL companies that genuinely operate in or near this area — not fictional names. Use your knowledge of verified, established solar installers in this region. Large national companies (SunPower, Tesla/SolarCity, Sunrun, Vivint Solar, etc.) are acceptable if they serve this market, as are well-known regional installers.

The homeowner needs:
- Location: ${city}, ${state}
- Roof area: ${usableArea} m²
- Panel type: ${panelType}
- System size: ${systemSizeKwp} kWp
- Annual production target: ${annualProductionKwh} kWh

For each company provide:
- Real company name
- Realistic address in or near ${city}, ${state}
- Approximate driving distance in km from ${city} center (5–60 km range)
- Real or realistic phone number
- 2-3 sentence evaluation tailored to this homeowner's specific needs and system size
- Star rating out of 5 (be realistic, 3.8–4.9 range)
- 2-4 relevant specialties

Return ONLY a valid JSON array (no markdown, no explanation):
[{"name":"...","address":"...","distanceKm":12,"phone":"...","aiEvaluation":"...","aiRating":4.5,"recommended":false,"specialties":["Residential","${panelType}"]}]

Set "recommended": true for the single best match for this homeowner's needs.`

    const msg = await anthropic.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 1400,
      messages: [{ role: 'user', content: prompt }]
    })

    let installers = []
    try {
      const text = msg.content[0].text.trim()
      const jsonMatch = text.match(/\[[\s\S]*\]/)
      installers = JSON.parse(jsonMatch ? jsonMatch[0] : text)
    } catch {
      installers = [
        { name: 'SunPower by Green Solar Technologies', address: `100 Solar Way, ${city}, ${state}`, distanceKm: 12, phone: '(800) 786-7693', aiEvaluation: 'SunPower offers industry-leading panel efficiency ideal for this system size. Their comprehensive warranty and local service team make them a strong choice.', aiRating: 4.7, recommended: true, specialties: ['Residential', panelType, 'Premium Panels', 'Financing'] },
        { name: 'Sunrun', address: `200 Renewable Blvd, ${city}, ${state}`, distanceKm: 18, phone: '(855) 478-6786', aiEvaluation: 'Sunrun is one of the largest residential solar providers nationwide with flexible lease and loan options. They have extensive experience with systems in this size range.', aiRating: 4.3, recommended: false, specialties: ['Residential', 'Lease Options', 'Battery Storage'] },
        { name: 'Tesla Energy', address: `300 Innovation Dr, ${city}, ${state}`, distanceKm: 25, phone: '(888) 518-3752', aiEvaluation: 'Tesla Solar offers competitive pricing with seamless Powerwall battery integration. Best suited for homeowners interested in energy independence and smart home integration.', aiRating: 4.1, recommended: false, specialties: ['Residential', 'Battery Storage', 'Smart Home', panelType] }
      ]
    }

    res.json({ installers: installers.slice(0, 3) })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
})

app.post('/api/actionplan', async (req, res) => {
  const { location, roof, solar, financial, score, panels, installerName } = req.body

  try {
    const prompt = `You are a solar energy consultant. Generate a personalized 6-step action plan for a homeowner based on their solar analysis.

Home details:
- Location: ${location.city}, ${location.state}
- Roof usable area: ${roof.usableArea} m² (${roof.orientation}-facing)
- Solar suitability score: ${score.total}/10 (${score.rating})
- Recommended: ${panels.recommendedPanels} ${panels.recommendedType} panels (${panels.systemSizeKwp} kWp)
- Annual solar production: ${panels.annualProductionKwh.toLocaleString()} kWh
- Annual savings: $${panels.annualSavings.toLocaleString()}
- Payback period: ${panels.simplePaybackYears} years
- 25-year net savings: $${panels.savings25Year.toLocaleString()}
- Annual CO2 reduction: ${panels.environmental.annualCO2SavedKg.toLocaleString()} kg
- Current electricity rate: $${financial.electricityRate}/kWh (${financial.utilityName})
- Top installer: ${installerName || 'local certified installers'}

Generate 6 specific, actionable steps. Be personal and use the exact numbers above. Include realistic timelines.
Each step has 2-3 bullet points. Each bullet is max 10 words. No emojis.

Return ONLY a valid JSON array (no markdown):
[{"number":1,"title":"...","bullets":["...","..."],"timeline":"..."}]`

    const msg = await anthropic.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 1800,
      messages: [{ role: 'user', content: prompt }]
    })

    let steps = []
    try {
      const text = msg.content[0].text.trim()
      const jsonMatch = text.match(/\[[\s\S]*\]/)
      steps = JSON.parse(jsonMatch ? jsonMatch[0] : text)
    } catch {
      steps = [
        { number: 1, title: 'Get Multiple Quotes', bullets: [`Contact 3+ certified installers in ${location.city}`, `Request quotes for a ${panels.systemSizeKwp} kWp system`, 'Compare warranties and financing terms'], timeline: 'Week 1–2' },
        { number: 2, title: 'Review Financing', bullets: [`Net cost ~$${panels.netCostAfterTaxCredit.toLocaleString()} after 30% tax credit`, `Payback period: ${panels.simplePaybackYears} years`, 'Compare solar loans, leases, and cash purchase'], timeline: 'Week 2–3' },
        { number: 3, title: 'Apply for Permits', bullets: ['Installer pulls building and electrical permits', 'Local approval typically takes 2–4 weeks', 'HOA approval may be required'], timeline: 'Week 3–5' },
        { number: 4, title: 'Schedule Installation', bullets: [`${panels.recommendedPanels} panels installed in 1–3 days`, 'Utility inspection required before grid tie-in', 'Minimal disruption to daily routine'], timeline: 'Week 5–8' },
        { number: 5, title: 'Grid Connection', bullets: [`${financial.utilityName} approves net metering`, 'System activated after final inspection', 'Export surplus power back to grid'], timeline: 'Week 8–10' },
        { number: 6, title: 'Monitor & Optimize', bullets: [`Target: ${panels.annualProductionKwh.toLocaleString()} kWh/year`, `Saves ~$${panels.annualSavings.toLocaleString()}/yr on electricity`, `Eliminates ${panels.environmental.annualCO2SavedKg.toLocaleString()} kg CO2 annually`], timeline: 'Ongoing' }
      ]
    }

    res.json({ steps })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
})

app.listen(PORT, () => console.log(`Helio server running on http://localhost:${PORT}`))
