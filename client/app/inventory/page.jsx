"use client";

import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import api from "../../services/api";

export default function InventoryPage() {
  const [inventory, setInventory] = useState([]);
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [edits, setEdits] = useState({});

  const fetchInventory = async () => {
    const { data } = await api.get("/inventory", {
      params: { page, limit: 10, lowStock: lowStockOnly },
    });
    setInventory(data.inventory);
    setPages(data.pages);
  };

  useEffect(() => {
    fetchInventory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, lowStockOnly]);

  const handleUpdate = async (productId) => {
    const quantity = edits[productId];
    if (quantity === undefined) return;
    await api.put(`/inventory/${productId}`, { quantity: Number(quantity) });
    fetchInventory();
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Inventory</h2>

          <label className="flex items-center gap-2 mb-4 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={lowStockOnly}
              onChange={(e) => {
                setPage(1);
                setLowStockOnly(e.target.checked);
              }}
            />
            Show low-stock items only
          </label>

          <table className="w-full bg-white border rounded text-sm">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-3">Product</th>
                <th className="p-3">SKU</th>
                <th className="p-3">Quantity</th>
                <th className="p-3">Location</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((item) => (
                <tr key={item._id} className="border-t">
                  <td className="p-3">{item.product?.name}</td>
                  <td className="p-3">{item.product?.sku}</td>
                  <td className="p-3">
                    <input
                      type="number"
                      defaultValue={item.quantity}
                      onChange={(e) =>
                        setEdits({ ...edits, [item.product._id]: e.target.value })
                      }
                      className="border rounded px-2 py-1 w-24"
                    />
                    {item.product &&
                      item.quantity <= item.product.lowStockThreshold && (
                        <span className="ml-2 text-xs text-red-600 font-medium">Low</span>
                      )}
                  </td>
                  <td className="p-3">{item.location}</td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => handleUpdate(item.product._id)}
                      className="text-blue-600 hover:underline"
                    >
                      Save
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex gap-2 mt-4">
            {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`px-3 py-1 rounded text-sm border ${
                  p === page ? "bg-blue-600 text-white" : "bg-white"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
