import HorizontalNavbar from "../components/navbar/HorizontalNavbar";
import StatisticCard from "../components/statistic/StatisticCard";
import React, { useState, useEffect } from "react";
import { Area, Pie } from "@ant-design/plots";
import { Spin } from "antd";

const StatisticPage = () => {
  const [data, setData] = useState();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch(process.env.REACT_APP_SERVER_URL + "/api/invoices/get-all")
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    fetch(process.env.REACT_APP_SERVER_URL + "/api/products/get-all")
      .then((res) => res.json())
      .then((json) => setProducts(json))
      .catch((err) => console.log(err));
  }, []);

  const totalAmount = () => {
    const amount = data.reduce((total, item) => item.totalAmount + total, 0);
    return `Rs ${amount.toFixed(2)}`;
  };

  const config = { data, xField: "customerName", yField: "subTotal", xAxis: { range: [0, 1] } };
  const config2 = {
    appendPadding: 10, data, angleField: "subTotal", colorField: "customerName",
    radius: 1, innerRadius: 0.6,
    label: { type: "inner", offset: "-50%", content: "{value}", style: { textAlign: "center", fontSize: 14 } },
    interactions: [{ type: "element-selected" }, { type: "element-active" }],
    statistic: { title: false, content: { style: { whiteSpace: "pre-wrap", overflow: "hidden", textOverflow: "ellipsis" }, content: "Stats" } },
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", background: "#f5f5f7", minHeight: "100vh" }}>
      <HorizontalNavbar />
      <div style={{ marginTop: 100, width: "100%" }}>
        {/* Header */}
        <div style={{
          background: 'white',
          borderBottom: '1px solid #e5e7eb',
          padding: '24px 40px',
          position: 'sticky',
          top: 0,
          zIndex: 10,
          boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
        }}>
          <h1 style={{ fontSize: 32, fontWeight: 700, margin: 0, color: '#111827' }}>
            Statistics
          </h1>
          <p style={{ fontSize: 15, color: '#6b7280', margin: '6px 0 0', fontWeight: 500 }}>
            Business analytics and performance metrics
          </p>
        </div>

        <div style={{ padding: 40 }}>
          {data ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
              {/* Stats Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 }}>
                <StatisticCard title={"Total Customers"} amount={data.length} image={"images/user.png"} />
                <StatisticCard title={"Total Revenue"} amount={totalAmount()} image={"images/money.png"} />
                <StatisticCard title={"Total Sales"} amount={data.length} image={"images/sale.png"} />
                <StatisticCard title={"Total Products"} amount={products.length} image={"images/product.png"} />
              </div>

              {/* Charts */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e5e7eb', padding: 28, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                  <h3 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 20px', color: '#111827' }}>Sales by Customer</h3>
                  <div style={{ height: 300 }}><Area {...config} /></div>
                </div>
                <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e5e7eb', padding: 28, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                  <h3 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 20px', color: '#111827' }}>Revenue Distribution</h3>
                  <div style={{ height: 300 }}><Pie {...config2} /></div>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 400 }}>
              <Spin size="large" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatisticPage;

