const express = require('express');
const path = require('path');
const cors = require('cors');
const Razorpay = require('razorpay');
require('dotenv').config(); 

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
// 1. Pehle Express ko bolo ki 'src' folder se files check kare
// Agar file wahan mil gayi (jaise style.css), toh Express wahi ruk jayega
app.use(express.static(path.join(__dirname, 'src')));

// Sabse Important: Static files ka rasta
// Maan lo tumhari index.html, checkout.html, sitemap.xml sab 'public' folder mein hain
app.use(express.static(path.join(__dirname, 'public')));

// Razorpay Setup
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// 1. Order ID Generate karne ka route
app.post("/create-order", async (req, res) => {
  const options = {
    amount: 4900, // Rs 49 ke liye 4900 (paise)
    currency: "INR",
    receipt: "order_rcptid_" + Date.now()
  };

  try {
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error("Razorpay Error:", error);
    res.status(500).json({ error: "Razorpay order fail ho gaya" });
  }
});

// 2. Sitemap aur Robots Route (Direct path)
app.get('/sitemap.xml', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'sitemap.xml'));
});

app.get('/robots.txt', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'robots.txt'));
});

// 3. Page Routes
app.get('/checkout', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'checkout.html'));
});

// 2. Baaki saare routes ke liye index.html bhejo (For SPA like React/Vue)
// Ye tabhi chalega jab upar static folder mein file NAHI milegi
app.get('/*any', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html')); 
    // Note: Agar index.html 'src' mein hai toh yahan bhi 'src' likhein
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`SYSTEM LIVE ON PORT ${PORT}`));