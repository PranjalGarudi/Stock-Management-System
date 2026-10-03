"use client";

import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import api from "../../services/api";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const [form, setForm] = useState({
    name: "",
    sku: "",
    category: "",
    price: "",
    unit: "pcs",
    lowStockThreshold: 10,
  });

  const fetchProducts = async () => {
    const { data } = await api.get("/products", {
      params: { search, category, page, limit: 10 },
    });
    setProducts(data.products);
    setPages(data.pages);
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search, category]);

  const handleCreate = async (e) => {
    e.preventDefault();
    await api.post("/products", form);
    setForm({ name: "", sku: "", category: "", price: "", unit: "pcs", lowStockThreshold: 10 });
    fetchProducts();
  };

  const handleDelete = async (id) => {
    await api.delete(`/products/${id}`);
    fetchProducts();
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Products</h2>

          <div className="flex gap-3 mb-4">
            <input
              placeholder="Search products..."
              value={search}
              onChange={(e) => {
                setPage(1);
                setSearch(e.target.value);
              }}
              className="border rounded px-3 py-2 text-sm w-64"
            />
            <input
              placeholder="Filter by category..."
              value={category}
              onChange={(e) => {
                setPage(1);
                setCategory(e.target.value);
              }}
              className="border rounded px-3 py-2 text-sm w-48"
            />
          </div>

          <form
            onSubmit={handleCreate}
            className="bg-white border rounded p-4 mb-6 grid grid-cols-2 sm:grid-cols-3 gap-3"
          >
            <input
              placeholder="Name"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="border rounded px-3 py-2 text-sm"
            />
            <input
              placeholder="SKU"
              required
              value={form.sku}
              onChange={(e) => setForm({ ...form, sku: e.target.value })}
              className="border rounded px-3 py-2 text-sm"
            />
            <input
              placeholder="Category"
              required
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="border rounded px-3 py-2 text-sm"
            />
            <input
              placeholder="Price"
              type="number"
              required
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="border rounded px-3 py-2 text-sm"
            />
            <input
              placeholder="Low stock threshold"
              type="number"
              value={form.lowStockThreshold}
              onChange={(e) => setForm({ ...form, lowStockThreshold: e.target.value })}
              className="border rounded px-3 py-2 text-sm"
            />
            <button className="bg-blue-600 text-white rounded px-3 py-2 text-sm hover:bg-blue-700">
              Add Product
            </button>
          </form>

          <table className="w-full bg-white border rounded text-sm">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-3">Name</th>
                <th className="p-3">SKU</th>
                <th className="p-3">Category</th>
                <th className="p-3">Price</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id} className="border-t">
                  <td className="p-3">{p.name}</td>
                  <td className="p-3">{p.sku}</td>
                  <td className="p-3">{p.category}</td>
                  <td className="p-3">${p.price}</td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => handleDelete(p._id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
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
