import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { Spin, Modal, Select, message } from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";

const { Option } = Select;

const TaxAssignmentPage = () => {
  const [assignments, setAssignments] = useState([]);
  const [taxes, setTaxes] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    assignmentType: "product",
    productId: null,
    categoryName: null,
    taxId: null
  });
  const BASE = process.env.REACT_APP_SERVER_URL;

  const fetchData = async () => {
    setLoading(true);
    try {
      const [assignmentsRes, taxesRes, productsRes, categoriesRes] = await Promise.all([
        fetch(`${BASE}/api/tax/assignments/get-all`),
        fetch(`${BASE}/api/tax/get-all`),
        fetch(`${BASE}/api/products/get-all`),
        fetch(`${BASE}/api/categories/get-all`)
      ]);

      const assignmentsData = await assignmentsRes.json();
      const taxesData = await taxesRes.json();
      const productsData = await productsRes.json();
      const categoriesData = await categoriesRes.json();

      setAssignments(Array.isArray(assignmentsData) ? assignmentsData : []);
      setTaxes(Array.isArray(taxesData) ? taxesData.filter(t => t.status) : []);
      setProducts(Array.isArray(productsData) ? productsData : []);
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error("Failed to fetch data");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdd = () => {
    setFormData({
      assignmentType: "product",
      productId: null,
      categoryName: null,
      taxId: null
    });
    setModalVisible(true);
  };

  const handleSubmit = async () => {
    if (!formData.taxId) {
      message.error("Please select a tax");
      return;
    }

    if (formData.assignmentType === "product" && !formData.productId) {
      message.error("Please select a product");
      return;
    }

    if (formData.assignmentType === "category" && !formData.categoryName) {
      message.error("Please select a category");
      return;
    }

    try {
      let productName = null;
      if (formData.assignmentType === "product") {
        const product = products.find(p => p._id === formData.productId);
        productName = product?.title;
      }

      const response = await fetch(`${BASE}/api/tax/assignments/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          productName
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        message.success(data.message);
        setModalVisible(false);
        fetchData();
      } else {
        message.error(data.message);
      }
    } catch (error) {
      console.error("Error creating assignment:", error);
      message.error("Failed to create assignment");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this assignment?")) return;

    try {
      const response = await fetch(`${BASE}/api/tax/assignments/delete/${id}`, {
        method: "DELETE"
      });
      const data = await response.json();
      
      if (response.ok) {
        message.success(data.message);
        fetchData();
      } else {
        message.error(data.message);
      }
    } catch (error) {
      console.error("Error deleting assignment:", error);
      message.error("Failed to delete assignment");
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
              Tax Assignment
            </h1>
            <p style={{ fontSize: 15, color: '#6b7280', margin: '6px 0 0', fontWeight: 500 }}>
              Assign taxes to products or categories
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
            <PlusOutlined /> Assign Tax
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
                {assignments.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '60px 24px' }}>
                    <p style={{ color: '#6b7280', fontSize: 15 }}>No tax assignments found. Click "Assign Tax" to create one.</p>
                  </div>
                ) : (
                  <table style={{ width: "100%", fontSize: 14, borderCollapse: "collapse" }}>
                    <thead style={{ background: '#f9fafb' }}>
                      <tr>
                        <th style={{ textAlign: "left", padding: '16px 28px', color: "#6b7280", fontWeight: 700, fontSize: 12, textTransform: "uppercase" }}>Type</th>
                        <th style={{ textAlign: "left", padding: '16px 28px', color: "#6b7280", fontWeight: 700, fontSize: 12, textTransform: "uppercase" }}>Product/Category</th>
                        <th style={{ textAlign: "left", padding: '16px 28px', color: "#6b7280", fontWeight: 700, fontSize: 12, textTransform: "uppercase" }}>Tax Name</th>
                        <th style={{ textAlign: "center", padding: '16px 28px', color: "#6b7280", fontWeight: 700, fontSize: 12, textTransform: "uppercase" }}>Tax %</th>
                        <th style={{ textAlign: "center", padding: '16px 28px', color: "#6b7280", fontWeight: 700, fontSize: 12, textTransform: "uppercase" }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {assignments.map((assignment) => (
                        <tr key={assignment._id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                          <td style={{ padding: "16px 28px" }}>
                            <span style={{
                              background: assignment.assignmentType === 'product' ? '#dbeafe' : '#fef3c7',
                              color: assignment.assignmentType === 'product' ? '#1e40af' : '#92400e',
                              padding: '4px 12px',
                              borderRadius: 6,
                              fontSize: 12,
                              fontWeight: 600,
                              textTransform: 'capitalize'
                            }}>
                              {assignment.assignmentType}
                            </span>
                          </td>
                          <td style={{ padding: "16px 28px", fontWeight: 600, color: "#111827" }}>
                            {assignment.assignmentType === 'product' ? assignment.productName : assignment.categoryName}
                          </td>
                          <td style={{ padding: "16px 28px", color: "#6b7280" }}>{assignment.taxName}</td>
                          <td style={{ padding: "16px 28px", textAlign: "center", fontWeight: 700, color: "#4f46e5" }}>
                            {assignment.taxPercentage}%
                          </td>
                          <td style={{ padding: "16px 28px", textAlign: "center" }}>
                            <button
                              onClick={() => handleDelete(assignment._id)}
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
                              <DeleteOutlined /> Remove
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
        title="Assign Tax"
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        okText="Assign"
      >
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>Assignment Type</label>
          <Select
            style={{ width: '100%' }}
            value={formData.assignmentType}
            onChange={(value) => setFormData({ ...formData, assignmentType: value, productId: null, categoryName: null })}
          >
            <Option value="product">Product</Option>
            <Option value="category">Category</Option>
          </Select>
        </div>

        {formData.assignmentType === "product" ? (
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>Select Product</label>
            <Select
              style={{ width: '100%' }}
              placeholder="Choose a product"
              value={formData.productId}
              onChange={(value) => setFormData({ ...formData, productId: value })}
              showSearch
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
              }
            >
              {products.map(product => (
                <Option key={product._id} value={product._id}>{product.title}</Option>
              ))}
            </Select>
          </div>
        ) : (
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>Select Category</label>
            <Select
              style={{ width: '100%' }}
              placeholder="Choose a category"
              value={formData.categoryName}
              onChange={(value) => setFormData({ ...formData, categoryName: value })}
            >
              {categories.map(category => (
                <Option key={category._id} value={category.title}>{category.title}</Option>
              ))}
            </Select>
          </div>
        )}

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>Select Tax</label>
          <Select
            style={{ width: '100%' }}
            placeholder="Choose a tax"
            value={formData.taxId}
            onChange={(value) => setFormData({ ...formData, taxId: value })}
          >
            {taxes.map(tax => (
              <Option key={tax._id} value={tax._id}>
                {tax.taxName} ({tax.taxPercentage}%)
              </Option>
            ))}
          </Select>
        </div>
      </Modal>
    </div>
  );
};

export default TaxAssignmentPage;
