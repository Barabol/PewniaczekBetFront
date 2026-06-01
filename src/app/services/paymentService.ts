import { apiClient } from './apiClient';
import { API_ENDPOINTS } from '../constants';

export const paymentService = {
  send: (amount: number) =>
    apiClient.post<unknown>(API_ENDPOINTS.PAYMENT.SEND, amount),

  reloadAll: () =>
    apiClient.get<string>(API_ENDPOINTS.PAYMENT.RELOAD_ALL),

  redirect: (paymentId: number) =>
    apiClient.get<string>(API_ENDPOINTS.PAYMENT.REDIRECT, { paymentId }),
};
