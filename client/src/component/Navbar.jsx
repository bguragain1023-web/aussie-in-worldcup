import logo from "../assets/logo.png";

export const Navbar = ({ onAdminClick, onDemoClick }) => {
  return (
    <div className="navbar ">
      <div className="container">
        <img
          className="logo"
          src={logo}
          alt="AussIe In WorldCup"
          //   style={{ height: "50px", width: "50px" }}
        />

        <div className="links d-flex gap-2">
          <span className="admin-link" onClick={onAdminClick}>
            Admin
          </span>
          <span className="admin-link" onClick={onDemoClick}>
            Demo-Admin
          </span>
        </div>
      </div>
    </div>
  );
};
