import { useState } from "react";
import supabase from "./supabaseClient";
import "./ForgotPassword.css";

function ForgotPassword({ setScreen }) {
    const [ email, setEmail ] = useState("");
    const [ message, setMessage ] = useState(null);

    async function handleSendEmail() {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: 'https://r41ryan.github.io/quick-maths-web/',
        });

        setMessage("Password Reset email sent!")
    }

    return (
        <div className="forgot-password">
            <h2>Forgot your password?</h2>
            <p>Enter your email address. If it an account with that email exists, we will send an email to allow you to reset your password.</p>
            <div className="forgot-password-input">
                <label htmlFor="email">Your Email Address:</label>
                <input id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <button onClick={handleSendEmail}>Send Password Reset Email</button>
            </div>
            <div className="forgot-password-output">
                {message && <p>{message}</p>}
            </div>
            <button onClick={() => setScreen("signIn")}>Return to Sign In</button>
        </div>
    )
}

export default ForgotPassword;