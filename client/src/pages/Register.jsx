import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";
import "../styles/Auth.css";
import logo from "../assets/studysync-logo.png";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      formData.password !==
      formData.confirmPassword
    ) {
      alert("Passwords do not match");
      return;
    }

    try {
      const data = await registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      localStorage.setItem(
        "token",
        data.token
      );

      alert("Registration Successful!");

      navigate("/");

    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Registration Failed"
      );
    }
  };

  return (
    <div className="auth-container">

      <div className="auth-left">

        <img
          src={logo}
          alt="StudySync"
          className="logo"
        />

        <h1>StudySync</h1>

        <p>
          Join StudySync and
          <br />
          manage your academic
          <br />
          life efficiently.
        </p>

      </div>

      <div className="auth-right">

        <div className="form-card">

          <h2>Create Account</h2>

          <form onSubmit={handleSubmit}>

            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />

            <button type="submit">
              Register
            </button>

          </form>

          <p>
            Already have an account?{" "}
            <Link to="/">
              Login
            </Link>
          </p>

        </div>

      </div>

    </div>
  );
}

export default Register;