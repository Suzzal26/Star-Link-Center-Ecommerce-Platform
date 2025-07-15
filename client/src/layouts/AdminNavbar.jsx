import { Dropdown } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { removeToken } from "../utils/token";
import Logo from "../assets/logo.png"; // Ensure this is the new Star Link Center logo

const AdminNavbar = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const getUserInfo = JSON.parse(localStorage.getItem("currentUser"));
  const adminEmail = getUserInfo?.email || "";
  let adminName = getUserInfo?.name;
  if (!adminName && adminEmail) {
    adminName = adminEmail
      .split("@")[0]
      .replace(/\b\w/g, (c) => c.toUpperCase());
  } else if (adminName) {
    adminName = adminName.replace(/\b\w/g, (c) => c.toUpperCase());
  } else {
    adminName = "";
  }

  const handleLogOut = () => {
    removeToken();
    localStorage.removeItem("currentUser");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const navLinkClass = (path) =>
    `nav-link text-white ${pathname.includes(path) ? "active bg-primary" : ""}`;

  return (
    <div className="sidebar bg-dark text-white d-flex flex-column p-3 vh-100">
      <Link
        to="/admin"
        className="d-flex flex-column align-items-start mb-4 text-white text-decoration-none"
        style={{ gap: "0.25rem" }}
      >
        <img className="img-fluid p-2" src={Logo} width={50} alt="Logo" />
        <span className="fs-5 fw-bold mb-1">
          {adminName
            ? `Welcome Admin "${adminName}"`
            : adminEmail
            ? `Welcome Admin "${adminEmail}"`
            : "Welcome Admin"}
        </span>
      </Link>

      <hr className="border-light" />

      <ul className="nav nav-pills flex-column mb-auto">
        <li>
          <Link to="/admin/products" className={navLinkClass("products")}>
            <i className="fa fa-box"></i> &nbsp; Products
          </Link>
        </li>
        <li>
          <Link to="/admin/orders" className={navLinkClass("orders")}>
            <i className="fa fa-shopping-cart"></i> &nbsp; Orders
          </Link>
        </li>
        <li>
          <Link to="/admin/sales" className={navLinkClass("sales")}>
            <i className="fa fa-chart-line"></i> &nbsp; Sales
          </Link>
        </li>
      </ul>

      <hr className="border-light" />

      <Dropdown>
        <Dropdown.Toggle variant="secondary">
          <strong>{adminName || adminEmail || "Admin"}</strong>
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item onClick={handleLogOut}>Sign Out</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};

export default AdminNavbar;
