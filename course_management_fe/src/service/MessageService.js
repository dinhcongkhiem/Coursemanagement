import axios from 'axios';
import { TIME_ZONE_OFF_SET } from '../constants';

const MESSAGES_API_BASE_URL = "http://localhost:8080/messages";
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
            params : {
                timestamp: new Date(new Date().getTime() - (TIME_ZONE_OFF_SET * 60 * 1000)).toISOString()
              }
          };
          return axios.request(config);
        

    }
}

export default new MessagesService();
