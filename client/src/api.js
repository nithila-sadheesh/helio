export async function analyzeAddress(address) {
  const res = await fetch(`/api/analyze?address=${encodeURIComponent(address)}`)
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || `Server error ${res.status}`)
  }
  return res.json()
}

export async function getInstallers(params) {
  const res = await fetch('/api/installers', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params)
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || `Server error ${res.status}`)
  }
  return res.json()
}

export async function getActionPlan(params) {
  const res = await fetch('/api/actionplan', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params)
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || `Server error ${res.status}`)
  }
  return res.json()
}
