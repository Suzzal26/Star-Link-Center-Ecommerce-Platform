import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../constants";
import { getISOWeek } from "date-fns";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

const Sales = () => {
  const [salesData, setSalesData] = useState([]);
  const [deliveredOrders, setDeliveredOrders] = useState([]);
  const [selectedWeek, setSelectedWeek] = useState(null);
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const { data } = await axios.get(`${BASE_URL}/api/v1/orders/sales`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSalesData(data.weeklySales);
        setDeliveredOrders(data.deliveredProducts);
      } catch (err) {
        console.error("❌ Failed to fetch sales data:", err);
      }
    };

    fetchSalesData();
  }, [token]);

const filtered = selectedWeek
  ? deliveredOrders.filter((order) => getISOWeek(new Date(order.createdAt)) === parseInt(selectedWeek))
  : deliveredOrders;


  return (
    <div className="container py-4">
      <h2>📊 Weekly Sales Report</h2>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={salesData.map((entry) => ({
            week: `Week ${entry._id}`,
            total: entry.total,
          }))}
          onClick={({ activeLabel }) => {
  const clickedWeek = activeLabel?.split(" ")[1];
  setSelectedWeek((prev) => (prev === clickedWeek ? null : clickedWeek));
}}

          margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="week" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="total" fill="#0d6efd" />
        </BarChart>
      </ResponsiveContainer>

      <h4 className="mt-4">
        📦 Delivered Items {selectedWeek && `(Filtered: Week ${selectedWeek})`}
      </h4>

      <table className="table table-striped table-bordered mt-3">
        <thead className="table-light">
          <tr>
            <th>User</th>
            <th>Product</th>
            <th>Quantity</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {filtered.flatMap((order) =>
            order.items.map((item, index) => (
              <tr key={`${order._id}-${index}`}>
                <td>{order.userId?.name}</td>
                <td>{item.name}</td>
                <td>{item.quantity}</td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Sales;
