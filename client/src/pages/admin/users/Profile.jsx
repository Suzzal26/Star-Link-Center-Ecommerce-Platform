import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getCurrentUser, isLoggedIn } from "../../../utils/login";
import { removeToken } from "../../../utils/token";
import axios from "axios";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import AddressMapPicker from "../../../components/AddressMapPicker"; // ✅ Add this

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({ contactNumber: "" });
  const [mapData, setMapData] = useState({ address: "", lat: null, lng: null }); // ✅ Holds address and coords
  const [changed, setChanged] = useState(false);
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!isLoggedIn()) {
        navigate("/login");
        return;
      }

      const userData = getCurrentUser();
      try {
        const response = await axios.get(
          `http://localhost:5000/api/v1/users/${userData.id}`
        );
        setUser(response.data);
        setFormData({
          contactNumber: response.data.contactNumber || "",
        });

        setMapData({
          address: response.data.address || "",
          lat: response.data.lat || null,
          lng: response.data.lng || null,
        });

        fetchUserOrders();
      } catch (error) {
        console.error("❌ Error fetching user profile:", error);
        alert("Failed to load profile.");
      }
    };

    const fetchUserOrders = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/v1/orders/my-orders`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setOrders(res.data);
      } catch (err) {
        console.error("❌ Failed to load orders:", err);
      }
    };

    fetchUserProfile();
  }, [navigate, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      setChanged(
        updated.contactNumber !== user.contactNumber ||
          mapData.address !== user.address
      );
      return updated;
    });
  };

  const handleUpdate = async () => {
    try {
      const payload = {
        ...formData,
        address: mapData.address,
        lat: mapData.lat,
        lng: mapData.lng,
      };

      const res = await axios.put(
        `http://localhost:5000/api/v1/users/${user._id}`,
        payload
      );
      console.log("✅ Profile updated:", res.data);
      alert("Profile updated successfully!");

      setUser((prev) => ({
        ...prev,
        ...formData,
        address: mapData.address,
        lat: mapData.lat,
        lng: mapData.lng,
      }));
      setChanged(false);
    } catch (error) {
      console.error("❌ Failed to update profile:", error);
      alert("Failed to update profile.");
    }
  };

  const handleLogout = () => {
    removeToken();
    localStorage.removeItem("currentUser");
    navigate("/login");
  };

  if (!user) return <h2>Loading profile...</h2>;

  return (
    <div className="container profile-container">
      {/* Profile content directly, no Tabs/navbar */}
      <h2>Welcome, {user.name || "User"}!</h2>
      <p>
        <strong>Email:</strong> {user.email}
      </p>

      {/* ✅ Address Map Picker */}
      <div className="mb-3">
        <label>
          <strong>Location:</strong>
        </label>
        <AddressMapPicker value={mapData} onChange={setMapData} />
      </div>

      {/* ✅ Contact Number */}
      <div className="mb-3">
        <label>
          <strong>Contact Number:</strong>
        </label>
        <input
          type="text"
          name="contactNumber"
          className="form-control"
          value={formData.contactNumber}
          onChange={handleChange}
          placeholder="Enter contact number"
        />
      </div>

      <p>
        <strong>Email Verified:</strong> {user.isVerified ? "✅ Yes" : "❌ No"}
      </p>

      {changed && (
        <button className="btn btn-success mt-2" onClick={handleUpdate}>
          Update Profile
        </button>
      )}

      <h3 className="mt-4">Order History</h3>
      {orders.length > 0 ? (
        <table className="table table-striped table-bordered mt-3">
          <thead className="table-light">
            <tr>
              <th>#</th>
              <th>Date</th>
              <th>Status</th>
              <th>Amount</th>
              <th>Items</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, idx) => (
              <tr key={order._id}>
                <td>{idx + 1}</td>
                <td>{new Date(order.createdAt).toLocaleString()}</td>
                <td>
                  <span
                    className={`badge bg-${
                      order.status === "confirmed"
                        ? "success"
                        : order.status === "pending"
                        ? "warning"
                        : order.status === "cancelled"
                        ? "secondary"
                        : order.status === "delivered"
                        ? "info"
                        : "dark"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td>Rs. {order.totalAmount}</td>
                <td>
                  <ul className="list-unstyled small mb-0">
                    {order.items.map((item, i) => (
                      <li key={i}>
                        {item.productId ? (
                          <Link to={`/products/${item.productId}`}>
                            {item.name}
                          </Link>
                        ) : (
                          <span>Product unavailable</span>
                        )}{" "}
                        × {item.quantity}
                      </li>
                    ))}
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-muted">You have not placed any orders yet.</p>
      )}

      <div className="button-group mt-3">
        <button
          className="btn btn-secondary me-2"
          onClick={() => navigate("/")}
        >
          Back to Home
        </button>
        <button className="btn btn-danger" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
