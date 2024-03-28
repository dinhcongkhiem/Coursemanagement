import axios from 'axios';

const COURSE_API_BASE_URL = "http://localhost:8080/api/v1/course";

class CourseService {
    GetCourses() {
        const JwtToken = localStorage.getItem('accessToken');
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: COURSE_API_BASE_URL + '/get',
            headers: {
                'Authorization': 'Bearer ' + JwtToken
            }
        };

        return axios.request(config);
    }
}

export default new CourseService();
