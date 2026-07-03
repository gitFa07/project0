import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import api from "../services/api";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
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

    if (loading) return;

    try {
      setLoading(true);
      setError("");

      await api.post("/auth/register", formData);

      navigate("/login");
    } catch (error) {
      setError(error.response?.data?.message || "Registration failed.");
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
          Register
        </h1>

        {error && (
          <p className="mb-4 rounded bg-red-600/20 p-2 text-red-400">{error}</p>
        )}

        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          autoFocus
          required
          className="mb-4 w-full rounded-lg border border-gray-700 bg-[#212121] p-3 text-white outline-none"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          autoComplete="email"
          required
          className="mb-4 w-full rounded-lg border border-gray-700 bg-[#212121] p-3 text-white outline-none"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          autoComplete="new-password"
          required
          className="mb-6 w-full rounded-lg border border-gray-700 bg-[#212121] p-3 text-white outline-none"
        />

        <button
          disabled={loading}
          className="w-full rounded-lg bg-white py-3 font-semibold text-black hover:bg-gray-200"
        >
          {loading ? "Creating account..." : "Register"}
        </button>

        <p className="mt-4 text-center text-gray-400">
          Already have an account?{" "}
          <Link to="/login" className="text-white hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Register;
