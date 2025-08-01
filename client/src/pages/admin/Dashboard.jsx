import { useEffect, useState } from "react";
import { getAdminDashboard } from "../../services/adminService";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [data, setData] = useState(null); // ✅ Keeps track of dashboard data

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAdminDashboard();
        setData(response.data); // ✅ Saves API response in state
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="container mt-4">
      <h2>Admin Dashboard</h2>
      
      {/* ✅ Display fetched data */}
      {data ? (
        <div className="mb-3">
          <p><strong>Total Products:</strong> {data.totalProducts}</p>
          <p><strong>Total Orders:</strong> {data.totalOrders}</p>
          <p><strong>Total Users:</strong> {data.totalUsers}</p>
        </div>
      ) : (
        <p>Loading dashboard data...</p>
      )}

      <div className="row">
        <div className="col-md-4">
          <Link to="/admin/products" className="btn btn-primary">
            Manage Products
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
