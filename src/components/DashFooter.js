import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";

function DashFooter() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const { username, status } = useAuth();

  const onGoHomeClicked = () => navigate("/dash");

  return (
    <footer className="dash-footer">
      {pathname !== "/dash" ? (
        <button
          className="dash-footer__button icon-button"
          title="Home"
          onClick={onGoHomeClicked}
        >
          <FontAwesomeIcon icon={faHouse} />
        </button>
      ) : null}

      <p>Current User: {username}</p>
      <p>Status: {status}</p>
    </footer>
  );
}

export default DashFooter;
