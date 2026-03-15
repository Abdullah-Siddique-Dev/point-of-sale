import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Login from "./pages/auth/Login";
import DashboardPage from "./pages/DashboardPage";
import InvoicePage from "./pages/InvoicePage";
import CustomersPage from "./pages/CustomersPage";
import CategoryPage from "./pages/CategoryPage";
import AddCategoryPage from "./pages/AddCategoryPage";
import SubCategoryPage from "./pages/SubCategoryPage";
import AddSubCategoryPage from "./pages/AddSubCategoryPage";
import ProductPage from "./pages/ProductPage";
import AddProductPage from "./pages/AddProductPage";
import StatisticsPage from "./pages/StatisticsPage";

// Extract user from URL BEFORE anything renders
const extractUserFromUrl = () => {
  try {
    const params = new URLSearchParams(window.location.search);
    const user = params.get("user");
    if (user) {
      localStorage.setItem("superAdmin", decodeURIComponent(user));
      // Remove ?user=... from URL immediately
      window.history.replaceState({}, "", window.location.pathname);
    }
  } catch (e) {}
};

// Run immediately on module load — before any component renders
extractUserFromUrl();

const PrivateRoute = ({ children }) => {
  const user = localStorage.getItem("superAdmin");
  if (!user) {
    window.location.href = "http://localhost:3000/login";
    return null;
  }
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
        <Route path="/invoices" element={<PrivateRoute><InvoicePage /></PrivateRoute>} />
        <Route path="/customers" element={<PrivateRoute><CustomersPage /></PrivateRoute>} />
        <Route path="/categories" element={<PrivateRoute><CategoryPage /></PrivateRoute>} />
        <Route path="/categories/add" element={<PrivateRoute><AddCategoryPage /></PrivateRoute>} />
        <Route path="/sub-categories" element={<PrivateRoute><SubCategoryPage /></PrivateRoute>} />
        <Route path="/sub-categories/add" element={<PrivateRoute><AddSubCategoryPage /></PrivateRoute>} />
        <Route path="/products" element={<PrivateRoute><ProductPage /></PrivateRoute>} />
        <Route path="/products/add" element={<PrivateRoute><AddProductPage /></PrivateRoute>} />
        <Route path="/statistics" element={<PrivateRoute><StatisticsPage /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
