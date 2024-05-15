import React, { useState, useEffect } from 'react'
import CourseService from '../../service/CourseService'
import './insert.css'
export default function Insert({ show, onClose, handleInsert, setCourseInsert, courseInsert }) {


    const [productArrSearch, setproductArrSearch] = useState([])
    const [productArr, setproductArr] = useState([])

    useEffect(() => {
        CourseService.GetCourses()
            .then((response) => {
                if (response.status === 200) {
                    setproductArr(response.data)
                    setproductArrSearch(response.data)
                }
            })


    }, [])
    const onChangeHandle = (e) => {
        const regex = new RegExp(e.target.value, 'i');
        if (e.target.value === '') {
            setproductArrSearch(productArr)
        } else {
            const searchResult = productArr.filter(item =>
                regex.test(item.programCode) || regex.test(item.name)
            );
            setproductArrSearch(searchResult);

        }
    }


    const [currentPopup, setCurrentPopup] = useState(null);

    const handleClosePopup = () => {
        setCurrentPopup(null);
    };

    const handleClick = (index, id) => {
        setCurrentPopup(index);
        setCourseInsert({
            courseId: id,
            desiredScore: "",
            note: ""
        })
    };

    const handleInsertCourse = () => {
        setCurrentPopup(null);
        setproductArrSearch(productArr)

        handleInsert()
    }

    if (!show) {
        return null;
    }
    return (
        <div className='insert-modal'>
            <div className='insert-container '>
                <div className="d-flex justify-content-between  align-items-baseline">
                    <h3 className='mb-4'>Insert courses</h3>
                    <button onClick={onClose} className='close-btn' ><i className="fa-solid fa-xmark"></i></button>
                </div>
                <div className="row mb-3 mx-3">
                    <label htmlFor="search-input" className="col-sm-2 col-form-label">Search :</label>
                    <div className="col-sm-10">
                        <input type="email" className="form-control" id="search-input" onChange={onChangeHandle} placeholder='Code or Name of courese' />
                    </div>
                </div>
                <div className='list-group list-search'>
                    {productArrSearch.map((data, index) => (
                        <>
                            <div className='search-result' key={index}>
                                <button type="button" className="list-group-item list-group-item-action" onClick={() => handleClick(index, data.id)}>{data.name}</button>

                            </div>
                            <PopupInsert
                                key={index}
                                show={currentPopup === index}
                                onClose={handleClosePopup}
                                courseInfor={courseInsert}
                                setCourse={setCourseInsert}
                                handleSubmit={handleInsertCourse}

                            />
                        </>

                    ))}
                </div>

            </div>
        </div>
    )
}

export function PopupInsert({ show, onClose, style, courseInfor, setCourse, handleSubmit }) {
    const [errInput, setErrInput] = useState(false);


    const handleScoreChange = (event) => {
        setCourse((prevState) => ({
            ...prevState,
            desiredScore: event.target.value
        }));
    };

    const handleNoteChange = (event) => {
        setCourse((prevState) => ({
            ...prevState,
            note: event.target.value
        }));
    };

    const handleSubmitCourse = () => {
        if (courseInfor.desiredScore.length <= 0 || courseInfor.desiredScore > 10 || courseInfor.desiredScore < 0) {
            setErrInput(true);
        } else {
            setErrInput(false);
            handleSubmit();
        }
    }


    return (
        <>
            {show && <div className="popup" style={style} >
                <div className='row'>

                    <div>
                        <button style={{ float: 'right', fontSize: '18px' }} className='close-btn' onClick={onClose}><i className="fa-solid fa-xmark"></i></button>
                    </div>
                    <div className="col-3 input-block">
                        <label htmlFor="first-name" className="form-label">Desired score</label>
                        <input type="number" className="form-control" id="first-name"
                            placeholder="Score" min="0" max="10" value={courseInfor ? courseInfor.desiredScore : 0}
                            onChange={handleScoreChange} />
                        {errInput && <span className="text-danger err-text">Điểm không hợp lệ vui lòng thử lại</span>}
                    </div>
                    <div className="col-9 input-block">
                        <label htmlFor="first-name" className="form-label">Note</label>
                        <input type="text" className="form-control" id="first-name" placeholder="Note" value={courseInfor ? courseInfor.note : ""} onChange={handleNoteChange} />

                    </div>
                    <div>
                        <button className="btn-insert" style={{ float: 'right' }} onClick={handleSubmitCourse} type='submit'>Submit</button>
                    </div>


                </div>


            </div>}
        </>

    );
};