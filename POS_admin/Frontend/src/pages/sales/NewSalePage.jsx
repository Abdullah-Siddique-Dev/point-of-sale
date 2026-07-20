import React, { useState } from "react";
import Sidebar from "../../components/Sidebar";
import { Form, Input, Button, InputNumber, Select, message, Space } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";

const NewSalePage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const saleNumber = `SALE-${Date.now()}`;
      const items = values.items.map((item) => ({
        ...item,
        total: item.quantity * item.price,
      }));
      const subtotal = items.reduce((sum, item) => sum + item.total, 0);
      const tax = subtotal * 0.1;
      const totalAmount = subtotal + tax - (values.discount || 0);

      const saleData = {
        saleNumber,
        storeName: values.storeName,
        customerName: values.customerName,
        customerPhone: values.customerPhone,
        items,
        subtotal,
        tax,
        discount: values.discount || 0,
        totalAmount,
        paymentMethod: values.paymentMethod,
        status: "completed",
      };

      const response = await fetch("http://localhost:5000/api/sales/add-sale", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(saleData),
      });

      if (response.ok) {
        message.success("Sale created successfully!");
        form.resetFields();
      } else {
        message.error("Failed to create sale");
      }
    } catch (error) {
      message.error("Error creating sale");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", background: "#f5f5f7", minHeight: "100vh" }}>
      <Sidebar />
      <div style={{ marginLeft: 260, width: "calc(100% - 260px)" }}>
        <div style={{ background: "white", borderBottom: "1px solid #e5e7eb", padding: "24px 40px", position: "sticky", top: 0, zIndex: 10, boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}>
          <h1 style={{ fontSize: 32, fontWeight: 700, margin: 0, color: "#111827" }}>Create New Sale</h1>
          <p style={{ fontSize: 15, color: "#6b7280", margin: "6px 0 0", fontWeight: 500 }}>Add a new sales transaction</p>
        </div>
        <div style={{ padding: 40 }}>
          <div style={{ background: "white", borderRadius: 12, border: "1px solid #e5e7eb", overflow: "hidden", boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}>
            <div style={{ padding: 32 }}>
              <Form form={form} layout="vertical" onFinish={onFinish}>
                <Form.Item label="Store Name" name="storeName"
                  rules={[{ required: true, message: "Please enter store name" }]}>
                  <Input placeholder="Enter store name" size="large" />
                </Form.Item>

                <Form.Item label="Customer Name" name="customerName"
                  rules={[{ required: true, message: "Please enter customer name" }]}>
                  <Input placeholder="Enter customer name" size="large" />
                </Form.Item>

                <Form.Item label="Customer Phone" name="customerPhone"
                  rules={[{ required: true, message: "Please enter customer phone" }]}>
                  <Input placeholder="Enter customer phone" size="large" />
                </Form.Item>

                <Form.List name="items" initialValue={[{}]}>
                  {(fields, { add, remove }) => (
                    <>
                      {fields.map(({ key, name, ...restField }) => (
                        <Space key={key} style={{ display: "flex", marginBottom: 8 }} align="baseline">
                          <Form.Item {...restField} name={[name, "productName"]}
                            rules={[{ required: true, message: "Product name required" }]}>
                            <Input placeholder="Product Name" />
                          </Form.Item>
                          <Form.Item {...restField} name={[name, "quantity"]}
                            rules={[{ required: true, message: "Quantity required" }]}>
                            <InputNumber placeholder="Qty" min={1} />
                          </Form.Item>
                          <Form.Item {...restField} name={[name, "price"]}
                            rules={[{ required: true, message: "Price required" }]}>
                            <InputNumber placeholder="Price" min={0} />
                          </Form.Item>
                          <MinusCircleOutlined onClick={() => remove(name)} />
                        </Space>
                      ))}
                      <Form.Item>
                        <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                          Add Item
                        </Button>
                      </Form.Item>
                    </>
                  )}
                </Form.List>

                <Form.Item label="Discount" name="discount">
                  <InputNumber placeholder="Enter discount" min={0} style={{ width: "100%" }} size="large" />
                </Form.Item>

                <Form.Item label="Payment Method" name="paymentMethod"
                  rules={[{ required: true, message: "Please select payment method" }]}>
                  <Select placeholder="Select payment method" size="large">
                    <Select.Option value="cash">Cash</Select.Option>
                    <Select.Option value="card">Card</Select.Option>
                    <Select.Option value="online">Online</Select.Option>
                  </Select>
                </Form.Item>

                <Form.Item>
                  <Button type="primary" htmlType="submit" loading={loading} block size="large"
                    style={{ background: "#4f46e5", borderColor: "#4f46e5", fontWeight: 600 }}>
                    Create Sale
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewSalePage;
