import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { Spin, message } from "antd";
import { useNavigate } from "react-router-dom";

const ManageTaxPage = () => {
  const [taxes, setTaxes] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const BASE = process.env.REACT_APP_SERVER_URL;

  const fetchData = async () => {
    setLoading(true);
    try {
      const [taxesRes, assignmentsRes] = await Promise.all([
        fetch(`${BASE}/api/tax/get-all`),
        fetch(`${BASE}/api/tax/assignments/get-all`)
      ]);
      
      const taxesData = await taxesRes.json();
      const assignmentsData = await assignmentsRes.json();
      
      setTaxes(Array.isArray(taxesData) ? taxesData : []);
      setAssignments(Array.isArray(assignmentsData) ? assignmentsData : []);
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error("Failed to fetch data");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getAssignmentCount = (taxId) => {
    return assignments.filter(a => a.taxId === taxId).length;
  };

  return (
    <div style={{ display: "flex", background: "#f5f5f7", minHeight: "100vh" }}>
      <Sidebar />
      <div style={{ marginLeft: 260, width: "calc(100% - 260px)" }}>
        <div style={{
          background: 'white',
          borderBottom: '1px solid #e5e7eb',
          padding: '24px 40px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h1 style={{ fontSize: 32, fontWeight: 700, margin: 0, color: '#111827' }}>
              Manage Taxes
            </h1>
            <p style={{ fontSize: 15, color: '#6b7280', margin: '6px 0 0', fontWeight: 500 }}>
              Overview of all taxes and their assignments
            </p>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button
              onClick={() => navigate('/admin/tax/settings')}
              style={{
                padding: '12px 24px',
                fontSize: 14,
                fontWeight: 600,
                color: '#4f46e5',
                background: 'white',
                border: '2px solid #4f46e5',
                borderRadius: 8,
                cursor: 'pointer'
              }}
            >
              Tax Settings
            </button>
            <button
              onClick={() => navigate('/admin/tax/assignments')}
              style={{
                padding: '12px 24px',
                fontSize: 14,
                fontWeight: 600,
                color: 'white',
                background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)',
                border: 'none',
                borderRadius: 8,
                cursor: 'pointer'
              }}
            >
              Assign Taxes
            </button>
          </div>
        </div>

        <div style={{ padding: 40 }}>
          {loading ? (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 400 }}>
              <Spin size="large" />
            </div>
          ) : (
            <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e5e7eb', overflow: 'hidden' }}>
              <div style={{ overflowX: 'auto' }}>
                {taxes.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '60px 24px' }}>
                    <p style={{ color: '#6b7280', fontSize: 15 }}>No taxes found. Go to Tax Settings to create one.</p>
                  </div>
                ) : (
                  <table style={{ width: "100%", fontSize: 14, borderCollapse: "collapse" }}>
                    <thead style={{ background: '#f9fafb' }}>
                      <tr>
                        <th style={{ textAlign: "left", padding: '16px 28px', color: "#6b7280", fontWeight: 700, fontSize: 12, textTransform: "uppercase" }}>Tax Name</th>
                        <th style={{ textAlign: "center", padding: '16px 28px', color: "#6b7280", fontWeight: 700, fontSize: 12, textTransform: "uppercase" }}>Percentage</th>
                        <th style={{ textAlign: "center", padding: '16px 28px', color: "#6b7280", fontWeight: 700, fontSize: 12, textTransform: "uppercase" }}>Status</th>
                        <th style={{ textAlign: "center", padding: '16px 28px', color: "#6b7280", fontWeight: 700, fontSize: 12, textTransform: "uppercase" }}>Assignments</th>
                      </tr>
                    </thead>
                    <tbody>
                      {taxes.map((tax) => (
                        <tr key={tax._id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                          <td style={{ padding: "16px 28px", fontWeight: 600, color: "#111827" }}>{tax.taxName}</td>
                          <td style={{ padding: "16px 28px", textAlign: "center", fontWeight: 700, color: "#4f46e5" }}>{tax.taxPercentage}%</td>
                          <td style={{ padding: "16px 28px", textAlign: "center" }}>
                            <span style={{
                              background: tax.status ? '#d1fae5' : '#fee2e2',
                              color: tax.status ? '#065f46' : '#991b1b',
                              padding: '4px 12px',
                              borderRadius: 6,
                              fontSize: 12,
                              fontWeight: 600
                            }}>
                              {tax.status ? 'Enabled' : 'Disabled'}
                            </span>
                          </td>
                          <td style={{ padding: "16px 28px", textAlign: "center" }}>
                            <span style={{
                              background: '#f3f4f6',
                              color: '#111827',
                              padding: '6px 14px',
                              borderRadius: 8,
                              fontSize: 13,
                              fontWeight: 700
                            }}>
                              {getAssignmentCount(tax._id)} Products/Categories
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageTaxPage;
