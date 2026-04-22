import { 
    signInWithEmailAndPassword, 
    GoogleAuthProvider, 
    signInWithPopup,
    signOut,
    sendEmailVerification

} from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";
import { auth } from "./firebase-config.js";

const googleProvider = new GoogleAuthProvider();

window.handleLogin = async (event) => {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPass').value;
    const btn = event.target.querySelector('button');

    if (!email || !password) {
        alert("⚠️ Please fill all fields!");
        return;
    }

    btn.disabled = true;
    btn.innerText = "VERIFYING...";

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Email verification check
        // Email verification check (Is hisse ko update karein)
if (!user.emailVerified) {
    const resend = confirm("⚠️ Your email is not verified! \n\nClick 'OK' to resend the verification link to " + email);
    
    if (resend) {
        try {
            await sendEmailVerification(user);
            alert("✅ Verification link sent! Please check your inbox (and spam folder).");
        } catch (error) {
            alert("🚨 Error sending mail: " + error.message);
        }
    }

    await signOut(auth); // User ko sign out karna zaroori hai jab tak verify na ho
    btn.disabled = false;
    btn.innerText = "Verify Identity →";
    return;
}

        localStorage.setItem('custEmail', email);
        window.location.href = "dashboard.html";

    } catch (error) {
        btn.disabled = false;
        btn.innerText = "Verify Identity →";

        switch (error.code) {
            case 'auth/invalid-credential':
            case 'auth/user-not-found':
            case 'auth/wrong-password':
                alert("❌ Invalid credentials!");
                break;
            case 'auth/invalid-email':
                alert("📧 Invalid email format.");
                break;
            case 'auth/too-many-requests':
                alert("🔒 Too many attempts. Try later.");
                break;
            default:
                alert("🚨 Error: " + error.message);
        }
    }
};

window.handleGoogleLogin = async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        localStorage.setItem('custEmail', result.user.email);
        window.location.href = "dashboard.html";
    } catch (error) {
        if (error.code !== 'auth/popup-closed-by-user') {
            alert("🚨 Google Login Error: " + error.message);
        }
    }
};