import { useEffect } from 'react';
import StudentService from '../../service/StudentService';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
export default function ActiveAccountRedirect() {
    const location = useLocation();
    const navigate = useNavigate();
    const [queryParameters] = useSearchParams()
    useEffect(() => {
        StudentService.VerifyAccount(queryParameters.get("activeKey"))
            .then((response) => {
                if (response.status === 200) {
                    toast("Successfully", {
                        position: "top-center",
                    });
                    navigate('/login', { state: { from: location } });


                }
            })
            .catch((error) => {
                console.log(error);
                toast("Cannot active your account", {
                    position: "top-center",
                });
            });


    }, []);

    return null;
}
