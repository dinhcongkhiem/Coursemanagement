
export const API_BASE_URL = process.env.REACT_APP_SERVER_HOST;
export const ACCESS_TOKEN = 'accessToken';
export const REFRESH_TOKEN = 'refreshToken';

export const OAUTH2_REDIRECT_URI = process.env.REACT_APP_CLIENT_HOST + '/oauth2/redirect'
export const AUTH_API_BASE_URL = API_BASE_URL + '/api/v1/auth'
export const CONNECTION_API_BASE_URL = API_BASE_URL + '/api/v1/connection'
export const COURSE_API_BASE_URL = API_BASE_URL + '/api/v1/course'
export const STUDENT_API_BASE_URL = API_BASE_URL + '/api/v1/student'
export const WEBSOCKET_URL = API_BASE_URL + '/ws'
export const GOOGLE_AUTH_URL = API_BASE_URL + '/oauth2/authorize/google?redirect_uri=' + OAUTH2_REDIRECT_URI;

