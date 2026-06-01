import { apiClient } from './apiClient';
import { API_ENDPOINTS } from '../constants';
import type { OathDto } from '../types';

export const oathService = {
  initiateGithub: () =>
    apiClient.get<unknown>(API_ENDPOINTS.OATH.GITHUB_INITIATE),

  callbackGithub: (code: string) =>
    apiClient.get<string>(API_ENDPOINTS.OATH.GITHUB_CALLBACK, { code }),

  getAll: (userId: number) =>
    apiClient.get<OathDto[]>(API_ENDPOINTS.OATH.ALL, { userId }),

  deleteGithub: () =>
    apiClient.delete<string>(API_ENDPOINTS.OATH.GITHUB_DELETE),
};
