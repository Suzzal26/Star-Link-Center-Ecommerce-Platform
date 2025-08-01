import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Notify from "../components/Alert";

const VerifyEmail = () => {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");

    if (!token) {
      setError("Invalid verification link.");
      setLoading(false);
      return;
    }

    const verify = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/v1/auth/verify-email/${token}`);
        
        if (data && data.message) {
          setMessage(data.message);
        } else {
          setMessage("Email verified successfully!");
        }

        setError(""); // ✅ clear error if success
        setTimeout(() => navigate("/login"), 3000);
      } catch (err) {
        const errMsg =
          err.response?.data?.error ||
          err.response?.data?.message ||
          "Verification failed. Token may be expired.";
        setError(errMsg);
        setMessage(""); // ✅ clear message if error
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, [location, navigate]);

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="col-md-6 col-lg-4">
        <div className="card shadow">
          <div className="card-body text-center">
            <h2 className="mb-3">Email Verification</h2>

            {loading && (
              <div className="alert alert-info">Verifying token...</div>
            )}

            {!loading && error && (
              <Notify variant="danger" msg={error} />
            )}

            {!loading && !error && message && (
              <Notify variant="success" msg={message} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
