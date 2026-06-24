export const BETTING_LIMITS = {
  MIN_STAKE: 1,
  MAX_STAKE: 10000,
  MIN_ODD: 1.01,
  MAX_ODD: 1000,
  MAX_BETS_PER_SLIP: 20,
} as const;

export const PAYMENT_LIMITS = {
  MIN_AMOUNT: 5,
  MAX_AMOUNT: 1000,
} as const;

export const CURRENCY = {
  CODE: 'PLN',
  SYMBOL: 'zł',
} as const;

export const ROUTES = {
  HOME: '/',
  LIVE: '/live',

  LOGIN: '/login',
  PROFILE: '/profile',
  WALLET: '/wallet',
  HISTORY: '/history',
} as const;

export const STORAGE_KEYS = {
  THEME: 'theme',
  AUTH_TOKEN: 'auth_token',
} as const;

export const API_ENDPOINTS = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL ?? '',
  USER: {
    LOGIN: '/api/user/login',
    REGISTER: '/api/user/register',
    LOGOUT: '/api/user/logout',
    DETAILS: '/api/user/details',
    ALL: '/api/user/all',
    TOGGLE_VISIBILITY: '/api/user/toggleVisibility',
    FOLLOW: '/api/user/follow',
    UNFOLLOW: '/api/user/unfollow',
    FOLLOWERS: '/api/user/followers',
    FOLLOWED: '/api/user/followed',
  },
  BET: {
    WIN_PLACE: '/api/bet/win/place',
    WIN_ADD: '/api/bet/win/add',
    WIN_CURRENT: '/api/bet/win/all',
    WIN_ALL: '/api/bet/win/all',
    SCORE_PLACE: '/api/bet/score/place',
    SCORE_ADD: '/api/bet/score/add',
    SCORE_CURRENT: '/api/bet/score/curent',
    SCORE_ALL: '/api/bet/score/all',
    PREDICTION_PLACE: '/api/bet/prediction/place',
    PREDICTION_ADD: '/api/bet/prediction/add',
    PREDICTION_CURRENT: '/api/bet/prediction/curent',
    PREDICTION_ALL: '/api/bet/prediction/all',
  },
  BET_HISTORY: '/api/bet/history',
  BET_HISTORY_WIN: '/api/bet/win/history',
  BET_HISTORY_SCORE: '/api/bet/score/history',
  BET_HISTORY_PREDICTION: '/api/bet/prediction/history',
  PAYMENT: {
    SEND: '/pay/send',
    SEND_CHECKOUT: '/api/payment/checkout',
    RELOAD_ALL: '/pay/reload_all',
    REDIRECT: '/pay/redirect',
  },
  OATH: {
    GITHUB_INITIATE: '/social/github/login',
    GITHUB_CALLBACK: '/social/github/callback',
    GITHUB_DELETE: '/social/github',
    ALL: '/social/all',
  },
} as const;
