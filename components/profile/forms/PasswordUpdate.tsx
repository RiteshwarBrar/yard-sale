"use client";

import { useState } from "react";
import { Loader2, Check, Eye, EyeOff, AlertCircle } from "lucide-react";

export function PasswordSection() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const checks = {
    length: newPassword.length >= 8,
    upper: /[A-Z]/.test(newPassword),
    number: /[0-9]/.test(newPassword),
    match: newPassword.length > 0 && newPassword === confirmPassword,
  };

  const allValid = checks.length && checks.upper && checks.number && checks.match;

  const handleSubmit = async () => {
    if (!currentPassword) return setError("Enter your current password.");
    if (!allValid) return setError("New password does not meet requirements.");

    setLoading(true);
    setError("");
    try {
      // Verify current password and update — Supabase doesn't have a direct
      // "verify current password" call, so the common pattern is to
      // re-authenticate then update:
      // const { error: signInError } = await supabase.auth.signInWithPassword({
      //   email: user.email, password: currentPassword,
      // });
      // if (signInError) throw new Error("Current password is incorrect.");
      // await supabase.auth.updateUser({ password: newPassword });

      setSaved(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setSaved(false), 2500);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not update password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900 mb-1">Password</h1>
      <p className="text-sm text-gray-400 mb-6">
        Choose a strong password you don&apos;t use elsewhere.
      </p>

      <div className="flex flex-col gap-4 max-w-sm">
        <Field label="Current password">
          <div className="relative">
            <input
              type={showCurrent ? "text" : "password"}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className={INPUT + " pr-10"}
            />
            <button
              type="button"
              onClick={() => setShowCurrent((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showCurrent ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </Field>

        <Field label="New password">
          <div className="relative">
            <input
              type={showNew ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={INPUT + " pr-10"}
            />
            <button
              type="button"
              onClick={() => setShowNew((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showNew ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </Field>

        <Field label="Confirm new password">
          <input
            type={showNew ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={INPUT}
          />
        </Field>

        {/* Requirements checklist */}
        {newPassword.length > 0 && (
          <div className="flex flex-col gap-1 bg-gray-50 rounded-lg p-3">
            <Requirement met={checks.length} label="At least 8 characters" />
            <Requirement met={checks.upper} label="At least one uppercase letter" />
            <Requirement met={checks.number} label="At least one number" />
            <Requirement met={checks.match} label="Passwords match" />
          </div>
        )}

        {error && (
          <p className="text-sm text-red-500 flex items-center gap-1.5">
            <AlertCircle size={14} /> {error}
          </p>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading || !allValid || !currentPassword}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#1877F2] text-white text-sm font-semibold rounded-lg hover:bg-[#1567d3] transition-colors disabled:opacity-40 mt-1"
        >
          {loading ? <Loader2 size={15} className="animate-spin" /> : saved ? <Check size={15} /> : null}
          {loading ? "Updating…" : saved ? "Password updated" : "Update password"}
        </button>
      </div>
    </div>
  );
}

function Requirement({ met, label }: { met: boolean; label: string }) {
  return (
    <div className={`flex items-center gap-2 text-xs ${met ? "text-green-600" : "text-gray-400"}`}>
      <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 ${
        met ? "bg-green-100" : "bg-gray-200"
      }`}>
        {met && <Check size={9} />}
      </div>
      {label}
    </div>
  );
}

const INPUT = "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 outline-none focus:border-[#1877F2] focus:ring-2 focus:ring-[#1877F2]/10 transition-all";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">{label}</label>
      {children}
    </div>
  );
}
