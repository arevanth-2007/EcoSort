"use client";

import React, { useState } from "react";
import { Gift, Plus, Edit2, Trash2, CheckCircle2, Coins, X } from "lucide-react";
import { useRouter } from "next/navigation";

interface AdminRewardsProps {
  initialRewards: any[];
  stores: any[];
}

export default function AdminRewardsClient({ initialRewards, stores }: AdminRewardsProps) {
  const router = useRouter();
  const [rewards, setRewards] = useState(initialRewards);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReward, setEditingReward] = useState<any | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Eco-Product");
  const [coinCost, setCoinCost] = useState("50");
  const [stock, setStock] = useState("50");
  const [imageUrl, setImageUrl] = useState("");
  const [sampleStoreId, setSampleStoreId] = useState("");
  const [saving, setSaving] = useState(false);

  const openCreateModal = () => {
    setEditingReward(null);
    setTitle("");
    setDescription("");
    setCategory("Eco-Product");
    setCoinCost("50");
    setStock("50");
    setImageUrl("https://images.unsplash.com/photo-1597484661643-2f5fef640dd1?w=600&auto=format&fit=crop&q=80");
    setSampleStoreId(stores[0]?.id || "");
    setIsModalOpen(true);
  };

  const openEditModal = (rew: any) => {
    setEditingReward(rew);
    setTitle(rew.title);
    setDescription(rew.description);
    setCategory(rew.category);
    setCoinCost(rew.coinCost.toString());
    setStock(rew.stock.toString());
    setImageUrl(rew.imageUrl);
    setSampleStoreId(rew.sampleStoreId || "");
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (editingReward) {
        const res = await fetch("/api/admin/rewards", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingReward.id,
            title,
            description,
            category,
            coinCost,
            stock,
            imageUrl,
            sampleStoreId: sampleStoreId || null,
          }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error);

        setRewards(rewards.map((r) => (r.id === editingReward.id ? data.reward : r)));
      } else {
        const res = await fetch("/api/admin/rewards", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            description,
            category,
            coinCost,
            stock,
            imageUrl,
            sampleStoreId: sampleStoreId || null,
          }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error);

        setRewards([data.reward, ...rewards]);
      }

      setIsModalOpen(false);
      router.refresh();
    } catch (err: any) {
      alert(err.message || "Failed to save reward.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete reward '${name}'?`)) return;

    try {
      const res = await fetch(`/api/admin/rewards?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete reward");

      setRewards(rewards.filter((r) => r.id !== id));
      router.refresh();
    } catch (err: any) {
      alert(err.message || "Error deleting reward.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-200 gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
            <Gift className="w-6 h-6 text-primary" />
            Manage Marketplace Rewards
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Configure redeemable sustainable catalog items, costs in Green Coins, and stock.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2 rounded-xl bg-gray-900 hover:bg-black text-white text-xs font-bold transition-colors shadow-xs flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-secondary" />
          <span>Add New Reward</span>
        </button>
      </div>

      {/* Rewards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {rewards.map((rew) => (
          <div key={rew.id} className="eco-card overflow-hidden flex flex-col justify-between group">
            <div className="relative h-44 bg-gray-100 overflow-hidden">
              <img
                src={rew.imageUrl}
                alt={rew.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-black bg-white text-primary shadow-xs">
                {rew.coinCost} GC
              </span>
              <span className="absolute bottom-3 left-3 px-2 py-0.5 rounded text-[10px] font-bold bg-black/60 text-white backdrop-blur-xs">
                {rew.category}
              </span>
            </div>

            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-gray-900">{rew.title}</h3>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{rew.description}</p>
                <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                  <span>Stock: {rew.stock} units</span>
                  <span>{rew._count?.redemptions || 0} redeemed</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                <button
                  onClick={() => openEditModal(rew)}
                  className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold flex items-center gap-1"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(rew.id, rew.title)}
                  className="px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete
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
                {editingReward ? "Edit Reward Item" : "Create New Reward"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-gray-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-gray-900 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs bg-white focus:ring-2 focus:ring-gray-900"
                  >
                    <option value="Eco-Product">Eco-Product</option>
                    <option value="Sapling">Sapling</option>
                    <option value="Voucher">Voucher</option>
                    <option value="Digital">Digital / Certificate</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Coin Cost (GC) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={coinCost}
                    onChange={(e) => setCoinCost(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-bold text-primary focus:ring-2 focus:ring-gray-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Available Stock</label>
                  <input
                    type="number"
                    min="0"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-gray-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Simulated Store</label>
                  <select
                    value={sampleStoreId}
                    onChange={(e) => setSampleStoreId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs bg-white focus:ring-2 focus:ring-gray-900"
                  >
                    <option value="">No Store (Digital)</option>
                    {stores.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Image URL *</label>
                <input
                  type="url"
                  required
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
                  {saving ? "Saving..." : "Save Reward"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
