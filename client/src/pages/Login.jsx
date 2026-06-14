import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";
import "../styles/Auth.css";
import logo from "../assets/studysync-logo.png";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await loginUser(formData);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/dashboard");
    } catch (error) {
      setError(error.response?.data?.message || "Login Failed");
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
            Organize Tasks.
            <br />
            Track Progress.
            <br />
            Achieve More.
          </p>
        </div>
      </div>

      <div className="auth-right">
        <div className="form-card">
          <div className="form-header">
            <h2>Welcome Back</h2>
            <p>Sign in to continue to StudySync</p>
          </div>

          {error && (
            <div className="error-msg">{error}</div>
          )}

          <form onSubmit={handleSubmit}>
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

            <button
              type="submit"
              className={loading ? "btn-loading" : ""}
              disabled={loading}
            >
              {loading ? "Signing in..." : "Login →"}
            </button>
          </form>

          <p className="switch-link">
            Don't have an account?{" "}
            <Link to="/register">Register</Link>
          </p>
        </div>
      </div>

    </div>
  );
}

export default Login;