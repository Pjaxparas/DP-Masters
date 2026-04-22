const express = require('express');
const path = require('path');
const cors = require('cors');
const Razorpay = require('razorpay');
require('dotenv').config();

const app = express();

// ===== MIDDLEWARE =====
app.use(cors());
app.use(express.json());

// ===== STATIC FILES =====
// Option A: Dono folders ko root (/) se serve karo (simple)
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'src')));

// Option B (BETTER): Alag paths se serve karo (conflict avoid karne ke liye)
// app.use(express.static(path.join(__dirname, 'public')));
// app.use('/src', express.static(path.join(__dirname, 'src')));

// ===== RAZORPAY SETUP =====
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ===== API ROUTES =====

// Razorpay Order Creation
app.post("/create-order", async (req, res) => {
    const options = {
        amount: 4900, // ₹49 in paise
        currency: "INR",
        receipt: "order_rcptid_" + Date.now()
    };

    try {
        const order = await razorpay.orders.create(options);
        res.json(order);
    } catch (error) {
        console.error("Razorpay Error:", error);
        res.status(500).json({ error: "Razorpay order creation failed" });
    }
});

// ===== PAGE ROUTES (Clean URLs without .html) =====

// Homepage
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Specific pages (optional - for clean URLs)
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

app.get('/checkout', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'checkout.html'));
});

app.get('/success', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'success.html'));
});

app.get('/failure', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'failure.html'));
});

// ===== 404 HANDLER (Catch-all - MUST BE LAST) =====
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'public', 'index.html'));
    // Ya agar 404 page alag hai:
    // res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

// ===== SERVER START =====
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 SYSTEM LIVE ON PORT ${PORT}`);
    console.log(`🌐 http://localhost:${PORT}`);
});