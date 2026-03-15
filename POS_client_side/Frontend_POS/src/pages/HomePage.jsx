import { useState, useEffect } from "react";
import CartTotals from "../components/cart/CartTotals";
import Sidebar from "../components/sidebar/Sidebar";
import Products from "../components/products/Products";
import { Spin, Select, Input } from "antd";
import { SearchOutlined, UserOutlined } from "@ant-design/icons";

const { Option } = Select;

function HomePage() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searched, setSearched] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const user = JSON.parse(localStorage.getItem("postUser"));

  useEffect(() => {
    const getCategories = async () => {
      try {
        const res = await fetch(
          process.env.REACT_APP_SERVER_URL + "/api/categories/get-all"
        );
        const data = await res.json();
        setCategories([{ _id: "all", title: "All" }, ...data]);
      } catch (error) {
        console.log(error);
      }
    };
    getCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory === "All") {
      setFiltered(products);
    } else {
      setFiltered(products.filter((product) => product.category === selectedCategory));
    }
  }, [selectedCategory, products]);

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar />
      <div style={{ marginLeft: "220px", width: "calc(100% - 220px)" }}>
        {/* Top Bar */}
        <div className="bg-white border-b px-6 py-3 flex items-center justify-between sticky top-0 z-10 shadow-sm">
          <h1 className="text-xl font-bold text-gray-800">Point of Sale (POS)</h1>
          <div className="flex items-center gap-2 text-gray-600">
            <UserOutlined />
            <span className="text-sm font-medium">{user?.username || "Admin"}</span>
          </div>
        </div>

        <div className="p-5">
          <div className="flex gap-5 h-[calc(100vh-70px)]">
            {/* Products Section */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Filters */}
              <div className="flex gap-3 mb-4">
                <Select
                  defaultValue="All"
                  style={{ width: 180 }}
                  onChange={(value) => setSelectedCategory(value)}
                  size="middle"
                >
                  {categories.map((cat) => (
                    <Option key={cat._id} value={cat.title}>
                      {cat.title}
                    </Option>
                  ))}
                </Select>
                <Input
                  placeholder="Search by product name"
                  prefix={<SearchOutlined className="text-gray-400" />}
                  style={{ flex: 1 }}
                  onChange={(e) => setSearched(e.target.value.toLowerCase())}
                />
              </div>

              {/* Products Grid */}
              <div className="flex-1 overflow-y-auto">
                {categories.length > 0 ? (
                  <Products
                    products={products}
                    setProducts={setProducts}
                    filtered={filtered}
                    searched={searched}
                  />
                ) : (
                  <div className="flex justify-center items-center h-full">
                    <Spin size="large" />
                  </div>
                )}
              </div>
            </div>

            {/* Cart Section */}
            <div className="w-80 flex-shrink-0">
              <CartTotals />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
