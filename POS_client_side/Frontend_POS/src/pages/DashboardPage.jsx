import { useEffect, useState } from "react";
import Sidebar from "../components/sidebar/Sidebar";
import { Spin } from "antd";
import { UserOutlined, ShoppingOutlined, AppstoreOutlined, DollarOutlined } from "@ant-design/icons";

const StatCard = ({ title, value, icon, color, bg }) => (
  <div className="bg-white rounded-xl shadow p-5 flex items-center justify-between">
    <div>
      <p className="text-gray-500 text-sm mb-1">{title}</p>
      <h2 className="text-3xl font-bold text-gray-800">{value}</h2>
    </div>
    <div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl" style={{ background: bg, color }}>
      {icon}
    </div>
  </div>
);

const DashboardPage = () => {
  const [products, setProducts] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("postUser"));

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [prodRes, invRes] = await Promise.all([
          fetch(process.env.REACT_APP_SERVER_URL + "/api/products/get-all"),
          fetch(process.env.REACT_APP_SERVER_URL + "/api/invoices/get-all"),
        ]);
        const prodData = await prodRes.json();
        const invData = await invRes.json();
        setProducts(prodData);
        setInvoices(invData);
      } catch (err) {
        console.log(err);
      }
      setLoading(false);
    };
    fetchAll();
  }, []);

  const totalRevenue = invoices.reduce((sum, inv) => sum + (inv.totalAmount || 0), 0);

  // unique customers by phone number
  const uniqueCustomers = new Set(invoices.map((inv) => inv.customerPhoneNumber)).size;

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar />
      <div style={{ marginLeft: "220px", width: "calc(100% - 220px)" }}>
        <div className="bg-white border-b px-6 py-3 flex items-center justify-between sticky top-0 z-10 shadow-sm">
          <div>
            <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>
            <p className="text-xs text-gray-400">Welcome back, {user?.username || "Admin"}</p>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <UserOutlined />
            <span className="text-sm font-medium">{user?.username || "Admin"}</span>
          </div>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="flex justify-center items-center h-64"><Spin size="large" /></div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
                <StatCard
                  title="Total Products"
                  value={products.length}
                  icon={<AppstoreOutlined />}
                  color="#6366f1"
                  bg="#ede9fe"
                />
                <StatCard
                  title="Total Orders"
                  value={invoices.length}
                  icon={<ShoppingOutlined />}
                  color="#ec4899"
                  bg="#fce7f3"
                />
                <StatCard
                  title="Total Customers"
                  value={uniqueCustomers}
                  icon={<UserOutlined />}
                  color="#10b981"
                  bg="#d1fae5"
                />
                <StatCard
                  title="Total Revenue"
                  value={`Rs ${totalRevenue.toLocaleString()}`}
                  icon={<DollarOutlined />}
                  color="#f59e0b"
                  bg="#fef3c7"
                />
              </div>

              {/* Recent Orders */}
              <div className="bg-white rounded-xl shadow p-5">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Recent Orders</h3>
                {invoices.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">No orders yet</p>
                ) : (
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-gray-500 border-b">
                        <th className="pb-2">Customer</th>
                        <th className="pb-2">Phone</th>
                        <th className="pb-2">Payment</th>
                        <th className="pb-2">Amount</th>
                        <th className="pb-2">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoices.slice(-5).reverse().map((inv) => (
                        <tr key={inv._id} className="border-b last:border-0 hover:bg-gray-50">
                          <td className="py-2">{inv.customerName}</td>
                          <td className="py-2">{inv.customerPhoneNumber}</td>
                          <td className="py-2">{inv.paymentMode}</td>
                          <td className="py-2 font-medium text-green-600">Rs {inv.totalAmount}</td>
                          <td className="py-2 text-gray-400">{inv.createdAt?.substring(0, 10)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
