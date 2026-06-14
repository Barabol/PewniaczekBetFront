import { API_ENDPOINTS } from '../constants';
import type { RedirectView } from '../types';

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export const paymentService = {
  send: async (amount: number) => {
    console.log('[PAYMENT SERVICE] Calling POST /pay/send with amount:', amount);
    
    const paymentResponse = await fetch(`http://172.21.225.41:8080${API_ENDPOINTS.PAYMENT.SEND}`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Origin': 'http://localhost:5173'
      },
      body: JSON.stringify(amount),
      credentials: 'include',
    });
    
    if (!paymentResponse.ok) {
      const errorBody = await paymentResponse.text();
      console.error('[PAYMENT SERVICE] Payment error:', {
        status: paymentResponse.status,
        statusText: paymentResponse.statusText,
        error: errorBody
      });
      throw new ApiError(errorBody || `HTTP ${paymentResponse.status}`, paymentResponse.status);
    }
    
    const result = await paymentResponse.json();
    console.log('[PAYMENT SERVICE] Response:', result);
    return result;
  },

  reloadAll: () =>
    apiClient.get<string>(API_ENDPOINTS.PAYMENT.RELOAD_ALL),

  redirect: (paymentId: number) =>
    apiClient.get<string>(API_ENDPOINTS.PAYMENT.REDIRECT, { paymentId }),
};
