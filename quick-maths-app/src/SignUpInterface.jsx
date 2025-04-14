import { useDatabase } from "./DatabaseContext";
import { useState } from "react";

function SignUpInterface({ setScreen }) {
  const { signUp } = useDatabase();

  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle sign up logic here
    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;
    const displayName = form["display-name"].value;

    signUp(displayName, email, password)
      .then((user) => {
        if (user) {
          console.log("User signed up successfully:", user);
          setScreen("mainMenu"); // Redirect to main menu after successful sign up
        } else {
          console.error("Sign up failed");
        }
      })
      .catch((error) => {
        setErrorMessage(error.message);
      });
  };

  return (
    <div className="sign-up-interface">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="display-name">Username:</label>
          <input type="text" id="display-name" name="display-name" required />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" required />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" name="password" required />
        </div>
        {errorMessage.length > 0 && (
          <p className="error-message">{errorMessage}</p>
        )}
        <button type="submit">Sign Up</button>
      </form>
      <button onClick={() => setScreen("mainMenu")}>Back to Main Menu</button>
    </div>
  );
}

export default SignUpInterface;
