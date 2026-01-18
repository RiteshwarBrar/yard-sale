"use client";

import React, { useEffect, useState, ChangeEvent, FormEvent, useActionState, startTransition } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";



export type NewItemData = {
  name: string;
  make: string;
  model: string;
  description: string;
  condition: "New" | "Like New" | "Good" | "Fair" | "Poor";
  location: string;
  price: number;
  media: File[];
};

type Props = {
    createNewListing: (data: NewItemData) => void;
    initial?: Partial<NewItemData>;
};

export default function NewItemForm({ createNewListing, initial }: Props) {
    const [name, setName] = useState(initial?.name ?? "");
    const [condition, setCondition] = useState<NewItemData["condition"]>(
        initial?.condition ?? "Good"
    );
    const [price, setPrice] = useState<string>(
        initial?.price !== undefined ? String(initial.price) : ""
    );
    const [media, setMedia] = useState<File[]>(initial?.media ?? []);
    const [previews, setPreviews] = useState<string[]>([]);
    const [ make, setMake ] = useState(initial?.make ?? "");
    const [ model, setModel ] = useState(initial?.model ?? "");
    const [ description, setDescription ] = useState(initial?.description ?? "");
    const [ location, setLocation ] = useState(initial?.location ?? "Default Location");
    const [ loading, setLoading ] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [alertMessage, setAlertMessage] = useState<string | null>(null);

    useEffect(() => {
        const urls = media.map((f) => URL.createObjectURL(f));
        setPreviews(urls);
        return () => {
        urls.forEach((u) => URL.revokeObjectURL(u));
        };
        
    }, [media]);

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;
        setMedia((prev) => [...prev, ...Array.from(files)]);
    };

    const removeImage = (idx: number) => {
        setMedia((prev) => prev.filter((_, i) => i !== idx));
    };

    const handleSubmit = async (e: FormEvent) => {
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
        location:location.trim(),
        condition,
        price: parsedPrice,
        media,
        };
        setLoading(true);
        await createNewListing(data);
        setLoading(false);
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
            <Label htmlFor="location">Location</Label>
            <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Item location"
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
            <div className="flex items-center justify-center w-full">
                <label htmlFor="images" className="flex flex-col items-center justify-center w-full h-64 p-20 bg-gray-100 border border-dashed rounded-lg border-default-strong rounded-base cursor-pointer hover:bg-gray-50">Images
                    <div className="flex flex-col items-center justify-center text-body pt-5 pb-6">
                        <svg className="w-8 h-8 mb-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h3a3 3 0 0 0 0-6h-.025a5.56 5.56 0 0 0 .025-.5A5.5 5.5 0 0 0 7.207 9.021C7.137 9.017 7.071 9 7 9a4 4 0 1 0 0 8h2.167M12 19v-9m0 0-2 2m2-2 2 2"/></svg>
                        <p className="mb-2 text-sm"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                        <p className="text-xs">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                    </div>
                    <input id="images" type="file" onChange={handleImageChange} className="hidden" />
                </label>
            </div>

            {/* file: modifiers style the button-like portion of the input */}
            {/* Ref: Tailwind file: utilities */}
            
        </div>
            
            {previews.length > 0 && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-2">
                {previews.map((src, i) => (
                <div
                    key={i}
                    className="relative aspect-square overflow-hidden rounded-md border"
                >
                    {/* Blob/object URLs aren't supported by next/image, use <img> for previews */}
                    <img
                    src={src}
                    alt={`preview-${i}`}
                    className="object-cover w-max h-max"
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
            <Button type="submit">{loading? "Loading": "Save Item"}</Button>
        </div>
        </form>
    );    
}

