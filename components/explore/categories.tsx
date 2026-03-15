'use client';
import React from 'react'
import { useEffect, useState } from "react";
import { createClient } from '@/lib/supabase/client';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';
import { Category } from '@/components/types/types';

export function Categories({ categories }: { categories: Category[] }) {
    const supabase = createClient();
    const router = useRouter();

    return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
        {categories.map((category) => (
            <Button key={category.id} variant="outline" onClick={() => console.log(`Clicked category ${category.name}`)}>
                {category.name}
            </Button>
        ))}
    </div>);
}