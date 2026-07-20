import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import { Table, Button, Modal, Form, Select, message, Space, Popconfirm, Tag, Spin } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

const ManageSalePage = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingSale, setEditingSale] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/sales/get-all");
      const data = await response.json();
      setSales(data);
    } catch (error) {
      message.error("Failed to fetch sales");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (record) => {
    setEditingSale(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/sales/delete-sale/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        message.success("Sale deleted successfully");
        fetchSales();
      }
    } catch (error) {
      message.error("Failed to delete sale");
    }
  };

  const handleUpdate = async (values) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/sales/update-sale/${editingSale._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        }
      );
      if (response.ok) {
        message.success("Sale updated successfully");
        setIsModalVisible(false);
        fetchSales();
      }
    } catch (error) {
      message.error("Failed to update sale");
    }
  };

  const columns = [
    { title: "Sale Number", dataIndex: "saleNumber", key: "saleNumber" },
    { title: "Store Name", dataIndex: "storeName", key: "storeName" },
    { title: "Customer", dataIndex: "customerName", key: "customerName" },
    { title: "Total Amount", dataIndex: "totalAmount", key: "totalAmount",
      render: (amount) => `Rs ${amount.toFixed(2)}` },
    { title: "Payment Method", dataIndex: "paymentMethod", key: "paymentMethod" },
    {
      title: "Status", dataIndex: "status", key: "status",
      render: s => <Tag color={s === "completed" ? "#10b981" : s === "pending" ? "#f59e0b" : "#ef4444"}>{s}</Tag>
    },
    {
      title: "Actions", key: "actions",
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Popconfirm title="Are you sure to delete this sale?" onConfirm={() => handleDelete(record._id)}
            okText="Yes" cancelText="No">
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ display: "flex", background: "#f5f5f7", minHeight: "100vh" }}>
      <Sidebar />
      <div style={{ marginLeft: 260, width: "calc(100% - 260px)" }}>
        <div style={{ background: "white", borderBottom: "1px solid #e5e7eb", padding: "24px 40px", position: "sticky", top: 0, zIndex: 10, boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}>
          <h1 style={{ fontSize: 32, fontWeight: 700, margin: 0, color: "#111827" }}>Manage Sales</h1>
          <p style={{ fontSize: 15, color: "#6b7280", margin: "6px 0 0", fontWeight: 500 }}>View and manage all sales transactions</p>
        </div>
        <div style={{ padding: 40 }}>
          <div style={{ background: "white", borderRadius: 12, border: "1px solid #e5e7eb", overflow: "hidden", boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}>
            <div style={{ padding: 32 }}>
              {loading ? <div style={{ textAlign: "center", padding: 60 }}><Spin size="large" /></div> : (
                <Table columns={columns} dataSource={sales} rowKey="_id" pagination={{ pageSize: 10 }} />
              )}
            </div>
          </div>
        </div>
      </div>

      <Modal title="Edit Sale" open={isModalVisible} onCancel={() => setIsModalVisible(false)} footer={null}>
        <Form form={form} layout="vertical" onFinish={handleUpdate}>
          <Form.Item label="Status" name="status">
            <Select size="large">
              <Select.Option value="completed">Completed</Select.Option>
              <Select.Option value="pending">Pending</Select.Option>
              <Select.Option value="cancelled">Cancelled</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large"
              style={{ background: "#4f46e5", borderColor: "#4f46e5", fontWeight: 600 }}>
              Update Sale
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ManageSalePage;
