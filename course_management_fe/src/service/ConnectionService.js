import axiosInstance from "./ConfigAxios";

import { CONNECTION_API_BASE_URL } from "../constants";
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
    
    return axiosInstance.request(config)
  
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

    return axiosInstance.request(config)
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
    return axiosInstance.request(config)
      

  }
}

export default new ConnectionService();