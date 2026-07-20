# ISSHUE Super Admin Backend

## Installation

```bash
npm install
```

## Environment Setup

Create a `.env` file with:

```
MONGO_URI=mongodb://localhost:27017/super_admin_pos
PORT=5000
```

## Running the Server

```bash
npm start
```

The server will run on http://localhost:5000

## API Endpoints

### Sales
- GET `/api/sales/get-all` - Get all sales
- POST `/api/sales/add-sale` - Create new sale
- PUT `/api/sales/update-sale/:id` - Update sale
- DELETE `/api/sales/delete-sale/:id` - Delete sale
- GET `/api/sales/get-sale/:id` - Get sale by ID

### Invoice Text
- GET `/api/invoice-text/get-settings` - Get invoice text settings
- PUT `/api/invoice-text/update-settings/:id` - Update invoice text settings
