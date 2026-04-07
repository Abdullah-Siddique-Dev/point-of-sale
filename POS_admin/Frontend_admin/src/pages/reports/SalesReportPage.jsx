import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { Spin, DatePicker, Select } from "antd";
import { DollarOutlined, ShoppingOutlined, CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";

const { RangePicker } = DatePicker;
const { Option } = Select;

const SalesReportPage = () => {
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState(null);
  const [salesData, setSalesData] = useState([]);
  const [filters, setFilters] = useState({
    startDate: null,
    endDate: null,
    paymentMode: "all",
    status: "all"
  });
  const BASE = process.env.REACT_APP_SERVER_URL;

  const fetchReport = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.startDate) params.append("startDate", filters.startDate);
      if (filters.endDate) params.append("endDate", filters.endDate);
      if (filters.paymentMode !== "all") params.append("paymentMode", filters.paymentMode);
      if (filters.status !== "all") params.append("status", filters.status);

      const response = await fetch(`${BASE}/api/reports/sales?${params.toString()}`);
      const data = await response.json();
      
      if (data.success) {
        setSummary(data.summary);
        setSalesData(data.data);
      }
    } catch (error) {
      console.error("Error fetching sales report:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchReport();
  }, []);

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
        {/* Header */}
        <div style={{
          background: 'white',
          borderBottom: '1px solid #e5e7eb',
          padding: '24px 40px'
        }}>
          <h1 style={{ fontSize: 32, fontWeight: 700, margin: 0, color: '#111827' }}>
            Sales Report
          </h1>
          <p style={{ fontSize: 15, color: '#6b7280', margin: '6px 0 0', fontWeight: 500 }}>
            Comprehensive sales analytics and performance metrics
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
              
              <div style={{ flex: '1 1 200px' }}>
                <label style={{ display: 'block', marginBottom: 8, fontSize: 13, fontWeight: 600, color: '#374151' }}>
                  Payment Mode
                </label>
                <Select
                  value={filters.paymentMode}
                  onChange={(value) => setFilters({ ...filters, paymentMode: value })}
                  style={{ width: '100%' }}
                >
                  <Option value="all">All</Option>
                  <Option value="Cash">Cash</Option>
                  <Option value="Card">Card</Option>
                </Select>
              </div>
              
              <div style={{ flex: '1 1 200px' }}>
                <label style={{ display: 'block', marginBottom: 8, fontSize: 13, fontWeight: 600, color: '#374151' }}>
                  Status
                </label>
                <Select
                  value={filters.status}
                  onChange={(value) => setFilters({ ...filters, status: value })}
                  style={{ width: '100%' }}
                >
                  <Option value="all">All</Option>
                  <Option value="Delivered">Delivered</Option>
                  <Option value="Pending">Pending</Option>
                  <Option value="Refunded">Refunded</Option>
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
                    cursor: 'pointer',
                    transition: 'all 0.3s'
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
              {/* Summary Cards */}
              {summary && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20, marginBottom: 24 }}>
                  <div style={{
                    background: 'white',
                    borderRadius: 12,
                    padding: 24,
                    border: '1px solid #e5e7eb'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                      <div style={{
                        width: 48,
                        height: 48,
                        borderRadius: 12,
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <DollarOutlined style={{ color: 'white', fontSize: 22 }} />
                      </div>
                      <div>
                        <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase' }}>
                          Total Sales
                        </p>
                        <h3 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: '#111827' }}>
                          Rs {summary.totalSales?.toLocaleString()}
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                      <div style={{
                        width: 48,
                        height: 48,
                        borderRadius: 12,
                        background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <ShoppingOutlined style={{ color: 'white', fontSize: 22 }} />
                      </div>
                      <div>
                        <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase' }}>
                          Total Invoices
                        </p>
                        <h3 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: '#111827' }}>
                          {summary.totalInvoices}
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                      <div style={{
                        width: 48,
                        height: 48,
                        borderRadius: 12,
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <CheckCircleOutlined style={{ color: 'white', fontSize: 22 }} />
                      </div>
                      <div>
                        <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase' }}>
                          Delivered
                        </p>
                        <h3 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: '#111827' }}>
                          {summary.statusCount?.delivered || 0}
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                      <div style={{
                        width: 48,
                        height: 48,
                        borderRadius: 12,
                        background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <CloseCircleOutlined style={{ color: 'white', fontSize: 22 }} />
                      </div>
                      <div>
                        <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase' }}>
                          Refunded
                        </p>
                        <h3 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: '#111827' }}>
                          {summary.statusCount?.refunded || 0}
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Sales Table */}
              <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e5e7eb', overflow: 'hidden' }}>
                <div style={{ padding: '24px 28px', borderBottom: '1px solid #e5e7eb' }}>
                  <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0, color: '#111827' }}>Sales Transactions</h3>
                  <p style={{ fontSize: 13, color: '#6b7280', margin: '4px 0 0' }}>Detailed list of all sales</p>
                </div>
                
                <div style={{ overflowX: 'auto' }}>
                  {salesData.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '60px 24px' }}>
                      <p style={{ color: '#6b7280', fontSize: 15 }}>No sales data found</p>
                    </div>
                  ) : (
                    <table style={{ width: "100%", fontSize: 14, borderCollapse: "collapse" }}>
                      <thead style={{ background: '#f9fafb' }}>
                        <tr>
                          <th style={{ textAlign: "left", padding: '16px 28px', color: "#6b7280", fontWeight: 700, fontSize: 12, textTransform: "uppercase" }}>Order ID</th>
                          <th style={{ textAlign: "left", padding: '16px 28px', color: "#6b7280", fontWeight: 700, fontSize: 12, textTransform: "uppercase" }}>Customer</th>
                          <th style={{ textAlign: "left", padding: '16px 28px', color: "#6b7280", fontWeight: 700, fontSize: 12, textTransform: "uppercase" }}>Phone</th>
                          <th style={{ textAlign: "left", padding: '16px 28px', color: "#6b7280", fontWeight: 700, fontSize: 12, textTransform: "uppercase" }}>Payment</th>
                          <th style={{ textAlign: "left", padding: '16px 28px', color: "#6b7280", fontWeight: 700, fontSize: 12, textTransform: "uppercase" }}>Status</th>
                          <th style={{ textAlign: "right", padding: '16px 28px', color: "#6b7280", fontWeight: 700, fontSize: 12, textTransform: "uppercase" }}>Amount</th>
                          <th style={{ textAlign: "left", padding: '16px 28px', color: "#6b7280", fontWeight: 700, fontSize: 12, textTransform: "uppercase" }}>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {salesData.map((sale, index) => (
                          <tr key={sale._id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                            <td style={{ padding: "16px 28px", fontWeight: 600, color: "#4f46e5" }}>#{sale._id.slice(-6)}</td>
                            <td style={{ padding: "16px 28px", fontWeight: 600, color: "#111827" }}>{sale.customerName}</td>
                            <td style={{ padding: "16px 28px", color: "#6b7280" }}>{sale.customerPhoneNumber}</td>
                            <td style={{ padding: "16px 28px" }}>
                              <span style={{
                                background: sale.paymentMode === 'Cash' ? '#dbeafe' : '#fef3c7',
                                color: sale.paymentMode === 'Cash' ? '#1e40af' : '#92400e',
                                padding: '4px 12px',
                                borderRadius: 6,
                                fontSize: 12,
                                fontWeight: 600
                              }}>
                                {sale.paymentMode}
                              </span>
                            </td>
                            <td style={{ padding: "16px 28px" }}>
                              <span style={{
                                background: sale.status === 'Delivered' ? '#d1fae5' : sale.status === 'Refunded' ? '#fee2e2' : '#fef3c7',
                                color: sale.status === 'Delivered' ? '#065f46' : sale.status === 'Refunded' ? '#991b1b' : '#92400e',
                                padding: '4px 12px',
                                borderRadius: 6,
                                fontSize: 12,
                                fontWeight: 600
                              }}>
                                {sale.status}
                              </span>
                            </td>
                            <td style={{ padding: "16px 28px", textAlign: "right", fontWeight: 700, color: "#111827" }}>
                              Rs {sale.totalAmount?.toLocaleString()}
                            </td>
                            <td style={{ padding: "16px 28px", color: "#6b7280" }}>
                              {new Date(sale.createdAt).toLocaleDateString()}
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

export default SalesReportPage;
