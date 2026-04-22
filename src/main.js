window.toggleSidebar = () => {
    const menu = document.getElementById('side-menu');
    const overlay = document.getElementById('menu-overlay');
    
    menu.classList.toggle('open');
    overlay.classList.toggle('show');

    // Body scroll lock
    if (menu.classList.contains('open')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = 'auto';
    }
};

window.redirectToLogin = () => {
    // Aap yahan koi chota sa animation ya log add kar sakte hain
    window.location.href = "login.html";
};

// Firebase imports (Ensure ye aapke file ke top par ho)
import { db, doc, setDoc, serverTimestamp } from './firebase-config.js';

/**
 * Handle Login/Registration Form
 * Flow: Save to Firebase -> Save to LocalStorage -> Redirect to Payment
 */
window.handleAuth = async (event) => {
    event.preventDefault(); // Page refresh hone se rokne ke liye

    const name = document.getElementById('userName').value;
    const email = document.getElementById('userEmail').value;
    const phone = document.getElementById('userPhone').value;
    const btn = event.target.querySelector('button');

    // Basic Validation
    if (!name || !email || !phone) {
        alert("Protocol requires all fields to be filled.");
        return;
    }

    // Button state change
    btn.disabled = true;
    btn.innerText = "AUTHORIZING...";

    // 1. Generate Unique Document ID (Email + Timestamp)
    const userDocId = email.replace(/[^a-zA-Z0-9]/g, "") + "_" + Date.now();

    try {
        // 2. Save Data to Firebase Firestore (as a Lead)
        await setDoc(doc(db, "leads", userDocId), {
            name: name,
            email: email,
            phone: phone,
            status: "AWAITING_PAYMENT", // Taki pata chale payment pending hai
            source: "Login_Page",
            timestamp: serverTimestamp()
        });

        // 3. Save to Local Storage (Payment page par use karne ke liye)
        localStorage.setItem('custName', name);
        localStorage.setItem('custEmail', email);
        localStorage.setItem('custPhone', phone);
        localStorage.setItem('lastLeadId', userDocId);

        // 4. Redirect to Payment Page
        window.location.href = "checkout.html";

    } catch (error) {
        console.error("Auth Error:", error);
        alert("Security protocol failed. Please try again.");
        btn.disabled = false;
        btn.innerText = "Authorize & Continue →";
    }
};