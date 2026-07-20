import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import { Form, Input, Button, message } from "antd";

const { TextArea } = Input;

const InvoiceTextPage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [settingsId, setSettingsId] = useState(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/invoice-text/get-settings");
      const data = await response.json();
      setSettingsId(data._id);
      form.setFieldsValue({
        headerText: data.headerText,
        footerText: data.footerText,
        termsAndConditions: data.termsAndConditions,
        thankYouMessage: data.thankYouMessage,
      });
    } catch (error) {
      message.error("Failed to fetch invoice settings");
    }
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5000/api/invoice-text/update-settings/${settingsId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        }
      );
      if (response.ok) {
        message.success("Invoice text settings updated successfully!");
      } else {
        message.error("Failed to update settings");
      }
    } catch (error) {
      message.error("Error updating settings");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", background: "#f5f5f7", minHeight: "100vh" }}>
      <Sidebar />
      <div style={{ marginLeft: 260, width: "calc(100% - 260px)" }}>
        <div style={{ background: "white", borderBottom: "1px solid #e5e7eb", padding: "24px 40px", position: "sticky", top: 0, zIndex: 10, boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}>
          <h1 style={{ fontSize: 32, fontWeight: 700, margin: 0, color: "#111827" }}>Invoice Text Settings</h1>
          <p style={{ fontSize: 15, color: "#6b7280", margin: "6px 0 0", fontWeight: 500 }}>Customize invoice text and messages</p>
        </div>
        <div style={{ padding: 40 }}>
          <div style={{ background: "white", borderRadius: 12, border: "1px solid #e5e7eb", overflow: "hidden", boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}>
            <div style={{ padding: 32 }}>
              <Form form={form} layout="vertical" onFinish={onFinish}>
                <Form.Item label="Header Text" name="headerText"
                  tooltip="Text that appears at the top of the invoice">
                  <TextArea rows={3} placeholder="Enter header text for invoices" size="large" />
                </Form.Item>

                <Form.Item label="Footer Text" name="footerText"
                  tooltip="Text that appears at the bottom of the invoice">
                  <TextArea rows={3} placeholder="Enter footer text for invoices" size="large" />
                </Form.Item>

                <Form.Item label="Terms and Conditions" name="termsAndConditions"
                  tooltip="Terms and conditions for the sale">
                  <TextArea rows={4} placeholder="Enter terms and conditions" size="large" />
                </Form.Item>

                <Form.Item label="Thank You Message" name="thankYouMessage"
                  tooltip="Message to thank customers">
                  <Input placeholder="Enter thank you message" size="large" />
                </Form.Item>

                <Form.Item>
                  <Button type="primary" htmlType="submit" loading={loading} block size="large"
                    style={{ background: "#4f46e5", borderColor: "#4f46e5", fontWeight: 600 }}>
                    Save Settings
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

export default InvoiceTextPage;
