import { useState, useEffect } from "react";
import CartTotals from "../components/cart/CartTotals";
import Sidebar from "../components/sidebar/Sidebar";
import Products from "../components/products/Products";
import { Spin, Select, Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";

const { Option } = Select;

function HomePage() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searched, setSearched] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

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
    <div className="flex">
      <Sidebar />
      <div className="main-content" style={{ marginLeft: "250px", width: "calc(100% - 250px)" }}>
        <div className="top-bar bg-white border-b p-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Point of Sale (POS)</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">Admin</span>
          </div>
        </div>
        
        {products && categories.length > 0 ? (
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Point of Sale (POS)</h2>
            
            <div className="flex gap-10">
              <div className="flex-1">
                <div className="filters flex gap-4 mb-6">
                  <Select
                    defaultValue="All"
                    style={{ width: 200 }}
                    onChange={(value) => setSelectedCategory(value)}
                  >
                    {categories.map((cat) => (
                      <Option key={cat._id} value={cat.title}>
                        {cat.title}
                      </Option>
                    ))}
                  </Select>
                  
                  <Input
                    placeholder="Search by product name"
                    prefix={<SearchOutlined />}
                    style={{ width: 300 }}
                    onChange={(e) => setSearched(e.target.value.toLowerCase())}
                  />
                </div>

                <Products
                  products={products}
                  setProducts={setProducts}
                  filtered={filtered}
                  searched={searched}
                />
              </div>

              <div className="cart-section" style={{ minWidth: "350px" }}>
                <CartTotals />
              </div>
            </div>
          </div>
        ) : (
          <Spin size="large" className="absolute left-1/2 top-1/2" />
        )}
      </div>
    </div>
  );
}

export default HomePage;
