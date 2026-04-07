import React, { useState } from "react";
import Sidebar from "../../components/Sidebar";
import { Card, Row, Col, Button, InputNumber, message, List, Typography } from "antd";

const { Title, Text } = Typography;

const PosSalePage = () => {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);

  const products = [
    { id: 1, name: "Product 1", price: 10 },
    { id: 2, name: "Product 2", price: 20 },
    { id: 3, name: "Product 3", price: 30 },
    { id: 4, name: "Product 4", price: 15 },
    { id: 5, name: "Product 5", price: 25 },
    { id: 6, name: "Product 6", price: 35 },
  ];

  const addToCart = (product) => {
    const existingItem = cart.find((item) => item.id === product.id);
    if (existingItem) {
      const updatedCart = cart.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
      setCart(updatedCart);
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    calculateTotal([...cart, { ...product, quantity: 1 }]);
  };

  const updateQuantity = (id, quantity) => {
    const updatedCart = cart.map((item) =>
      item.id === id ? { ...item, quantity } : item
    );
    setCart(updatedCart);
    calculateTotal(updatedCart);
  };

  const removeFromCart = (id) => {
    const updatedCart = cart.filter((item) => item.id !== id);
    setCart(updatedCart);
    calculateTotal(updatedCart);
  };

  const calculateTotal = (cartItems) => {
    const sum = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setTotal(sum);
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      message.warning("Cart is empty");
      return;
    }
    message.success("Sale completed successfully!");
    setCart([]);
    setTotal(0);
  };

  return (
    <div style={{ display: "flex", background: "#f5f5f7", minHeight: "100vh" }}>
      <Sidebar />
      <div style={{ marginLeft: 260, width: "calc(100% - 260px)" }}>
        <div style={{ background: "white", borderBottom: "1px solid #e5e7eb", padding: "24px 40px", position: "sticky", top: 0, zIndex: 10, boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}>
          <h1 style={{ fontSize: 32, fontWeight: 700, margin: 0, color: "#111827" }}>POS Sale</h1>
          <p style={{ fontSize: 15, color: "#6b7280", margin: "6px 0 0", fontWeight: 500 }}>Quick point of sale interface</p>
        </div>
        <div style={{ padding: 40 }}>
          <Row gutter={24}>
            <Col span={16}>
              <div style={{ background: "white", borderRadius: 12, border: "1px solid #e5e7eb", overflow: "hidden", boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}>
                <div style={{ padding: "24px 32px", borderBottom: "1px solid #e5e7eb", background: "#f9fafb" }}>
                  <h3 style={{ fontSize: 20, fontWeight: 700, margin: 0, color: "#111827" }}>Products</h3>
                </div>
                <div style={{ padding: 32 }}>
                  <Row gutter={[16, 16]}>
                    {products.map((product) => (
                      <Col span={8} key={product.id}>
                        <Card hoverable onClick={() => addToCart(product)}
                          style={{ textAlign: "center", borderRadius: 8, border: "1px solid #e5e7eb" }}>
                          <Title level={4} style={{ margin: "0 0 8px", fontSize: 18, fontWeight: 600 }}>{product.name}</Title>
                          <Text style={{ fontSize: 16, color: "#10b981", fontWeight: 600 }}>Rs {product.price}</Text>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </div>
              </div>
            </Col>
            <Col span={8}>
              <div style={{ background: "white", borderRadius: 12, border: "1px solid #e5e7eb", overflow: "hidden", boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}>
                <div style={{ padding: "24px 32px", borderBottom: "1px solid #e5e7eb", background: "#f9fafb" }}>
                  <h3 style={{ fontSize: 20, fontWeight: 700, margin: 0, color: "#111827" }}>Cart</h3>
                </div>
                <div style={{ padding: 32 }}>
                  <List dataSource={cart}
                    renderItem={(item) => (
                      <List.Item actions={[
                        <InputNumber min={1} value={item.quantity}
                          onChange={(value) => updateQuantity(item.id, value)} />,
                        <Button danger onClick={() => removeFromCart(item.id)}>Remove</Button>,
                      ]}>
                        <List.Item.Meta title={item.name}
                          description={`Rs ${item.price} x ${item.quantity} = Rs ${item.price * item.quantity}`} />
                      </List.Item>
                    )}
                  />
                  <div style={{ marginTop: 24, textAlign: "right" }}>
                    <Title level={3} style={{ color: "#10b981", margin: "0 0 16px" }}>Total: Rs {total.toFixed(2)}</Title>
                    <Button type="primary" size="large" block onClick={handleCheckout}
                      style={{ background: "#4f46e5", borderColor: "#4f46e5", fontWeight: 600 }}>
                      Checkout
                    </Button>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
};

export default PosSalePage;
