import { apiClient } from './apiClient';
import { API_ENDPOINTS } from '../constants';
import type {
  WinBetPlaceDto,
  WinBetDto,
  ScoreBetPlaceDto,
  ScoreBetDto,
  PredictionBetPlaceDto,
  PredictionBetDto,
  PageWinBetDto,
  PageScoreBetDto,
  PagePredictionBetDto,
  PageUserWinBetDto,
  PageUserScoreBetDto,
  PageUserBetPredictionDto,
} from '../types';

export const betService = {
  placeWinBet: (dto: WinBetPlaceDto) =>
    apiClient.post<string>(API_ENDPOINTS.BET.WIN_PLACE, dto),

  addWinBet: (dto: WinBetDto) =>
    apiClient.post<string>(API_ENDPOINTS.BET.WIN_ADD, dto),

  getWinCurrent: (sport?: string, page = 0, pageSize = 5) =>
    apiClient.get<PageWinBetDto>(API_ENDPOINTS.BET.WIN_CURRENT, { sport, page, pageSize }),

  getWinAll: (sport?: string, page = 0, pageSize = 5) =>
    apiClient.get<PageWinBetDto>(API_ENDPOINTS.BET.WIN_ALL, { sport, page, pageSize }),

  placeScoreBet: (dto: ScoreBetPlaceDto) =>
    apiClient.post<string>(API_ENDPOINTS.BET.SCORE_PLACE, dto),

  addScoreBet: (dto: ScoreBetDto) =>
    apiClient.post<string>(API_ENDPOINTS.BET.SCORE_ADD, dto),

  getScoreCurrent: (sport?: string, page = 0, pageSize = 5) =>
    apiClient.get<PageScoreBetDto>(API_ENDPOINTS.BET.SCORE_CURRENT, { sport, page, pageSize }),

  getScoreAll: (sport?: string, page = 0, pageSize = 5) =>
    apiClient.get<PageScoreBetDto>(API_ENDPOINTS.BET.SCORE_ALL, { sport, page, pageSize }),

  placePredictionBet: (dto: PredictionBetPlaceDto) =>
    apiClient.post<string>(API_ENDPOINTS.BET.PREDICTION_PLACE, dto),

  addPredictionBet: (dto: PredictionBetDto) =>
    apiClient.post<string>(API_ENDPOINTS.BET.PREDICTION_ADD, dto),

  getPredictionCurrent: (page = 0, pageSize = 5) =>
    apiClient.get<PagePredictionBetDto>(API_ENDPOINTS.BET.PREDICTION_CURRENT, { page, pageSize }),

  getPredictionAll: (page = 0, pageSize = 5) =>
    apiClient.get<PagePredictionBetDto>(API_ENDPOINTS.BET.PREDICTION_ALL, { page, pageSize }),

  getWinHistory: (page = 0, pageSize = 10, user?: number, sport?: string, findEnded?: boolean) =>
    apiClient.get<PageUserWinBetDto>(API_ENDPOINTS.BET_HISTORY_WIN, { page, pageSize, user, sport, findEnded }),

  getScoreHistory: (page = 0, pageSize = 10, user?: number, sport?: string, findEnded?: boolean) =>
    apiClient.get<PageUserScoreBetDto>(API_ENDPOINTS.BET_HISTORY_SCORE, { page, pageSize, user, sport, findEnded }),

  getPredictionHistory: (page = 0, pageSize = 10, user?: number, findEnded?: boolean) =>
    apiClient.get<PageUserBetPredictionDto>(API_ENDPOINTS.BET_HISTORY_PREDICTION, { page, pageSize, user, findEnded }),
};
