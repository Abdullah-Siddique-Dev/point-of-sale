import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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
import SupplierPage from "./pages/SupplierPage";
import AddSupplierPage from "./pages/AddSupplierPage";
import PurchaseStockReportPage from "./pages/purchase/StockReportPage";
import AddPurchasePage from "./pages/purchase/AddPurchasePage";
import PurchaseInvoicesPage from "./pages/purchase/PurchaseInvoicesPage";
import PurchaseSummaryPage from "./pages/purchase/PurchaseSummaryPage";
import PurchaseReturnsPage from "./pages/purchase/PurchaseReturnsPage";
import AddPurchaseReturnPage from "./pages/purchase/AddPurchaseReturnPage";
import TotalStockPage from "./pages/inventory/TotalStockPage";
import OutOfStockPage from "./pages/inventory/OutOfStockPage";
import StockAlertPage from "./pages/inventory/StockAlertPage";
import SalesReportPage from "./pages/reports/SalesReportPage";
import PurchaseReportPage from "./pages/reports/PurchaseReportPage";
import StockReportPage from "./pages/reports/StockReportPage";
import ManageTaxPage from "./pages/tax/ManageTaxPage";
import TaxSettingsPage from "./pages/tax/TaxSettingsPage";
import TaxAssignmentPage from "./pages/tax/TaxAssignmentPage";

const PrivateRoute = ({ children }) => {
  const user = localStorage.getItem("superAdmin");
  if (!user) {
    return <Navigate to="/login" />;
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
        <Route path="/suppliers" element={<PrivateRoute><SupplierPage /></PrivateRoute>} />
        <Route path="/suppliers/add" element={<PrivateRoute><AddSupplierPage /></PrivateRoute>} />
        <Route path="/purchase/stock" element={<PrivateRoute><PurchaseStockReportPage /></PrivateRoute>} />
        <Route path="/purchase/add" element={<PrivateRoute><AddPurchasePage /></PrivateRoute>} />
        <Route path="/purchase/invoices" element={<PrivateRoute><PurchaseInvoicesPage /></PrivateRoute>} />
        <Route path="/purchase/summary" element={<PrivateRoute><PurchaseSummaryPage /></PrivateRoute>} />
        <Route path="/purchase/returns" element={<PrivateRoute><PurchaseReturnsPage /></PrivateRoute>} />
        <Route path="/purchase/returns/add" element={<PrivateRoute><AddPurchaseReturnPage /></PrivateRoute>} />
        <Route path="/inventory/total-stock" element={<PrivateRoute><TotalStockPage /></PrivateRoute>} />
        <Route path="/inventory/out-of-stock" element={<PrivateRoute><OutOfStockPage /></PrivateRoute>} />
        <Route path="/inventory/alerts" element={<PrivateRoute><StockAlertPage /></PrivateRoute>} />
        <Route path="/reports/sales" element={<PrivateRoute><SalesReportPage /></PrivateRoute>} />
        <Route path="/reports/purchase" element={<PrivateRoute><PurchaseReportPage /></PrivateRoute>} />
        <Route path="/reports/stock" element={<PrivateRoute><StockReportPage /></PrivateRoute>} />
        <Route path="/tax" element={<PrivateRoute><ManageTaxPage /></PrivateRoute>} />
        <Route path="/tax/settings" element={<PrivateRoute><TaxSettingsPage /></PrivateRoute>} />
        <Route path="/tax/assignments" element={<PrivateRoute><TaxAssignmentPage /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
