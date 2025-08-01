import { useContext } from "react";
import { CartContext } from "../contexts/CartContext";
import { Link, useNavigate } from "react-router-dom";
import { isLoggedIn } from "../utils/login"; // ✅ Ensure this exists
import "./Cart.css";

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, clearCart } =
    useContext(CartContext);
  const navigate = useNavigate();

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleCheckout = () => {
    if (!isLoggedIn()) {
      alert("Please log in to proceed to checkout.");
      navigate("/login");
    } else {
      console.log("Navigating to /checkout");
      navigate("/checkout");
    }
  };

  return (
    <div className="cart-container">
      <h1>Your Shopping Cart</h1>
      {cart.length === 0 ? (
        <p className="empty-cart">
          Your cart is empty. <Link to="/products">Shop Now</Link>
        </p>
      ) : (
        <div className="cart-content">
          <ul>
            {cart.map((item, index) => (
              <li key={`${item.id}-${index}`} className="cart-item">
                <img src={item.image} alt={item.name} className="cart-image" />
                <h3>{item.name}</h3>
                <p>Price: Rs. {item.price}</p>
                <div className="quantity-control">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>
                <button
                  className="remove-btn"
                  onClick={() => removeFromCart(item.id)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>

          {/* ✅ Subtotal Display */}
          <div className="cart-total">
            Total Amount: Rs. {subtotal.toFixed(2)}
          </div>

          <div className="cart-actions">
            <button className="clear-btn" onClick={clearCart}>
              Clear Cart
            </button>
            <button className="checkout-btn" onClick={handleCheckout}>
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
