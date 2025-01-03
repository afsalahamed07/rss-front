import { Link } from "react-router-dom";
import "./nav.css";

const Nav = () => {
  return (
    <div className="navbar">
      <div className="right">
        <Link to="/">
          <div className="nav-item">Home</div>
        </Link>
      </div>
      <div className="left">
        <Link to="/rss">
          <div className="nav-item">RSS</div>
        </Link>
      </div>
    </div>
  );
};

export default Nav;
