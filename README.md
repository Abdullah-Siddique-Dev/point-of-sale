# 🏪 POS System - Complete Point of Sale Solution

A modern, full-featured Point of Sale system with separate Admin and Cashier panels, built with React, Node.js, Express, and MongoDB.

---

## 🌟 Features

### 👨‍💼 Admin Panel (Port 3001)
- 📊 Comprehensive Dashboard with Analytics
- 🛍️ Complete Product Management (CRUD)
- 🏷️ Category & SubCategory Management
- 👥 Customer Management
- 🏢 Supplier Management
- 📦 Purchase Order Management
- ↩️ Purchase Returns
- 📈 Advanced Statistics & Charts
- 📋 Inventory Reports & Alerts
- 🧾 Sales History & Invoices

### 👨‍💻 Cashier Panel (Port 3000)
- 🛒 Point of Sale Interface
- 📊 Dashboard with Key Metrics
- 🧾 Invoice Management
- 👥 Customer View
- 📦 Product Browsing
- 📈 Statistics
- 🏢 Supplier View
- 📋 Inventory View

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd POS_System
```

2. **Install Backend Dependencies**
```bash
cd POS_cashier/Backend_POS
npm install
```

3. **Install Cashier Frontend Dependencies**
```bash
cd ../Frontend_POS
npm install
```

4. **Install Admin Frontend Dependencies**
```bash
cd ../../POS_admin/Frontend_admin
npm install
```

5. **Configure Environment Variables**

Create `.env` files in:
- `POS_cashier/Backend_POS/.env`
- `POS_cashier/Frontend_POS/.env`
- `POS_admin/Frontend_admin/.env`

Backend `.env`:
```env
MONGO_URI=mongodb://localhost:27017/pos_system
PORT=4000
JWT_SECRET=your_jwt_secret_key
```

Frontend `.env` (Cashier):
```env
REACT_APP_SERVER_URL=http://localhost:4000
```

Frontend `.env` (Admin):
```env
REACT_APP_SERVER_URL=http://localhost:4000
```

6. **Seed the Database**
```bash
cd POS_cashier/Backend_POS
npm run seed
```

7. **Start the Servers**

Terminal 1 - Backend:
```bash
cd POS_cashier/Backend_POS
npm start
```

Terminal 2 - Cashier Frontend:
```bash
cd POS_cashier/Frontend_POS
npm start
```

Terminal 3 - Admin Frontend:
```bash
cd POS_admin/Frontend_admin
npm start
```

---

## 🔑 Default Login Credentials

| Role | Email | Password | Access Level |
|------|-------|----------|--------------|
| Admin | admin@pos.com | 123456 | Full Access |
| Cashier | cashier@pos.com | 123456 | POS Only |
| Manager | manager@pos.com | 123456 | Full Access |
| Staff | staff@pos.com | 123456 | POS Only |

---

## 🌐 Access URLs

- **Cashier Panel**: http://localhost:3000
- **Admin Panel**: http://localhost:3001
- **Backend API**: http://localhost:4000

---

## 📚 Documentation

### Complete Guides:
1. **[Quick Reference](QUICK_REFERENCE.md)** - Quick access to all important info
2. **[User Flow Documentation](USER_FLOW_DOCUMENTATION.md)** - Complete user flows for both panels
3. **[Visual Flow Diagrams](VISUAL_FLOW_DIAGRAM.md)** - System architecture and process flows
4. **[Database Seeding Guide](DATABASE_SEEDING_COMPLETE.md)** - Database setup and seeding info
5. **[Project Status](PROJECT_STATUS.md)** - Current project status and achievements
6. **[Design System](DESIGN_SYSTEM.md)** - UI/UX design guidelines

### Quick Links:
- 🔑 [Login Credentials](#-default-login-credentials)
- 🚀 [Quick Start](#-quick-start)
- 📊 [Features](#-features)
- 🎯 [Common Tasks](#-common-tasks)
- 🐛 [Troubleshooting](#-troubleshooting)

---

## 🎯 Common Tasks

### Making a Sale (Cashier)
1. Login with cashier credentials
2. Browse or search for products
3. Click products to add to cart
4. Enter customer details
5. Select payment method
6. Click "Create Order"
7. Print invoice (optional)

### Adding a Product (Admin)
1. Login with admin credentials
2. Navigate to Products → Add Product
3. Fill in product details
4. Upload product image
5. Set price and stock
6. Click "Add Product"

### Creating a Purchase Order (Admin)
1. Login with admin credentials
2. Navigate to Purchase → Add New Purchase
3. Select supplier
4. Add products with quantities and prices
5. Add notes (optional)
6. Click "Create Purchase"
7. Stock is automatically updated

### Checking Inventory
1. Login (any role)
2. Navigate to Inventory → Total Stock
3. View all products with stock levels
4. Check Out of Stock page for critical alerts
5. Check Stock Alert page for low stock warnings

---

## 📊 Database Statistics

### Seeded Data:
- **Users**: 4 accounts (Admin, Cashier, Manager, Staff)
- **Products**: 17 items across 5 categories
- **Total Stock**: 753 units
- **Categories**: 5 main categories
- **SubCategories**: 6 subcategories
- **Suppliers**: 5 suppliers
- **Sample Sales**: 5 invoices
- **Total Revenue**: Rs 357,270.92
- **Purchase Orders**: 4 orders
- **Purchase Returns**: 4 returns

---

## 🛠️ Tech Stack

### Frontend:
- React.js
- Ant Design (UI Components)
- React Router (Navigation)
- Recharts (Charts & Analytics)

### Backend:
- Node.js
- Express.js
- MongoDB (Database)
- Mongoose (ODM)
- JWT (Authentication)
- bcryptjs (Password Hashing)

### Development Tools:
- ESLint
- Prettier
- dotenv

---

## 📁 Project Structure

```
POS_System/
├── POS_admin/
│   ├── Backend_admin/
│   │   ├── models/
│   │   ├── routes/
│   │   └── server.js
│   └── Frontend_admin/
│       ├── public/
│       └── src/
│           ├── components/
│           ├── pages/
│           └── App.jsx
│
├── POS_cashier/
│   ├── Backend_POS/
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Product.js
│   │   │   ├── Category.js
│   │   │   ├── Invoice.js
│   │   │   ├── Supplier.js
│   │   │   ├── Purchase.js
│   │   │   └── PurchaseReturn.js
│   │   ├── routes/
│   │   ├── seed.js
│   │   └── server.js
│   └── Frontend_POS/
│       ├── public/
│       └── src/
│           ├── components/
│           │   ├── cart/
│           │   ├── categories/
│           │   ├── products/
│           │   ├── sidebar/
│           │   └── header/
│           ├── pages/
│           │   ├── auth/
│           │   ├── inventory/
│           │   └── ...
│           └── App.jsx
│
└── Documentation/
    ├── README.md (This file)
    ├── QUICK_REFERENCE.md
    ├── USER_FLOW_DOCUMENTATION.md
    ├── VISUAL_FLOW_DIAGRAM.md
    ├── DATABASE_SEEDING_COMPLETE.md
    ├── PROJECT_STATUS.md
    └── DESIGN_SYSTEM.md
```

---

## 🎨 Design Features

### Modern UI:
- ✅ Dark sidebar with light content area
- ✅ Premium stat cards with animations
- ✅ Modern table designs
- ✅ Smooth transitions and hover effects
- ✅ Professional typography
- ✅ Consistent color scheme
- ✅ Custom scrollbar
- ✅ Responsive layouts

### User Experience:
- ✅ Intuitive navigation
- ✅ Real-time search and filtering
- ✅ Loading states
- ✅ Success/error messages
- ✅ Confirmation dialogs
- ✅ Print functionality
- ✅ Role-based access control
- ✅ Auto-redirect for admins

---

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcryptjs
- Role-based access control
- Protected routes
- Secure API endpoints
- Environment variable configuration

---

## 📈 Key Metrics

### Performance:
- Fast product search and filtering
- Real-time cart updates
- Instant stock updates
- Quick invoice generation

### Scalability:
- Modular architecture
- Separate admin and cashier panels
- RESTful API design
- MongoDB for flexible data storage

---

## 🐛 Troubleshooting

### Backend won't start?
- Check if MongoDB is running
- Verify `.env` file exists with correct MONGO_URI
- Check if port 4000 is available
- Run `npm install` in Backend_POS folder

### Frontend won't start?
- Check if backend is running on port 4000
- Verify `.env` file exists with REACT_APP_SERVER_URL
- Check if ports 3000/3001 are available
- Run `npm install` in Frontend folders
- Clear browser cache

### Can't login?
- Use exact credentials from the table above
- Ensure backend is running
- Check MongoDB connection
- Verify database is seeded

### Products not showing?
- Run seed script: `npm run seed`
- Check backend console for errors
- Verify MongoDB connection
- Check browser console for errors

### Images not loading?
- Check internet connection (images from Unsplash CDN)
- Verify image URLs in database
- Check browser console for CORS errors

---

## 🔄 Database Management

### Seed Database:
```bash
cd POS_cashier/Backend_POS
npm run seed
```

### Reset Database:
```bash
# Stop all servers first
cd POS_cashier/Backend_POS
npm run seed
# This will delete all existing data and create fresh seed data
```

### Backup Database:
```bash
mongodump --db pos_system --out ./backup
```

### Restore Database:
```bash
mongorestore --db pos_system ./backup/pos_system
```

---

## 🚀 Deployment

### Backend Deployment:
1. Set up MongoDB Atlas or similar cloud database
2. Update MONGO_URI in production environment
3. Deploy to Heroku, AWS, or similar platform
4. Set environment variables

### Frontend Deployment:
1. Build production version: `npm run build`
2. Deploy to Netlify, Vercel, or similar platform
3. Update API URL to production backend
4. Configure environment variables

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

## 📝 License

This project is licensed under the MIT License.

---

## 👥 Team

- **Developer**: [Your Name]
- **Project Type**: Point of Sale System
- **Version**: 1.0.0
- **Last Updated**: March 24, 2026

---

## 📞 Support

For questions or issues:
1. Check the [Quick Reference](QUICK_REFERENCE.md)
2. Review [User Flow Documentation](USER_FLOW_DOCUMENTATION.md)
3. Check [Troubleshooting](#-troubleshooting) section
4. Open an issue on GitHub

---

## 🎉 Acknowledgments

- Ant Design for UI components
- Unsplash for product images
- MongoDB for database
- React team for the framework
- Express team for the backend framework

---

## 📊 Project Status

✅ **Status**: Production Ready

### Completed Features:
- ✅ User authentication and authorization
- ✅ Product management (CRUD)
- ✅ Category management (CRUD)
- ✅ Supplier management (CRUD)
- ✅ Purchase order management
- ✅ Purchase returns
- ✅ Point of Sale interface
- ✅ Invoice generation and printing
- ✅ Inventory management
- ✅ Stock alerts
- ✅ Statistics and analytics
- ✅ Customer management
- ✅ Modern UI/UX design
- ✅ Database seeding
- ✅ Complete documentation

---

## 🔮 Future Enhancements

Potential features for future versions:
- 📱 Mobile responsive design
- 📧 Email notifications
- 🔔 Real-time notifications
- 📄 Advanced PDF reports
- 🔍 Advanced analytics
- 📈 Sales forecasting
- 👥 Employee management
- 🎨 Theme customization
- 🌐 Multi-language support
- 💳 Payment gateway integration
- 📦 Barcode scanning
- 🖨️ Receipt printer integration
- 📱 Mobile app version
- ☁️ Cloud deployment

---

**Made with ❤️ for efficient business management**

