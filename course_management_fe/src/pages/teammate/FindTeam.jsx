import React, { useState, useEffect } from 'react'
import './FindTeam.css'
import Navbar from '../navbar/Navbar';
import StudentService from '../../service/StudentService';
import ConnectionService from '../../service/ConnectionService';
import { useSocket } from '../../context/SocketContext';
export default function FindTeamMate({ setLoading }) {
    const [indexPopup, setIndexPopup] = useState(null);
    const [listCourse, setListCourse] = useState([]);
    const [listStudentInAllCourse, setListStudentInAllCourse] = useState([])
    const [listConnections, setListConnections] = useState([]);
    const { getListStudentConnect } = useSocket();

    useEffect(() => {
        StudentService.getCourses()
            .then((response) => {
                if (response.status === 200) {
                    setListCourse(response.data);
                }
            })
            .catch((err) => {
                console.log(err);
            })
        GetListConnection()
        StudentService.getStudentsInCourse()
            .then((response) => {
                if (response.status === 200) {
                    setListStudentInAllCourse(response.data);
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }, [])
    const GetListConnection = () => {
        ConnectionService.getConnections()
            .then((response) => {
                if (response.status === 200) {
                    setListConnections(response.data);
                }
            })
            .catch((err) => {
                console.log(err);
            })
    }
    const HandleShowPopup = (index) => {
        listStudentInAllCourse[index].forEach(student => {
            if (listConnections.some(connection =>
                (student.studentId === connection.receiverId || student.studentId === connection.senderId) && connection.connected)) {
                student.isConnected = true
            } else if (listConnections.some(connection => student.studentId === connection.receiverId)) {
                student.isConnected = false

            }
        });
        setIndexPopup(index)
    }
    const handleConnectStudent = (receiverId) => {
        setLoading(true)
        ConnectionService.createConnection(receiverId)
            .then((response) => {
                if (response.status === 200) {
                    GetListConnection()
                    listStudentInAllCourse[indexPopup].forEach(student => {
                        if ((student.studentId === response.data.sender.id) || (student.studentId === response.data.receiver.id)) {
                            if (response.data.connected) {
                                getListStudentConnect()
                                student.isConnected = true;
                            } else {
                                student.isConnected = false;

                            }
                        }
                        setLoading(false)
                    });

                }
            })
            .catch((error) => {
                console.log(error);
                setLoading(false)

            });
    }
    return (
        <>
            <div className="d-flex">
                <Navbar />

                <div className='find-team'>
                    <h2>Find your teammate</h2>
                    <p>You can find your teammate in here to learn together !!!</p>
                    <div className='find-team-container'>
                        <div className='list-group list-search'>
                            {listCourse.map((data, index) => (
                                <div className='list-courses position-relative d-flex align-items-center' key={index}>
                                    <button type="button" className="list-group-item list-group-item-action" onClick={() => HandleShowPopup(index, data.course.id)}>{data.course.name}</button>
                                    {(indexPopup === index) ? <i className="fa-solid fa-play arrow-icon"></i> : null}
                                    <ListTeamMate
                                        key={index}
                                        show={indexPopup === index}
                                        listStudentInCourse={listStudentInAllCourse[index]}
                                        handleConnectStudent={handleConnectStudent}
                                    />
                                </div>
                            ))}
                        </div>

                    </div>
                </div>
            </div>

        </>
    )
}

const ListTeamMate = ({ show, listStudentInCourse, handleConnectStudent }) => {
    if (!show) {
        return null;
    }

    return (
        <>
            <div className=' align-items-center position-absolute z-1 list-team'>
                <ul className="list-group">
                    {listStudentInCourse.length > 0 ?
                        (listStudentInCourse.map((data, index) => (
                            <li className="list-group-item" key={index}>
                                <div className='teammate-container'>
                                    <div className="d-flex align-items-center">
                                        <div className='img-around'>
                                            <img className='avt-image' src={data.avatar} alt="avt" />

                                        </div>
                                        <div className='infor-teammate'>
                                            <p className='name-std'>{data.studentName}</p>
                                            <p className='desire'>{data.note}</p>
                                            <button className="btn-connect" disabled={data.isConnected !== undefined}
                                                style={{ opacity: (data.isConnected !== undefined) && '0.6' }}
                                                onClick={() => handleConnectStudent(data.studentId)}>
                                                {data.isConnected ? "Connected" : "Connect"}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        )))
                        :
                        <li className="list-group-item">
                            <div className='teammate-container'>
                                <div className="d-flex align-items-center">
                                    <div className='infor-teammate'>
                                        <p className='desire'>No one has taken this course except you !</p>
                                    </div>
                                </div>
                            </div>
                        </li>
                    }


                </ul>

            </div>
        </>
    )
}