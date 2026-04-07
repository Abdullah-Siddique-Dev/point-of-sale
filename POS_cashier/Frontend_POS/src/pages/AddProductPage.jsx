import React, { useState, useEffect } from "react";
import HorizontalNavbar from "../components/navbar/HorizontalNavbar";
import { Form, Input, Button, Select, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Option } = Select;
const { TextArea } = Input;

const AddProductPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imageBase64, setImageBase64] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const getCategories = async () => {
      try {
        const res = await fetch(
          process.env.REACT_APP_SERVER_URL + "/api/categories/get-all"
        );
        const data = await res.json();
        setCategories(data);
      } catch (error) {
        console.log(error);
      }
    };
    getCategories();
  }, []);

  const handleImageUpload = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setImageBase64(e.target.result);
    };
    reader.readAsDataURL(file);
    return false;
  };

  const onFinish = async (values) => {
    if (!imageBase64) {
      message.error("Please upload a product image!");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        process.env.REACT_APP_SERVER_URL + "/api/products/add-product",
        {
          method: "POST",
          body: JSON.stringify({
            title: values.title,
            img: imageBase64,
            price: values.price,
            category: values.category,
          }),
          headers: { "Content-type": "application/json; charset=UTF-8" },
        }
      );

      if (res.status === 200) {
        message.success("Product added successfully!");
        navigate("/products");
      }
      setLoading(false);
    } catch (error) {
      message.error("Something went wrong!");
      setLoading(false);
    }
  };

  return (
    <div className="flex">
      <HorizontalNavbar />
      <div className="main-content" style={{ marginLeft: "250px", width: "calc(100% - 250px)" }}>
        <div className="top-bar bg-white border-b p-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Add New Product</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">Admin</span>
          </div>
        </div>

        <div className="p-6">
          <div className="bg-white p-6 rounded shadow max-w-2xl">
            <h2 className="text-xl font-semibold mb-6">Product Information</h2>
            <Form layout="vertical" onFinish={onFinish}>
              <Form.Item
                label="Product Name"
                name="title"
                rules={[{ required: true, message: "Please enter product name!" }]}
              >
                <Input placeholder="Enter product name" />
              </Form.Item>

              <Form.Item
                label="Category"
                name="category"
                rules={[{ required: true, message: "Please select category!" }]}
              >
                <Select placeholder="Select category">
                  {categories.map((cat) => (
                    <Option key={cat._id} value={cat.title}>
                      {cat.title}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                label="Price (Rs)"
                name="price"
                rules={[{ required: true, message: "Please enter price!" }]}
              >
                <Input type="number" placeholder="Enter price" />
              </Form.Item>

              <Form.Item label="Product Image" required>
                <Upload
                  beforeUpload={handleImageUpload}
                  maxCount={1}
                  listType="picture"
                >
                  <Button icon={<UploadOutlined />}>Upload Image</Button>
                </Upload>
              </Form.Item>

              <Form.Item>
                <div className="flex gap-4">
                  <Button onClick={() => navigate("/products")}>
                    Cancel
                  </Button>
                  <Button type="primary" htmlType="submit" loading={loading}>
                    Add Product
                  </Button>
                </div>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProductPage;

