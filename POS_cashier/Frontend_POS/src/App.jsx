import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import DashboardPage from "./pages/DashboardPage";
import CartPage from "./pages/CartPage";
import InvoicePage from "./pages/InvoicePage";
import CustomersPage from "./pages/CustomersPage";
import StatisticPage from "./pages/StatisticPage";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import CategoryPage from "./pages/CategoryPage";
import AddCategoryPage from "./pages/AddCategoryPage";
import SubCategoryPage from "./pages/SubCategoryPage";
import AddSubCategoryPage from "./pages/AddSubCategoryPage";
import ProductPage from "./pages/ProductPage";
import AddProductPage from "./pages/AddProductPage";
import SupplierPage from "./pages/SupplierPage";
import TotalStockPage from "./pages/inventory/TotalStockPage";
import OutOfStockPage from "./pages/inventory/OutOfStockPage";
import { useSelector } from "react-redux";
import { useEffect } from "react";

function App() {
  const cart = useSelector((state) => state.cart);
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        <Route path="/" element={<RouteControl><HomePage /></RouteControl>} />
        <Route path="/dashboard" element={<RouteControl><DashboardPage /></RouteControl>} />
        <Route path="/cart" element={<RouteControl><CartPage /></RouteControl>} />
        <Route path="/invoices" element={<RouteControl><InvoicePage /></RouteControl>} />
        <Route path="/customers" element={<RouteControl><CustomersPage /></RouteControl>} />
        <Route path="/statistics" element={<RouteControl><StatisticPage /></RouteControl>} />

        <Route path="/categories" element={<AdminRoute><CategoryPage /></AdminRoute>} />
        <Route path="/categories/add" element={<AdminRoute><AddCategoryPage /></AdminRoute>} />
        <Route path="/sub-categories" element={<AdminRoute><SubCategoryPage /></AdminRoute>} />
        <Route path="/sub-categories/add" element={<AdminRoute><AddSubCategoryPage /></AdminRoute>} />
        <Route path="/products" element={<RouteControl><ProductPage /></RouteControl>} />
        <Route path="/products/add" element={<RouteControl><AddProductPage /></RouteControl>} />
        <Route path="/suppliers" element={<RouteControl><SupplierPage /></RouteControl>} />
        <Route path="/inventory/total-stock" element={<RouteControl><TotalStockPage /></RouteControl>} />
        <Route path="/inventory/out-of-stock" element={<RouteControl><OutOfStockPage /></RouteControl>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

// Cashier Route - Only cashiers can access
const RouteControl = ({ children }) => {
  const stored = localStorage.getItem("postUser");
  if (!stored) return <Navigate to="/login" />;
  const user = JSON.parse(stored);
  // If admin role, redirect to admin dashboard on same port
  if (user.role === "admin") return <Navigate to="/login" />;
  return children;
};

// Admin Route - Block cashiers from accessing admin-only pages
const AdminRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("postUser"));
  if (!user) return <Navigate to="/login" />;
  if (user.role === "cashier") return <Navigate to="/" />;
  return children;
};
