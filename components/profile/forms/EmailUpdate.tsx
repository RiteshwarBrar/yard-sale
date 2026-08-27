"use client";
import { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeft } from "lucide-react";
import { updateEmail, verifyOTP } from "@/app/actions/auth";

interface EmailUpdateFormProps {
  currentEmail: string;
  onClose: () => void;
  onSubmit: (newEmail: string) => void;
}

type Step = "enter-new" | "verify";

export function EmailUpdateForm({ currentEmail, onClose, onSubmit }: EmailUpdateFormProps) {
  const router = useRouter();
  const [isRefreshing, startTransition] = useTransition();
  const [step, setStep] = useState<Step>("enter-new");
  const [newEmail, setNewEmail] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  const isValidEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

  const resetEmailForm = () => {
    setStep("enter-new");
    setNewEmail("");
    setCode("");
    setError("");
    onClose();
  }

  const resetVerificationForm = () => {
    setStep("enter-new");
    setCode("");
    setError("");
  }

  const handleRequestChange = async () => {
    if (!newEmail) return setError("Enter a new email address.");
    if (!isValidEmail(newEmail)) return setError("Enter a valid email address.");
    if (newEmail === currentEmail) return setError("This is already your current email.");

    setLoading(true);
    setError("");
    try {
      await updateEmail(newEmail);
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
      const result = await verifyOTP("email_change", code, newEmail);

      if (result.error) {
        setError("Invalid or expired code. Try again.");
        setLoading(false);
        return;
      }

      startTransition(() => {
        router.refresh();
      });
    } catch {
      setError("Invalid or expired code. Try again.");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (loading && !isRefreshing) {
      onSubmit(newEmail);
      setNewEmail("");
      setCode("");
      setStep("enter-new");
      setLoading(false);
    }
  }, [isRefreshing]);
  // ── Step: enter new email ────────────────────────────────────────────────
  if (step === "enter-new") {
    return (
      <div>
        <button
          onClick={() => resetEmailForm()}
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
    <div className={isRefreshing ? "opacity-60 pointer-events-none transition-opacity" : "transition-opacity"}>
      <button
        onClick={() => resetVerificationForm()}
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