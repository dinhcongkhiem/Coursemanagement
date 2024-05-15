import React, { useState } from 'react';
import './Authen.css'
import imgslide from '../../assets/image/sgs-campus-night-03.jpg'
import imgslide2 from '../../assets/image/img-slider1.jpg'
import Carousel from 'react-bootstrap/Carousel';
import StudentService from '../../service/StudentService';
import { toast } from 'react-toastify';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';


export default function SetNewPassword({ setLoading }) {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [queryParameters] = useSearchParams()
    const location = useLocation();
    const navigate = useNavigate();
    const [isErr, setIsErr] = useState(
        {
            passwordErr: false,
            confirmPasswordErr: false,
            errnotMatch: false,

        }
    )
    const images = [
        imgslide,
        imgslide2
    ];

    const handleSendPasswordReset = (e) => {
        e.preventDefault()
        if (password.length === 0) {
            setIsErr((prev) => ({
                ...prev,
                passwordErr: true
            }))
        } else {
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
        } else if (confirmPassword !== password) {
            setIsErr((prev) => ({
                ...prev,
                errnotMatch: true,
                confirmPasswordErr: false

            }))
        } else {
            setIsErr((prev) => ({
                ...prev,
                emailErr: false,
                confirmPasswordErr: false
            }))
        }
        if (password) {
            setLoading(true)
            StudentService.setNewPassword(queryParameters.get("activeKey"), password, confirmPassword)
            .then((response) => {
                if(response.status === 200){
                    toast("Update password successfully", {
                        position: "top-center",
                    });
                    setLoading(false)
                    navigate('/login', { state: { from: location } });
                }
            
              })
              .catch((error) => {
                console.log(error);
                setLoading(false)

              });
        }

    }
    return (
        <>
            <div className="modal-authen">
                <div className='modal-container'>
                    <div className='header-login-modal'>
                        <h2>Change your password</h2>
                    </div>

                    <div className="login-input-group">
                        <form>

                            <div className="mb-3 input-block">
                                <label htmlFor="password" className="form-label">Password</label>
                                <input type="password" className="form-control" id="password" placeholder="Password" onChange={(e) => { setPassword(e.target.value) }} />
                                {isErr.passwordErr && <span className='errMessage' style={{ left: '5px' }}>Please input password</span>}
                                {isErr.passwordErr && <span className='warning-icon' style={{ right: '8px' }}><i className="fa-solid fa-triangle-exclamation"></i></span>}
                            </div>
                            <div className="mb-3 input-block">
                                <label htmlFor="Confirmpassword" className="form-label">Confirm password</label>
                                <input type="password" className="form-control" id="Confirmpassword" placeholder="Confirm password" onChange={(e) => { setConfirmPassword(e.target.value) }} />
                                {isErr.confirmPasswordErr && <span className='errMessage' style={{ left: '5px' }}>Please input confirm password</span>}
                                {isErr.errnotMatch && <span className='errMessage' style={{ left: '5px' }}>Confirm password not match</span>}
                                {(isErr.confirmPasswordErr || isErr.errnotMatch) && <span className='warning-icon' style={{ right: '8px' }}><i className="fa-solid fa-triangle-exclamation"></i></span>}
                            </div>


                            <div className="row wrap-btn mt-5">
                                <button className='btn' onClick={handleSendPasswordReset}>Send password reset email</button>

                            </div>
                        </form>
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