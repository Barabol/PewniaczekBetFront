import { apiClient } from './apiClient';
import { API_ENDPOINTS } from '../constants';
import type { UserDto, PageUserDto } from '../types';

export const userService = {
  login: (email: string, password: string) =>
    apiClient.post<UserDto>(API_ENDPOINTS.USER.LOGIN, { email, password }),

  register: (name: string, surname: string, email: string, password: string) =>
    apiClient.post<UserDto>(API_ENDPOINTS.USER.REGISTER, { name, surname, email, password }),

  logout: () =>
    apiClient.get<string>(API_ENDPOINTS.USER.LOGOUT),

  getDetails: (userId?: number) =>
    apiClient.get<UserDto>(API_ENDPOINTS.USER.DETAILS, userId ? { userId } : undefined),

  getAll: () =>
    apiClient.get<UserDto[]>(API_ENDPOINTS.USER.ALL),

  toggleVisibility: () =>
    apiClient.get<UserDto>(API_ENDPOINTS.USER.TOGGLE_VISIBILITY),

  follow: (userId: number) =>
    apiClient.post<string>(API_ENDPOINTS.USER.FOLLOW, userId),

  unfollow: (userId: number) =>
    apiClient.delete<string>(API_ENDPOINTS.USER.UNFOLLOW, { userId }),

  getFollowers: (page = 0, pageSize = 5) =>
    apiClient.get<PageUserDto>(API_ENDPOINTS.USER.FOLLOWERS, { page, pageSize }),

  getFollowed: (page = 0, pageSize = 5) =>
    apiClient.get<PageUserDto>(API_ENDPOINTS.USER.FOLLOWED, { page, pageSize }),
};
