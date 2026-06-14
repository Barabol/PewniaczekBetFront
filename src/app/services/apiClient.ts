import { API_ENDPOINTS } from '../constants';

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  console.log('[API CLIENT] Response headers:', Object.fromEntries(response.headers.entries()));
  console.log('[API CLIENT] Response content-type:', response.headers.get('content-type'));
  
  if (!response.ok) {
    let message = `HTTP ${response.status}`;
    try {
      const errorBody = await response.text();
      console.log('[API CLIENT] Error response body:', errorBody);
      if (errorBody) message = errorBody;
    } catch (parseError) {
      console.log('[API CLIENT] Failed to parse error body:', parseError);
    }
    throw new ApiError(message, response.status);
  }

  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    const jsonBody = await response.json();
    console.log('[API CLIENT] Parsed JSON response:', jsonBody);
    return jsonBody as T;
  }

  const textBody = await response.text();
  console.log('[API CLIENT] Response text:', textBody);
  return textBody as unknown as T;
}

async function request<T>(
  endpoint: string,
  method: string,
  body?: unknown,
  params?: Record<string, string | number | undefined>
): Promise<T> {
  let url = `${API_ENDPOINTS.BASE_URL}${endpoint}`;

  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        searchParams.append(key, String(value));
      }
    });
    const qs = searchParams.toString();
    if (qs) url += `?${qs}`;
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  const config: RequestInit = {
    method,
    credentials: 'include',
    headers,
  };

  if (body !== undefined) {
    config.body = JSON.stringify(body);
  }

  console.log('[API CLIENT] Request:', {
    url,
    method,
    body: body ? JSON.parse(JSON.stringify(body)) : null,
    timestamp: new Date().toISOString()
  });

  const response = await fetch(url, config);
  
  console.log('[API CLIENT] Response:', {
    status: response.status,
    statusText: response.statusText,
    url: response.url,
    headers: Object.fromEntries(response.headers.entries()),
    timestamp: new Date().toISOString()
  });
  
  return handleResponse<T>(response);
}

export const apiClient = {
  get: <T>(endpoint: string, params?: Record<string, string | number | undefined>) =>
    request<T>(endpoint, 'GET', undefined, params),

  post: <T>(endpoint: string, body?: unknown) =>
    request<T>(endpoint, 'POST', body),

  delete: <T>(endpoint: string, params?: Record<string, string | number | undefined>) =>
    request<T>(endpoint, 'DELETE', undefined, params),
};
