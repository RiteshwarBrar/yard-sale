"use client";

import { useState } from "react";
import { Loader2, CheckCircle2, AlertCircle, ArrowLeft, Phone as PhoneIcon } from "lucide-react";
import { UserProfile } from "@/lib/types";
import { Pencil } from "lucide-react";

interface PhoneSectionProps {
  profile: UserProfile;
}

type Step = "view" | "enter-new" | "verify";

export function PhoneSection({ profile }: PhoneSectionProps) {
  const [step, setStep] = useState<Step>("view");
  const [newPhone, setNewPhone] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  const isValidPhone = (p: string) => /^\+?[1-9]\d{7,14}$/.test(p.replace(/[\s-]/g, ""));

  const handleRequestChange = async () => {
    const cleaned = newPhone.replace(/[\s-]/g, "");
    if (!isValidPhone(cleaned)) return setError("Enter a valid phone number with country code, e.g. +91 98765 43210.");
    if (cleaned === profile.phone_number) return setError("This is already your current number.");

    setLoading(true);
    setError("");
    try {
      // await supabase.auth.updateUser({ phone: cleaned });
      setStep("verify");
      setResendCooldown(30);
      startCooldown();
    } catch {
      setError("Could not send verification code. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const startCooldown = () => {
    const interval = setInterval(() => {
      setResendCooldown((c) => {
        if (c <= 1) { clearInterval(interval); return 0; }
        return c - 1;
      });
    }, 1000);
  };

  const handleVerify = async () => {
    if (code.length !== 6) return setError("Enter the 6-digit code.");
    setLoading(true);
    setError("");
    try {
      // await supabase.auth.verifyOtp({ phone: newPhone, token: code, type: "phone_change" });
      // onUpdate({ ...profile, phone: newPhone, phone_verified: true });
      setStep("view");
      setNewPhone("");
      setCode("");
    } catch {
      setError("Invalid or expired code. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── View ──────────────────────────────────────────────────────────────────
  if (step === "view") {
    return (
      <div className="border border-gray-200 rounded-xl p-4 mb-6">
        <p className="text-sm font-semibold text-gray-700 mb-3">Phone number</p>

        {profile.phone_number ? (
          <div className="flex items-center justify-between p-2">
            <div className="flex items-center justify-left gap-2">
              <p className="text-sm font-medium text-gray-500">{profile.phone_number}</p>
              <button
              onClick={() => setStep("enter-new")}
            >
              <Pencil size={15} className="text-gray-500 hover:text-gray-700 transition-colors" />
            </button>
            </div>
            {/* phone verified */}
              <div className="flex items-center gap-1.5 mt-1">
                {true ? (
                  <><CheckCircle2 size={13} className="text-green-600" /><span className="text-xs text-green-600">Verified</span></>
                ) : (
                  <><AlertCircle size={13} className="text-amber-500" /><span className="text-xs text-amber-600">Not verified</span></>
                )}
              </div>
            
          </div>
        ) : (
          <div className="border border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center text-center mb-4">
            <PhoneIcon size={24} className="text-gray-300 mb-2" />
            <p className="text-sm text-gray-500 mb-3">No phone number added yet</p>
            <button
              onClick={() => setStep("enter-new")}
              className="text-sm font-semibold text-[#1877F2] hover:underline"
            >
              Add phone number
            </button>
          </div>
        )}
      </div>
    );
  }

  // ── Enter new number ─────────────────────────────────────────────────────
  if (step === "enter-new") {
    return (
      <div>
        <button onClick={() => setStep("view")} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-4">
          <ArrowLeft size={14} /> Back
        </button>

        <h1 className="text-xl font-bold text-gray-900 mb-1">
          {profile.phone_number ? "Change phone number" : "Add phone number"}
        </h1>
        <p className="text-sm text-gray-400 mb-6">
          We&apos;ll send an SMS code to confirm this number.
        </p>

        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">
          Phone number
        </label>
        <input
          type="tel"
          value={newPhone}
          onChange={(e) => setNewPhone(e.target.value)}
          placeholder="+91 98765 43210"
          className={INPUT}
        />

        {error && <p className="text-sm text-red-500 mt-3">{error}</p>}

        <button
          onClick={handleRequestChange}
          disabled={loading}
          className="mt-5 flex items-center gap-2 px-5 py-2.5 bg-[#1877F2] text-white text-sm font-semibold rounded-lg hover:bg-[#1567d3] transition-colors disabled:opacity-60"
        >
          {loading && <Loader2 size={15} className="animate-spin" />}
          Send verification code
        </button>
      </div>
    );
  }

  // ── Verify code ───────────────────────────────────────────────────────────
  return (
    <div>
      <button onClick={() => setStep("enter-new")} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-4">
        <ArrowLeft size={14} /> Back
      </button>

      <h1 className="text-xl font-bold text-gray-900 mb-1">Verify your phone number</h1>
      <p className="text-sm text-gray-400 mb-6">
        Enter the 6-digit code sent via SMS to <span className="font-medium text-gray-600">{newPhone}</span>
      </p>

      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">
        Verification code
      </label>
      <input
        type="text"
        inputMode="numeric"
        maxLength={6}
        value={code}
        onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
        placeholder="000000"
        className={`${INPUT} text-center text-lg font-mono tracking-[0.3em]`}
      />

      {error && <p className="text-sm text-red-500 mt-3">{error}</p>}

      <button
        onClick={handleVerify}
        disabled={loading || code.length !== 6}
        className="mt-5 flex items-center gap-2 px-5 py-2.5 bg-[#1877F2] text-white text-sm font-semibold rounded-lg hover:bg-[#1567d3] transition-colors disabled:opacity-40"
      >
        {loading && <Loader2 size={15} className="animate-spin" />}
        Confirm change
      </button>

      <button
        onClick={() => { setResendCooldown(30); startCooldown(); }}
        disabled={resendCooldown > 0}
        className="block mt-3 text-sm text-[#1877F2] hover:underline disabled:text-gray-400 disabled:no-underline"
      >
        {resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : "Resend code"}
      </button>
    </div>
  );
}

const INPUT = "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 outline-none focus:border-[#1877F2] focus:ring-2 focus:ring-[#1877F2]/10 transition-all placeholder-gray-400";
