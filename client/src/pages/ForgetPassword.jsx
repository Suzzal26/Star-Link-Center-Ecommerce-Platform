import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import LogoImg from "../assets/logo.png"; // Ensure this is the new Star Link Center logo
import Notify from "../components/Alert";
import { generateFPToken } from "../services/users";
import "./ForgetPassword.css";

const ForgetPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let timer;
    if (error || message) {
      timer = setTimeout(() => {
        setError("");
        setMessage("");
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [error, message]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const { data } = await generateFPToken({ email });

      if (data?.message) {
        setMessage("OTP sent to your email. Redirecting...");

        setTimeout(() => {
          navigate("/reset-password", { state: { email } });
        }, 3000); // Redirect after 3 seconds
      }
    } catch (e) {
      console.error("❌ Forgot Password Error:", e?.response);
      setError(
        e?.response?.data?.error || "Failed to generate token. Try again."
      );
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 fp-container">
      <div className="flex align-items-center">
        <div className="col-md-4 w-100">
          <div className="card shadow">
            <div className="card-body">
              <div className="row d-flex justify-content-center align-items-center">
                <img src={LogoImg} className="fp-logo" alt="Logo" />
                <h2 className="text-center mt-2">Forgot Password</h2>

                {error && <Notify msg={error} />}
                {message && <Notify variant="success" msg={message} />}

                <form className="mb-3" onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Email address</label>
                    <input
                      type="email"
                      className="form-control"
                      value={email}
                      required
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <div className="form-text">
                      A 6-digit OTP will be sent to your email.
                    </div>
                  </div>
                  <div className="d-grid col-6 mx-auto">
                    <button type="submit" className="btn btn-primary btn-lg">
                      Generate OTP
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

export default ForgetPassword;
