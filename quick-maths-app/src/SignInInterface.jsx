import { useDatabase } from "./DatabaseContext";

function SignInInterface({ setScreen }) {
  const { signIn } = useDatabase();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle sign up logic here
    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;
    signIn(email, password)
      .then((user) => {
        if (user) {
          console.log("User signed up successfully:", user);
          setScreen("mainMenu"); // Redirect to main menu after successful sign up
        } else {
          console.error("Sign up failed");
        }
      })
      .catch((error) => {
        console.error("Error signing up:", error.message);
      });
  };

  return (
    <div className="sign-in-interface">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" required />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" name="password" required />
        </div>
        <button type="submit">Sign In</button>
      </form>
      <button onClick={() => setScreen("mainMenu")}>Back to Main Menu</button>
    </div>
  );
}

export default SignInInterface;