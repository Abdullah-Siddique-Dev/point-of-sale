import { Form, Input, Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // If already logged in (redirected from cashier side), go straight to dashboard
  useEffect(() => {
    if (localStorage.getItem("superAdmin")) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const res = await fetch(process.env.REACT_APP_SERVER_URL + "/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email: values.email, password: values.password }),
        headers: { "Content-type": "application/json; charset=UTF-8" },
      });
      const data = await res.json();
      if (res.status === 200) {
        const userData = { username: data.userName, email: data.email, role: data.role || "admin" };
        localStorage.setItem("superAdmin", JSON.stringify(userData));
        message.success("Login successful!");
        navigate("/dashboard");
      } else if (res.status === 403) {
        message.error("Invalid Password!");
      } else if (res.status === 404) {
        message.error("User Not Found!");
      } else {
        message.error("Login failed!");
      }
    } catch (error) {
      message.error("Something went wrong!");
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex" }}>
      {/* Left panel - form */}
      <div style={{ width: 420, minWidth: 380, padding: "0 48px", display: "flex", flexDirection: "column", justifyContent: "center", position: "relative", background: "#fff" }}>
        <h1 style={{ fontSize: 32, fontWeight: "bold", textAlign: "center", marginBottom: 6 }}>POS System</h1>
        <p style={{ textAlign: "center", color: "#9ca3af", fontSize: 13, marginBottom: 32 }}>Sign in as Admin or Cashier</p>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item label="Email" name="email"
            rules={[{ required: true, message: "Email cannot be empty!" }, { type: "email", message: "Enter a valid email!" }]}>
            <Input size="large" placeholder="Enter your email" />
          </Form.Item>
          <Form.Item label="Password" name="password"
            rules={[{ required: true, message: "Password cannot be empty!" }]}>
            <Input.Password size="large" placeholder="Enter your password" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} size="large" style={{ width: "100%" }}>
              Login
            </Button>
          </Form.Item>
        </Form>
        <div style={{ position: "absolute", bottom: 32, left: 0, width: "100%", textAlign: "center", fontSize: 13, color: "#6b7280" }}>
          Go to Cashier side:&nbsp;
          <a href="http://localhost:3000/register" style={{ color: "#6366f1" }}>Register here</a>
        </div>
      </div>
      {/* Right panel - decorative */}
      <div style={{ flex: 1, background: "#6c63ff", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", color: "#fff" }}>
        <div style={{ textAlign: "center", padding: 40 }}>
          <div style={{ fontSize: 64, marginBottom: 24 }}>🛒</div>
          <h2 style={{ fontSize: 28, fontWeight: "bold", marginBottom: 12 }}>Admin Panel</h2>
          <p style={{ fontSize: 15, opacity: 0.8, maxWidth: 320 }}>Manage your products, categories, orders and customers from one place.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
