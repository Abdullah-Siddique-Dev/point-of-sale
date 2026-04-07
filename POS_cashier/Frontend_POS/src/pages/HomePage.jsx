import { useState, useEffect } from "react";
import CartTotals from "../components/cart/CartTotals";
import HorizontalNavbar from "../components/navbar/HorizontalNavbar";
import Products from "../components/products/Products";
import { Spin, Select, Input } from "antd";
import { SearchOutlined, FilterOutlined } from "@ant-design/icons";

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
    <div style={{ 
      display: "flex", 
      flexDirection: "column", 
      background: "linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%)",
      minHeight: "100vh",
      position: "fixed",
      width: "100%",
      height: "100vh",
      overflow: "hidden"
    }}>
      <HorizontalNavbar />
      <div style={{ 
        marginTop: 100, 
        width: "100%", 
        height: "calc(100vh - 100px)", 
        overflowY: "auto",
        overflowX: "hidden"
      }}>
        <div style={{ padding: '40px 40px 0 40px' }}>
          <div style={{ display: "flex", gap: 32 }}>
            {/* Products Section */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", paddingBottom: 40 }}>
              {/* Premium Filters */}
              <div style={{ display: "flex", gap: 16, marginBottom: 24 }}>
                <Select
                  defaultValue="All"
                  style={{ width: 220 }}
                  onChange={(value) => setSelectedCategory(value)}
                  size="large"
                  suffixIcon={<FilterOutlined style={{ color: "#9ca3af" }} />}
                >
                  {categories.map((cat) => (
                    <Option key={cat._id} value={cat.title}>
                      {cat.title}
                    </Option>
                  ))}
                </Select>
                
                <Input
                  placeholder="Search products by name..."
                  prefix={<SearchOutlined style={{ color: "#9ca3af" }} />}
                  style={{ 
                    flex: 1,
                    height: 48,
                    borderRadius: 12,
                    border: '1px solid #e5e7eb',
                    fontSize: 15
                  }}
                  size="large"
                  onChange={(e) => setSearched(e.target.value.toLowerCase())}
                />
              </div>

              {/* Products Grid */}
              <div style={{
                background: 'white',
                borderRadius: 16,
                padding: 28,
                border: '1px solid #e5e7eb',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
              }}>
                {categories.length > 0 ? (
                  <Products
                    products={products}
                    setProducts={setProducts}
                    filtered={filtered}
                    searched={searched}
                  />
                ) : (
                  <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "60px 0" }}>
                    <Spin size="large" />
                  </div>
                )}
              </div>
            </div>

            {/* Cart Section - Fixed/Sticky */}
            <div style={{ 
              width: 420, 
              flexShrink: 0,
              position: 'sticky',
              top: 20,
              alignSelf: 'flex-start',
              maxHeight: 'calc(100vh - 160px)',
              overflow: 'hidden'
            }}>
              <CartTotals />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
