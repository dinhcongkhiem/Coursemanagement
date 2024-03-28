import axios from 'axios';

const AUTH_API_BASE_URL = "http://localhost:8080/api/v1/auth";
const STUDENT_API_BASE_URL = "http://localhost:8080/api/v1/student"
const JwtToken = localStorage.getItem('accessToken')

class Student {

    VerifyAccount(activeKey) {
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `${AUTH_API_BASE_URL}/verify?activeKey=${activeKey}`,
        };
        return axios.request(config)

    }
    SendPasswordResetEmail(email){
        let data = {
            "email": email
          }
          
          let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: AUTH_API_BASE_URL  + '/reset/password',
            headers: { 
              'Content-Type': 'application/json'
            },
            data : data
          };
          
          return axios.request(config)
        
          
    }
    Register(fullname, email, password, location) {
        let data = {
            "student_name": fullname,
            "email": email,
            "password": password,
            "address": location,
            "phoneNum": "",
            "avatar": "https://fullstack.edu.vn/static/media/fallback-avatar.155cdb2376c5d99ea151.jpg"
        };

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: AUTH_API_BASE_URL + '/register',
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };

        return axios.request(config)
           
    }
    Login(username, password) {
        let data = JSON.stringify({
            "email": username,
            "password": password
        });

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: AUTH_API_BASE_URL + '/login',
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };

        return axios.request(config)

    }

    getInforStudent() {
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: STUDENT_API_BASE_URL,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + JwtToken
            },
        };

        return axios.request(config)

    }
    insertCourse(data) {


        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: STUDENT_API_BASE_URL + '/course',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + JwtToken
            },
            data: data
        };

        return axios.request(config)

    }
    getCourses() {
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: STUDENT_API_BASE_URL + '/course',
            headers: {
                'Authorization': 'Bearer ' + JwtToken
            }
        };

        return axios.request(config)

    }
    updateCourse(data) {
        let config = {
            method: 'put',
            maxBodyLength: Infinity,
            url: STUDENT_API_BASE_URL + '/course',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + JwtToken
            },
            data: data
        };

        return axios.request(config)

    }

    removeCourse(id) {
        let config = {
            method: 'delete',
            maxBodyLength: Infinity,
            url: STUDENT_API_BASE_URL + '/course?id=' + id,
            headers: {
                'Authorization': 'Bearer ' + JwtToken
            }
        };

        return axios.request(config)


    }

    getStudentsInCourse() {
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: STUDENT_API_BASE_URL + '/incourse',
            headers: {
                'Authorization': 'Bearer ' + JwtToken
            }
        };

        return axios.request(config)
    }

    updateStudent(formData) {
        let config = {
            method: 'patch',
            maxBodyLength: Infinity,
            url: STUDENT_API_BASE_URL + "/update",
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': 'Bearer ' + JwtToken
            },
            data: formData
        };

        return axios.request(config)
    }

    GetOTPtoAuthen() {
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: STUDENT_API_BASE_URL + '/password',
            headers: {
                'Authorization': `Bearer ${JwtToken}`
            }
        };

        return axios.request(config)
    }

    changePassword(otp, password, confirmPassword) {
        let data = {
            "password": password,
            "confirmPassword": confirmPassword
        };

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: STUDENT_API_BASE_URL + `/password?otp=${otp}`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${JwtToken}`
            },
            data: data
        };

        return axios.request(config)

    }
}

export default new Student();