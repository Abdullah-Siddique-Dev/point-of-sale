import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import NewSalePage from "./pages/sales/NewSalePage";
import ManageSalePage from "./pages/sales/ManageSalePage";
import PosSalePage from "./pages/sales/PosSalePage";
import InvoiceTextPage from "./pages/sales/InvoiceTextPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/sales/new" element={<NewSalePage />} />
        <Route path="/sales/manage" element={<ManageSalePage />} />
        <Route path="/sales/pos" element={<PosSalePage />} />
        <Route path="/sales/invoice-text" element={<InvoiceTextPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
