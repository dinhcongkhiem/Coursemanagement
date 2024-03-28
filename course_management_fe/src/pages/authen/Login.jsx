import React, { useState } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom'
import './Authen.css'
import imglogo from '../../assets/image/RMIT-LOGO-BL.png'
import imgslide from '../../assets/image/sgs-campus-night-03.jpg'
import imgslide2 from '../../assets/image/img-slider1.jpg'
import Carousel from 'react-bootstrap/Carousel';
import StudentService from '../../service/StudentService';
import { GOOGLE_AUTH_URL, ACCESS_TOKEN } from '../../constants';
import { toast } from 'react-toastify';


export default function Login({ setAuthenticated, setLoading }) {
    const navigate = useNavigate();
    const location = useLocation();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isErr, setIsErr] = useState(
        {
            emailErr: false,
            passwordErr: false,  
        }
    )
    const images = [
        imgslide,
        imgslide2
    ];
    
    const handleLogin = (e) => {
        e.preventDefault()
        if (username.length === 0) {
            setIsErr((prev) => ({
                ...prev,
                emailErr: true
            }))
        }else{
            setIsErr((prev) => ({
                ...prev,
                emailErr: false
            }))
        }

        if (password.length === 0) {
            setIsErr((prev) => ({
                ...prev,
                passwordErr: true
            }))
        }else{
            setIsErr((prev) => ({
                ...prev,
                passwordErr: false
            }))
        }
        if (username && password) {
            setLoading(true)
            StudentService.Login(username, password)
                .then((response) => {
                    if (response.status === 200) {
                        setAuthenticated(true)
                        localStorage.setItem(ACCESS_TOKEN, response.data.accessToken)
                        navigate('/', { state: { from: location } });
                        setLoading(false);
                        window.location.reload(false)

                    }
                }).catch((err) => {
                    console.log(err);
                    toast.warn("Your username or account is incorrect",{
                        position: "top-center",
                    });
                    setLoading(false);

                })
        }

    }
    return (
        <>
            <div className="modal-authen">
                <div className='modal-container'>
                    <div className='header-login-modal'>
                        <h2>Sign in to your account</h2>
                        <p><span>If you haven’t signed up yet. </span><Link to='/register'>Register here! </Link></p>
                    </div>

                    <div className="login-input-group">
                        <form>

                            <div className="mb-3 input-block">
                                <label htmlFor="email" className="form-label">Email</label>
                                <input type="email" className="form-control" id="email" placeholder="Email" onChange={(e) => {setUsername(e.target.value)}}/>
                                {isErr.emailErr && <span className='errMessage' style={{ left: '5px' }}>Please input email</span>}
                                {isErr.emailErr && <span className='warning-icon' style={{ right: '8px' }}><i className="fa-solid fa-triangle-exclamation"></i></span>}
                            </div>
                            <div className="mb-3 input-block">
                                <label htmlFor="password" className="form-label">Password</label>
                                <input type="password" className="form-control" id="password" placeholder="Password" onChange={(e) => {setPassword(e.target.value)}}/>
                                {isErr.passwordErr && <span className='errMessage' style={{ left: '5px' }}>Please input password</span>}
                                {isErr.passwordErr && <span className='warning-icon' style={{ right: '8px' }}><i className="fa-solid fa-triangle-exclamation"></i></span>}
                            </div>
                            <div className="d-flex justify-content-between">
                                <div >
                                </div>
                                <div className="forgot-pass">
                                    <Link to="/forgotpassword">Forgot password</Link>
                                </div>
                            </div>
                            <div className="row wrap-btn">
                                <button className='btn' onClick={(e) => handleLogin(e)}>Start</button>

                            </div>
                        </form>
                    </div>

                    <div className='break-form'>
                        <hr />
                        Or continue with
                        <hr />
                    </div>

                    <div className="row wrap-btn">
                        <a href={GOOGLE_AUTH_URL} type="submit" value="Submit" className='btn'>
                            <i className="fa-brands fa-google"></i>
                            Google</a>


                    </div>
                </div>
                <div className='slider'>
                    <div className="slider-inner">
                        <Carousel controls={false}>
                            {images.map((image, index) => (
                                <Carousel.Item>
                                    <img
                                        className="d-block w-100"
                                        src={image}
                                        alt={index}
                                    />
                                </Carousel.Item>
                            ))}

                        </Carousel>
                    </div>
                </div>

            </div>
        </>
    )
}