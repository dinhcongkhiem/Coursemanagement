import axios from 'axios';

const CONNECTION_API_BASE_URL = 'http://localhost:8080/api/v1/connection'
const JwtToken = localStorage.getItem('accessToken')

class ConnectionService {
  createConnection(receiverId){
    let data = {
      "receiverId": receiverId
    }
    
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: CONNECTION_API_BASE_URL,
      headers: { 
        'Content-Type': 'application/json', 
        'Authorization': 'Bearer ' + JwtToken
      },
      data : data
    };
    
    return axios.request(config)
  
  }


  getListStudentInConnection() {
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: CONNECTION_API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + JwtToken
      },
    };

    return axios.request(config)
  }
  getConnections() {
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: CONNECTION_API_BASE_URL + '/all',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + JwtToken
      },
    };
    return axios.request(config)
      

  }
}

export default new ConnectionService();