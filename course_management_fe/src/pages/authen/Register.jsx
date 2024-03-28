import React, { useState, useEffect } from 'react';
import { Link, Outlet } from 'react-router-dom'
import './Authen.css'
import imgslide from '../../assets/image/sgs-campus-night-03.jpg'
import imgslide2 from '../../assets/image/img-slider1.jpg'
import Carousel from 'react-bootstrap/Carousel';
import StudentService from '../../service/StudentService';
import { toast } from 'react-toastify';

export default function Register({setLoading}) {
    const images = [
        imgslide,
        imgslide2
    ];
    const [fullname, setFullname] = useState('');
    const [location, setLocation] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isErr, setIsErr] = useState(
        {
            fullnameErr: false,
            locationErr: false,
            emailErr: false,
            passwordErr: false,
            confirmPasswordErr: false,
            notMatchPassword: false
        }
    )

    const handleRegister = (e) => {
        e.preventDefault();
        if (fullname.length === 0) {
            setIsErr((prev) => ({
                ...prev,
                fullnameErr: true
            }))
        }else{
            setIsErr((prev) => ({
                ...prev,
                fullnameErr: false
            }))
        }

        if (location.length === 0) {
            setIsErr((prev) => ({
                ...prev,
                locationErr: true
            }))
        }else{
            setIsErr((prev) => ({
                ...prev,
                locationErr: false
            }))
        }

        if (email.length === 0) {
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

        if (confirmPassword.length === 0) {
            setIsErr((prev) => ({
                ...prev,
                confirmPasswordErr: true
            }))
        }else if(confirmPassword !== password){
            setIsErr((prev) => ({
                ...prev,
                notMatchPassword: true
            }))
        }else{
            setIsErr((prev) => ({
                ...prev,
                notMatchPassword: false,
                confirmPasswordErr: false

            }))
        }
        if(fullname && location && email && password && confirmPassword ){
            setLoading(true)
            StudentService.Register(fullname, email, password,location)
            .then((response) => {
                if(response.status === 200){
                    toast(response.data,{
                        position: "top-center",
                    });
                    setLoading(false)

                }
            })
            .catch((err) => {
                if(err.response.status === 400){
                    toast.warn(err.response.data,{
                        position: "top-center",
                    });
                }
                console.error(err);
                setLoading(false)

            });
        }
    }


    return (
        <>
            <div className="modal-authen">
                <div className='modal-container'>
                    <div className='header-login-modal'>
                        <h2>Sign up to get started</h2>
                        <p><span>If you already have an account, </span><Link to='/login'>Login here!</Link></p>
                    </div>

                    <div className="login-input-group">
                        <form>
                            <div className='row'>
                                <div className="mb-3 col input-block">
                                    <label htmlFor="full-name" className="form-label">Full name</label>
                                    <input type="text" className="form-control" id="full-name"
                                        placeholder="Full name" onChange={(e) => setFullname(e.target.value)} />
                                    {isErr.fullnameErr && <span className='errMessage'>Please input full name</span>}
                                    {isErr.fullnameErr && <span className='warning-icon'><i className="fa-solid fa-triangle-exclamation"></i></span>}
                                </div>
                                <div className="mb-3 col input-block">
                                    <label htmlFor="location" className="form-label">Location</label>
                                    <input type="text" className="form-control" id="location"
                                        placeholder="Hà Nội, Đà Nẵng, ..." onChange={(e) => setLocation(e.target.value)} />
                                    {isErr.locationErr && <span className='errMessage'>Please input location</span>}
                                    {isErr.locationErr && <span className='warning-icon'><i className="fa-solid fa-triangle-exclamation"></i></span>}
                                </div>
                            </div>
                            <div className="mb-3 input-block">
                                <label htmlFor="email" className="form-label">Email address</label>
                                <input type="email" className="form-control" id="email"
                                    placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
                                {isErr.emailErr && <span className='errMessage' style={{ left: '5px' }}>Please input email</span>}
                                {isErr.emailErr && <span className='warning-icon' style={{ right: '8px' }}><i className="fa-solid fa-triangle-exclamation"></i></span>}
                            </div>
                            <div className='row'>
                                <div className="mb-3 col input-block">
                                    <label htmlFor="password" className="form-label">Password</label>
                                    <input type="password" className="form-control" id="password"
                                        placeholder="***" onChange={(e) => setPassword(e.target.value)} />
                                    {isErr.passwordErr && <span className='errMessage'>Please input password</span>}
                                    {isErr.passwordErr && <span className='warning-icon'><i className="fa-solid fa-triangle-exclamation"></i></span>}
                                </div>
                                <div className="mb-3 col input-block">
                                    <label htmlFor="confirm-password" className="form-label">Confirm password</label>
                                    <input type="password" className="form-control" id="confirm-password"
                                        placeholder="***" onChange={(e) => setConfirmPassword(e.target.value)} />
                                    {isErr.confirmPasswordErr && <span className='errMessage'>Please input confirm password</span>}
                                    {isErr.notMatchPassword && <span className='errMessage'>Confirm passwords do not match</span>}
                                    
                                    {(isErr.confirmPasswordErr ||isErr.notMatchPassword)  && <span className='warning-icon'><i className="fa-solid fa-triangle-exclamation"></i></span>}
                                </div>
                            </div>
                            <div className="row wrap-btn">
                                <button type="submit" value="Submit" className='btn' onClick={handleRegister}>Get Started</button>

                            </div>
                        </form>
                    </div>

                    <div className='break-form'>
                        <hr />
                        Or continue with
                        <hr />
                    </div>

                    <div className="row wrap-btn">
                        <button type="submit" value="Submit" className='btn'>
                            <i className="fa-brands fa-google"></i>
                            Google</button>

                    </div>
                </div>
                <div className='slider'>
                    <div className="slider-inner">
                        <Carousel controls={false}>
                            {images.map((image, index) => (
                                <Carousel.Item key={index}>
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