import {
  ApiError,
  NETWORK_ERROR_MESSAGE,
  getStatusErrorMessage,
  type ApiErrorBody,
} from '../types/api'

interface OpenApiClientConfig {
  monitoringApiUrl: string
  monitoringAdminApiKey: string
}

const clientConfig: OpenApiClientConfig = {
  monitoringApiUrl: 'http://localhost:3002',
  monitoringAdminApiKey: '',
}

export const configureOpenApiClients = (config: OpenApiClientConfig): void => {
  Object.assign(clientConfig, config)
}

const resolveUrl = (baseUrl: string, path: string): string => {
  if (/^https?:\/\//i.test(path)) return path
  return `${baseUrl.replace(/\/$/, '')}/${path.replace(/^\//, '')}`
}

const parseBody = async (response: Response): Promise<unknown> => {
  if ([204, 205, 304].includes(response.status)) return undefined

  const text = await response.text()
  if (!text) return undefined

  try {
    return JSON.parse(text) as unknown
  } catch {
    return text
  }
}

const isApiErrorBody = (value: unknown): value is ApiErrorBody =>
  typeof value === 'object' && value !== null

const getResponseMessage = (body: ApiErrorBody | undefined, status: number): string => {
  const statusMessage = getStatusErrorMessage(status)
  const message = body?.message
  const detail = Array.isArray(message) ? message.filter(Boolean).join(' ') : message?.trim()
  return detail && detail !== statusMessage ? `${statusMessage} ${detail}` : statusMessage
}

const request = async <T>(
  baseUrl: string,
  path: string,
  options: RequestInit = {},
): Promise<T> => {
  const headers = new Headers(options.headers)
  headers.set('Accept', 'application/json')

  if (
    clientConfig.monitoringAdminApiKey &&
    !headers.has('x-admin-api-key')
  ) {
    headers.set('x-admin-api-key', clientConfig.monitoringAdminApiKey)
  }

  let response: Response
  try {
    response = await fetch(resolveUrl(baseUrl, path), { ...options, headers })
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') throw error
    throw new ApiError(NETWORK_ERROR_MESSAGE, 0)
  }
  const body = await parseBody(response)

  if (!response.ok) {
    const errorBody = isApiErrorBody(body) ? body : undefined
    throw new ApiError(getResponseMessage(errorBody, response.status), response.status, errorBody)
  }

  return body as T
}

export const monitoringApiFetch = <T>(path: string, options?: RequestInit): Promise<T> =>
  request<T>(clientConfig.monitoringApiUrl, path, options)
