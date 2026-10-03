"use client";

import { useEffect, useState } from "react";
import Navbar from "../../../components/Navbar";
import Sidebar from "../../../components/Sidebar";
import DashboardCard from "../../../components/DashboardCard";
import api from "../../../services/api";

export default function StaffDashboard() {
  const [stats, setStats] = useState({ products: 0, orders: 0, lowStock: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [productsRes, ordersRes, lowStockRes] = await Promise.all([
          api.get("/products?limit=1"),
          api.get("/orders?limit=1"),
          api.get("/inventory/low-stock"),
        ]);
        setStats({
          products: productsRes.data.total,
          orders: ordersRes.data.total,
          lowStock: lowStockRes.data.length,
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Staff Dashboard</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <DashboardCard title="Total Products" value={stats.products} />
            <DashboardCard title="Total Orders" value={stats.orders} />
            <DashboardCard title="Low Stock Items" value={stats.lowStock} />
          </div>
        </main>
      </div>
    </div>
  );
}
