import React from "react";
import Layout from "../components/Layout";
import { Card, Row, Col, Statistic } from "antd";
import {
  ShoppingCartOutlined,
  DollarOutlined,
  UserOutlined,
  ShopOutlined,
} from "@ant-design/icons";

const DashboardPage = () => {
  return (
    <Layout>
      <h1 style={{ marginBottom: "24px" }}>Dashboard</h1>
      <Row gutter={16}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Sales"
              value={0}
              prefix={<ShoppingCartOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Revenue"
              value={0}
              prefix={<DollarOutlined />}
              suffix="$"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Customers"
              value={0}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Products"
              value={0}
              prefix={<ShopOutlined />}
            />
          </Card>
        </Col>
      </Row>
    </Layout>
  );
};

export default DashboardPage;
