"use client";

import { useEffect, useState } from "react";
import Navbar from "../../../components/Navbar";
import Sidebar from "../../../components/Sidebar";
import DashboardCard from "../../../components/DashboardCard";
import DashboardCharts from "../../../components/DashboardCharts";
import api from "../../../services/api";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ products: 0, orders: 0, lowStock: 0 });
  const [report, setReport] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalOrders: 0,
    totalInventoryRecords: 0,
    salesReport: [],
    categoryWiseSales: [],
    purchaseDetails: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, ordersRes, lowStockRes, summaryRes] = await Promise.all([
          api.get("/products?limit=1"),
          api.get("/orders?limit=1"),
          api.get("/inventory/low-stock"),
          api.get("/reports/summary"),
        ]);
        setStats({
          products: productsRes.data.total,
          orders: ordersRes.data.total,
          lowStock: lowStockRes.data.length,
        });
        setReport(summaryRes.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Admin Dashboard</h2>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <DashboardCard title="Total Products" value={report.totalProducts} />
            <DashboardCard title="Total Categories" value={report.totalCategories} />
            <DashboardCard title="Total Orders" value={report.totalOrders} />
            <DashboardCard title="Low Stock Items" value={stats.lowStock} />
          </div>

          <DashboardCharts
            salesReport={report.salesReport}
            categoryWiseSales={report.categoryWiseSales}
            purchaseDetails={report.purchaseDetails}
          />
        </main>
      </div>
    </div>
  );
}