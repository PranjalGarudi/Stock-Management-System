"use client";

import Link from "next/link";
import { useAuth } from "../context/AuthContext";

const links = [
  {href:"/dashboard/admin",label:"Dashboard", roles:["admin"]},
  { href: "/products", label: "Products", roles: ["admin", "manager", "staff"] },
  { href: "/inventory", label: "Inventory", roles: ["admin", "manager", "staff"] },
  { href: "/orders", label: "Orders", roles: ["admin", "manager", "staff"] },
];

export default function Sidebar() {
  const { user } = useAuth();
  const role = user?.role;

  return (
    <aside className="w-56 bg-gray-900 text-gray-100 min-h-screen p-4">
      <nav className="flex flex-col gap-2">
        {links
          .filter((l) => !role || l.roles.includes(role))
          .map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="px-3 py-2 rounded hover:bg-gray-800 text-sm"
            >
              {l.label}
            </Link>
          ))}
      </nav>
    </aside>
  );
}
