import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const PrivateRoute = ({ children, authenticated }) => {
  let navigate = useNavigate();

  useEffect(() => {
    if (!authenticated) {
      navigate('/login');
    }
  }, [authenticated, navigate]); // Add dependencies here

  if (authenticated) {
    return children;
  } else {
    return null;
  }
};

export default PrivateRoute;
