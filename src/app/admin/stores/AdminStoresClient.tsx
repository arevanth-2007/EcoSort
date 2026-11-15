"use client";

import React, { useState } from "react";
import { Store, Plus, Edit2, Trash2, MapPin, Phone, X } from "lucide-react";
import { useRouter } from "next/navigation";

interface AdminStoresProps {
  initialStores: any[];
}

export default function AdminStoresClient({ initialStores }: AdminStoresProps) {
  const router = useRouter();
  const [stores, setStores] = useState(initialStores);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStore, setEditingStore] = useState<any | null>(null);

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("Hyderabad");
  const [description, setDescription] = useState("");
  const [phone, setPhone] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [saving, setSaving] = useState(false);

  const openCreateModal = () => {
    setEditingStore(null);
    setName("");
    setAddress("");
    setCity("Hyderabad");
    setDescription("");
    setPhone("+91 40 6712 4001");
    setImageUrl("https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&auto=format&fit=crop&q=80");
    setIsModalOpen(true);
  };

  const openEditModal = (store: any) => {
    setEditingStore(store);
    setName(store.name);
    setAddress(store.address);
    setCity(store.city);
    setDescription(store.description);
    setPhone(store.phone || "");
    setImageUrl(store.imageUrl || "");
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (editingStore) {
        const res = await fetch("/api/admin/stores", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingStore.id, name, address, city, description, phone, imageUrl }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setStores(stores.map((s) => (s.id === editingStore.id ? data.store : s)));
      } else {
        const res = await fetch("/api/admin/stores", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, address, city, description, phone, imageUrl }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setStores([...stores, data.store]);
      }

      setIsModalOpen(false);
      router.refresh();
    } catch (err: any) {
      alert(err.message || "Failed to save store");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, storeName: string) => {
    if (!confirm(`Delete simulated store '${storeName}'?`)) return;

    try {
      const res = await fetch(`/api/admin/stores?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete store");
      setStores(stores.filter((s) => s.id !== id));
      router.refresh();
    } catch (err: any) {
      alert(err.message || "Error deleting store");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-200 gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
            <Store className="w-6 h-6 text-primary" />
            Manage Partner Distribution Stores
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Community drop-off locations and reward redemption centers.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2 rounded-xl bg-gray-900 hover:bg-black text-white text-xs font-bold transition-colors shadow-xs flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-secondary" />
          <span>Add New Store</span>
        </button>
      </div>

      {/* Stores List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stores.map((s) => (
          <div key={s.id} className="eco-card p-5 bg-white flex flex-col justify-between">
            <div>
              <div className="relative h-32 rounded-xl overflow-hidden bg-gray-100 mb-3">
                <img src={s.imageUrl} alt={s.name} className="w-full h-full object-cover" />
                <span className="absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-bold bg-black/60 text-white font-mono">
                  {s.storeCode}
                </span>
              </div>

              <h3 className="text-base font-bold text-gray-900">{s.name}</h3>
              <p className="text-xs text-gray-500 mt-1 flex items-start gap-1">
                <MapPin className="w-3.5 h-3.5 text-secondary shrink-0 mt-0.5" />
                <span>{s.address}, {s.city}</span>
              </p>
              {s.phone && (
                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                  <span>{s.phone}</span>
                </p>
              )}
              <p className="text-xs text-gray-600 mt-2 line-clamp-2">{s.description}</p>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
              <span className="font-semibold text-primary">{s._count?.rewards || 0} rewards assigned</span>
              <div className="space-x-1">
                <button
                  onClick={() => openEditModal(s)}
                  className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(s.id, s.name)}
                  className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-base font-bold text-gray-900">
                {editingStore ? "Edit Sample Store" : "Create Sample Store"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Store Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-gray-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Address *</label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-gray-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-gray-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Contact Phone</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-gray-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-gray-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Image URL</label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-gray-900"
                />
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2 rounded-xl border border-gray-200 text-gray-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2 rounded-xl bg-gray-900 text-white font-bold hover:bg-black"
                >
                  {saving ? "Saving..." : "Save Store"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
