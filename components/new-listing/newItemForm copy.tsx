"use client";

import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export type NewItemData = {
  name: string;
  make: string;
  model: string;
  description: string;
  condition: "New" | "Like New" | "Good" | "Fair" | "Poor";
  price: number;
  images: File[];
};

type Props = {
  onSubmit?: (data: NewItemData) => void;
  initial?: Partial<NewItemData>;
};

export default function NewItemForm({ onSubmit, initial }: Props) {

  const [name, setName] = useState(initial?.name ?? "");
  const [condition, setCondition] = useState<NewItemData["condition"]>(
    initial?.condition ?? "Good"
  );
  const [price, setPrice] = useState<string>(
    initial?.price !== undefined ? String(initial.price) : ""
  );
  const [images, setImages] = useState<File[]>(initial?.images ?? []);
  const [previews, setPreviews] = useState<string[]>([]);
  const [ make, setMake ] = useState(initial?.make ?? "");
  const [ model, setModel ] = useState(initial?.model ?? "");
  const [ description, setDescription ] = useState(initial?.description ?? "");
  const [error, setError] = useState<string | null>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  useEffect(() => {
    const urls = images.map((f) => URL.createObjectURL(f));
    setPreviews(urls);
    return () => {
      urls.forEach((u) => URL.revokeObjectURL(u));
    };
  }, [images]);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    setImages((prev) => [...prev, ...Array.from(files)]);
    e.currentTarget.value = "";
  };

  const removeImage = (idx: number) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Name is required.");
      return;
    }
    if (!make.trim() || !model.trim()) {
      setAlertMessage("Item make and model information is recommended.");
    }
    if (!description.trim()) {
        setError("Description is required.");
        return;
    }
    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      setError("Price must be a non-negative number.");
      return;
    }

    const data: NewItemData = {
      name: name.trim(),
      make: make?.trim(),
      model: model?.trim(),
      description: description.trim(),
      condition,
      price: parsedPrice,
      images,
    };

    onSubmit?.(data);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto w-full max-w-2xl space-y-6 rounded-lg border bg-background p-6 shadow-sm"
    >
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Item name"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="condition">Condition</Label>
        <select
          id="condition"
          value={condition}
          onChange={(e) =>
            setCondition(e.target.value as NewItemData["condition"])
          }
          className="h-10 rounded-md border border-input bg-background px-3 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <option>New</option>
          <option>Like New</option>
          <option>Good</option>
          <option>Fair</option>
          <option>Poor</option>
        </select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="make">Make</Label>
        <Input 
            id="make"
            value={make}
            onChange={(e) => setMake(e.target.value)}
            placeholder="Brand/Company"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="model">Model</Label>
        <Input
            id="model"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            placeholder="Model name or number"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Input
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Item description"
            required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="price">Price (USD)</Label>
        <Input
          id="price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="0.00"
          inputMode="decimal"
          className="w-48"
        />
      </div>

      <div className="space-y-3">
        <Label htmlFor="images">Images</Label>
        <div className="rounded-lg border border-dashed p-4">
          <input
            id="images"
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="block w-full text-sm file:me-4 file:rounded-md file:border-0 file:bg-primary file:px-4 file:py-2 file:text-primary-foreground file:font-medium hover:file:bg-primary/90"
          />

          {/* file: modifiers style the button-like portion of the input */}
          {/* Ref: Tailwind file: utilities */}
        </div>
        </div>

        
        {previews.length > 0 && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {previews.map((src, i) => (
              <div
                key={i}
                className="relative aspect-square overflow-hidden rounded-md border"
              >
                {/* Blob/object URLs aren't supported by next/image, use <img> for previews */}
                <img
                  src={src}
                  alt={`preview-${i}`}
                  className="object-cover w-full h-full"
                />
                <Button
                  type="button"
                  onClick={() => removeImage(i)}
                  size="sm"
                  variant="destructive"
                  className="absolute right-2 top-2 h-7 px-2"
                  aria-label="Remove image"
                  title="Remove image"
                >
                  ×
                </Button>
              </div>
            ))}
          </div>
        )}

      {error && (
        <div
          role="alert"
          className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          {error}
        </div>
      )}

      <div className="flex items-center justify-end gap-2">
        <Button type="submit">Save Item</Button>
      </div>
    </form>
  );
}
