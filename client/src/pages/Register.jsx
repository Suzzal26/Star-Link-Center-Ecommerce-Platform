import { useRef, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import LogoImg from "../assets/logo.png"; // Ensure this is the new Star Link Center logo
import Notify from "../components/Alert";
import { register } from "../services/users";
import AddressMapPicker from "../components/AddressMapPicker";
import "./Register.css";

const Register = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [locationData, setLocationData] = useState(null);
  const registerForm = useRef();

  // ✅ Auto-clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timeout = setTimeout(() => setError(""), 5000);
      return () => clearTimeout(timeout);
    }
  }, [error]);

  const validatePassword = (password) => {
    // Minimum 8 chars, at least 1 uppercase, 1 lowercase, 1 number, 1 special char
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    const form = registerForm.current;
    const formData = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      password: form.password.value,
      contactNumber: form.contactNumber.value.trim(),
      address: locationData?.address || "",
      lat: locationData?.lat,
      lng: locationData?.lng,
    };

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Invalid email format.");
      setLoading(false);
      return;
    }

    if (!validatePassword(formData.password)) {
      setError(
        "Password must be at least 8 characters, include uppercase, lowercase, number, and special character."
      );
      setLoading(false);
      return;
    }

    const phoneRegex = /^(98|97)\d{8}$/;
    if (!phoneRegex.test(formData.contactNumber)) {
      setError(
        "Invalid contact number. Must be a 10-digit Nepal number starting with 98 or 97."
      );
      setLoading(false);
      return;
    }

    const valid =
      formData.address.includes("Kathmandu") ||
      formData.address.includes("Lalitpur") ||
      formData.address.includes("Bhaktapur");

    if (!formData.address || !formData.lat || !formData.lng || !valid) {
      setError("Please select a valid address within Kathmandu Valley.");
      setLoading(false);
      return;
    }

    try {
      const { data } = await register(formData);
      if (!data || !data.message) throw new Error("Invalid server response");

      setMessage(data.message || "Registration successful!");
      setTimeout(() => navigate("/login"), 3000);
    } catch (e) {
      const errorMsg =
        e.response?.data?.error ||
        e.response?.data?.message ||
        e.message ||
        "Something went wrong.";
      setError(errorMsg);
    } finally {
      setLoading(false);
      setTimeout(() => {
        setMessage("");
      }, 5000);
    }
  };

  return (
    <div className="register-container">
      <div className="register-form-wrapper">
        <div className="card shadow">
          <div className="card-body">
            <div className="text-center">
              <img src={LogoImg} className="register-logo" alt="Logo" />
              <h2 className="mt-2">Register</h2>
            </div>

            {error && <Notify msg={error} />}
            {message && <Notify variant="success" msg={message} />}

            <form className="mt-3" ref={registerForm} onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Email address</label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Password</label>
                <div className="input-group">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control"
                    name="password"
                    required
                  />
                  <span
                    className="input-group-text password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <i
                      className={`fa ${
                        showPassword ? "fa-eye-slash" : "fa-eye"
                      }`}
                    ></i>
                  </span>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Contact Number (Nepal)</label>
                <input
                  type="text"
                  className="form-control"
                  name="contactNumber"
                  placeholder="98XXXXXXXX"
                  required
                />
              </div>

              <div className="mb-3">
                <AddressMapPicker
                  value={locationData}
                  onChange={setLocationData}
                />
              </div>

              <div className="d-grid col-6 mx-auto mt-3">
                <button
                  type="submit"
                  className="btn btn-primary btn-lg"
                  disabled={loading}
                >
                  {loading ? "Registering..." : "Register"}
                </button>
              </div>
            </form>

            <hr />
            <div className="text-center">
              <Link to="/login" className="text-decoration-none">
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
