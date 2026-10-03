"use client";

import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="flex items-center justify-between bg-white border-b px-6 py-3 shadow-sm">
      <h1 className="text-lg font-semibold text-gray-800">Inventory Management System</h1>
      {user && (
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            {user.name} <span className="uppercase text-xs text-gray-400">({user.role})</span>
          </span>
          <button
            onClick={logout}
            className="text-sm bg-red-500 text-white px-3 py-1.5 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      )}
    </header>
  );
}
