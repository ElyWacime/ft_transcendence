
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import "../css/notfound.css";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="notfound-page">
      <div className="notfound-container">
        <h1 className="notfound-title">404</h1>
        <p className="notfound-message">Oops! Page not found</p>
        <a href="/" className="notfound-link">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
