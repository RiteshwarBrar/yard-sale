"use client";

import { useState, useRef } from "react";
import { X, Upload, Plus, Loader2 } from "lucide-react";
import { SellerListing, Category } from "./types";

interface CreateListingModalProps {
  categories: Category[];
  onClose: () => void;
  onCreated: (listing: SellerListing) => void;
  userID: string;
}

const CONDITIONS = ["Like new", "Good", "Used", "Fair", "For parts"] as const;

export function CreateListingModal({ categories, onClose, onCreated, userID }: CreateListingModalProps) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    condition: "Good",
    category: categories[0]?.name ?? "",
    location: "",
  });
  const [photos, setPhotos] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const set = (key: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const newFiles = Array.from(files).slice(0, 6 - photos.length);
    setPhotos((p) => [...p, ...newFiles]);
    newFiles.forEach((f) => {
      const reader = new FileReader();
      reader.onload = (e) => setPreviews((p) => [...p, e.target?.result as string]);
      reader.readAsDataURL(f);
    });
  };

  const removePhoto = (i: number) => {
    setPhotos((p) => p.filter((_, idx) => idx !== i));
    setPreviews((p) => p.filter((_, idx) => idx !== i));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.price) return setError("Title and price are required.");
    setSubmitting(true);
    setError("");

    try {
      // In your real app, call a server action here to insert into Supabase
      // and upload photos to ListingsMedia storage bucket.
      // Example shape of what to POST:
      // await createListing({ ...form, price: Number(form.price), photos, userID });

      // Optimistic local update for now:
      const newListing: SellerListing = {
        id: crypto.randomUUID(),
        created_by: userID,
        created_at: new Date().toISOString(),
        name: form.name,
        description: form.description,
        price: Number(form.price),
        condition: form.condition,
        category: form.category,
        location: form.location,
        active: true,
      };
      onCreated(newListing);
    } catch {
      setError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 shrink-0">
          <h2 className="text-base font-bold text-gray-900">Create new listing</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
          >
            <X size={16} className="text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 px-5 py-4 flex flex-col gap-4">

          {/* Photos */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
              Photos <span className="normal-case font-normal text-gray-400">(up to 6)</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {previews.map((src, i) => (
                <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200 group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removePhoto(i)}
                    className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                  >
                    <X size={16} className="text-white" />
                  </button>
                </div>
              ))}
              {photos.length < 6 && (
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="w-20 h-20 rounded-lg border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-1 hover:border-[#1877F2] hover:bg-[#E7F3FF]/30 transition-colors text-gray-400 hover:text-[#1877F2]"
                >
                  <Upload size={16} />
                  <span className="text-[10px] font-medium">Add</span>
                </button>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />
          </div>

          {/* Title */}
          <Field label="Title *">
            <input
              type="text"
              placeholder="e.g. iPhone 12, Wooden dining table…"
              value={form.name}
              onChange={set("name")}
              className={INPUT}
              required
            />
          </Field>

          {/* Price */}
          <Field label="Price (₹) *">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₹</span>
              <input
                type="number"
                placeholder="0"
                value={form.price}
                onChange={set("price")}
                className={INPUT + " pl-7"}
                min={0}
                required
              />
            </div>
          </Field>

          {/* Condition + Category */}
          <div className="grid grid-cols-2 gap-3">
            <Field label="Condition">
              <select value={form.condition} onChange={set("condition")} className={INPUT}>
                {CONDITIONS.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Category">
              <select value={form.category} onChange={set("category")} className={INPUT}>
                {categories.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
              </select>
            </Field>
          </div>

          {/* Location */}
          <Field label="Location">
            <input
              type="text"
              placeholder="e.g. Ludhiana, Model Town…"
              value={form.location}
              onChange={set("location")}
              className={INPUT}
            />
          </Field>

          {/* Description */}
          <Field label="Description">
            <textarea
              placeholder="Describe the item — condition, dimensions, brand, reason for selling…"
              value={form.description}
              onChange={set("description")}
              rows={3}
              className={INPUT + " resize-none"}
            />
          </Field>

          {error && (
            <p className="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2">{error}</p>
          )}
        </form>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-gray-200 flex gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="flex-1 py-2.5 bg-[#1877F2] rounded-xl text-sm font-semibold text-white hover:bg-[#1567d3] transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {submitting ? (
              <><Loader2 size={15} className="animate-spin" /> Publishing…</>
            ) : (
              <><Plus size={15} /> Publish listing</>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}

const INPUT = "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 outline-none focus:border-[#1877F2] focus:ring-2 focus:ring-[#1877F2]/10 transition-all placeholder-gray-400";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">{label}</label>
      {children}
    </div>
  );
}
