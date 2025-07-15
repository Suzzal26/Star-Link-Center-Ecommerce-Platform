import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { BASE_URL } from "../../constants";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState("");
  const [sortOption, setSortOption] = useState("date-desc");
  const token = localStorage.getItem("access_token");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${BASE_URL}/api/v1/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrders(data);
    } catch (error) {
      console.error("❌ Failed to load orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (id, status) => {
    try {
      await axios.patch(
        `${BASE_URL}/api/v1/orders/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchOrders();
    } catch (err) {
      console.error(`❌ Failed to update order status:`, err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    let result = [...orders];

    if (filterStatus) {
      result = result.filter((o) => o.status === filterStatus);
    }

    result.sort((a, b) => {
      if (sortOption === "date-desc") return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortOption === "date-asc") return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortOption === "name-asc") return a.userId?.name.localeCompare(b.userId?.name);
      if (sortOption === "name-desc") return b.userId?.name.localeCompare(a.userId?.name);
      if (sortOption === "amount-asc") return a.totalAmount - b.totalAmount;
      if (sortOption === "amount-desc") return b.totalAmount - a.totalAmount;
      return 0;
    });

    return result;
  }, [orders, filterStatus, sortOption]);

  return (
    <div className="container py-5">
      <h2 className="mb-4">📝 All Customer Orders</h2>

      {/* Filter + Sort UI */}
      <div className="d-flex justify-content-between mb-3">
        <select
          className="form-select w-auto"
          onChange={(e) => setFilterStatus(e.target.value)}
          value={filterStatus}
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <select
          className="form-select w-auto"
          onChange={(e) => setSortOption(e.target.value)}
          value={sortOption}
        >
          <option value="date-desc">Newest First</option>
          <option value="date-asc">Oldest First</option>
          <option value="name-asc">Customer Name (A-Z)</option>
          <option value="name-desc">Customer Name (Z-A)</option>
          <option value="amount-asc">Amount (Low to High)</option>
          <option value="amount-desc">Amount (High to Low)</option>
        </select>
      </div>

      {loading ? (
        <p>Loading orders...</p>
      ) : filteredOrders.length === 0 ? (
        <div className="alert alert-warning">No orders found.</div>
      ) : (
        <table className="table table-bordered table-hover">
          <thead className="table-light">
            <tr>
              <th>#</th>
              <th>User</th>
              <th>Total</th>
              <th>Address</th>
              <th>Payment</th>
              <th>Status</th>
              <th>Items</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order, index) => (
              <tr key={order._id}>
                <td>{index + 1}</td>
                <td>
                  {order.userId?.name}
                  <br />
                  <small>{order.userId?.email}</small>
                </td>
                <td>Rs. {order.totalAmount}</td>
                <td>
                  {order.shippingAddress?.address}, {order.shippingAddress?.city}
                  <br />
                  <small>{order.shippingAddress?.phone}</small>
                </td>
                <td>{order.paymentMethod}</td>
                <td>
                  <span
                    className={`badge bg-${
                      order.status === "pending"
                        ? "warning"
                        : order.status === "confirmed"
                        ? "success"
                        : order.status === "delivered"
                        ? "info"
                        : "secondary"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td>
                  <ul className="list-unstyled small">
                    {order.items.map((item, i) => (
                      <li key={i}>
                        {item.name} x {item.quantity}
                      </li>
                    ))}
                  </ul>
                </td>
                <td>
                  {order.status === "pending" ? (
                    <>
                      <button
                        className="btn btn-sm btn-success me-2"
                        onClick={() => updateOrderStatus(order._id, "confirmed")}
                      >
                        Confirm
                      </button> <br />
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => updateOrderStatus(order._id, "cancelled")}
                      >
                        Cancel
                      </button>
                    </>
                  ) : order.status === "confirmed" ? (
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => updateOrderStatus(order._id, "delivered")}
                    >
                      Mark as Delivered
                    </button>
                  ) : (
                    <span className="text-muted small">No actions</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Orders;
