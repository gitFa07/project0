import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const response = await api.post("/auth/login", formData);

      login(response.data.user, response.data.token);

      navigate("/");
    } catch (error) {
      setError(error.response?.data?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-[#212121]">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-xl bg-[#2f2f2f] p-8"
      >
        <h1 className="mb-6 text-center text-3xl font-bold text-white">
          Login
        </h1>
        {error && (
          <p className="mb-4 rounded bg-red-600/20 p-2 text-red-400">{error}</p>
        )}
        <input
          autoFocus
          required
          autoComplete="email"
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="mb-4 w-full rounded-lg border border-gray-700 bg-[#212121] p-3 text-white outline-none"
        />

        <input
          required
          autoComplete="current-password"
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="mb-6 w-full rounded-lg border border-gray-700 bg-[#212121] p-3 text-white outline-none"
        />

        <button
          disabled={loading}
          className="w-full rounded-lg bg-white py-3 font-semibold text-black hover:bg-gray-200"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        <p className="mt-4 text-center text-gray-400">
          Don't have an account?{" "}
          <Link to="/register" className="text-white hover:underline">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
