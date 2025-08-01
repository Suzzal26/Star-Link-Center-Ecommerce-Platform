import { Routes, Route } from "react-router-dom";

import UserLayout from "./layouts/UserLayout";
import AdminLayout from "./layouts/AdminLayout";

import Home from "./pages/Home";
import Login from "./pages/Login";
import ForgetPassword from "./pages/ForgetPassword";
import Register from "./pages/Register";
import VerifyPassword from "./pages/VerifyPassword";
import VerifyEmail from "./pages/VerifyEmail";
import NotFound from "./pages/NotFound";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Repairing from "./pages/Repairing";
import OrdersSuccess from "./pages/OrdersSuccess";

import SearchResults from "./pages/SearchResults";
import ResetPassword from "./pages/ResetPassword";

// Admin Pages
import ProductList from "./pages/admin/products/List";
import ProductAdd from "./pages/admin/products/Add";
import ProductEdit from "./pages/admin/products/Edit";
import UserList from "./pages/admin/users/List";
import Profile from "./pages/admin/users/Profile";
import UserDetail from "./pages/admin/users/Detail";
import UserAdd from "./pages/admin/users/Add";
import Orders from "./pages/admin/Orders";
import Sales from "./pages/admin/Sales";

import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/forget-password" element={<ForgetPassword />} />
      <Route path="/verify-password" element={<VerifyPassword />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-email" element={<VerifyEmail />} />

      {/* User Routes with Navbar */}
      <Route path="/" element={<UserLayout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="products" element={<Products />} />
        <Route path="products/:id" element={<ProductDetail />} />
        <Route path="cart" element={<Cart />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="repairing" element={<Repairing />} />
        <Route path="contact" element={<Contact />} />
        <Route path="/orders-success" element={<OrdersSuccess />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="search" element={<SearchResults />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route
          index
          element={
            <PrivateRoute roles={["admin"]}>
              <ProductList />
            </PrivateRoute>
          }
        />
        <Route
          path="products"
          element={
            <PrivateRoute roles={["admin"]}>
              <ProductList />
            </PrivateRoute>
          }
        />
        <Route
          path="products/add"
          element={
            <PrivateRoute roles={["admin"]}>
              <ProductAdd />
            </PrivateRoute>
          }
        />
        <Route
          path="products/edit/:id"
          element={
            <PrivateRoute roles={["admin"]}>
              <ProductEdit />
            </PrivateRoute>
          }
        />
        <Route
          path="users"
          element={
            <PrivateRoute roles={["admin"]}>
              <UserList />
            </PrivateRoute>
          }
        />
        <Route
          path="users/add"
          element={
            <PrivateRoute roles={["admin"]}>
              <UserAdd />
            </PrivateRoute>
          }
        />
        <Route
          path="users/:id"
          element={
            <PrivateRoute roles={["admin"]}>
              <UserDetail />
            </PrivateRoute>
          }
        />
        <Route
          path="profile"
          element={
            <PrivateRoute roles={["admin", "user"]}>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="orders"
          element={
            <PrivateRoute roles={["admin"]}>
              <Orders />
            </PrivateRoute>
          }
        />
        <Route
          path="sales"
          element={
            <PrivateRoute roles={["admin"]}>
              <Sales />
            </PrivateRoute>
          }
        />
      </Route>

      {/* Error Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
