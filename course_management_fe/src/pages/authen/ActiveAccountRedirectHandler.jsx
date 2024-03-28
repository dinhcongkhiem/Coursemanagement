import { useEffect } from 'react';
import StudentService from '../../service/StudentService';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

export default function ActiveAccountRedirect({setAuthenticated}) {
    const location = useLocation();
    const navigate = useNavigate();
    const [queryParameters] = useSearchParams()
    useEffect(() => {
        console.log(queryParameters.get("activeKey"));
        StudentService.VerifyAccount(queryParameters.get("activeKey"))
        .then((response) => {
            console.log(JSON.stringify(response.data));
        })
        .catch((error) => {
            console.log(error);
        });
        
        navigate('/login', { state: { from: location } });
        
    }, []); 

    return null;
}
