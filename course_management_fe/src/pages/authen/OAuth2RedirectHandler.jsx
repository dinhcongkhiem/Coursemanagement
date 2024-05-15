import { useEffect } from 'react';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../../constants';
import { useLocation, useNavigate } from 'react-router-dom';

export default function OAuth2RedirectHandler({setAuthenticated}) {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        function GetUrlParameter(name) {
            name = name.replace(/[\]]/, '\\[').replace(/[\]]/, '\\]');
            var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
            var results = regex.exec(location.search);
            return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
        };
        const token = GetUrlParameter('token');
        const refreshToken = GetUrlParameter('refreshToken')
        const error = GetUrlParameter('error');
        if(token && refreshToken) {
            localStorage.setItem(ACCESS_TOKEN, token);
            localStorage.setItem(REFRESH_TOKEN, refreshToken)
            setAuthenticated((prev) => ({
                ...prev,
                isLogin: true
            }))
            navigate('/', { state: { from: location } });
            window.location.reload(false)
        } else {
            navigate('/login', { state: { from: location, error: error } });
        }
    }, [location, navigate]); 

    return null;
}
