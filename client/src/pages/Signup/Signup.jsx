import React, { useState } from "react";
import NavBar from "../../components/NavBar/NavBar";
import PasswordInput from "../../components/Input/PasswordInput";
import { Link, useNavigate } from "react-router-dom";
import { validateEmail } from "../../utils/helper";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const handlesignup = async (e) => {
    e.preventDefault();

    // Form validation
    if (!name) {
      setError("Please enter your name");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email");
      return;
    }
    if (!password) {
      setError("Please enter a password");
      return;
    }

    setError("");
    setSuccess("");

    try {
      // Make the API call to create an account
      const response = await fetch("http://localhost:8000/create-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName: name, email, password }),
      });

      const data = await response.json();

      if (data.error) {
        setError(data.message);
      } else {
        setSuccess("Account created successfully!");
        setTimeout(() => navigate("/login"), 2000); // Redirect to login page after success
      }
    } catch (err) {
      setError("Failed to create an account. Please try again.");
    }
  };

  return (
    <div>
      <NavBar />
      <div className="flex items-center justify-center mt-28 ">
        <div className="w-96 border rounded bg-white px-7 py-10">
          <form onSubmit={handlesignup}>
            <h4 className="text-2xl mb-7">Signup</h4>

            <input
              type="text"
              placeholder="Name"
              className="input-box"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Email"
              className="input-box"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && <p className="text-red-500 text-xs pb-1">{error}</p>}
            {success && (
              <p className="text-green-500 text-xs pb-1">{success}</p>
            )}

            <button type="submit" className="btn-primary">
              Create Account
            </button>

            <p className="text-sm text-center mt-4">
              Already have an account?{" "}
              <Link to="/login" className="font-medium text-primary underline">
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
