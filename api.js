export async function loadData() {
  const res = await fetch('/api/countdowns')
  return res.json()
}

export async function saveCountdownToDB(obj) {
  const res = await fetch('/api/countdowns', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(obj)
  })
  return res.json()
}

export async function updateCountdownToDB(id, updates) {
  await fetch('/api/countdowns', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, ...updates })
  })
}

export async function deleteCountdownFromDB(id) {
  await fetch('/api/countdowns', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id })
  })
}