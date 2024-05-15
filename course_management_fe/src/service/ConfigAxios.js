import axios from 'axios';
import { ACCESS_TOKEN } from '../constants';
import { AUTH_API_BASE_URL } from '../constants';
let isRefreshing = false;
let refreshSubscribers = [];

const axiosInstance = axios.create();

// Hàm để gửi yêu cầu refresh token và nhận lại access token mới từ máy chủ
async function refreshToken() {
    try {
        const refreshResponse = await axios.post(AUTH_API_BASE_URL + '/refresh_token', {
            refresh_token: localStorage.getItem('refreshToken')
        });
        const newAccessToken = refreshResponse.data.accessToken;
        localStorage.setItem(ACCESS_TOKEN, newAccessToken);
        return newAccessToken;
    } catch (error) {
        throw error;
    }
}

// Intercept response để xử lý refresh token khi access token hết hạn
axiosInstance.interceptors.response.use(
    function (response) {
        return response;
    },
    function (error) {
        const { config, response } = error;
        const status = response?.status;
        if (status === 401 && !config._retry) {
            if (!isRefreshing) {
                isRefreshing = true;
                refreshToken().then(newAccessToken => {
                    config.headers.Authorization = 'Bearer ' + newAccessToken;
                    config._retry = true;
                    refreshSubscribers.forEach(cb => cb(newAccessToken));
                }).catch(err => {
                    console.error('Error refreshing token:', err);
                    // Xử lý lỗi khi không thể làm mới token
                }).finally(() => {
                    isRefreshing = false;
                    refreshSubscribers = [];
                });
            }
            const retryOriginalRequest = new Promise(resolve => {
                refreshSubscribers.push(token => {
                    config.headers.Authorization = 'Bearer ' + token;
                    resolve(axiosInstance(config));
                });
            });
            return retryOriginalRequest;
        }
        return Promise.reject(error);
    }
);
export default axiosInstance;