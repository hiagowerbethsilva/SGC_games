import { ApiError } from '../types/api'

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080'

type RequestOptions = Omit<RequestInit, 'body'> & {
  body?: unknown
}

async function parseError(response: Response): Promise<string> {
  const text = await response.text()
  if (!text) return `Erro ${response.status}: ${response.statusText}`
  try {
    const json = JSON.parse(text) as { message?: string }
    return json.message ?? text
  } catch {
    return text
  }
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, headers, ...rest } = options

  const token = localStorage.getItem('sgc_token')
  const authHeaders: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {}

  const response = await fetch(`${BASE_URL}${path}`, {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders,
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  if (!response.ok) {
    const message = await parseError(response)
    throw new ApiError(message, response.status)
  }

  if (response.status === 204) {
    return undefined as T
  }

  const text = await response.text()
  if (!text) return undefined as T
  return JSON.parse(text) as T
}
