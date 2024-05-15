import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom';
import Insert, { PopupInsert } from '../../layout/modal/Insert';
import './Home.css'
import Navbar from '../navbar/Navbar';
import StudentService from '../../service/StudentService';
import { toast } from 'react-toastify';
import { confirmAlert } from 'react-confirm-alert'; 
import ConfirmModal from '../../layout/modal/ConfirmModal';
import 'react-confirm-alert/src/react-confirm-alert.css'; 
export default function Home({ setLoading }) {

    const [showPopup, setShowPopup] = useState(false);
    const [currentPopup, setCurrentPopup] = useState(null);
    const [listCourse, setListCourse] = useState([])
    const [course, setCourse] = useState({});
    const [courseInsert, setCourseInsert] = useState({
        courseId: null,
        desiredScore: "",
        note: ""
    });

    const handleOpenPopup = () => {
        setShowPopup(true);
    };
    const handleClosePopup = () => {
        setShowPopup(false)
        setCurrentPopup(null);

    }

    const handleClosePopupUpdate = () => {
        setCurrentPopup(null);
    };

    const handleClick = (index) => {
        setCurrentPopup(index);
        let currentCourse = {
            id: listCourse[index].id,
            desiredScore: listCourse[index].desiredScore,
            note: listCourse[index].note
        }

        setCourse(currentCourse)
    };

    const getCourses = () => {
        StudentService.getCourses()
            .then((response) => {
                setListCourse(response.data)
            })
            .catch((error) => {
                console.log(error);
            });
    }

    useEffect(() => {
        getCourses()
    }, [])
    const handleInsert = () => {
        setLoading(true)
        StudentService.insertCourse(courseInsert)
            .then((response) => {
                if (response.status === 200) {
                    setLoading(false)
                    setShowPopup(false)
                    getCourses()
                    toast("Insert successfully!", { hideProgressBar: true })
                }
            })
            .catch((error) => {
                setLoading(false)
                toast(error.response.data, { hideProgressBar: true })
            });

    }
    const handleUpdate = () => {
        setLoading(true)
        StudentService.updateCourse(course)
            .then((response) => {
                getCourses();
                setLoading(false);
                setCurrentPopup(null);

                toast("Update successfully!", { hideProgressBar: true })
            })
            .catch((error) => {
                console.log(error);
            });
    }
    const handleDelete = (id) => {
        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                    <ConfirmModal onClose={onClose} handleClickDelete={() => {
                        StudentService.removeCourse(id)
                            .then((response) => {
                                getCourses();
                                toast("Deleted !", { hideProgressBar: true })

                            })
                            .catch((error) => {
                                console.log(error);
                            });
                    }} />
                );
            }
        });


    }
    return (
        <>
            <div className='d-flex flex-row'>
                <Navbar />
                <div className='mx-1 mt-5 home-container'>
                    <h1>List course</h1>
                    <button className="btn-insert" onClick={handleOpenPopup}>Add courses</button>
                    <table className="table align-middle">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Name</th>
                                <th scope="col">Code</th>
                                <th scope="col">Form of study</th>
                                <th scope="col">Duration</th>
                                <th scope="col">Desired score</th>
                                <th scope="col">Note</th>


                            </tr>
                        </thead>
                        <tbody>

                            {listCourse.map((data, index) => (
                                <tr key={index} style={{ position: 'relative' }}>
                                    <th scope="row">{index}</th>
                                    <td>{data.course.name}</td>
                                    <td>{data.course.programCode}</td>
                                    <td>{data.course.studyLoad}</td>
                                    <td>{data.course.duration}</td>
                                    <td>{data.desiredScore}</td>
                                    <td>{data.note}</td>

                                    <td>
                                        <div className='action-course'>
                                            <button onClick={() => handleClick(index)}><i className="fa-solid fa-pen-to-square"></i></button>
                                            <button onClick={() => handleDelete(data.id)}><i className="fa-solid fa-trash"></i></button>
                                        </div>

                                        <PopupInsert
                                            key={index}
                                            show={currentPopup === index}
                                            onClose={handleClosePopupUpdate}
                                            style={{ top: '73px', right: '55px', width: '600px' }}
                                            courseInfor={course}
                                            setCourse={setCourse}
                                            handleSubmit={handleUpdate}
                                        />
                                    </td>
                                </tr>


                            ))}
                        </tbody>
                    </table>
                    <Insert show={showPopup} onClose={handleClosePopup} handleInsert={handleInsert} setCourseInsert={setCourseInsert} courseInsert={courseInsert} />
                </div>
            </div >
        </>

    );
}

