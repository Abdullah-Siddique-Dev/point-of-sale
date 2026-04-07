import { Form, Input, Button, message, Select } from "antd";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Register = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const res = await fetch(
        process.env.REACT_APP_SERVER_URL + "/api/auth/register",
        {
          method: "POST",
          body: JSON.stringify(values),
          headers: { "Content-type": "application/json; charset=UTF-8" },
        }
      );
      if (res.status === 200) {
        message.success("Registration successful");
        navigate("/login");
        setLoading(false);
      }
    } catch (error) {
      message.error("Something went wrong!");
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex" }}>
      {/* Left panel - form */}
      <div style={{ width: 420, minWidth: 380, padding: "0 48px", display: "flex", flexDirection: "column", justifyContent: "center", position: "relative", background: "#fff" }}>
        <h1 style={{ fontSize: 32, fontWeight: "bold", textAlign: "center", marginBottom: 6 }}>POS System</h1>
        <p style={{ textAlign: "center", color: "#9ca3af", fontSize: 13, marginBottom: 32 }}>Create your account</p>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item label="Username" name="userName"
            rules={[{ required: true, message: "Username field cannot be empty!" }]}>
            <Input size="large" placeholder="Enter your username" />
          </Form.Item>
          <Form.Item label="Email" name="email"
            rules={[{ required: true, message: "Email field cannot be empty!" }, { type: "email", message: "Enter a valid email!" }]}>
            <Input size="large" placeholder="Enter your email" />
          </Form.Item>
          <Form.Item label="Password" name="password"
            rules={[{ required: true, message: "Password field cannot be empty!" }]}>
            <Input.Password size="large" placeholder="Enter your password" />
          </Form.Item>
          <Form.Item label="Role" name="role" initialValue="cashier"
            rules={[{ required: true, message: "Please select a role!" }]}>
            <Select size="large">
              <Select.Option value="admin">Admin</Select.Option>
              <Select.Option value="cashier">Cashier</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Confirm Password" name="passwordAgain" dependencies={["password"]}
            rules={[
              { required: true, message: "Confirm password field cannot be empty!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("The two passwords you entered do not match!"));
                },
              }),
            ]}>
            <Input.Password size="large" placeholder="Confirm your password" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} size="large" style={{ width: "100%" }}>
              Register
            </Button>
          </Form.Item>
        </Form>
        <div style={{ position: "absolute", bottom: 32, left: 0, width: "100%", textAlign: "center", fontSize: 13, color: "#6b7280" }}>
          Already have an account?&nbsp;
          <a href="/login" style={{ color: "#6366f1" }}>Login here</a>
        </div>
      </div>
      {/* Right panel - decorative */}
      <div style={{ flex: 1, background: "#6c63ff", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", color: "#fff" }}>
        <div style={{ textAlign: "center", padding: 40 }}>
          <div style={{ fontSize: 64, marginBottom: 24 }}>🛒</div>
          <h2 style={{ fontSize: 28, fontWeight: "bold", marginBottom: 12 }}>Join Our Team</h2>
          <p style={{ fontSize: 15, opacity: 0.8, maxWidth: 320 }}>Register as a cashier or admin to start managing your sales efficiently.</p>
        </div>
      </div>
    </div>
  );
};

export default Register;
