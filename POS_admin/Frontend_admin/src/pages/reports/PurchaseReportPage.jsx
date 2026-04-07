import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { Spin, DatePicker, Select } from "antd";
import { ShoppingOutlined, TeamOutlined } from "@ant-design/icons";

const { RangePicker } = DatePicker;
const { Option } = Select;

const PurchaseReportPage = () => {
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState(null);
  const [purchaseData, setPurchaseData] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [filters, setFilters] = useState({
    startDate: null,
    endDate: null,
    supplierId: "all"
  });
  const BASE = process.env.REACT_APP_SERVER_URL;

  useEffect(() => {
    // Fetch suppliers for filter
    fetch(`${BASE}/api/suppliers/get-all`)
      .then(res => res.json())
      .then(data => setSuppliers(Array.isArray(data) ? data : []))
      .catch(err => console.error(err));
    
    fetchReport();
  }, []);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.startDate) params.append("startDate", filters.startDate);
      if (filters.endDate) params.append("endDate", filters.endDate);
      if (filters.supplierId !== "all") params.append("supplierId", filters.supplierId);

      const response = await fetch(`${BASE}/api/reports/purchase?${params.toString()}`);
      const data = await response.json();
      
      if (data.success) {
        setSummary(data.summary);
        setPurchaseData(data.data);
      }
    } catch (error) {
      console.error("Error fetching purchase report:", error);
    }
    setLoading(false);
  };

  const handleDateChange = (dates) => {
    if (dates) {
      setFilters({
        ...filters,
        startDate: dates[0].format("YYYY-MM-DD"),
        endDate: dates[1].format("YYYY-MM-DD")
      });
    } else {
      setFilters({ ...filters, startDate: null, endDate: null });
    }
  };

  return (
    <div style={{ display: "flex", background: "#f5f5f7", minHeight: "100vh" }}>
      <Sidebar />
      <div style={{ marginLeft: 260, width: "calc(100% - 260px)" }}>
        <div style={{
          background: 'white',
          borderBottom: '1px solid #e5e7eb',
          padding: '24px 40px'
        }}>
          <h1 style={{ fontSize: 32, fontWeight: 700, margin: 0, color: '#111827' }}>
            Purchase Report
          </h1>
          <p style={{ fontSize: 15, color: '#6b7280', margin: '6px 0 0', fontWeight: 500 }}>
            Track all purchase transactions and supplier performance
          </p>
        </div>

        <div style={{ padding: 40 }}>
          {/* Filters */}
          <div style={{
            background: 'white',
            borderRadius: 16,
            padding: '24px 28px',
            marginBottom: 24,
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{ flex: '1 1 300px' }}>
                <label style={{ display: 'block', marginBottom: 8, fontSize: 13, fontWeight: 600, color: '#374151' }}>
                  Date Range
                </label>
                <RangePicker 
                  onChange={handleDateChange}
                  style={{ width: '100%' }}
                  format="YYYY-MM-DD"
                />
              </div>
              
              <div style={{ flex: '1 1 250px' }}>
                <label style={{ display: 'block', marginBottom: 8, fontSize: 13, fontWeight: 600, color: '#374151' }}>
                  Supplier
                </label>
                <Select
                  value={filters.supplierId}
                  onChange={(value) => setFilters({ ...filters, supplierId: value })}
                  style={{ width: '100%' }}
                >
                  <Option value="all">All Suppliers</Option>
                  {suppliers.map(sup => (
                    <Option key={sup._id} value={sup._id}>{sup.name}</Option>
                  ))}
                </Select>
              </div>
              
              <div style={{ flex: '0 0 auto', alignSelf: 'flex-end' }}>
                <button
                  onClick={fetchReport}
                  style={{
                    padding: '10px 24px',
                    fontSize: 14,
                    fontWeight: 600,
                    color: 'white',
                    background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)',
                    border: 'none',
                    borderRadius: 8,
                    cursor: 'pointer'
                  }}
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>

          {loading ? (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 400 }}>
              <Spin size="large" />
            </div>
          ) : (
            <>
              {summary && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20, marginBottom: 24 }}>
                  <div style={{
                    background: 'white',
                    borderRadius: 12,
                    padding: 24,
                    border: '1px solid #e5e7eb'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{
                        width: 48,
                        height: 48,
                        borderRadius: 12,
                        background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <ShoppingOutlined style={{ color: 'white', fontSize: 22 }} />
                      </div>
                      <div>
                        <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase' }}>
                          Total Purchase Amount
                        </p>
                        <h3 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: '#111827' }}>
                          Rs {summary.totalPurchaseAmount?.toLocaleString()}
                        </h3>
                      </div>
                    </div>
                  </div>

                  <div style={{
                    background: 'white',
                    borderRadius: 12,
                    padding: 24,
                    border: '1px solid #e5e7eb'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{
                        width: 48,
                        height: 48,
                        borderRadius: 12,
                        background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <TeamOutlined style={{ color: 'white', fontSize: 22 }} />
                      </div>
                      <div>
                        <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase' }}>
                          Total Purchases
                        </p>
                        <h3 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: '#111827' }}>
                          {summary.totalPurchaseCount}
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e5e7eb', overflow: 'hidden' }}>
                <div style={{ padding: '24px 28px', borderBottom: '1px solid #e5e7eb' }}>
                  <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0, color: '#111827' }}>Purchase Transactions</h3>
                </div>
                
                <div style={{ overflowX: 'auto' }}>
                  {purchaseData.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '60px 24px' }}>
                      <p style={{ color: '#6b7280', fontSize: 15 }}>No purchase data found</p>
                    </div>
                  ) : (
                    <table style={{ width: "100%", fontSize: 14, borderCollapse: "collapse" }}>
                      <thead style={{ background: '#f9fafb' }}>
                        <tr>
                          <th style={{ textAlign: "left", padding: '16px 28px', color: "#6b7280", fontWeight: 700, fontSize: 12, textTransform: "uppercase" }}>Purchase ID</th>
                          <th style={{ textAlign: "left", padding: '16px 28px', color: "#6b7280", fontWeight: 700, fontSize: 12, textTransform: "uppercase" }}>Supplier</th>
                          <th style={{ textAlign: "left", padding: '16px 28px', color: "#6b7280", fontWeight: 700, fontSize: 12, textTransform: "uppercase" }}>Product</th>
                          <th style={{ textAlign: "center", padding: '16px 28px', color: "#6b7280", fontWeight: 700, fontSize: 12, textTransform: "uppercase" }}>Quantity</th>
                          <th style={{ textAlign: "right", padding: '16px 28px', color: "#6b7280", fontWeight: 700, fontSize: 12, textTransform: "uppercase" }}>Amount</th>
                          <th style={{ textAlign: "left", padding: '16px 28px', color: "#6b7280", fontWeight: 700, fontSize: 12, textTransform: "uppercase" }}>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {purchaseData.map((purchase) => (
                          <tr key={purchase._id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                            <td style={{ padding: "16px 28px", fontWeight: 600, color: "#4f46e5" }}>#{purchase._id.slice(-6)}</td>
                            <td style={{ padding: "16px 28px", fontWeight: 600, color: "#111827" }}>{purchase.supplierName}</td>
                            <td style={{ padding: "16px 28px", color: "#6b7280" }}>{purchase.productName}</td>
                            <td style={{ padding: "16px 28px", textAlign: "center", fontWeight: 600, color: "#111827" }}>{purchase.quantity}</td>
                            <td style={{ padding: "16px 28px", textAlign: "right", fontWeight: 700, color: "#111827" }}>
                              Rs {purchase.totalAmount?.toLocaleString()}
                            </td>
                            <td style={{ padding: "16px 28px", color: "#6b7280" }}>
                              {new Date(purchase.createdAt).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PurchaseReportPage;
