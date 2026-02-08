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
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

export function VerifyPhoneForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
    const [code, setCode] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState("");
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [cooledDown, setCooledDown] = useState(true);
    const [isSending, setIsSending] = useState(false);
    const supabase = createClient();
    const data = sessionStorage.getItem("signup_phone"); 
    const phone = data ? JSON.parse(data) : "";
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, "");
        if (value.length <= 6) {
            setCode(value);
            setError("");
        }
    };
    

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        setIsLoading(true);
        setError(null);

        if (code.length !== 6) {
            setError("Please enter a valid 6-digit code.");
            setIsLoading(false);
            return;
        }

        console.log(data);
        try {
          const { data, error } = await supabase.auth.verifyOtp({
            phone: phone,
            token: code,
            type: "sms",
          });
          if (error) throw error;
          if (!data.user || !data.session) {
            setError("Verification failed-No user or session data returned.");
            setIsLoading(false);
            return;
           }
          // const sessionData = await supabase.auth.getSession(); // if this doesn't work then explicitly update usermeta with phone_verified: true and check that in protected route
          console.log("Phone verification successful:", data);
          router.push("/protected");
        } catch (error: unknown) {
          setError(error instanceof Error ? error.message : "An error occurred");
        } finally {
          setIsLoading(false);
        }
    };

    const sendCode: React.MouseEventHandler<HTMLButtonElement> = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsSending(true);
        setError(null);
        setMessage("");
        

        try {
            const { data, error } = await supabase.auth.signInWithOtp({
              phone,
            });
            if (error) throw error;
            console.log("OTP sent successfully:", data);
            setMessage("OTP resent successfully!");
        } catch (error) {
            setMessage("Failed to resend OTP.");
            setError(error instanceof Error ? error.message : "An error occurred");
        }
        setIsSending(false);
        setCooledDown(false);
        setTimeout(() => setCooledDown(true), 60000); // 60 second cooldown

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
                    pattern="[0-9]*"
                    maxLength={6}
                    value={code}
                    onChange={handleChange}
                    autoFocus
                    required
                />
              </div>
              
              {error? <p className="text-sm text-red-500">{error}</p>:<p className="text-sm text-gray-700">{message}</p>}
              {/* <Button type="submit" className="w-full" disabled={isLoading}>
                {isSending ? "Sending OTP" : "Send Code"}
              </Button> */}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Verifying Phone Number" : "Verify"}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
                Didn't receive the code?{" "}
              <button onClick = {sendCode} className="underline underline-offset-4" disabled={!cooledDown}>
                {isSending ? "Sending OTP" : (cooledDown?"Resend Code":"Please wait 60 seconds before resending")}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
    );
};
