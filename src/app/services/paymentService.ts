import { apiClient } from './apiClient';
import { API_ENDPOINTS } from '../constants';
import type { RedirectView } from '../types';

export const paymentService = {
  send: (amount: number) =>
    apiClient.post<RedirectView>(API_ENDPOINTS.PAYMENT.SEND, amount),

  reloadAll: () =>
    apiClient.get<string>(API_ENDPOINTS.PAYMENT.RELOAD_ALL),

  redirect: (paymentId: number) =>
    apiClient.get<string>(API_ENDPOINTS.PAYMENT.REDIRECT, { paymentId }),
};
