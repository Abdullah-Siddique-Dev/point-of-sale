import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import { Form, Input, Button, Card, message } from "antd";

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
    <Layout>
      <Card title="Invoice Text Settings">
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Header Text"
            name="headerText"
            tooltip="Text that appears at the top of the invoice"
          >
            <TextArea
              rows={3}
              placeholder="Enter header text for invoices"
            />
          </Form.Item>

          <Form.Item
            label="Footer Text"
            name="footerText"
            tooltip="Text that appears at the bottom of the invoice"
          >
            <TextArea
              rows={3}
              placeholder="Enter footer text for invoices"
            />
          </Form.Item>

          <Form.Item
            label="Terms and Conditions"
            name="termsAndConditions"
            tooltip="Terms and conditions for the sale"
          >
            <TextArea
              rows={4}
              placeholder="Enter terms and conditions"
            />
          </Form.Item>

          <Form.Item
            label="Thank You Message"
            name="thankYouMessage"
            tooltip="Message to thank customers"
          >
            <Input placeholder="Enter thank you message" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Save Settings
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </Layout>
  );
};

export default InvoiceTextPage;
