import { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { CartContext } from "../contexts/CartContext";
import { getCurrentUser } from "../utils/login";
import { placeOrder } from "../api/orderService";
import { BASE_URL } from "../constants";
import AddressMapPicker from "../components/AddressMapPicker"; // ✅ Make sure this path is correct
import "./Checkout.css";

const DELIVERY_FEE = 100;

const Checkout = () => {
  const { cart, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  const token = localStorage.getItem("access_token");
  const currentUser = getCurrentUser();
  const [user, setUser] = useState(null);
  const [mapData, setMapData] = useState({ address: "", lat: null, lng: null });
  const [loading, setLoading] = useState(false);

  const subtotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart]
  );
  const total = subtotal + DELIVERY_FEE;

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    (async () => {
      try {
        const { data } = await axios.get(
          `${BASE_URL}/api/v1/users/${currentUser.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setUser(data);
        setMapData({
          address: data.address || "",
          lat: data.lat || null,
          lng: data.lng || null,
        });
      } catch (err) {
        console.error("❌ Failed to load user:", err);
      }
    })();
  }, [currentUser, navigate, token]);

  const handlePlaceOrder = async () => {
    if (!mapData.address) {
      alert("Please select a delivery address.");
      return;
    }

    const orderData = {
      items: cart.map((item) => ({
        productId: item._id || item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
      shippingAddress: {
        name: user?.name,
        phone: user?.contactNumber || "Not Provided",
        address: mapData.address,
        city: mapData.address,
        lat: mapData.lat,
        lng: mapData.lng,
      },
      totalAmount: total,
      paymentMethod: "COD",
    };

    try {
      setLoading(true);
      await placeOrder(orderData, token);
      alert("✅ Order placed successfully!");
      clearCart();
      navigate("/orders-success");
    } catch (err) {
      console.error("❌ Order failed:", err);
      alert(err.response?.data?.error || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelCheckout = () => {
    if (window.confirm("Are you sure you want to cancel this order?")) {
      clearCart();
      navigate("/cart");
    }
  };

  const handleUnavailable = () =>
    alert("❌ Online Payment is currently unavailable.");

  if (cart.length === 0) {
    return (
      <div className="checkout-container">
        <h2>Checkout</h2>
        <p>
          Your cart is empty. Go to{" "}
          <span className="products-link" onClick={() => navigate("/products")}>
            Products
          </span>
        </p>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <h1>Checkout</h1>

      <div className="checkout-content p-4">
        {/* ─────── User Info ─────── */}
        <h4>User Information</h4>
        <p>
          <strong>Name:</strong> {user?.name || "Not Available"}
        </p>
        <p>
          <strong>Email:</strong> {user?.email || "Not Available"}
        </p>
        <p>
          <strong>Phone:</strong> {user?.contactNumber || "Not Provided"}
        </p>

        {/* ─────── Cart Items ─────── */}
        <hr className="my-4" />
        <h4>Items in Your Order</h4>
        <ul>
          {cart.map((item, idx) => (
            <li key={`${item.id}-${idx}`} className="checkout-item">
              <img
                src={item.image}
                alt={item.name}
                className="checkout-image"
              />
              <div>
                <h3>{item.name}</h3>
                <p>Price: Rs. {item.price}</p>
                <p>Quantity: {item.quantity}</p>
              </div>
            </li>
          ))}
        </ul>

        {/* ─────── Address Picker ─────── */}
        <div className="mt-4">
          <label>
            <strong>Delivery Address:</strong>
          </label>
          <AddressMapPicker value={mapData} onChange={setMapData} />
        </div>

        {/* ─────── Summary ─────── */}
        <div className="checkout-summary mt-4">
          <p>Subtotal: Rs. {subtotal.toFixed(2)}</p>
          <p>Delivery Fee: Rs. {DELIVERY_FEE}</p>
          <hr />
          <h3>Total: Rs. {total.toFixed(2)}</h3>
        </div>

        {/* ─────── Buttons ─────── */}
        <div className="d-flex justify-content-center gap-3 mt-4">
          <button
            className="btn btn-success"
            onClick={handlePlaceOrder}
            disabled={loading}
          >
            {loading ? "Placing Order..." : "Cash on Delivery (COD)"}
          </button>

          <button className="btn btn-danger" onClick={handleUnavailable}>
            Online Payment (Unavailable)
          </button>

          <button
            className="btn btn-outline-secondary"
            onClick={handleCancelCheckout}
          >
            Cancel Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
