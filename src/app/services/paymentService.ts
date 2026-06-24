import { API_ENDPOINTS } from '../constants';
import type { RedirectView } from '../types';
import { apiClient } from './apiClient';

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
    const response = await apiClient.post<RedirectView>(API_ENDPOINTS.PAYMENT.SEND_CHECKOUT, amount);
    return response;
  },

  reloadAll: () =>
    apiClient.get<string>(API_ENDPOINTS.PAYMENT.RELOAD_ALL),

  redirect: (paymentId: number) =>
    apiClient.get<string>(API_ENDPOINTS.PAYMENT.REDIRECT, { paymentId }),
};
