import logo from "../assets/logo.png";

export const Navbar = ({ onAdminClick }) => {
  return (
    <div className="navbar ">
      <div className="container">
        <img
          className="logo"
          src={logo}
          alt="AussIe In WorldCup"
          //   style={{ height: "50px", width: "50px" }}
        />

        <span className="admin-link" onClick={onAdminClick}>
          Admin
        </span>
      </div>
    </div>
  );
};
