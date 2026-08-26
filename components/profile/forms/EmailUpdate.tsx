"use client";

import { useState } from "react";
import { Loader2, CheckCircle2, AlertCircle, ArrowLeft } from "lucide-react";
import { UserProfile } from "@/lib/types";

interface EmailSectionProps {
  profile: UserProfile;
  onUpdate: (p: UserProfile) => void;
}

type Step = "view" | "enter-new" | "verify";

export function EmailSection({ profile, onUpdate }: EmailSectionProps) {
  const [step, setStep] = useState<Step>("view");
  const [newEmail, setNewEmail] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  const isValidEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

  const handleRequestChange = async () => {
    if (!isValidEmail(newEmail)) return setError("Enter a valid email address.");
    if (newEmail === profile.email) return setError("This is already your current email.");

    setLoading(true);
    setError("");
    try {
      // Call your Supabase auth update — this sends a confirmation email/OTP
      // await supabase.auth.updateUser({ email: newEmail });

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
        if (c <= 1) {
          clearInterval(interval);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
  };

  const handleVerify = async () => {
    if (code.length !== 6) return setError("Enter the 6-digit code.");
    setLoading(true);
    setError("");
    try {
      // Call your Supabase verify endpoint:
      // await supabase.auth.verifyOtp({ email: newEmail, token: code, type: "email_change" });

      onUpdate({ ...profile, email: newEmail});
      setStep("view");
      setNewEmail("");
      setCode("");
    } catch {
      setError("Invalid or expired code. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── View: current email ─────────────────────────────────────────────────
  if (step === "view") {
    return (
      <div>
        <h1 className="text-xl font-bold text-gray-900 mb-1">Email address</h1>
        <p className="text-sm text-gray-400 mb-6">
          Used for sign-in and important account notifications.
        </p>

        <div className="border border-gray-200 rounded-xl p-4 flex items-center justify-between mb-4">
          <div>
            <p className="text-sm font-medium text-gray-900">{profile.email}</p>
            <div className="flex items-center gap-1.5 mt-1">
              {/* email verified */}
              {true ? (
                <>
                  <CheckCircle2 size={13} className="text-green-600" />
                  <span className="text-xs text-green-600">Verified</span>
                </>
              ) : (
                <>
                  <AlertCircle size={13} className="text-amber-500" />
                  <span className="text-xs text-amber-600">Not verified</span>
                </>
              )}
              
            </div>
          </div>
          <button
            onClick={() => setStep("enter-new")}
            className="text-sm font-medium text-[#1877F2] hover:underline"
          >
            Change
          </button>
        </div>
      </div>
    );
  }

  // ── Step: enter new email ────────────────────────────────────────────────
  if (step === "enter-new") {
    return (
      <div>
        <button
          onClick={() => setStep("view")}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-4"
        >
          <ArrowLeft size={14} /> Back
        </button>

        <h1 className="text-xl font-bold text-gray-900 mb-1">Change email address</h1>
        <p className="text-sm text-gray-400 mb-6">
          We&apos;ll send a verification code to confirm the new address.
        </p>

        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">
          New email address
        </label>
        <input
          type="email"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          placeholder="you@example.com"
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

  // ── Step: verify code ────────────────────────────────────────────────────
  return (
    <div>
      <button
        onClick={() => setStep("enter-new")}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-4"
      >
        <ArrowLeft size={14} /> Back
      </button>

      <h1 className="text-xl font-bold text-gray-900 mb-1">Verify your new email</h1>
      <p className="text-sm text-gray-400 mb-6">
        Enter the 6-digit code we sent to <span className="font-medium text-gray-600">{newEmail}</span>
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
        onClick={() => {
          setResendCooldown(30);
          startCooldown();
        }}
        disabled={resendCooldown > 0}
        className="block mt-3 text-sm text-[#1877F2] hover:underline disabled:text-gray-400 disabled:no-underline"
      >
        {resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : "Resend code"}
      </button>
    </div>
  );
}

const INPUT = "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 outline-none focus:border-[#1877F2] focus:ring-2 focus:ring-[#1877F2]/10 transition-all placeholder-gray-400";
