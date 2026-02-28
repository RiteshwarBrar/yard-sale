'use client';
import React from 'react'
import { useEffect, useState } from "react";
import { createClient } from '@/lib/supabase/client';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';

export function Categories() {
    const supabase = createClient();
    const router = useRouter();
    const [categories, setCategories] = useState<Array<any>>([
        { id: 1, name: "Electronics" },
        { id: 2, name: "Furniture" },
        { id: 3, name: "Clothing" },
        { id: 4, name: "Books" },
        { id: 5, name: "Apartments" },
    ]);

    // useEffect(() => {
    //     const fetchCategories = async () => {
    //         const { data, error } = await supabase
    //             .from('categories')
    //             .select('*');
    //         if (error) {
    //             console.error("Error fetching categories:", error);
    //             return;
    //         }
    //         setCategories(data);
    //     };
    //     fetchCategories();
    // }, []);

    return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map((category) => (
            <Button key={category.id} variant="outline" onClick={() => router.push(`/explore/category/${category.id}`)}>
                {category.name}
            </Button>
        ))}
    </div>);
}