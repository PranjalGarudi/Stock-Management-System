"use client";

import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import api from "../../services/api";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const [products, setProducts] = useState([]);
  const [items, setItems] = useState([{ product: "", quantity: 1 }]);
  const [formError, setFormError] = useState("");

  const fetchOrders = async () => {
    const { data } = await api.get("/orders", { params: { status, page, limit: 10 } });
    setOrders(data.orders);
    setPages(data.pages);
  };

  const fetchProducts = async () => {
    const { data } = await api.get("/products", { params: { limit: 100 } });
    setProducts(data.products);
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, page]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    await api.put(`/orders/${id}/status`, { status: newStatus });
    fetchOrders();
  };

  const addItemRow = () => setItems([...items, { product: "", quantity: 1 }]);

  const updateItem = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  const removeItemRow = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    setFormError("");
    try {
      await api.post("/orders", {
        items: items.map((i) => ({ product: i.product, quantity: Number(i.quantity) })),
      });
      setItems([{ product: "", quantity: 1 }]);
      fetchOrders();
    } catch (err) {
      setFormError(err.response?.data?.message || "Failed to create order");
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Orders</h2>

          <form onSubmit={handleCreateOrder} className="bg-white border rounded p-4 mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Create Order</h3>

            {formError && (
              <div className="bg-red-50 text-red-600 text-sm p-2 rounded mb-3">{formError}</div>
            )}

            {items.map((item, index) => (
              <div key={index} className="flex gap-3 mb-2">
                <select
                  value={item.product}
                  onChange={(e) => updateItem(index, "product", e.target.value)}
                  required
                  className="border rounded px-3 py-2 text-sm flex-1"
                >
                  <option value="">Select product...</option>
                  {products.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.name} ({p.sku})
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => updateItem(index, "quantity", e.target.value)}
                  required
                  className="border rounded px-3 py-2 text-sm w-24"
                />
                {items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeItemRow(index)}
                    className="text-red-600 text-sm hover:underline"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={addItemRow}
              className="text-blue-600 text-sm hover:underline mb-4"
            >
              + Add another item
            </button>

            <button className="block bg-blue-600 text-white rounded px-4 py-2 text-sm hover:bg-blue-700">
              Create Order
            </button>
          </form>

          <select
            value={status}
            onChange={(e) => {
              setPage(1);
              setStatus(e.target.value);
            }}
            className="border rounded px-3 py-2 text-sm mb-4"
          >
            <option value="">All statuses</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <table className="w-full bg-white border rounded text-sm">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-3">Order #</th>
                <th className="p-3">Items</th>
                <th className="p-3">Total</th>
                <th className="p-3">Status</th>
                <th className="p-3">Created By</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o._id} className="border-t align-top">
                  <td className="p-3">{o.orderNumber}</td>
                  <td className="p-3">
                    <ul className="space-y-1">
                      {o.items.map((item, i) => (
                        <li key={i}>
                          {item.product?.name ?? "Deleted product"} × {item.quantity}
                          <span className="text-gray-400 text-xs ml-1">
                            ({item.product?.sku})
                          </span>
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="p-3">${o.totalAmount}</td>
                  <td className="p-3">
                    <select
                      value={o.status}
                      onChange={(e) => handleStatusChange(o._id, e.target.value)}
                      className="border rounded px-2 py-1 text-sm"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="p-3 text-gray-600">
                    {o.createdBy?.name ?? "Unknown"}
                    {o.createdBy?.role && (
                      <span className="ml-1 text-xs uppercase text-gray-400">
                        ({o.createdBy.role})
                      </span>
                    )}
                    <div className="text-xs text-gray-400">{o.createdBy?.email}</div>
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