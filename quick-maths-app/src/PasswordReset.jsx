import { useState } from "react";
import supabase from "./supabaseClient";
import { useDatabase } from "./DatabaseContext";
import "./PasswordReset.css"

function PasswordReset({ setScreen }) {
    const { user } = useDatabase();

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [loading, setLoading] = useState(false);

    async function handleReset() {
        setError(null);
        setSuccessMessage(null);

        if (!newPassword || !confirmPassword) {
            setError("Please fill in both fields");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);

        const { error } = await supabase.auth.updateUser({ password: newPassword });

        setLoading(false);

        if (error) {
            setError(error.message);
        } else {
            setSuccessMessage("Password reset successful! Redirecting...");
            setTimeout(() => setScreen("mainMenu"), 2000);
        }

    }

    return (
        <div className="reset-password">
            <h2>Reset your password</h2>
            <div className="reset-password-input">
                <label htmlFor="newPassword">New Password</label>
                <input type="password" id="newPassword" onChange={(e) => setNewPassword(e.target.value)} />
                <label htmlFor="confirmPassword">Confirm New Password</label>
                <input type="password" id="confirmPassword" onChange={(e) => setConfirmPassword(e.target.value)} />
                <button onClick={handleReset} disabled={loading}>
                    {loading ? "Resetting" : "Reset Password"}
                </button>
            </div>

            {error && <p style={{ color: "red" }}>{error}</p>}
            {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
            <button onClick={() => setScreen("mainMenu")}>Back to Main Menu</button>
        </div>
    )
}

export default PasswordReset;