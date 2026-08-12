import { mkdir, writeFile } from 'node:fs/promises'

const worker = `const app = {
  async fetch(request, env) {
    const response = await env.ASSETS.fetch(request)
    if (response.status !== 404 || request.method !== 'GET') return response

    const url = new URL(request.url)
    url.pathname = '/index.html'
    return env.ASSETS.fetch(new Request(url, request))
  },
}

export default app
`

await mkdir('dist/server', { recursive: true })
await writeFile('dist/server/index.js', worker)
