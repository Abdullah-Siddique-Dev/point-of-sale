import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import { Table, Button, Modal, Form, Input, InputNumber, Select, message, Space, Popconfirm } from "antd";
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
    {
      title: "Sale Number",
      dataIndex: "saleNumber",
      key: "saleNumber",
    },
    {
      title: "Store Name",
      dataIndex: "storeName",
      key: "storeName",
    },
    {
      title: "Customer",
      dataIndex: "customerName",
      key: "customerName",
    },
    {
      title: "Total Amount",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (amount) => `$${amount.toFixed(2)}`,
    },
    {
      title: "Payment Method",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Popconfirm
            title="Are you sure to delete this sale?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Layout>
      <h1 style={{ marginBottom: "24px" }}>Manage Sales</h1>
      <Table
        columns={columns}
        dataSource={sales}
        loading={loading}
        rowKey="_id"
      />

      <Modal
        title="Edit Sale"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleUpdate}>
          <Form.Item label="Status" name="status">
            <Select>
              <Select.Option value="completed">Completed</Select.Option>
              <Select.Option value="pending">Pending</Select.Option>
              <Select.Option value="cancelled">Cancelled</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Update Sale
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
};

export default ManageSalePage;
