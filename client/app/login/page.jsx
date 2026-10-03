"use client";

import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-sm border w-full max-w-sm"
      >
        <h2 className="text-xl font-semibold mb-6 text-gray-800">Sign in</h2>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm p-2 rounded mb-4">{error}</div>
        )}

        <label className="block text-sm text-gray-600 mb-1">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full border rounded px-3 py-2 mb-4 text-sm"
        />

        <label className="block text-sm text-gray-600 mb-1">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full border rounded px-3 py-2 mb-6 text-sm"
        />

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-blue-600 text-white py-2 rounded text-sm hover:bg-blue-700 disabled:opacity-50"
        >
          {submitting ? "Signing in..." : "Sign in"}
        </button>

        <p className="text-sm text-gray-500 mt-4 text-center">
        Need an account?{" "}
        <a href="/register" className="text-blue-600 hover:underline">
        Register
        </a>
</p>
      </form>
    </div>
  );
}
