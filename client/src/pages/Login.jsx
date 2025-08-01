import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LogoImg from "../assets/logo.png"; // Ensure this is the new Star Link Center logo
import Notify from "../components/Alert";
import { login } from "../services/users";
import { setToken } from "../utils/token";
import { setCurrentUser, getCurrentUser, isLoggedIn } from "../utils/login";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const [payload, setPayload] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isLoggedIn()) {
      const user = getCurrentUser();
      console.log("User already logged in:", user);

      navigate(user?.role === "admin" ? "/admin" : "/");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      console.log("🛠️ Login Payload:", payload); // Add this line

      const { data } = await login(payload);
      console.log("✅ Login API Response:", data); // Already present, good!

      if (!data?.user) {
        setError("Invalid response from server: No user data received.");
        return;
      }

      if (!data.user.isVerified) {
        setError("Please verify your email before logging in.");
        return;
      }

      if (data?.token) {
        setToken(data.token);
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        setCurrentUser(data.user);

        console.log(
          "🎉 Token Successfully Stored:",
          localStorage.getItem("token")
        );

        setMessage("Login successful! Redirecting...");
        setTimeout(() => {
          navigate(data.user.role === "admin" ? "/admin" : "/");
        }, 2000);
      } else {
        setError("Login failed: No token received.");
      }
    } catch (e) {
      console.error("❌ Login Error:", e?.response);
      setError(e?.response?.data?.error || "Login failed, please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 login-container">
      <div className="flex align-items-center">
        <div className="col-md-4 w-100">
          <div className="card shadow">
            <div className="card-body">
              <div className="row d-flex justify-content-center align-items-center">
                <img src={LogoImg} className="login-logo" alt="Logo" />
                <h2 className="text-center mt-2">Login</h2>
                {error && <Notify msg={error} />}
                {message && <Notify variant="success" msg={message} />}
                <form className="mb-3" onSubmit={handleLogin}>
                  <div className="mb-3">
                    <label className="form-label">Email address</label>
                    <input
                      type="email"
                      className="form-control"
                      required
                      value={payload.email}
                      onChange={(e) =>
                        setPayload({ ...payload, email: e.target.value })
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Password</label>
                    <div className="input-group">
                      <input
                        type={showPassword ? "text" : "password"}
                        className="form-control"
                        required
                        value={payload.password}
                        onChange={(e) =>
                          setPayload({ ...payload, password: e.target.value })
                        }
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
                    <button
                      type="submit"
                      className="btn btn-primary btn-lg"
                      disabled={loading}
                    >
                      {loading ? "Logging in..." : "Login"}
                    </button>
                  </div>
                </form>
                <hr />
                <div className="d-flex justify-content-between">
                  <Link to="/register" className="text-decoration-none">
                    Register
                  </Link>
                  <Link to="/forget-password" className="text-decoration-none">
                    Forgot Password?
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

export default Login;
