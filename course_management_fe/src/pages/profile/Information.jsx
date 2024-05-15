import './Profile.css'
import { useState, useEffect } from 'react'
import ProfileNav from './ProfileNavConponent'
import StudentService from '../../service/StudentService'
import { toast } from 'react-toastify';
export default function Profile({ setLoading }) {
    const [avatar, setAvatar] = useState('');
    const [oldStudent, setOldStudent] = useState({
        name: "",
        email: "",
        address: "",
        phoneNum: "",
        avatar: ""
    })
    const [student, setStudent] = useState({
        name: "",
        email: "",
        address: "",
        phoneNum: "",
        avatar: ""
    })

    const [isEdit, SetIsEdit] = useState([false, false, false, false, false])
    const [isErr, SetIsErr] = useState([false, false, false, false, false])

    const indexToKey = ["avatar", "name", "email", "address", "phoneNum"];
    const formData = new FormData();

    const handleClick = (index) => {
        const updatedIsEdit = [...isEdit];
        updatedIsEdit[index] = !updatedIsEdit[index];
        SetIsEdit(updatedIsEdit);
        SetIsErr([false, false, false, false, false])
        setStudent(oldStudent);
    }

    useEffect(() => {
        StudentService.getInforStudent()
            .then((response) => {
                if (response.status === 200) {
                    setStudent(response.data)
                    setOldStudent(response.data)
                }
            })
            .catch((error) => {
                console.log(error);
            });

    }, [])

    useEffect(() => {
        return () => {
            avatar && URL.revokeObjectURL(avatar)
        }
    }, [avatar])
    const handleSaveClick = (index) => {
        if (student[indexToKey[index]] === '') {
            const updatedIsErr = [...isEdit];
            updatedIsErr[index] = true;
            SetIsErr(updatedIsErr);
        } else if (oldStudent[indexToKey[index]] !== student[indexToKey[index]]) {
            setLoading(true)

            formData.append(indexToKey[index], student[indexToKey[index]])
            StudentService.updateStudent(formData)
                .then((response) => {
                    if (response.status === 200) {
                        setStudent(response.data)
                        setOldStudent(response.data)
                        toast("Update successfully!", { hideProgressBar: true })
                        setLoading(false)
                    }
                })
        }
        handleClick(index)

    }
    const handleChangeAvt = (e) => {
        if (e.target.files && e.target.files[0]) {
            setAvatar(URL.createObjectURL(e.target.files[0]))
            const updateStudent = { ...student };
            updateStudent.avatar = e.target.files[0];
            setStudent(updateStudent)

        }
    };
    const handleOnChange = (e, index) => {
        const updateStudent = { ...student };
        updateStudent[indexToKey[index]] = e.target.value;
        if (e.target.value.length > 0) {
            SetIsErr([false, false, false, false, false])
        }
        setStudent(updateStudent)
    }





    return student && (
        <div className="profile-container">
            <ProfileNav />
            <div className="profile-content">
                <h4>Your information</h4>
                <div className='info-content'>
                    <div className='infor'>
                        <h5 style={{ fontSize: '1.1em' }}>Avatar</h5>
                        <div className='avt-content'>
                            <div className="PhotoField_contentBody">Should be a square image, accepts files: JPG, PNG or GIF</div>
                            <div className="PhotoField_contentImage">
                                <div className="PhotoField_avatar">
                                    <div className="FallbackAvatar_avatar" onClick={() => handleClick(0)} style={{ cursor: 'pointer' }}>
                                        {avatar ? <img src={avatar} alt="Preview" /> : <img src={student.avatar} alt="Đinh Công Khiêm" />}


                                    </div>
                                </div>
                                <label htmlFor="avatar">
                                    {isEdit[0] &&
                                        <>
                                            <div className='camera-icon'>
                                                <i className="fa-solid fa-camera"></i>
                                            </div>
                                            <div className='input-file'>
                                                <input type="file" accept="image/jpg, image/jpeg, image/png" id="avatar" onChange={handleChangeAvt} />
                                            </div>
                                        </>
                                    }

                                </label>
                            </div>
                        </div>
                    </div>
                    <div className='infor-action'>
                        {isEdit[0] ?
                            <div className='action-group'>
                                <button className='save-btn' onClick={() => handleSaveClick(0)}>Save</button>
                                <button className='cancel-btn' onClick={() => handleClick(0)}>Cancel</button>
                            </div> :
                            <button onClick={() => handleClick(0)}>Chỉnh sửa</button>
                        }
                    </div>
                </div>
                <div className='info-content'>
                    <div className='infor'>
                        <h5 style={{ fontSize: '1.1em' }}>Full name</h5>
                        <div>
                            <input disabled={!isEdit[1]} type="text" name="full_name" className={isErr[1] ? 'err' : null}
                                maxLength="50" placeholder="Input your full name" onChange={(event) => handleOnChange(event, 1)} value={student.name} />
                            {isErr[1] && <span className='errMessage' style={{ top: '90px' }}>Please input full name</span>}
                            {isErr[1] && <span className='warning-icon' style={{ top: '65px' }}><i class="fa-solid fa-triangle-exclamation"></i></span>}

                        </div>
                    </div>
                    <div className='infor-action'>
                        {isEdit[1] ?
                            <div className='action-group'>
                                <button className='save-btn' onClick={() => handleSaveClick(1)}>Save</button>
                                <button className='cancel-btn' onClick={() => handleClick(1)}>Cancel</button>
                            </div> :
                            <button onClick={() => handleClick(1)}>Chỉnh sửa</button>
                        }
                    </div>
                </div>

                <div className='info-content'>
                    <div className='infor'>
                        <h5 style={{ fontSize: '1.1em' }}>Email</h5>
                        <div>
                            <input disabled={!isEdit[2]} type="text" name="full_name" maxLength="50" className={isErr[2] ? 'err' : null}
                                placeholder="Input your email" onChange={(event) => handleOnChange(event, 2)} value={student.email} />
                            {isErr[2] && <span className='errMessage' style={{ top: '90px' }}>Please input email</span>}
                            {isErr[2] && <span className='warning-icon' style={{ top: '65px' }}><i class="fa-solid fa-triangle-exclamation"></i></span>}
                        </div>
                    </div>
                    <div className='infor-action'>
                        {isEdit[2] ?
                            <div className='action-group'>
                                <button className='save-btn' onClick={() => handleSaveClick(2)}>Save</button>
                                <button className='cancel-btn' onClick={() => handleClick(2)}>Cancel</button>
                            </div> :
                            <button onClick={() => handleClick(2)}>Chỉnh sửa</button>
                        }
                    </div>
                </div>

                <div className='info-content'>
                    <div className='infor'>
                        <h5 style={{ fontSize: '1.1em' }}>Address</h5>
                        <div>
                            <input disabled={!isEdit[3]} type="text" name="full_name" className={isErr[3] ? 'err' : null}
                                maxLength="50" placeholder="Input your address" onChange={(event) => handleOnChange(event, 3)} value={student.address} />
                            {isErr[3] && <span className='errMessage' style={{ top: '90px' }}>Please input address</span>}
                            {isErr[3] && <span className='warning-icon' style={{ top: '65px' }}><i class="fa-solid fa-triangle-exclamation"></i></span>}
                        </div>
                    </div>
                    <div className='infor-action'>
                        {isEdit[3] ?
                            <div className='action-group'>
                                <button className='save-btn' onClick={() => handleSaveClick(3)}>Save</button>
                                <button className='cancel-btn' onClick={() => handleClick(3)}>Cancel</button>
                            </div> :
                            <button onClick={() => handleClick(3)}>Chỉnh sửa</button>
                        }
                    </div>
                </div>
                <div className='info-content'>
                    <div className='infor'>
                        <h5 style={{ fontSize: '1.1em' }}>Phone number</h5>
                        <div>
                            <input disabled={!isEdit[4]} type="text" name="full_name" className={isErr[4] ? 'err' : null}
                                maxLength="50" placeholder="Input your phone number" onChange={(event) => handleOnChange(event, 4)} value={student.phoneNum} />
                            {isErr[4] && <span className='errMessage' style={{ top: '90px' }}>Please input phone number</span>}
                            {isErr[4] && <span className='warning-icon' style={{ top: '65px' }}><i class="fa-solid fa-triangle-exclamation"></i></span>}
                        </div>
                    </div>
                    <div className='infor-action'>
                        {isEdit[4] ?
                            <div className='action-group'>
                                <button className='save-btn' onClick={() => handleSaveClick(4)}>Save</button>
                                <button className='cancel-btn' onClick={() => handleClick(4)}>Cancel</button>
                            </div> :
                            <button onClick={() => handleClick(4)}>Chỉnh sửa</button>
                        }
                    </div>
                </div>

            </div>
        </div>
    )
}

