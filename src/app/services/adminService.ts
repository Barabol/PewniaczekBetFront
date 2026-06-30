import { apiClient } from './apiClient';
import { API_ENDPOINTS } from '../constants';
import type { PageLogDto } from '../types';

export const adminService = {
  getLogs: (page = 0, pageSize = 5) =>
    apiClient.get<PageLogDto>(API_ENDPOINTS.ADMIN.LOGS, { pageNumber: page, pageSize }),
};
