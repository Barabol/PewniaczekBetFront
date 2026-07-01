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

type RequestInterceptor = (config: RequestInit) => RequestInit | Promise<RequestInit>;
type ResponseInterceptor = (response: Response) => Response | Promise<Response>;

const requestInterceptors: RequestInterceptor[] = [];
const responseInterceptors: ResponseInterceptor[] = [];

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

  let config: RequestInit = {
    method,
    credentials: 'include',
    headers,
  };

  if (body !== undefined) {
    config.body = JSON.stringify(body);
  }

  // Apply request interceptors
  for (const interceptor of requestInterceptors) {
    config = await interceptor(config);
  }

  console.log('[API CLIENT] Request:', {
    url,
    method,
    body: body ? JSON.parse(JSON.stringify(body)) : null,
    timestamp: new Date().toISOString()
  });

  const response = await fetch(url, config);
  
  let interceptedResponse = response;
  // Apply response interceptors
  for (const interceptor of responseInterceptors) {
    interceptedResponse = await interceptor(interceptedResponse);
  }

  console.log('[API CLIENT] Response:', {
    status: interceptedResponse.status,
    statusText: interceptedResponse.statusText,
    url: interceptedResponse.url,
    headers: Object.fromEntries(interceptedResponse.headers.entries()),
    timestamp: new Date().toISOString()
  });
  
  return handleResponse<T>(interceptedResponse);
}

export const apiClient = {
  get: <T>(endpoint: string, params?: Record<string, string | number | undefined>) =>
    request<T>(endpoint, 'GET', undefined, params),

  post: <T>(endpoint: string, body?: unknown) =>
    request<T>(endpoint, 'POST', body),

  delete: <T>(endpoint: string, params?: Record<string, string | number | undefined>) =>
    request<T>(endpoint, 'DELETE', undefined, params),

  interceptors: {
    request: {
      use: (interceptor: RequestInterceptor) => {
        requestInterceptors.push(interceptor);
      }
    },
    response: {
      use: (interceptor: ResponseInterceptor) => {
        responseInterceptors.push(interceptor);
      }
    }
  }
};

// Add default language request interceptor
apiClient.interceptors.request.use((config) => {
  const lang = localStorage.getItem('i18nextLng') || 'pl';
  if (config.headers) {
    (config.headers as Record<string, string>)['Accept-Language'] = lang;
  }
  return config;
});
