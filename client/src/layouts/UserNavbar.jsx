import { useState, useContext } from "react";
import { Container, Navbar, Form, FormControl } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaShoppingCart,
  FaUser,
  FaSignOutAlt,
  FaSignInAlt,
  FaBars,
} from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import Logo from "../assets/logo.png"; // Ensure this is the new Star Link Center logo
import { isLoggedIn, logout } from "../utils/login";
import { CartContext } from "../contexts/CartContext";
import { categories } from "../constants";
import "./UserNavbar.css";

const UserNavbar = () => {
  const { cart } = useContext(CartContext);
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
    }
  };

  const totalCartItems = cart.reduce((total, item) => total + item.quantity, 0);

  const handleLogout = () => {
    logout();
    navigate("/");
    window.location.reload();
  };

  return (
    <Navbar expand="lg" className="modern-navbar">
      <Container fluid className="px-4">
        {/* Logo */}
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <img
            src={Logo}
            width="40"
            height="40"
            alt="Logo"
            className="me-3 logo-img"
          />
          <span>Star Link Center</span>
        </Link>

        {/* Mobile Menu Toggle */}
        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <IoMdClose size={24} /> : <FaBars size={24} />}
        </button>

        <Navbar.Collapse
          id="navbarScroll"
          className={isMobileMenuOpen ? "show" : ""}
        >
          {/* Navigation Links */}
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/contact">
                Contact Us
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/about">
                About Us
              </Link>
            </li>

            {/* Products Dropdown */}
            <div
              className="nav-item-dropdown-wrapper"
              onMouseEnter={() => setShowDropdown(true)}
              onMouseLeave={() => setShowDropdown(false)}
            >
              <li className="nav-item dropdown">
                <Link className="nav-link dropdown-toggle" to="/products">
                  Products
                </Link>

                {showDropdown && (
                  <ul className="dropdown-menu show modern-dropdown">
                    {Object.entries(categories).map(
                      ([category, subcategories]) => (
                        <li
                          key={category}
                          className="dropdown-submenu"
                          onMouseEnter={() => setActiveCategory(category)}
                          onMouseLeave={() => setActiveCategory(null)}
                        >
                          <button
                            className="dropdown-item d-flex justify-content-between align-items-center"
                            onClick={() =>
                              navigate(`/products?category=${category}`)
                            }
                          >
                            {category}
                            <span className="arrow">▶</span>
                          </button>

                          {activeCategory === category &&
                            subcategories.length > 0 && (
                              <ul className="dropdown-menu show position-absolute modern-dropdown-submenu">
                                {subcategories.map((sub) => (
                                  <li key={sub}>
                                    <button
                                      className="dropdown-item"
                                      onClick={() =>
                                        navigate(
                                          `/products?category=${category}&subcategory=${sub}`
                                        )
                                      }
                                    >
                                      {sub}
                                    </button>
                                  </li>
                                ))}
                              </ul>
                            )}
                        </li>
                      )
                    )}
                  </ul>
                )}
              </li>
            </div>

            <li className="nav-item">
              <Link className="nav-link" to="/repairing">
                Repairing
              </Link>
            </li>
          </ul>

          {/* Search Bar */}
          <div className="d-flex mx-auto align-items-center search-container">
            <Form className="d-flex flex-grow-1" onSubmit={handleSearch}>
              <div className="position-relative w-100">
                <FormControl
                  type="search"
                  placeholder="Search products..."
                  className="modern-search-input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" className="search-btn">
                  <FaSearch size={16} />
                </button>
              </div>
            </Form>
          </div>

          {/* Cart and User Section */}
          <div className="d-flex align-items-center gap-3">
            {/* Cart */}
            <Link to="/cart" className="cart-link position-relative">
              <FaShoppingCart size={24} color="var(--white)" />
              {totalCartItems > 0 && (
                <span className="badge bg-danger position-absolute">
                  {totalCartItems}
                </span>
              )}
            </Link>

            {/* User Section */}
            <div className="d-flex align-items-center gap-2">
              {isLoggedIn() ? (
                <>
                  <Link
                    className="btn btn-outline-light btn-sm d-flex align-items-center gap-2"
                    to="/profile"
                  >
                    <FaUser size={16} />
                    Profile
                  </Link>
                  <button
                    className="btn btn-danger btn-sm d-flex align-items-center gap-2"
                    onClick={handleLogout}
                  >
                    <FaSignOutAlt size={16} />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <span className="guest-welcome">Welcome Guest</span>
                  <Link
                    className="btn btn-outline-light btn-sm d-flex align-items-center gap-2"
                    to="/login"
                  >
                    <FaSignInAlt size={16} />
                    Login
                  </Link>
                </>
              )}
            </div>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default UserNavbar;
