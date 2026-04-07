import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { Spin, Modal, Input, InputNumber, Switch, message } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";

const TaxSettingsPage = () => {
  const [taxes, setTaxes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentTax, setCurrentTax] = useState(null);
  const [formData, setFormData] = useState({
    taxName: "",
    taxPercentage: 0,
    status: true,
    description: ""
  });
  const BASE = process.env.REACT_APP_SERVER_URL;

  const fetchTaxes = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE}/api/tax/get-all`);
      const data = await response.json();
      setTaxes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching taxes:", error);
      message.error("Failed to fetch taxes");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTaxes();
  }, []);

  const handleAdd = () => {
    setEditMode(false);
    setCurrentTax(null);
    setFormData({ taxName: "", taxPercentage: 0, status: true, description: "" });
    setModalVisible(true);
  };

  const handleEdit = (tax) => {
    setEditMode(true);
    setCurrentTax(tax);
    setFormData({
      taxName: tax.taxName,
      taxPercentage: tax.taxPercentage,
      status: tax.status,
      description: tax.description || ""
    });
    setModalVisible(true);
  };

  const handleSubmit = async () => {
    if (!formData.taxName || formData.taxPercentage < 0) {
      message.error("Please fill all fields correctly");
      return;
    }

    try {
      const url = editMode 
        ? `${BASE}/api/tax/update/${currentTax._id}`
        : `${BASE}/api/tax/add`;
      
      const method = editMode ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      
      if (response.ok) {
        message.success(data.message);
        setModalVisible(false);
        fetchTaxes();
      } else {
        message.error(data.message);
      }
    } catch (error) {
      console.error("Error saving tax:", error);
      message.error("Failed to save tax");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this tax?")) return;

    try {
      const response = await fetch(`${BASE}/api/tax/delete/${id}`, {
        method: "DELETE"
      });
      const data = await response.json();
      
      if (response.ok) {
        message.success(data.message);
        fetchTaxes();
      } else {
        message.error(data.message);
      }
    } catch (error) {
      console.error("Error deleting tax:", error);
      message.error("Failed to delete tax");
    }
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
              Tax Settings
            </h1>
            <p style={{ fontSize: 15, color: '#6b7280', margin: '6px 0 0', fontWeight: 500 }}>
              Define and manage tax types for your POS system
            </p>
          </div>
          <button
            onClick={handleAdd}
            style={{
              padding: '12px 24px',
              fontSize: 14,
              fontWeight: 600,
              color: 'white',
              background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)',
              border: 'none',
              borderRadius: 8,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}
          >
            <PlusOutlined /> Add New Tax
          </button>
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
                    <p style={{ color: '#6b7280', fontSize: 15 }}>No taxes found. Click "Add New Tax" to create one.</p>
                  </div>
                ) : (
                  <table style={{ width: "100%", fontSize: 14, borderCollapse: "collapse" }}>
                    <thead style={{ background: '#f9fafb' }}>
                      <tr>
                        <th style={{ textAlign: "left", padding: '16px 28px', color: "#6b7280", fontWeight: 700, fontSize: 12, textTransform: "uppercase" }}>Tax Name</th>
                        <th style={{ textAlign: "center", padding: '16px 28px', color: "#6b7280", fontWeight: 700, fontSize: 12, textTransform: "uppercase" }}>Percentage</th>
                        <th style={{ textAlign: "left", padding: '16px 28px', color: "#6b7280", fontWeight: 700, fontSize: 12, textTransform: "uppercase" }}>Description</th>
                        <th style={{ textAlign: "center", padding: '16px 28px', color: "#6b7280", fontWeight: 700, fontSize: 12, textTransform: "uppercase" }}>Status</th>
                        <th style={{ textAlign: "center", padding: '16px 28px', color: "#6b7280", fontWeight: 700, fontSize: 12, textTransform: "uppercase" }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {taxes.map((tax) => (
                        <tr key={tax._id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                          <td style={{ padding: "16px 28px", fontWeight: 600, color: "#111827" }}>{tax.taxName}</td>
                          <td style={{ padding: "16px 28px", textAlign: "center", fontWeight: 700, color: "#4f46e5" }}>{tax.taxPercentage}%</td>
                          <td style={{ padding: "16px 28px", color: "#6b7280" }}>{tax.description || "-"}</td>
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
                            <button
                              onClick={() => handleEdit(tax)}
                              style={{
                                padding: '8px 16px',
                                marginRight: 8,
                                background: '#dbeafe',
                                color: '#1e40af',
                                border: 'none',
                                borderRadius: 6,
                                cursor: 'pointer',
                                fontWeight: 600
                              }}
                            >
                              <EditOutlined /> Edit
                            </button>
                            <button
                              onClick={() => handleDelete(tax._id)}
                              style={{
                                padding: '8px 16px',
                                background: '#fee2e2',
                                color: '#991b1b',
                                border: 'none',
                                borderRadius: 6,
                                cursor: 'pointer',
                                fontWeight: 600
                              }}
                            >
                              <DeleteOutlined /> Delete
                            </button>
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

      <Modal
        title={editMode ? "Edit Tax" : "Add New Tax"}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        okText={editMode ? "Update" : "Create"}
      >
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>Tax Name</label>
          <Input
            placeholder="e.g. GST, Service Tax, VAT"
            value={formData.taxName}
            onChange={(e) => setFormData({ ...formData, taxName: e.target.value })}
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>Tax Percentage (%)</label>
          <InputNumber
            min={0}
            max={100}
            style={{ width: '100%' }}
            value={formData.taxPercentage}
            onChange={(value) => setFormData({ ...formData, taxPercentage: value })}
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>Description (Optional)</label>
          <Input.TextArea
            rows={3}
            placeholder="Brief description of this tax"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>Status</label>
          <Switch
            checked={formData.status}
            onChange={(checked) => setFormData({ ...formData, status: checked })}
            checkedChildren="Enabled"
            unCheckedChildren="Disabled"
          />
          <p style={{ fontSize: 12, color: '#6b7280', marginTop: 8 }}>
            Only enabled taxes can be assigned to products/categories
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default TaxSettingsPage;
