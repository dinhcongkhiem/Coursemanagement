import './Profile.css'
import ProfileNav from './ProfileNavConponent'
import './VerifyOTP.css'
import { useState } from 'react'
import StudentService from '../../service/StudentService'
import { toast } from 'react-toastify'
export default function ChangePassword({ setLoading }) {
    const [show, setShow] = useState(false);
    const [err, setErr] = useState({
        errPassword: false,
        errConfirmPassword: false,
        err: false
    })
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const handleChangePasswordRequest = () => {
        if (!password) {
            setErr((prev) => ({
                ...prev,
                errPassword: true,
            }))
        } else {
            setErr((prev) => ({
                ...prev,
                errPassword: false,
            }))
        }
        if (!confirmPassword) {
            setErr((prev) => ({
                ...prev,
                errConfirmPassword: true,
            }))
        } else {
            setErr((prev) => ({
                ...prev,
                errConfirmPassword: false,
            }))
        }
        if (password !== confirmPassword) {
            setErr((prev) => ({
                ...prev,
                err: true,
            }))
        } else {
            setErr((prev) => ({
                ...prev,
                err: false,
            }))
        }
        if (password && confirmPassword && password === confirmPassword) {
            setLoading(true)
            StudentService.GetOTPtoAuthen()
                .then((response) => {
                    if (response.status === 200) {
                        setLoading(false)
                        setShow(!show)
                        console.log(JSON.stringify(response.data));

                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        }


    }

    const handlechangePassword = (otp) => {
        setLoading(true)
        StudentService.changePassword(otp, password, confirmPassword)
            .then((response) => {
                if (response.status === 200) {
                    setLoading(false)
                    setShow(!show)
                    toast("Update successfully", { hideProgressBar: true })
                    setPassword('')
                    setConfirmPassword('')

                }
            })
            .catch((error) => {
                console.log(error);
            });
    }


    return (
        <div className="profile-container">
            <ProfileNav />
            <div className="profile-content">
                <h2>Change your password</h2>
                <div className='info-content'>
                    <div className='infor'>
                        <h4 style={{ fontSize: '1.1em' }}>New password</h4>
                        <div>
                            <input type="password" maxLength="50" placeholder="New Password" className={err.errPassword ? 'err' : null}
                                value={password} onChange={newText => setPassword(newText.target.value)} />
                            {err.errPassword && <span className='errMessage'>Please input new password</span>}
                            {err.errPassword && <span className='warning-icon'><i class="fa-solid fa-triangle-exclamation"></i></span>}
                            


                        </div>
                    </div>

                </div>

                <div className='info-content'>
                    <div className='infor'>
                        <h4 style={{ fontSize: '1.1em' }}>Confirm new password</h4>
                        <div>
                            <input type="password" maxLength="50" placeholder="Confirm new password" className={err.errConfirmPassword ? 'err' : null}
                                value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                            {err.errConfirmPassword && <span className='errMessage'>Please input confirm password</span>}
                            {err.err && <span className='errMessage'>Confirm password must be the same as the new password</span>}
                            {(err.errConfirmPassword || err.err) && <span className='warning-icon'><i class="fa-solid fa-triangle-exclamation"></i></span>}


                        </div>
                    </div>

                </div>
                <div className='infor-action change-p-btn'>
                    <button onClick={handleChangePasswordRequest}>Update password</button>
                </div>
                <VerifyOTP show={show} onClose={() => setShow(false)} handlechangePassword={handlechangePassword} />
            </div>

        </div>
    )
}

function VerifyOTP({ show, onClose, handlechangePassword }) {
    const [input, setInputOtp] = useState('')
    const handleClick = () => {
        handlechangePassword(input);
    }

    return (
        show && <div className='verify-otp-container' onClick={onClose}>

            <div className='verify-otp-content' onClick={(event) => event.stopPropagation()}>
                <div className='verify-otp-header'>
                    <h3>Verification</h3>
                    <button style={{ float: 'right', fontSize: '18px' }} className='close-btn' onClick={onClose}><i className="fa-solid fa-xmark"></i></button>
                </div>
                <div>
                    <p className='discription'>We have just sent an OTP to your email please enter it to continue! <a href='/#'>Resend email</a></p>

                </div>
                <div className='row input-otp'>
                    <label htmlFor="OTP">OTP</label>
                    <input type="text" maxLength="6" placeholder="input OTP" id='OTP' onChange={(e) => setInputOtp(e.target.value)} />
                </div>
                <button className='continue-btn' onClick={handleClick}>Continue</button>
            </div>
        </div>

    )
}