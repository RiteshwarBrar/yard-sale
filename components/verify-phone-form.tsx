"use client";
import React, { useState } from "react";
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

export function VerifyPhoneForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
    const [code, setCode] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [resendTimer, setResendTimer] = useState(0);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, "");
        if (value.length <= 6) {
            setCode(value);
            setError("");
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (code.length !== 6) {
            setError("Please enter a valid 6-digit code.");
            return;
        }
        // Submit code logic here
        
        alert(`Code submitted: ${code}`);
    };
    const resendCode: React.MouseEventHandler<HTMLButtonElement> = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        // Call your resend OTP API here
        try {
            //Resend OTP logic here
            // Optionally reset timer/cooldown and notify user
            setResendTimer(60); 
            setMessage("OTP resent successfully!");
        } catch (error) {
            // Handle error (e.g., show notification)
            // setMessage("Failed to resend OTP.");
        }
    }; 

    return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Verify Your Phone Number</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="code">Enter 6-digit code</Label>
                <Input
                    id="code"
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={code}
                    onChange={handleChange}
                    autoFocus
                    required
                />
              </div>
              
              {error? <p className="text-sm text-red-500">{error}</p>:<p className="text-sm text-gray-700">{message}</p>}
              <Button type="submit" className="w-full" >
                Verify
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
                Didn't receive the code?{" "}
              <button onClick = {()=>{}} className="underline underline-offset-4">
                Resend Code
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
    );
};
