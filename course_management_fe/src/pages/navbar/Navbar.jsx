import { Outlet, Link, useLocation } from "react-router-dom";
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();

  return (
    <>
      <div className="nav-bar">
        <div className="nav-list">
          <ul>
            <li className={location.pathname === "/" ? "active-side" : ""}>
              <Link to="/">
                <i className="fa-solid fa-book"></i>
                <span>Submit courses</span>
              </Link>
            </li>
            <li className={location.pathname === "/team" ? "active-side" : ""}>
              <Link to="/team">
                <i className="fa-solid fa-user-group"></i>
                <span>Find Teammate</span>
              </Link>
            </li>
            <li className={location.pathname === "/message" ? "active-side" : ""}>
              <Link to="/message">
                <i className="fa-solid fa-message"></i>
                <span>Message</span>
              </Link>
            </li>
          </ul>
        </div>

      </div>

      <Outlet />
    </>
  )
};

export default Navbar;
