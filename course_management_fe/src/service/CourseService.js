import axiosInstance from "./ConfigAxios";
import { COURSE_API_BASE_URL } from "../constants";

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

        return axiosInstance.request(config);
    }
}

export default new CourseService();
