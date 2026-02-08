"use client";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

import React from 'react'
import Link from "next/link";

export default function CompleteSignUpForm() {
    const [email, setEmail] = useState("");
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    const updateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const { data, error } = await supabase.auth.updateUser({
            data: {
                // Add any additional user metadata here
                firstname: firstname,
                lastname: lastname,
                email: email,
            },
        });
        setIsLoading(false);

        if (error) {
        setError("An error occurred while updating your account. Please try again.");
        console.error("Error updating user:", error);
        return;
        }
        console.log("User updated successfully:", data);
        const { data: sessionData } = await supabase.auth.getSession();
        console.log("Updated session data:", sessionData);
        router.refresh();
        return;
    }
    return (
        <div>
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Final Steps...</CardTitle>
                    <CardDescription>Complete your account setup</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={updateUser}>
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="email">Email Address *</Label>
                                </div>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="e.g. user@example.com"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="firstname">First Name *</Label>
                                </div>
                                <Input
                                    id="firstname"
                                    type="text"
                                    placeholder="First Name"
                                    required
                                    value={firstname}
                                    onChange={(e) => setFirstname(e.target.value)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="lastname">Last Name</Label>
                                </div>
                                <Input
                                    id="lastname"
                                    type="text"
                                    placeholder="Last Name"
                                    value={lastname}
                                    onChange={(e) => setLastname(e.target.value)}
                                />
                            </div>
                            {error && <p className="text-sm text-red-500">{error}</p>}
                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? "Updating your account..." : "Submit"}
                            </Button>
                        </div>
                        <div className="mt-4 text-sm text-muted-foreground">
                            * Required fields
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div >
    )
}
