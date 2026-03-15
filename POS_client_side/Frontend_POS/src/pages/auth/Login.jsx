import { Button, Form, Input, Carousel, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import AuthCarousel from "../../components/auth/AuthCarousel";
import { useState } from "react";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const res = await fetch(
        process.env.REACT_APP_SERVER_URL + "/api/auth/login",
        {
          method: "POST",
          body: JSON.stringify(values),
          headers: { "Content-type": "application/json; charset=UTF-8" },
        }
      );
      const user = await res.json();

      if (res.status === 200) {
        const userData = {
          username: user.userName,
          email: user.email,
          role: user.role || "admin",
        };

        if (userData.role === "admin") {
          localStorage.setItem("superAdmin", JSON.stringify(userData));
          localStorage.setItem("postUser", JSON.stringify(userData));
          message.success("Login successful — redirecting to Admin Panel...");
          setTimeout(() => {
            const encoded = encodeURIComponent(JSON.stringify(userData));
            window.location.href = `http://localhost:3001/dashboard?user=${encoded}`;
          }, 800);
        } else {
          localStorage.setItem("postUser", JSON.stringify(userData));
          message.success("Login successful");
          navigate("/");
        }
      } else if (res.status === 403) {
        message.error("Invalid Password!");
      } else if (res.status === 404) {
        message.error("User Not Found!");
      }
    } catch (error) {
      message.error("Something went wrong!");
    }
    setLoading(false);
  };

  return (
    <div className="h-screen">
      <div className="flex justify-between h-full">
        <div className="xl:w-2/6 min-w-[400px] xl:px-20 px-10 flex flex-col justify-center w-full relative">
          <h1 className="text-center text-4xl font-bold mb-2">POS System</h1>
          <p className="text-center text-gray-400 mb-8 text-sm">Sign in as Admin or Cashier</p>
          <Form layout="vertical" onFinish={onFinish}>
            <Form.Item label="Email" name="email"
              rules={[{ required: true, message: "Email cannot be empty!" }]}>
              <Input size="large" placeholder="Enter your email" />
            </Form.Item>
            <Form.Item label="Password" name="password"
              rules={[{ required: true, message: "Password cannot be empty!" }]}>
              <Input.Password size="large" placeholder="Enter your password" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" size="large" htmlType="submit" className="w-full" loading={loading}>
                Login
              </Button>
            </Form.Item>
          </Form>
          <div className="absolute bottom-10 left-0 w-full flex items-center justify-center text-sm text-gray-500">
            Don't have an account?
            <Link to="/register" className="text-blue-600 inline-block p-2">Register now</Link>
          </div>
        </div>
        <div className="sm:flex hidden xl:w-4/6 min-w-[500px] bg-[#6c63ff]">
          <div className="w-full mt-40">
            <Carousel autoplay>
              <AuthCarousel img={"images/responsive.svg"} title={"Responsive"} desc={"Compatible with All Device Sizes"} />
              <AuthCarousel img={"images/statistic.svg"} title={"Statistics"} desc={"Comprehensive Statistics Tracking"} />
              <AuthCarousel img={"images/customer.svg"} title={"Customer Satisfaction"} desc={"Satisfied Customers After Experience"} />
              <AuthCarousel img={"images/admin.svg"} title={"Admin Panel"} desc={"Centralized Management"} />
            </Carousel>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
