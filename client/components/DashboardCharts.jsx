"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = ["#1e293b", "#0ea5e9", "#fb923c", "#22c55e", "#a855f7", "#ef4444"];

export default function DashboardCharts({ salesReport, categoryWiseSales, purchaseDetails }) {
  return (
    <div className="mt-6 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Sales Report - bar chart */}
        <div className="bg-white border rounded p-4 lg:col-span-2">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Sales Report</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={salesReport}>
              <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} angle={-20} textAnchor="end" height={60} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="remaining" name="Remaining Quantity" fill="#1e293b" />
              <Bar dataKey="sold" name="Sold Quantity" fill="#fb923c" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category Wise Sales % */}
        <div className="bg-white border rounded p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Category Wise Sales (%)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={categoryWiseSales}
                dataKey="percentage"
                nameKey="category"
                cx="50%"
                cy="50%"
                outerRadius={70}
              >
                {categoryWiseSales.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <ul className="mt-3 space-y-1 text-sm">
            {categoryWiseSales.map((c, i) => (
              <li key={c.category} className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full inline-block"
                    style={{ backgroundColor: COLORS[i % COLORS.length] }}
                  />
                  {c.category}
                </span>
                <span className="font-medium">{c.percentage}%</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Purchase Details table */}
      <div className="bg-white border rounded p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Purchase Details</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2">Order #</th>
              <th className="p-2">Category</th>
              <th className="p-2">Product</th>
              <th className="p-2">Quantity</th>
              <th className="p-2">Price</th>
            </tr>
          </thead>
          <tbody>
            {purchaseDetails.map((row, i) => (
              <tr key={i} className="border-t">
                <td className="p-2">{row.orderNumber}</td>
                <td className="p-2">{row.category}</td>
                <td className="p-2">{row.product}</td>
                <td className="p-2">{row.quantity}</td>
                <td className="p-2">${row.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}