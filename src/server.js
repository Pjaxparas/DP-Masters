const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

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

// Port settings for local & live
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`SYSTEM LIVE ON PORT ${PORT}`));

