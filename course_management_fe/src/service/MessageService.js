import axiosInstance from './ConfigAxios';
import { API_BASE_URL } from '../constants';
const MESSAGES_API_BASE_URL = API_BASE_URL + "/messages";
const MESSAGE_API_BASE_URL = API_BASE_URL + "/message"
const JwtToken = localStorage.getItem('accessToken');

class MessagesService {
  GetMessageInAllChatRoom() {
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: MESSAGES_API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + JwtToken
      },
      params: {
        timestamp: new Date().toISOString()
      }
    };
    return axiosInstance.request(config);
  }

  GetOldMessage(connectionId, timestamp) {
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${MESSAGE_API_BASE_URL}/${connectionId}?timestamp=${timestamp}`,
      headers: {
        'Authorization': 'Bearer ' + JwtToken
       }
    };

    return axiosInstance.request(config)

  }
}

export default new MessagesService();
