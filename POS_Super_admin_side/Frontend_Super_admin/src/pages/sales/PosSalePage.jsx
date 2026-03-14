import React, { useState } from "react";
import Layout from "../../components/Layout";
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
    <Layout>
      <h1 style={{ marginBottom: "24px" }}>POS Sale</h1>
      <Row gutter={16}>
        <Col span={16}>
          <Card title="Products">
            <Row gutter={[16, 16]}>
              {products.map((product) => (
                <Col span={8} key={product.id}>
                  <Card
                    hoverable
                    onClick={() => addToCart(product)}
                    style={{ textAlign: "center" }}
                  >
                    <Title level={4}>{product.name}</Title>
                    <Text>${product.price}</Text>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Cart">
            <List
              dataSource={cart}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    <InputNumber
                      min={1}
                      value={item.quantity}
                      onChange={(value) => updateQuantity(item.id, value)}
                    />,
                    <Button danger onClick={() => removeFromCart(item.id)}>
                      Remove
                    </Button>,
                  ]}
                >
                  <List.Item.Meta
                    title={item.name}
                    description={`$${item.price} x ${item.quantity} = $${
                      item.price * item.quantity
                    }`}
                  />
                </List.Item>
              )}
            />
            <div style={{ marginTop: "20px", textAlign: "right" }}>
              <Title level={3}>Total: ${total.toFixed(2)}</Title>
              <Button type="primary" size="large" block onClick={handleCheckout}>
                Checkout
              </Button>
            </div>
          </Card>
        </Col>
      </Row>
    </Layout>
  );
};

export default PosSalePage;
