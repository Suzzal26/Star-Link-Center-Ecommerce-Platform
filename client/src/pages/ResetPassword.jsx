import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import LogoImg from "../assets/logo.png"; // Ensure this is the new Star Link Center logo
import Notify from "../components/Alert";
import { resetPassword } from "../services/users";
import "./ResetPassword.css";

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";

  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!email) {
      navigate("/forgot-password"); // 🚨 Redirect if email is missing
    }
  }, [email, navigate]);

  useEffect(() => {
    let timer;
    if (message || error) {
      timer = setTimeout(() => {
        setMessage("");
        setError("");
      }, 4000);
    }
    return () => clearTimeout(timer);
  }, [message, error]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const { data } = await resetPassword({ email, otp, newPassword });
      if (data?.message) {
        setMessage("Password reset successful. Redirecting to login...");

        setTimeout(() => {
          navigate("/login");
        }, 3000);
      }
    } catch (e) {
      console.error("❌ Reset Password Error:", e?.response);
      setError(
        e?.response?.data?.error || "Failed to reset password. Try again."
      );
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 rp-container">
      <div className="flex align-items-center">
        <div className="col-md-4 w-100">
          <div className="card shadow">
            <div className="card-body">
              <div className="row d-flex justify-content-center align-items-center">
                <img src={LogoImg} className="rp-logo" alt="Logo" />
                <h2 className="text-center mt-2">Reset Password</h2>

                {error && <Notify msg={error} />}
                {message && <Notify variant="success" msg={message} />}

                <form className="mb-3" onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">OTP</label>
                    <input
                      type="text"
                      className="form-control"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">New Password</label>
                    <div className="input-group">
                      <input
                        type={showPassword ? "text" : "password"}
                        className="form-control"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
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

                  <div className="d-grid col-6 mx-auto">
                    <button type="submit" className="btn btn-primary btn-lg">
                      Reset Password
                    </button>
                  </div>
                </form>

                <hr />
                <div className="d-flex justify-content-center">
                  <Link to="/login" className="text-decoration-none">
                    Back to Login
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
