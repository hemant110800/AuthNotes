import { useContext } from "react";
import { NavLink, Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const NavigationBar = () => {
  const user = useContext(AuthContext);
  console.log(user.user)

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-navbar">
        <div className="container-fluid">
          <NavLink className="navbar-brand !text-[#0b5ed7] font-bold" to="">
            AuthNotes
          </NavLink>
          <div className="navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <NavLink
                  className="nav-link active"
                  style={({ isActive }) => ({
                    fontWeight: isActive ? "bolder" : "",
                  })}
                  aria-current="page"
                  to="/"
                >
                  Home
                </NavLink>
              </li>
              <li className="nav-item">
                {user.user == null ? (
                  <NavLink
                    className="nav-link"
                    style={({ isActive }) => ({
                      fontWeight: isActive ? "bolder" : "",
                    })}
                    to="/login"
                  >
                    Login
                  </NavLink>
                ) : (
                  <NavLink
                    className="nav-link"
                    style={({ isActive }) => ({
                      fontWeight: isActive ? "bolder" : "",
                    })}
                    to="/logout"
                    onClick={user.logoutHandler}
                  >
                    Logout
                  </NavLink>
                )}
              </li>
            </ul>
            {user.user && (
              <div className="d-flex gap-1">
                Welcome <strong>{user.user}</strong>
                </div>)}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default NavigationBar;
