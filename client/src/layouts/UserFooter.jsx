import { Link } from "react-router-dom";
import {
  FaFacebook,
  FaInstagram,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
} from "react-icons/fa";
import Logo from "../assets/logo.png"; // Ensure this is the new Star Link Center logo
import { categories } from "../constants";
import "./UserFooter.css";

const UserFooter = () => {
  const productCategories = Object.keys(categories);

  return (
    <footer className="footer-container">
      <div className="container">
        <div className="row">
          {/* Column 1: About */}
          <div className="col-lg-3 col-md-6 mb-4">
            <div className="footer-about">
              <img src={Logo} alt="Star Link Center" className="footer-logo" />
              <p>
                Your trusted partner for IT solutions, repairs, and maintenance
                services in Kathmandu Valley.
              </p>
              <div className="social-icons">
                <a
                  href="https://www.facebook.com/centeryourit/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaFacebook />
                </a>
                <a
                  href="https://www.instagram.com/your.itcenter/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaInstagram />
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="col-lg-2 col-md-6 mb-4">
            <h5 className="footer-title">Quick Links</h5>
            <ul className="footer-links">
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/about">About Us</Link>
              </li>
              <li>
                <Link to="/products">All Products</Link>
              </li>
              <li>
                <Link to="/repairing">Repair Services</Link>
              </li>
              <li>
                <Link to="/contact">Contact</Link>
              </li>
              <li>
                <Link to="/cart">Shopping Cart</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Product Categories */}
          <div className="col-lg-3 col-md-6 mb-4">
            <h5 className="footer-title">Product Categories</h5>
            <ul className="footer-links">
              {productCategories.map((cat) => (
                <li key={cat}>
                  <Link to={`/products?category=${cat}`}>{cat}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact Info */}
          <div className="col-lg-4 col-md-6 mb-4">
            <h5 className="footer-title">Contact Information</h5>
            <ul className="footer-contact">
              <li>
                <FaMapMarkerAlt />
                <span>Kathmandu, Nepal</span>
              </li>
              <li>
                <FaPhoneAlt />
                <div>
                  <a href="tel:01-5713548">01-5713548</a>,{" "}
                  <a href="tel:9851154402">9851154402</a>
                </div>
              </li>
              <li>
                <FaEnvelope />
                <a href="mailto:info@youritcenter.com">info@youritcenter.com</a>
              </li>
            </ul>
            <div className="business-hours">
              <h6>Business Hours</h6>
              <p>Sunday - Friday: 10:00 AM - 7:00 PM</p>
              <p>Saturday: Closed</p>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-12 text-center footer-bottom">
            <p>
              &copy; {new Date().getFullYear()} Star Link Center. All rights
              reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default UserFooter;
