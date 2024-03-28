import { Link, useLocation } from "react-router-dom"
import './Profile.css'
export default function ProfileNav() {
    const location = useLocation();

    return (

        <div className="profile-nav">
            <h3>Cài đặt</h3>
            <ul>
                <li>
                    <Link to="/profile/information" className={location.pathname === "/profile/information" ? "active" : null}>
                        <i className="fa-regular fa-user"></i>
                        <span>Your profile</span>
                    </Link>
                </li>
                <li>
                    <Link to="/profile/changepassword" className={location.pathname === "/profile/changepassword" ? "active" : null}>
                        <i className="fa-solid fa-lock"></i>
                        Change password</Link>
                </li>
            </ul>
        </div>

    )
}