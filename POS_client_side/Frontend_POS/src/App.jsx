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
      </Routes>
    </BrowserRouter>
  );
}

export default App;

// Redirect to login if not logged in
export const RouteControl = ({ children }) => {
  if (localStorage.getItem("postUser")) return children;
  return <Navigate to="/login" />;
};

// Allow if no role set (old accounts) or role is admin; block only explicit cashier
export const AdminRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("postUser"));
  if (!user) return <Navigate to="/login" />;
  if (user.role === "cashier") return <Navigate to="/" />;
  return children;
};
