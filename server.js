require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from public folder

// In-memory storage for orders (use a database in production)
let orders = [];
let orderIdCounter = 1000;

// Serve the main HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'main.html'));
});

// API to submit order
app.post('/api/orders', (req, res) => {
  const { customerDetails, cart, paymentMethod } = req.body;
  const orderId = `NG-${orderIdCounter++}`;
  const order = {
    id: orderId,
    customer: customerDetails,
    items: cart,
    paymentMethod,
    total: cart.reduce((sum, item) => sum + item.price, 0),
    status: 'pending',
    date: new Date()
  };
  orders.push(order);
  res.json({ success: true, orderId, message: 'Order placed successfully!' });
});

// API to get orders (for admin, optional)
app.get('/api/orders', (req, res) => {
  res.json(orders);
});

// Expose non-sensitive EmailJS config to client
app.get('/api/config', (req, res) => {
  const config = {
    emailjsPublicKey: process.env.EMAILJS_PUBLIC_KEY || null,
    serviceId: process.env.EMAILJS_SERVICE_ID || null,
    templateAdmin: process.env.EMAILJS_TEMPLATE_ADMIN || null,
    templateCustomer: process.env.EMAILJS_TEMPLATE_CUSTOMER || null
  };
  res.json(config);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});