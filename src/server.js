const express = require('express');
const path = require('path');
const cors = require('cors');
const Razorpay = require('razorpay');
require('dotenv').config(); // Yeh .env file se keys read karne ke liye hai

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// 1. Static Files: Ye line 'public' folder ki saari files ko expose karti hai
app.use(express.static(path.join(__dirname, 'public')));

// 2. Routes: Main landing page ke liye
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 3. Checkout Page: Direct access ke liye
app.get('/checkout', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'checkout.html'));
});
// 4. Google Bot ke liye robots.txt route
app.get('/robots.txt', (req, res) => {
    res.type('text/plain');
    res.send("User-agent: *\nDisallow:");
});

// Sitemap route
app.get('/sitemap.xml', (req, res) => {
  res.sendFile(path.join(__dirname, '../sitemap.xml'));
});
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET, // <--- Secret Key yahan use hoti hai
});

// Example: Order create karne ka endpoint
app.post("/create-order", async (req, res) => {
  const options = {
    amount: 490, // amount in smallest currency unit (500 INR)
    currency: "INR",
    receipt: "order_rcptid_11"
  };

  try {
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Robots.txt route
app.get('/robots.txt', (req, res) => {
  res.sendFile(path.join(__dirname, '../robots.txt'));
});
// Port settings for local & live
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`SYSTEM LIVE ON PORT ${PORT}`));

