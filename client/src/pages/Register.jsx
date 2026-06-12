import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";
import "../styles/Auth.css";
import logo from "../assets/studysync-logo.png";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const data = await registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      localStorage.setItem("token", data.token);
      navigate("/");
    } catch (error) {
      setError(error.response?.data?.message || "Registration Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">

      <div className="auth-left">
        <div className="auth-left-content">
          <img src={logo} alt="StudySync" className="logo" />
          <h1>StudySync</h1>
          <p>
            Join StudySync and
            <br />
            manage your academic
            <br />
            life efficiently.
          </p>
        </div>
      </div>

      <div className="auth-right">
        <div className="form-card">
          <div className="form-header">
            <h2>Create Account</h2>
            <p>Join StudySync today</p>
          </div>

          {error && (
            <div className="error-msg">{error}</div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label>Password</label>
              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <span
                  className="eye-icon"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword
                    ? <AiOutlineEyeInvisible />
                    : <AiOutlineEye />
                  }
                </span>
              </div>
            </div>

            <div className="input-group">
              <label>Confirm Password</label>
              <div className="password-wrapper">
                <input
                  type={showConfirm ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="••••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
                <span
                  className="eye-icon"
                  onClick={() => setShowConfirm(!showConfirm)}
                >
                  {showConfirm
                    ? <AiOutlineEyeInvisible />
                    : <AiOutlineEye />
                  }
                </span>
              </div>
            </div>

            <button
              type="submit"
              className={loading ? "btn-loading" : ""}
              disabled={loading}
            >
              {loading ? "Creating account..." : "Register →"}
            </button>
          </form>

          <p className="switch-link">
            Already have an account?{" "}
            <Link to="/">Login</Link>
          </p>
        </div>
      </div>

    </div>
  );
}

export default Register;