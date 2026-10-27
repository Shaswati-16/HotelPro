import { Link, useNavigate, useLocation } from "react-router-dom";
import { isLoggedIn, getUser, clearSession } from "../../utils/auth.js";

export default function Header() {
  const navigate = useNavigate();
  // Subscribing to the location makes the header re-render after login and logout
  useLocation();

  const loggedIn = isLoggedIn();
  const user = getUser();

  const handleLogout = () => {
    clearSession();
    navigate("/login");
  };

  return (
    <header className="header">
      <Link to="/" className="brand">
        HotelPro
      </Link>
      <nav className="nav">
        {loggedIn && <Link to="/dashboard">Rooms</Link>}
        {loggedIn && <Link to="/bookings">My bookings</Link>}
        {loggedIn && user?.userType === "admin" && <Link to="/admin/rooms">Manage rooms</Link>}
        {!loggedIn && <Link to="/login">Login</Link>}
        {!loggedIn && <Link to="/register">Register</Link>}
        {loggedIn && (
          <button className="btn btn-link" onClick={handleLogout}>
            Logout
          </button>
        )}
      </nav>
    </header>
  );
}
