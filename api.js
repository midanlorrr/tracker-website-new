export async function loadData() {
    console.log('client GET');
    const res = await fetch('/api/countdowns');
    return res.json();
}

export async function saveCountdownToDB(obj) {
    console.log('client POST');
    const res = await fetch('/api/countdowns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(obj)
    })
    return res.json()
}

export async function updateCountdownToDB(id, updates) {
    console.log('client PATCH');
    await fetch('/api/countdowns', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updates })
    })
}

export async function deleteCountdownFromDB(id) {
    console.log('client DELETE');
    await fetch('/api/countdowns', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
    })
}