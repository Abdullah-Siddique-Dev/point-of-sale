const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

// Import models
const User = require("./models/User");
const Category = require("./models/Category");
const SubCategory = require("./models/SubCategory");
const Product = require("./models/Product");
const Supplier = require("./models/Supplier");
const Invoice = require("./models/Invoice");
const Purchase = require("./models/Purchase");
const PurchaseReturn = require("./models/PurchaseReturn");

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    process.exit(1);
  }
};

// Seed Data
const seedData = async () => {
  try {
    console.log("🌱 Starting to seed database...\n");

    // Clear existing data
    console.log("🗑️  Clearing existing data...");
    await User.deleteMany({});
    await Category.deleteMany({});
    await SubCategory.deleteMany({});
    await Product.deleteMany({});
    await Supplier.deleteMany({});
    await Invoice.deleteMany({});
    await Purchase.deleteMany({});
    await PurchaseReturn.deleteMany({});
    console.log("✅ Existing data cleared\n");

    // 1. Create Users
    console.log("👤 Creating users...");
    const hashedPassword = await bcrypt.hash("123456", 10);
    const users = await User.insertMany([
      {
        userName: "Admin User",
        email: "admin@pos.com",
        password: hashedPassword,
        role: "admin",
      },
      {
        userName: "John Cashier",
        email: "cashier@pos.com",
        password: hashedPassword,
        role: "cashier",
      },
      {
        userName: "Sarah Manager",
        email: "manager@pos.com",
        password: hashedPassword,
        role: "admin",
      },
      {
        userName: "Mike Staff",
        email: "staff@pos.com",
        password: hashedPassword,
        role: "cashier",
      },
    ]);
    console.log(`✅ Created ${users.length} users\n`);

    // 2. Create Categories
    console.log("📁 Creating categories...");
    const categories = await Category.insertMany([
      { title: "Electronics" },
      { title: "Clothing" },
      { title: "Food & Beverages" },
      { title: "Home & Garden" },
      { title: "Sports & Outdoors" },
    ]);
    console.log(`✅ Created ${categories.length} categories\n`);

    // 3. Create SubCategories
    console.log("📂 Creating subcategories...");
    const subCategories = await SubCategory.insertMany([
      {
        title: "Mobile Phones",
        categoryId: categories[0]._id,
        categoryName: "Electronics",
      },
      {
        title: "Laptops",
        categoryId: categories[0]._id,
        categoryName: "Electronics",
      },
      {
        title: "Men's Wear",
        categoryId: categories[1]._id,
        categoryName: "Clothing",
      },
      {
        title: "Women's Wear",
        categoryId: categories[1]._id,
        categoryName: "Clothing",
      },
      {
        title: "Snacks",
        categoryId: categories[2]._id,
        categoryName: "Food & Beverages",
      },
      {
        title: "Beverages",
        categoryId: categories[2]._id,
        categoryName: "Food & Beverages",
      },
    ]);
    console.log(`✅ Created ${subCategories.length} subcategories\n`);

    // 4. Create Suppliers
    console.log("🏢 Creating suppliers...");
    const suppliers = await Supplier.insertMany([
      {
        name: "Tech Solutions Ltd",
        company: "Tech Solutions",
        phone: "03001234567",
        email: "contact@techsolutions.com",
        address: "123 Tech Street, Karachi",
        status: true,
      },
      {
        name: "Fashion Hub",
        company: "Fashion Hub Co",
        phone: "03009876543",
        email: "info@fashionhub.com",
        address: "456 Fashion Avenue, Lahore",
        status: true,
      },
      {
        name: "Food Distributors",
        company: "Food Dist Inc",
        phone: "03007654321",
        email: "sales@fooddist.com",
        address: "789 Market Road, Islamabad",
        status: true,
      },
      {
        name: "Home Essentials",
        company: "Home Essentials Ltd",
        phone: "03005551234",
        email: "orders@homeessentials.com",
        address: "321 Garden Lane, Faisalabad",
        status: true,
      },
      {
        name: "Sports Gear Pro",
        company: "Sports Gear",
        phone: "03004443333",
        email: "info@sportsgear.com",
        address: "654 Sports Complex, Multan",
        status: false,
      },
    ]);
    console.log(`✅ Created ${suppliers.length} suppliers\n`);

    // 5. Create Products
    console.log("📦 Creating products...");
    const products = await Product.insertMany([
      // Electronics
      {
        title: "Samsung Galaxy S21",
        img: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400",
        price: 89999,
        category: "Electronics",
        stock: 15,
      },
      {
        title: "iPhone 13 Pro",
        img: "https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=400",
        price: 149999,
        category: "Electronics",
        stock: 8,
      },
      {
        title: "Dell XPS 15 Laptop",
        img: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400",
        price: 179999,
        category: "Electronics",
        stock: 5,
      },
      {
        title: "Sony WH-1000XM4 Headphones",
        img: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400",
        price: 29999,
        category: "Electronics",
        stock: 20,
      },
      {
        title: "iPad Air",
        img: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400",
        price: 64999,
        category: "Electronics",
        stock: 12,
      },
      // Clothing
      {
        title: "Men's Casual Shirt",
        img: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400",
        price: 2499,
        category: "Clothing",
        stock: 50,
      },
      {
        title: "Women's Summer Dress",
        img: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400",
        price: 3999,
        category: "Clothing",
        stock: 30,
      },
      {
        title: "Men's Jeans",
        img: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400",
        price: 3499,
        category: "Clothing",
        stock: 40,
      },
      {
        title: "Women's Handbag",
        img: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400",
        price: 4999,
        category: "Clothing",
        stock: 25,
      },
      // Food & Beverages
      {
        title: "Lays Chips Family Pack",
        img: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400",
        price: 250,
        category: "Food & Beverages",
        stock: 100,
      },
      {
        title: "Coca Cola 1.5L",
        img: "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400",
        price: 150,
        category: "Food & Beverages",
        stock: 80,
      },
      {
        title: "Oreo Biscuits",
        img: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400",
        price: 120,
        category: "Food & Beverages",
        stock: 150,
      },
      {
        title: "Nestle Coffee",
        img: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400",
        price: 899,
        category: "Food & Beverages",
        stock: 60,
      },
      // Home & Garden
      {
        title: "LED Table Lamp",
        img: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400",
        price: 1999,
        category: "Home & Garden",
        stock: 35,
      },
      {
        title: "Kitchen Knife Set",
        img: "https://images.unsplash.com/photo-1593618998160-e34014e67546?w=400",
        price: 2499,
        category: "Home & Garden",
        stock: 28,
      },
      // Sports
      {
        title: "Football",
        img: "https://images.unsplash.com/photo-1614632537423-1e6c2e7e0aab?w=400",
        price: 1499,
        category: "Sports & Outdoors",
        stock: 45,
      },
      {
        title: "Yoga Mat",
        img: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400",
        price: 1299,
        category: "Sports & Outdoors",
        stock: 55,
      },
    ]);
    console.log(`✅ Created ${products.length} products\n`);

    // 6. Create Invoices
    console.log("🧾 Creating invoices...");
    const invoices = await Invoice.insertMany([
      {
        orderId: "ORD-2024-001",
        customerName: "Abdullah",
        customerPhoneNumber: 3001234567,
        paymentMode: "Credit Card",
        cartItems: [
          {
            _id: products[0]._id,
            title: products[0].title,
            price: products[0].price,
            quantity: 1,
          },
          {
            _id: products[3]._id,
            title: products[3].title,
            price: products[3].price,
            quantity: 1,
          },
        ],
        subTotal: 119998,
        tax: 14399.76,
        totalAmount: 134397.76,
        cashierName: "John Cashier",
        status: "Delivered",
      },
      {
        orderId: "ORD-2024-002",
        customerName: "Fatima Khan",
        customerPhoneNumber: 3009876543,
        paymentMode: "Cash",
        cartItems: [
          {
            _id: products[6]._id,
            title: products[6].title,
            price: products[6].price,
            quantity: 2,
          },
          {
            _id: products[8]._id,
            title: products[8].title,
            price: products[8].price,
            quantity: 1,
          },
        ],
        subTotal: 12997,
        tax: 1559.64,
        totalAmount: 14556.64,
        cashierName: "John Cashier",
        status: "Delivered",
      },
      {
        orderId: "ORD-2024-003",
        customerName: "Ahmed Ali",
        customerPhoneNumber: 3007654321,
        paymentMode: "Credit Card",
        cartItems: [
          {
            _id: products[9]._id,
            title: products[9].title,
            price: products[9].price,
            quantity: 5,
          },
          {
            _id: products[10]._id,
            title: products[10].title,
            price: products[10].price,
            quantity: 3,
          },
        ],
        subTotal: 1700,
        tax: 204,
        totalAmount: 1904,
        cashierName: "Mike Staff",
        status: "Delivered",
      },
      {
        orderId: "ORD-2024-004",
        customerName: "Sara Malik",
        customerPhoneNumber: 3005551234,
        paymentMode: "Cash",
        cartItems: [
          {
            _id: products[2]._id,
            title: products[2].title,
            price: products[2].price,
            quantity: 1,
          },
        ],
        subTotal: 179999,
        tax: 21599.88,
        totalAmount: 201598.88,
        cashierName: "John Cashier",
        status: "Delivered",
      },
      {
        orderId: "ORD-2024-005",
        customerName: "Hassan Raza",
        customerPhoneNumber: 3004443333,
        paymentMode: "Credit Card",
        cartItems: [
          {
            _id: products[15]._id,
            title: products[15].title,
            price: products[15].price,
            quantity: 2,
          },
          {
            _id: products[16]._id,
            title: products[16].title,
            price: products[16].price,
            quantity: 1,
          },
        ],
        subTotal: 4297,
        tax: 515.64,
        totalAmount: 4812.64,
        cashierName: "Mike Staff",
        status: "Delivered",
      },
    ]);
    console.log(`✅ Created ${invoices.length} invoices\n`);

    // 7. Create Purchases
    console.log("🛒 Creating purchases...");
    const purchases = await Purchase.insertMany([
      {
        supplierId: suppliers[0]._id.toString(),
        supplierName: suppliers[0].name,
        items: [
          {
            productId: products[0]._id.toString(),
            productName: products[0].title,
            quantity: 10,
            purchasePrice: 75000,
            total: 750000,
          },
          {
            productId: products[1]._id.toString(),
            productName: products[1].title,
            quantity: 5,
            purchasePrice: 120000,
            total: 600000,
          },
        ],
        totalAmount: 1350000,
        notes: "Initial stock purchase",
        status: "Received",
      },
      {
        supplierId: suppliers[1]._id.toString(),
        supplierName: suppliers[1].name,
        items: [
          {
            productId: products[5]._id.toString(),
            productName: products[5].title,
            quantity: 50,
            purchasePrice: 1500,
            total: 75000,
          },
          {
            productId: products[6]._id.toString(),
            productName: products[6].title,
            quantity: 30,
            purchasePrice: 2500,
            total: 75000,
          },
        ],
        totalAmount: 150000,
        notes: "Clothing stock replenishment",
        status: "Received",
      },
      {
        supplierId: suppliers[2]._id.toString(),
        supplierName: suppliers[2].name,
        items: [
          {
            productId: products[9]._id.toString(),
            productName: products[9].title,
            quantity: 100,
            purchasePrice: 150,
            total: 15000,
          },
          {
            productId: products[10]._id.toString(),
            productName: products[10].title,
            quantity: 80,
            purchasePrice: 90,
            total: 7200,
          },
        ],
        totalAmount: 22200,
        notes: "Monthly food stock",
        status: "Received",
      },
      {
        supplierId: suppliers[3]._id.toString(),
        supplierName: suppliers[3].name,
        items: [
          {
            productId: products[13]._id.toString(),
            productName: products[13].title,
            quantity: 35,
            purchasePrice: 1200,
            total: 42000,
          },
        ],
        totalAmount: 42000,
        notes: "Home essentials order",
        status: "Received",
      },
    ]);
    console.log(`✅ Created ${purchases.length} purchases\n`);

    // 8. Create Purchase Returns
    console.log("↩️  Creating purchase returns...");
    const purchaseReturns = await PurchaseReturn.insertMany([
      {
        purchaseId: purchases[0]._id.toString(),
        supplierId: suppliers[0]._id.toString(),
        supplierName: suppliers[0].name,
        items: [
          {
            productId: products[0]._id.toString(),
            productName: products[0].title,
            quantity: 2,
            purchasePrice: 75000,
            total: 150000,
          },
        ],
        totalAmount: 150000,
        reason: "Defective units",
        status: "Returned",
      },
      {
        purchaseId: purchases[1]._id.toString(),
        supplierId: suppliers[1]._id.toString(),
        supplierName: suppliers[1].name,
        items: [
          {
            productId: products[5]._id.toString(),
            productName: products[5].title,
            quantity: 5,
            purchasePrice: 1500,
            total: 7500,
          },
        ],
        totalAmount: 7500,
        reason: "Wrong size delivered",
        status: "Returned",
      },
      {
        purchaseId: purchases[2]._id.toString(),
        supplierId: suppliers[2]._id.toString(),
        supplierName: suppliers[2].name,
        items: [
          {
            productId: products[9]._id.toString(),
            productName: products[9].title,
            quantity: 10,
            purchasePrice: 150,
            total: 1500,
          },
        ],
        totalAmount: 1500,
        reason: "Expired products",
        status: "Returned",
      },
      {
        purchaseId: purchases[3]._id.toString(),
        supplierId: suppliers[3]._id.toString(),
        supplierName: suppliers[3].name,
        items: [
          {
            productId: products[13]._id.toString(),
            productName: products[13].title,
            quantity: 3,
            purchasePrice: 1200,
            total: 3600,
          },
        ],
        totalAmount: 3600,
        reason: "Damaged during shipping",
        status: "Returned",
      },
    ]);
    console.log(`✅ Created ${purchaseReturns.length} purchase returns\n`);

    console.log("✨ Database seeding completed successfully!\n");
    console.log("📊 Summary:");
    console.log(`   - Users: ${users.length}`);
    console.log(`   - Categories: ${categories.length}`);
    console.log(`   - SubCategories: ${subCategories.length}`);
    console.log(`   - Products: ${products.length}`);
    console.log(`   - Suppliers: ${suppliers.length}`);
    console.log(`   - Invoices: ${invoices.length}`);
    console.log(`   - Purchases: ${purchases.length}`);
    console.log(`   - Purchase Returns: ${purchaseReturns.length}`);
    console.log("\n🔑 Login Credentials:");
    console.log("   Admin: admin@pos.com / 123456");
    console.log("   Cashier: cashier@pos.com / 123456");
    console.log("   Manager: manager@pos.com / 123456");
    console.log("   Staff: staff@pos.com / 123456");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
  } finally {
    mongoose.connection.close();
    console.log("\n🔌 Database connection closed");
  }
};

// Run the seed
connectDB().then(() => seedData());
