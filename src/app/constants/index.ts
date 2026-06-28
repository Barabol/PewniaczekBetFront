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
  ADMIN: '/admin',
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
    UNFOLLOW: '/api/user/follow', // Corrected path to match Swagger (DELETE /api/user/follow)
    FOLLOWERS: '/api/user/followers',
    FOLLOWED: '/api/user/followed',
    PAYMENTS: '/api/user/payments', // Added payments endpoint
  },
  BET: {
    WIN_PLACE: '/api/bet/win/place',
    WIN_ADD: '/api/bet/win/add',
    WIN_CURRENT: '/api/bet/win/curent', // Corrected to /api/bet/win/curent
    WIN_ALL: '/api/bet/win/all',
    WIN_SPORTS: '/api/bet/win/sports',
    SCORE_PLACE: '/api/bet/score/place',
    SCORE_ADD: '/api/bet/score/add',
    SCORE_CURRENT: '/api/bet/score/curent',
    SCORE_ALL: '/api/bet/score/all',
    SCORE_SPORTS: '/api/bet/score/sports',
    PREDICTION_PLACE: '/api/bet/prediction/place',
    PREDICTION_ADD: '/api/bet/prediction/add',
    PREDICTION_CURRENT: '/api/bet/prediction/curent',
    PREDICTION_ALL: '/api/bet/prediction/all',
    PREDICTION_END: '/api/bet/prediction/end', // Added endpoint to end prediction bets
  },
  WORKER: {
    WIN_ADD: '/api/worker/win/add',
    SCORE_ADD: '/api/worker/score/add',
    PREDICTION_ADD: '/api/worker/prediction/add',
    PREDICTION_END: '/api/worker/prediction/end',
    GAME_UPDATE: '/api/worker/game/update',
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
    GITHUB_INITIATE: '/social/github/initiate', // Connect GitHub account
    GITHUB_INITIATE_LOGIN: '/social/github/login', // Login via GitHub
    GITHUB_CALLBACK: '/social/github/callback', // GitHub callback for binding
    GITHUB_CALLBACK_LOGIN: '/social/github/callback/login', // GitHub callback for login
    GITHUB_DELETE: '/social/github',
    ALL: '/social/all',
  },
} as const;

