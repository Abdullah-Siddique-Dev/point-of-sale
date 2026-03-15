import Sidebar from "../components/sidebar/Sidebar";
import StatisticCard from "../components/statistic/StatisticCard";
import React, { useState, useEffect } from "react";
import { Area, Pie } from "@ant-design/plots";
import { Spin } from "antd";
import { UserOutlined } from "@ant-design/icons";

const StatisticPage = () => {
  const [data, setData] = useState();
  const [products, setProducts] = useState([]);
  const user = JSON.parse(localStorage.getItem("postUser"));

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
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar />
      <div style={{ marginLeft: "220px", width: "calc(100% - 220px)" }}>
        <div className="bg-white border-b px-6 py-3 flex items-center justify-between sticky top-0 z-10 shadow-sm">
          <h1 className="text-xl font-bold text-gray-800">Statistics</h1>
          <div className="flex items-center gap-2 text-gray-600">
            <UserOutlined />
            <span className="text-sm font-medium">{user?.username || "Admin"}</span>
          </div>
        </div>
        <div className="p-5">
          {data ? (
            <>
              <div className="grid xl:grid-cols-4 md:grid-cols-2 gap-4 mb-6">
                <StatisticCard title={"Total Customers"} amount={data.length} image={"images/user.png"} />
                <StatisticCard title={"Total Revenue"} amount={totalAmount()} image={"images/money.png"} />
                <StatisticCard title={"Total Sales"} amount={data.length} image={"images/sale.png"} />
                <StatisticCard title={"Total Products"} amount={products.length} image={"images/product.png"} />
              </div>
              <div className="flex justify-between gap-6 lg:flex-row flex-col">
                <div className="bg-white rounded shadow p-4 lg:w-1/2 h-72"><Area {...config} /></div>
                <div className="bg-white rounded shadow p-4 lg:w-1/2 h-72"><Pie {...config2} /></div>
              </div>
            </>
          ) : (
            <div className="flex justify-center items-center h-64"><Spin size="large" /></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatisticPage;
