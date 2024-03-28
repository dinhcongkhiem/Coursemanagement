import React, { useState, useEffect, useRef } from 'react';
import image from '../../assets/image/1280px-RMIT_University_Logo.svg.png';
import './Header.css'
import { Link, Outlet } from 'react-router-dom'

export default function Header({setAuthenticated, isLogin}) {
    const [isShowProfileMenu, setIsShowProfileMenu] = useState(false);

    const profileMenuRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
                setIsShowProfileMenu(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [profileMenuRef]);


    const HanderLogout = () => {
        localStorage.removeItem('accessToken');
        setAuthenticated(false);
    }
    return (
        <div className='d-flex flex-row justify-content-between header align-items-center '>
            <div>
                <Link to="/">
                    <img src={image} style={{ width: '115px' }} alt='logo'></img>
                </Link>
            </div>

            <div className='profile' style={{display: isLogin ? 'block' : 'none'}}>
                <a className='user' onClick={() => setIsShowProfileMenu(!isShowProfileMenu)}>
                    <i className="icon fa-regular fa-user"></i>
                </a>
                <div ref={profileMenuRef} className='list-menu' style={{ display: isShowProfileMenu ? 'block' : 'none' }}>
                    <div className="list-group">
                        <Link to="/profile/information" className="list-group-item list-group-item-action">Profile</Link>
                        <a className="list-group-item list-group-item-action" onClick={HanderLogout}>Logout</a>
                    </div>
                </div>
            </div>

            <Outlet />

        </div>
    )
}
