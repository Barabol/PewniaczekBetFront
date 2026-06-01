// Application Constants

// Betting Limits
export const BETTING_LIMITS = {
  MIN_STAKE: 1,
  MAX_STAKE: 10000,
  MIN_ODD: 1.01,
  MAX_ODD: 1000,
  MAX_BETS_PER_SLIP: 20,
} as const;

// Currency
export const CURRENCY = {
  CODE: 'PLN',
  SYMBOL: 'zł',
  FORMAT: (amount: number) => `${amount.toFixed(2)} PLN`,
} as const;

// Time Formats
export const TIME_FORMATS = {
  DATE: 'DD.MM.YYYY',
  TIME: 'HH:mm',
  DATETIME: 'DD.MM.YYYY HH:mm',
} as const;

// Routes
export const ROUTES = {
  HOME: '/',
  LIVE: '/live',
  ESPORTS: '/esports',
  PROMOTIONS: '/promotions',
  RESULTS: '/results',
  LOGIN: '/login',
  PROFILE: '/profile',
  HISTORY: '/history',
  WALLET: '/wallet',
  SETTINGS: '/settings',
  STATS: '/stats',
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  THEME: 'theme',
  AUTH_TOKEN: 'auth_token',
  USER_PREFERENCES: 'user_preferences',
  BETTING_SLIP: 'betting_slip',
} as const;

// Theme
export const THEME = {
  LIGHT: 'light',
  DARK: 'dark',
} as const;

// Bet Status Colors
export const BET_STATUS_COLORS = {
  pending: {
    bg: 'bg-yellow-100 dark:bg-yellow-900',
    text: 'text-yellow-700 dark:text-yellow-300',
    icon: 'text-yellow-600',
  },
  won: {
    bg: 'bg-green-100 dark:bg-green-900',
    text: 'text-green-700 dark:text-green-300',
    icon: 'text-green-600',
  },
  lost: {
    bg: 'bg-red-100 dark:bg-red-900',
    text: 'text-red-700 dark:text-red-300',
    icon: 'text-red-600',
  },
  cancelled: {
    bg: 'bg-gray-100 dark:bg-gray-900',
    text: 'text-gray-700 dark:text-gray-300',
    icon: 'text-gray-600',
  },
} as const;

// Sport Categories Icons Map
export const SPORT_ICONS = {
  football: 'Circle',
  tennis: 'Target',
  basketball: 'Trophy',
  volleyball: 'Dumbbell',
  cycling: 'Bike',
  swimming: 'Waves',
} as const;

// Validation Messages
export const VALIDATION_MESSAGES = {
  EMAIL_REQUIRED: 'Email jest wymagany',
  EMAIL_INVALID: 'Nieprawidłowy format email',
  PASSWORD_REQUIRED: 'Hasło jest wymagane',
  PASSWORD_TOO_SHORT: 'Hasło musi mieć minimum 8 znaków',
  PASSWORD_NO_UPPERCASE: 'Hasło musi zawierać wielką literę',
  PASSWORD_NO_LOWERCASE: 'Hasło musi zawierać małą literę',
  PASSWORD_NO_NUMBER: 'Hasło musi zawierać cyfrę',
  STAKE_TOO_LOW: 'Minimalna stawka to {min} PLN',
  STAKE_TOO_HIGH: 'Maksymalna stawka to {max} PLN',
  BALANCE_INSUFFICIENT: 'Niewystarczające środki na koncie',
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  BASE_URL: 'http://172.21.225.41:8080',
  USER: {
    LOGIN: '/api/user/login',
    REGISTER: '/api/user/register',
    LOGOUT: '/api/user/logout',
    DETAILS: '/api/user/details',
    ALL: '/api/user/all',
    TOGGLE_VISIBILITY: '/api/user/toggleVisibility',
    FOLLOW: '/api/user/follow',
    UNFOLLOW: '/api/user/follow',
    FOLLOWERS: '/api/user/followers',
    FOLLOWED: '/api/user/followed',
  },
  BET: {
    WIN_PLACE: '/api/bet/win/place',
    WIN_ADD: '/api/bet/win/add',
    WIN_CURRENT: '/api/bet/win/curent',
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
  PAYMENT: {
    SEND: '/pay/send',
    RELOAD_ALL: '/pay/reload_all',
    REDIRECT: '/pay/redirect',
  },
  OATH: {
    GITHUB_INITIATE: '/social/github/initiate',
    GITHUB_CALLBACK: '/social/github/callback',
    GITHUB_DELETE: '/social/github',
    ALL: '/social/all',
  },
} as const;

// Timeouts and Intervals
export const TIMING = {
  DEBOUNCE_DELAY: 300,
  SEARCH_DEBOUNCE: 500,
  AUTO_LOGOUT: 30 * 60 * 1000, // 30 minutes
  ODDS_REFRESH: 5000, // 5 seconds for live odds
  NOTIFICATION_DURATION: 3000,
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
} as const;

// Breakpoints (matching Tailwind)
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
} as const;

// Regex Patterns
export const REGEX_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
  PHONE: /^\+?[1-9]\d{1,14}$/,
  POSTAL_CODE: /^\d{2}-\d{3}$/,
} as const;

// Feature Flags (Future)
export const FEATURE_FLAGS = {
  ENABLE_LIVE_BETTING: true,
  ENABLE_ESPORTS: true,
  ENABLE_CASHOUT: false,
  ENABLE_LIVE_STREAMING: false,
  ENABLE_VIRTUAL_SPORTS: false,
} as const;

// Social Media Links
export const SOCIAL_MEDIA = {
  FACEBOOK: 'https://facebook.com/pewniaczekbet',
  TWITTER: 'https://twitter.com/pewniaczekbet',
  INSTAGRAM: 'https://instagram.com/pewniaczekbet',
  YOUTUBE: 'https://youtube.com/pewniaczekbet',
} as const;

// Responsible Gaming
export const RESPONSIBLE_GAMING = {
  MIN_AGE: 18,
  SELF_EXCLUSION_PERIODS: [
    { label: '1 miesiąc', days: 30 },
    { label: '3 miesiące', days: 90 },
    { label: '6 miesięcy', days: 180 },
    { label: '1 rok', days: 365 },
    { label: 'Na zawsze', days: null },
  ],
  DEFAULT_LIMITS: {
    daily: 500,
    weekly: 2000,
    monthly: 5000,
  },
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Błąd połączenia z serwerem',
  UNAUTHORIZED: 'Sesja wygasła. Zaloguj się ponownie',
  FORBIDDEN: 'Brak uprawnień do wykonania tej operacji',
  NOT_FOUND: 'Nie znaleziono żądanego zasobu',
  INTERNAL_SERVER_ERROR: 'Wystąpił błąd serwera. Spróbuj ponownie później',
  BAD_REQUEST: 'Nieprawidłowe dane. Sprawdź formularz',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  BET_PLACED: 'Zakład został pomyślnie złożony',
  LOGIN_SUCCESS: 'Zalogowano pomyślnie',
  LOGOUT_SUCCESS: 'Wylogowano pomyślnie',
  PROFILE_UPDATED: 'Profil został zaktualizowany',
  DEPOSIT_SUCCESS: 'Wpłata została zrealizowana',
  WITHDRAWAL_SUCCESS: 'Wypłata została zlecona',
  PASSWORD_CHANGED: 'Hasło zostało zmienione',
} as const;
