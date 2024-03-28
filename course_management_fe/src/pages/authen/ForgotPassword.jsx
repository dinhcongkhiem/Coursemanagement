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


export default function ForgotPassword({ setAuthenticated, setLoading }) {
    const [username, setUsername] = useState('');
    const [isErr, setIsErr] = useState(
        {
            emailErr: false, 
        }
    )
    const images = [
        imgslide,
        imgslide2
    ];

    const handleSendPasswordReset = (e) => {
        e.preventDefault()
        if (username.length === 0) {
            setIsErr((prev) => ({
                ...prev,
                emailErr: true
            }))
        } else {
            setIsErr((prev) => ({
                ...prev,
                emailErr: false
            }))
        }

        console.log("Hello");
        if (username) {
            setLoading(true)
            StudentService.SendPasswordResetEmail(username)
                .then((response) => {
                    if (response.status === 200) {
                        setLoading(false);
                        toast("Please to check your email to reset password", {
                            position: "top-center",
                        });
                    }
                }).catch((err) => {
                    console.log(err);
                    toast.warn("Student with email not found", {
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
                        <h2>Reset your password</h2>
                        <p>Enter your user account's verified email address and we will send you a password reset link.</p>
                    </div>

                    <div className="login-input-group">
                        <form>

                            <div className="mb-3 input-block">
                                <label htmlFor="email" className="form-label">Email</label>
                                <input type="email" className="form-control" id="email" placeholder="Email" onChange={(e) => { setUsername(e.target.value) }} />
                                {isErr.emailErr && <span className='errMessage' style={{ left: '5px' }}>Please input email</span>}
                                {isErr.emailErr && <span className='warning-icon' style={{ right: '8px' }}><i className="fa-solid fa-triangle-exclamation"></i></span>}
                            </div>

                            <div className="row wrap-btn mt-5">
                                <button className='btn' onClick={(e) => handleSendPasswordReset(e)}>Send password reset email</button>

                            </div>
                        </form>
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