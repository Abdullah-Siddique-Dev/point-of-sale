import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { Spin } from "antd";
import { AppstoreOutlined, WarningOutlined, CloseCircleOutlined, DollarOutlined } from "@ant-design/icons";

const StockReportPage = () => {
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState(null);
  const [stockData, setStockData] = useState([]);
  const BASE = process.env.REACT_APP_SERVER_URL;

  const fetchReport = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE}/api/reports/stock`);
      const data = await response.json();
      
      if (data.success) {
        setSummary(data.summary);
        setStockData(data.data);
      }
    } catch (error) {
      console.error("Error fetching stock report:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchReport();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "Out of Stock":
        return { bg: '#fee2e2', color: '#991b1b' };
      case "Low Stock":
        return { bg: '#fef3c7', color: '#92400e' };
      default:
        return { bg: '#d1fae5', color: '#065f46' };
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
            Stock Report
          </h1>
          <p style={{ fontSize: 15, color: '#6b7280', margin: '6px 0 0', fontWeight: 500 }}>
            Monitor inventory levels and stock movements
          </p>
        </div>

        <div style={{ padding: 40 }}>
          {loading ? (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 400 }}>
              <Spin size="large" />
            </div>
          ) : (
            <>
              {summary && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20, marginBottom: 24 }}>
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
                        <AppstoreOutlined style={{ color: 'white', fontSize: 22 }} />
                      </div>
                      <div>
                        <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase' }}>
                          Total Products
                        </p>
                        <h3 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: '#111827' }}>
                          {summary.totalProducts}
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
                        background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <WarningOutlined style={{ color: 'white', fontSize: 22 }} />
                      </div>
                      <div>
                        <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase' }}>
                          Low Stock
                        </p>
                        <h3 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: '#111827' }}>
                          {summary.lowStockCount}
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
                        background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <CloseCircleOutlined style={{ color: 'white', fontSize: 22 }} />
                      </div>
                      <div>
                        <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase' }}>
                          Out of Stock
                        </p>
                        <h3 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: '#111827' }}>
                          {summary.outOfStockCount}
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
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <DollarOutlined style={{ color: 'white', fontSize: 22 }} />
                      </div>
                      <div>
                        <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase' }}>
                          Stock Value
                        </p>
                        <h3 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: '#111827' }}>
                          Rs {summary.totalStockValue?.toLocaleString()}
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e5e7eb', overflow: 'hidden' }}>
                <div style={{ padding: '24px 28px', borderBottom: '1px solid #e5e7eb' }}>
                  <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0, color: '#111827' }}>Stock Details</h3>
                </div>
                
                <div style={{ overflowX: 'auto' }}>
                  {stockData.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '60px 24px' }}>
                      <p style={{ color: '#6b7280', fontSize: 15 }}>No stock data found</p>
                    </div>
                  ) : (
                    <table style={{ width: "100%", fontSize: 14, borderCollapse: "collapse" }}>
                      <thead style={{ background: '#f9fafb' }}>
                        <tr>
                          <th style={{ textAlign: "left", padding: '16px 28px', color: "#6b7280", fontWeight: 700, fontSize: 12, textTransform: "uppercase" }}>Product</th>
                          <th style={{ textAlign: "left", padding: '16px 28px', color: "#6b7280", fontWeight: 700, fontSize: 12, textTransform: "uppercase" }}>Category</th>
                          <th style={{ textAlign: "center", padding: '16px 28px', color: "#6b7280", fontWeight: 700, fontSize: 12, textTransform: "uppercase" }}>Purchased</th>
                          <th style={{ textAlign: "center", padding: '16px 28px', color: "#6b7280", fontWeight: 700, fontSize: 12, textTransform: "uppercase" }}>Sold</th>
                          <th style={{ textAlign: "center", padding: '16px 28px', color: "#6b7280", fontWeight: 700, fontSize: 12, textTransform: "uppercase" }}>Available</th>
                          <th style={{ textAlign: "right", padding: '16px 28px', color: "#6b7280", fontWeight: 700, fontSize: 12, textTransform: "uppercase" }}>Price</th>
                          <th style={{ textAlign: "center", padding: '16px 28px', color: "#6b7280", fontWeight: 700, fontSize: 12, textTransform: "uppercase" }}>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stockData.map((item) => {
                          const statusStyle = getStatusColor(item.stockStatus);
                          return (
                            <tr key={item._id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                              <td style={{ padding: "16px 28px", fontWeight: 600, color: "#111827" }}>{item.productName}</td>
                              <td style={{ padding: "16px 28px", color: "#6b7280" }}>{item.category}</td>
                              <td style={{ padding: "16px 28px", textAlign: "center", fontWeight: 600, color: "#10b981" }}>{item.totalPurchased}</td>
                              <td style={{ padding: "16px 28px", textAlign: "center", fontWeight: 600, color: "#ef4444" }}>{item.totalSold}</td>
                              <td style={{ padding: "16px 28px", textAlign: "center", fontWeight: 700, color: "#111827" }}>{item.currentStock}</td>
                              <td style={{ padding: "16px 28px", textAlign: "right", fontWeight: 600, color: "#6b7280" }}>
                                Rs {item.price?.toLocaleString()}
                              </td>
                              <td style={{ padding: "16px 28px", textAlign: "center" }}>
                                <span style={{
                                  background: statusStyle.bg,
                                  color: statusStyle.color,
                                  padding: '4px 12px',
                                  borderRadius: 6,
                                  fontSize: 12,
                                  fontWeight: 600
                                }}>
                                  {item.stockStatus}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
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

export default StockReportPage;
