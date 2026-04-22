import { 
    createUserWithEmailAndPassword, 
    sendEmailVerification, 
    signOut 
} from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";
import { auth, db } from "./firebase-config.js";

window.handleRegistration = async (event) => {
    event.preventDefault();

    const fullName = document.getElementById('regFullName').value.trim();
    const dob = document.getElementById('regDOB').value;
    const phone = document.getElementById('regPhone').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const pass = document.getElementById('regPass').value;
    const confirmPass = document.getElementById('regConfirmPass').value;
    const btn = event.target.querySelector('button');

    // Validations (same as before)
    const nameRegex = /^[a-zA-Z\s]+$/;
    if (!nameRegex.test(fullName)) {
        alert("⚠️ INVALID NAME: No numbers/special chars allowed.");
        return;
    }

    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
    if (age < 18) {
        alert("🚫 You must be 18+ years old.");
        return;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
        alert("📱 Enter exactly 10 digits for phone.");
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert("📧 Invalid email format.");
        return;
    }

    const passRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    if (!passRegex.test(pass)) {
        alert("🔐 Weak password: Min 8 chars with letters, numbers & special chars.");
        return;
    }

    if (pass !== confirmPass) {
        alert("❌ Passwords do not match!");
        return;
    }

    // Firebase Registration
    btn.disabled = true;
    btn.innerText = "INITIALIZING PROTOCOL...";

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
        const user = userCredential.user;

        await sendEmailVerification(user);

        await setDoc(doc(db, "members", user.uid), {
            fullName: fullName,
            dob: dob,
            phone: phone,
            email: email,
            role: "member",
            emailVerified: false,
            joinedAt: new Date().toISOString()
        });

        localStorage.setItem('custName', fullName);
        localStorage.setItem('custEmail', email);

        await signOut(auth);

        alert(`✅ Registration Successful!\n\n📧 Verification link sent to:\n${email}\n\nVerify your email, then login.`);
        window.location.href = "login.html";

    } catch (error) {
        console.error("Registration Error:", error);
        
        if (error.code === 'auth/email-already-in-use') {
            alert("⚠️ Email already registered. Please login.");
            window.location.href = "login.html";
        } else if (error.code === 'auth/weak-password') {
            alert("🔐 Password too weak.");
        } else if (error.code === 'auth/network-request-failed') {
            alert("📡 Network error. Check internet.");
        } else {
            alert("🚨 Error: " + error.message);
        }

        btn.disabled = false;
        btn.innerText = "Initialize Protocol →";
    }
};