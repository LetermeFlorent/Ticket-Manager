// Fait un GET vers le serveur
export async function apiGet(path) {
  const response = await fetch('/api' + path)
  return response.json()
}

// Fait un POST, PUT ou DELETE vers le serveur
export async function apiSend(path, method, body) {
  const options = { method: method }
  if (body) {
    options.headers = { 'Content-Type': 'application/json' }
    options.body = JSON.stringify(body)
  }
  const response = await fetch('/api' + path, options)
  return response.json()
}
