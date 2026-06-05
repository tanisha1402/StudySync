import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";
import "../styles/Auth.css";
import logo from "../assets/studysync-logo.png";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await loginUser(formData);

      localStorage.setItem(
        "token",
        data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );


      navigate("/dashboard");

    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Login Failed"
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
          Organize Tasks.
          <br />
          Track Progress.
          <br />
          Achieve More.
        </p>

      </div>

      <div className="auth-right">

        <div className="form-card">

          <h2>Welcome Back</h2>

          <form onSubmit={handleSubmit}>

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

            <button type="submit">
              Login
            </button>

          </form>

          <p>
            Don't have an account?{" "}
            <Link to="/register">
              Register
            </Link>
          </p>

        </div>

      </div>

    </div>
  );
}

export default Login;