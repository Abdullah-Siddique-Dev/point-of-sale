import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { Spin, Select, Badge } from "antd";
import { 
  UserOutlined, ShoppingOutlined, AppstoreOutlined, DollarOutlined, 
  WarningOutlined, RiseOutlined, FallOutlined, TrophyOutlined,
  ShoppingCartOutlined, CheckCircleOutlined, CloseCircleOutlined,
  ClockCircleOutlined, StockOutlined, LineChartOutlined
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Option } = Select;

// Enhanced Stat Card Component
const StatCard = ({ title, value, icon, trend, trendValue, delay = 0, color = "#4f46e5" }) => {
  const [isHovered, setIsHovered] = useState(false);
  const isPositive = trendValue >= 0;
  
  return (
    <div 
      className="stat-card stagger-item"
      style={{
        background: 'white',
        borderRadius: '16px',
        padding: '24px',
        border: '1px solid #e5e7eb',
        cursor: 'pointer',
        transition: 'all 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        position: 'relative',
        overflow: 'hidden',
        animationDelay: `${delay}s`
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `radial-gradient(circle at top right, ${color}15 0%, transparent 70%)`,
        opacity: isHovered ? 1 : 0,
        transition: 'opacity 0.4s'
      }} />
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 12px' }}>
            {title}
          </p>
          <h3 style={{ fontSize: 32, fontWeight: 800, color: '#111827', margin: '0 0 10px', letterSpacing: '-0.02em' }}>
            {value}
          </h3>
          {trend && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{
                width: 22,
                height: 22,
                borderRadius: '50%',
                background: isPositive ? '#d1fae5' : '#fee2e2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {isPositive ? 
                  <RiseOutlined style={{ color: '#10b981', fontSize: 11 }} /> :
                  <FallOutlined style={{ color: '#ef4444', fontSize: 11 }} />
                }
              </div>
              <span style={{ fontSize: 13, fontWeight: 700, color: isPositive ? '#10b981' : '#ef4444' }}>
                {isPositive ? '+' : ''}{trendValue}%
              </span>
              <span style={{ fontSize: 11, color: '#9ca3af', fontWeight: 500 }}>vs last month</span>
            </div>
          )}
        </div>
        
        <div style={{
          width: 56,
          height: 56,
          borderRadius: '14px',
          background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: 24,
          boxShadow: isHovered ? `0 12px 24px ${color}40` : `0 4px 12px ${color}30`,
          transition: 'all 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
          transform: isHovered ? 'scale(1.1) rotate(5deg)' : 'scale(1) rotate(0deg)'
        }}>
          {icon}
        </div>
      </div>
    </div>
  );
};

// Alert Card Component
const AlertCard = ({ title, description, count, onClick, type = "warning" }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const colors = {
    warning: { border: '#f59e0b', bg: '#fffbeb', iconBg: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)', iconColor: '#ffffff', badgeBg: '#f59e0b', glow: 'rgba(245, 158, 11, 0.3)' },
    critical: { border: '#ef4444', bg: '#fef2f2', iconBg: 'linear-gradient(135deg, #f87171 0%, #ef4444 100%)', iconColor: '#ffffff', badgeBg: '#ef4444', glow: 'rgba(239, 68, 68, 0.3)' }
  };
  
  const color = colors[type];
  
  return (
    <div 
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: color.bg,
        border: `2px solid ${color.border}`,
        borderRadius: '16px',
        padding: '20px 24px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        transition: 'all 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: isHovered ? `0 12px 24px ${color.glow}` : 'none'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, position: 'relative', zIndex: 1 }}>
        <div style={{
          width: 48,
          height: 48,
          borderRadius: 12,
          background: color.iconBg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: `0 8px 16px ${color.glow}`
        }}>
          <WarningOutlined style={{ color: color.iconColor, fontSize: 22 }} />
        </div>
        <div>
          <p style={{ margin: 0, fontWeight: 800, color: '#111827', fontSize: 16 }}>{title}</p>
          <p style={{ margin: '4px 0 0', color: '#6B7280', fontSize: 13, fontWeight: 500 }}>{description}</p>
        </div>
      </div>
      
      <Badge 
        count={count} 
        style={{ 
          backgroundColor: color.badgeBg,
          fontSize: 15,
          fontWeight: 700,
          padding: '0 10px',
          height: 28,
          lineHeight: '28px',
          borderRadius: 8,
          boxShadow: `0 4px 12px ${color.glow}`,
          transform: isHovered ? 'scale(1.1)' : 'scale(1)',
          transition: 'transform 0.3s'
        }} 
      />
    </div>
  );
};

// Order Status Card
const OrderStatusCard = ({ title, count, icon, color }) => {
  return (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      padding: '20px',
      border: '1px solid #e5e7eb',
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      transition: 'all 0.3s',
      cursor: 'pointer'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-4px)';
      e.currentTarget.style.boxShadow = `0 8px 16px ${color}20`;
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = 'none';
    }}>
      <div style={{
        width: 48,
        height: 48,
        borderRadius: '12px',
        background: `${color}15`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 22,
        color: color
      }}>
        {icon}
      </div>
      <div>
        <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{title}</p>
        <h4 style={{ margin: '4px 0 0', fontSize: 24, fontWeight: 800, color: '#111827' }}>{count}</h4>
      </div>
    </div>
  );
};

// Top Product Card
const TopProductCard = ({ product, rank }) => {
  const medals = ['🥇', '🥈', '🥉'];
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      padding: '16px',
      background: 'white',
      borderRadius: '12px',
      border: '1px solid #e5e7eb',
      transition: 'all 0.3s',
      cursor: 'pointer'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateX(8px)';
      e.currentTarget.style.boxShadow = '0 4px 12px rgba(79, 70, 229, 0.1)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateX(0)';
      e.currentTarget.style.boxShadow = 'none';
    }}>
      <div style={{
        width: 40,
        height: 40,
        borderRadius: '10px',
        background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 20,
        fontWeight: 700,
        color: 'white'
      }}>
        {rank <= 3 ? medals[rank - 1] : rank}
      </div>
      <div style={{ flex: 1 }}>
        <p style={{ margin: 0, fontWeight: 700, color: '#111827', fontSize: 14 }}>{product.productName}</p>
        <p style={{ margin: '4px 0 0', fontSize: 12, color: '#6b7280', fontWeight: 500 }}>
          {product.unitsSold} units • Rs {product.revenue.toLocaleString()}
        </p>
      </div>
      <TrophyOutlined style={{ fontSize: 20, color: '#f59e0b' }} />
    </div>
  );
};

const DashboardPage = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [salesPeriod, setSalesPeriod] = useState('daily');
  const [salesAnalytics, setSalesAnalytics] = useState([]);
  const [loading, setLoading] = useState(true);
  const BASE = process.env.REACT_APP_SERVER_URL;
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    fetchSalesAnalytics(salesPeriod);
  }, [salesPeriod]);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch(`${BASE}/api/dashboard/stats`);
      const result = await response.json();
      if (result.success) {
        setDashboardData(result.data);
      }
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
      setLoading(false);
    }
  };

  const fetchSalesAnalytics = async (period) => {
    try {
      const response = await fetch(`${BASE}/api/dashboard/sales-analytics?period=${period}`);
      const result = await response.json();
      if (result.success) {
        setSalesAnalytics(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch sales analytics:", error);
    }
  };

  if (loading || !dashboardData) {
    return (
      <div style={{ display: "flex", background: "#f5f5f7", minHeight: "100vh" }}>
        <Sidebar />
        <div style={{ marginLeft: 260, width: "calc(100% - 260px)", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Spin size="large" />
        </div>
      </div>
    );
  }

  const { summary, inventory, orderStatus, topProducts, taxSummary, recentOrders } = dashboardData;

  return (
    <div style={{ display: "flex", background: "#f5f5f7", minHeight: "100vh" }}>
      <Sidebar />
      <div style={{ marginLeft: 260, width: "calc(100% - 260px)" }}>
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <h1 style={{ 
              fontSize: 32, 
              fontWeight: 700, 
              margin: 0, 
              color: '#111827',
              fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
              letterSpacing: '-0.02em'
            }}>
              Hi Admin, Welcome back!
            </h1>
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 600, margin: '8px 0 0', color: '#111827' }}>
            Dashboard Overview
          </h2>
          <p style={{ fontSize: 14, color: '#6b7280', margin: '4px 0 0', fontWeight: 500 }}>
            Complete business analytics and performance metrics
          </p>
        </div>

        <div style={{ padding: 40 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            
            {/* TOP SUMMARY CARDS - Row 1 */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
              <StatCard 
                title="Total Products" 
                value={summary.totalProducts} 
                icon={<AppstoreOutlined />} 
                trend={true}
                trendValue={12.5}
                delay={0}
                color="#4f46e5"
              />
              <StatCard 
                title="Total Orders" 
                value={summary.totalOrders} 
                icon={<ShoppingOutlined />} 
                trend={true}
                trendValue={summary.ordersGrowth}
                delay={0.05}
                color="#10b981"
              />
              <StatCard 
                title="Total Customers" 
                value={summary.totalCustomers} 
                icon={<UserOutlined />} 
                trend={true}
                trendValue={23.1}
                delay={0.1}
                color="#f59e0b"
              />
              <StatCard 
                title="Total Revenue" 
                value={`Rs ${summary.totalRevenue.toLocaleString()}`} 
                icon={<DollarOutlined />} 
                trend={true}
                trendValue={summary.revenueGrowth}
                delay={0.15}
                color="#ec4899"
              />
            </div>

            {/* Second Row - Today's Metrics + Tax */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
              <StatCard 
                title="Today Sales" 
                value={`Rs ${summary.todaySales.toLocaleString()}`} 
                icon={<DollarOutlined />} 
                delay={0.2}
                color="#06b6d4"
              />
              <StatCard 
                title="Today Orders" 
                value={summary.todayOrders} 
                icon={<ShoppingCartOutlined />} 
                delay={0.25}
                color="#8b5cf6"
              />
              <StatCard 
                title="Total Tax Collected" 
                value={`Rs ${summary.totalTaxCollected.toLocaleString()}`} 
                icon={<StockOutlined />} 
                delay={0.3}
                color="#ef4444"
              />
            </div>

            {/* ALERT SECTION - Row 2 */}
            {(inventory.lowStockCount > 0 || inventory.outOfStockCount > 0) && (
              <div style={{ display: "grid", gridTemplateColumns: inventory.outOfStockCount > 0 && inventory.lowStockCount > 0 ? "1fr 1fr" : "1fr", gap: 20 }}>
                {inventory.outOfStockCount > 0 && (
                  <AlertCard
                    title="Out of Stock"
                    description="Requires immediate restocking"
                    count={inventory.outOfStockCount}
                    onClick={() => navigate("/inventory/out-of-stock")}
                    type="critical"
                  />
                )}
                {inventory.lowStockCount > 0 && (
                  <AlertCard
                    title="Low Stock Alert"
                    description="Products below 10 units"
                    count={inventory.lowStockCount}
                    onClick={() => navigate("/inventory/alerts")}
                    type="warning"
                  />
                )}
              </div>
            )}

            {/* SALES ANALYTICS GRAPH - Row 3 */}
            <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e5e7eb', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <div style={{ padding: '24px 32px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ fontSize: 20, fontWeight: 800, margin: 0, color: '#111827' }}>Sales Analytics</h3>
                  <p style={{ fontSize: 13, color: '#6b7280', margin: '4px 0 0', fontWeight: 500 }}>Track sales performance over time</p>
                </div>
                <Select 
                  value={salesPeriod} 
                  onChange={setSalesPeriod}
                  style={{ width: 140 }}
                >
                  <Option value="daily">Daily</Option>
                  <Option value="weekly">Weekly</Option>
                  <Option value="monthly">Monthly</Option>
                </Select>
              </div>
              <div style={{ padding: '32px' }}>
                {salesAnalytics.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '60px 0', color: '#6b7280' }}>
                    <LineChartOutlined style={{ fontSize: 48, color: '#e5e7eb', marginBottom: 16 }} />
                    <p style={{ margin: 0, fontWeight: 600 }}>No sales data available</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {salesAnalytics.map((data, index) => {
                      const maxSales = Math.max(...salesAnalytics.map(d => d.sales));
                      const salesPercentage = maxSales > 0 ? (data.sales / maxSales) * 100 : 0;
                      const maxOrders = Math.max(...salesAnalytics.map(d => d.orders));
                      const ordersPercentage = maxOrders > 0 ? (data.orders / maxOrders) * 100 : 0;
                      
                      return (
                        <div key={index} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                          <div style={{ width: 80, fontSize: 13, fontWeight: 700, color: '#6b7280' }}>
                            {data.label}
                          </div>
                          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                            <div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                <span style={{ fontSize: 11, fontWeight: 700, color: '#4f46e5' }}>Sales</span>
                                <span style={{ fontSize: 12, fontWeight: 800, color: '#111827' }}>Rs {data.sales.toLocaleString()}</span>
                              </div>
                              <div style={{ 
                                height: 24, 
                                background: '#eef2ff', 
                                borderRadius: 6, 
                                overflow: 'hidden',
                                position: 'relative'
                              }}>
                                <div style={{
                                  width: `${salesPercentage}%`,
                                  height: '100%',
                                  background: 'linear-gradient(90deg, #4f46e5 0%, #6366f1 100%)',
                                  borderRadius: 6,
                                  transition: 'width 0.8s cubic-bezier(0.23, 1, 0.32, 1)',
                                  boxShadow: '0 2px 8px rgba(79, 70, 229, 0.3)'
                                }} />
                              </div>
                            </div>
                            <div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                <span style={{ fontSize: 11, fontWeight: 700, color: '#10b981' }}>Orders</span>
                                <span style={{ fontSize: 12, fontWeight: 800, color: '#111827' }}>{data.orders}</span>
                              </div>
                              <div style={{ 
                                height: 24, 
                                background: '#d1fae5', 
                                borderRadius: 6, 
                                overflow: 'hidden',
                                position: 'relative'
                              }}>
                                <div style={{
                                  width: `${ordersPercentage}%`,
                                  height: '100%',
                                  background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)',
                                  borderRadius: 6,
                                  transition: 'width 0.8s cubic-bezier(0.23, 1, 0.32, 1)',
                                  boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)'
                                }} />
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* ORDER STATUS + INVENTORY + TAX SUMMARY - Row 4 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20 }}>
              
              {/* Order Status Overview */}
              <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e5e7eb', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <h3 style={{ fontSize: 18, fontWeight: 800, margin: '0 0 20px', color: '#111827' }}>Order Status</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <OrderStatusCard 
                    title="Completed" 
                    count={orderStatus.delivered} 
                    icon={<CheckCircleOutlined />} 
                    color="#10b981" 
                  />
                  <OrderStatusCard 
                    title="Pending" 
                    count={orderStatus.pending} 
                    icon={<ClockCircleOutlined />} 
                    color="#f59e0b" 
                  />
                  <OrderStatusCard 
                    title="Cancelled" 
                    count={orderStatus.cancelled} 
                    icon={<CloseCircleOutlined />} 
                    color="#ef4444" 
                  />
                </div>
              </div>

              {/* Inventory Summary */}
              <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e5e7eb', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <h3 style={{ fontSize: 18, fontWeight: 800, margin: '0 0 20px', color: '#111827' }}>Inventory Summary</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div style={{ padding: '16px', background: '#f9fafb', borderRadius: 12 }}>
                    <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Stock Value</p>
                    <h4 style={{ margin: '6px 0 0', fontSize: 22, fontWeight: 800, color: '#111827' }}>Rs {inventory.totalStockValue.toLocaleString()}</h4>
                  </div>
                  <div style={{ padding: '16px', background: '#fffbeb', borderRadius: 12, border: '1px solid #fbbf24' }}>
                    <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Low Stock Items</p>
                    <h4 style={{ margin: '6px 0 0', fontSize: 22, fontWeight: 800, color: '#f59e0b' }}>{inventory.lowStockCount}</h4>
                  </div>
                  <div style={{ padding: '16px', background: '#fef2f2', borderRadius: 12, border: '1px solid #f87171' }}>
                    <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: '#ef4444', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Out of Stock</p>
                    <h4 style={{ margin: '6px 0 0', fontSize: 22, fontWeight: 800, color: '#ef4444' }}>{inventory.outOfStockCount}</h4>
                  </div>
                </div>
              </div>

              {/* Tax Summary */}
              <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e5e7eb', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <h3 style={{ fontSize: 18, fontWeight: 800, margin: '0 0 20px', color: '#111827' }}>Tax Summary</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div style={{ padding: '16px', background: 'linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%)', borderRadius: 12 }}>
                    <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: '#4f46e5', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Today's Tax</p>
                    <h4 style={{ margin: '6px 0 0', fontSize: 22, fontWeight: 800, color: '#4f46e5' }}>Rs {taxSummary.todayTax.toLocaleString()}</h4>
                  </div>
                  <div style={{ padding: '16px', background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)', borderRadius: 12 }}>
                    <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.05em' }}>This Month's Tax</p>
                    <h4 style={{ margin: '6px 0 0', fontSize: 22, fontWeight: 800, color: '#10b981' }}>Rs {taxSummary.monthTax.toLocaleString()}</h4>
                  </div>
                  {taxSummary.activeTax && (
                    <div style={{ padding: '16px', background: '#f9fafb', borderRadius: 12 }}>
                      <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Active Tax</p>
                      <h4 style={{ margin: '6px 0 0', fontSize: 16, fontWeight: 800, color: '#111827' }}>
                        {taxSummary.activeTax.name} ({taxSummary.activeTax.percentage}%)
                      </h4>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* TOP SELLING PRODUCTS - Row 5 */}
            <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e5e7eb', padding: '28px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <div style={{ marginBottom: 24 }}>
                <h3 style={{ fontSize: 20, fontWeight: 800, margin: 0, color: '#111827' }}>Top Selling Products</h3>
                <p style={{ fontSize: 13, color: '#6b7280', margin: '4px 0 0', fontWeight: 500 }}>Best performing products by units sold</p>
              </div>
              {topProducts.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 0', color: '#6b7280' }}>
                  <TrophyOutlined style={{ fontSize: 48, color: '#e5e7eb', marginBottom: 16 }} />
                  <p style={{ margin: 0, fontWeight: 600 }}>No sales data available yet</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {topProducts.map((product, index) => (
                    <TopProductCard key={product.productId} product={product} rank={index + 1} />
                  ))}
                </div>
              )}
            </div>

            {/* RECENT ORDERS TABLE - Row 6 */}
            <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e5e7eb', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <div style={{ padding: '28px 32px', borderBottom: '1px solid #e5e7eb' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ fontSize: 20, fontWeight: 800, margin: 0, color: '#111827' }}>Recent Orders</h3>
                    <p style={{ fontSize: 13, color: '#6b7280', margin: '4px 0 0', fontWeight: 500 }}>Latest customer transactions</p>
                  </div>
                  <button 
                    onClick={() => navigate("/invoices")}
                    style={{
                      padding: '10px 20px',
                      fontSize: 13,
                      fontWeight: 700,
                      color: 'white',
                      background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)',
                      border: 'none',
                      borderRadius: 10,
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                      boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 8px 16px rgba(79, 70, 229, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(79, 70, 229, 0.3)';
                    }}>
                    View All Orders
                  </button>
                </div>
              </div>
              
              <div style={{ padding: 32 }}>
                {recentOrders.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '60px 0' }}>
                    <ShoppingCartOutlined style={{ fontSize: 48, color: '#e5e7eb', marginBottom: 16 }} />
                    <p style={{ color: '#6b7280', fontSize: 16, margin: 0, fontWeight: 600 }}>No orders yet</p>
                    <p style={{ color: '#9ca3af', fontSize: 13, margin: '8px 0 0', fontWeight: 500 }}>Orders will appear here once customers make purchases</p>
                  </div>
                ) : (
                  <table style={{ width: "100%", fontSize: 14, borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ borderBottom: "2px solid #e5e7eb" }}>
                        <th style={{ textAlign: "left", paddingBottom: 14, color: "#6b7280", fontWeight: 800, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em" }}>Order ID</th>
                        <th style={{ textAlign: "left", paddingBottom: 14, color: "#6b7280", fontWeight: 800, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em" }}>Customer</th>
                        <th style={{ textAlign: "left", paddingBottom: 14, color: "#6b7280", fontWeight: 800, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em" }}>Phone</th>
                        <th style={{ textAlign: "left", paddingBottom: 14, color: "#6b7280", fontWeight: 800, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em" }}>Payment</th>
                        <th style={{ textAlign: "left", paddingBottom: 14, color: "#6b7280", fontWeight: 800, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em" }}>Amount</th>
                        <th style={{ textAlign: "left", paddingBottom: 14, color: "#6b7280", fontWeight: 800, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em" }}>Status</th>
                        <th style={{ textAlign: "left", paddingBottom: 14, color: "#6b7280", fontWeight: 800, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em" }}>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map(order => (
                        <tr key={order._id} style={{ 
                          borderBottom: "1px solid #f3f4f6", 
                          transition: "all 0.3s",
                          cursor: 'pointer'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "#f9fafb";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "transparent";
                        }}>
                          <td style={{ padding: "16px 0", fontWeight: 700, color: "#4f46e5", fontSize: 13 }}>#{order.orderId}</td>
                          <td style={{ fontWeight: 700, color: "#111827", fontSize: 14 }}>{order.customerName}</td>
                          <td style={{ color: "#6b7280", fontWeight: 600, fontSize: 13 }}>{order.customerPhoneNumber}</td>
                          <td>
                            <span style={{ 
                              background: '#d1fae5', 
                              color: '#059669', 
                              padding: '6px 12px', 
                              borderRadius: 6, 
                              fontSize: 11, 
                              fontWeight: 700
                            }}>
                              {order.paymentMode}
                            </span>
                          </td>
                          <td style={{ color: "#111827", fontWeight: 800, fontSize: 15 }}>Rs {order.totalAmount?.toLocaleString()}</td>
                          <td>
                            <span style={{ 
                              background: order.status === 'Delivered' ? '#d1fae5' : order.status === 'Pending' ? '#fef3c7' : '#fee2e2',
                              color: order.status === 'Delivered' ? '#059669' : order.status === 'Pending' ? '#d97706' : '#dc2626',
                              padding: '6px 12px', 
                              borderRadius: 6, 
                              fontSize: 11, 
                              fontWeight: 700
                            }}>
                              {order.status}
                            </span>
                          </td>
                          <td style={{ color: "#9ca3af", fontSize: 12, fontWeight: 600 }}>{new Date(order.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
