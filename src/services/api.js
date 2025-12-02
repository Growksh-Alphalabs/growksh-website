const API_BASE = process.env.VITE_API_BASE || ''

export async function fetchPosts(){
  const res = await fetch(`${API_BASE}/posts`)
  return res.json()
}

export async function submitContact(payload){
  const res = await fetch(`${API_BASE}/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  return res.json()
}
