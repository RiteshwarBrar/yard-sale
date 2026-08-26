"use client";

import { useState } from "react";
import { Loader2, Check } from "lucide-react";
import { UserProfile, BIO_MAX_LENGTH } from "@/lib/types";
import { AvatarChangeModal } from '@/components/profile/AvatarChangeModal';

interface ProfileSectionProps {
  profile: UserProfile;
  onUpdate: (p: UserProfile) => void;
}

export function DemoProfileSection({ profile, onUpdate }: ProfileSectionProps) {
  const [firstName, setFirstName] = useState(profile.first_name);
  const [lastName, setLastName] = useState(profile.last_name);
  const [bio, setBio] = useState(profile.bio ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const bioRemaining = BIO_MAX_LENGTH - bio.length;
  const bioTooLong = bio.length > BIO_MAX_LENGTH;

  const hasChanges =
    firstName !== profile.first_name ||
    lastName !== profile.last_name ||
    bio !== (profile.bio ?? "");

  const handleSave = async () => {
    if (bioTooLong) return;
    setSaving(true);
    try {
      // Call your server action / Supabase update here:
      // await supabase.from("profiles").update({ first_name: firstName, last_name: lastName, bio }).eq("id", profile.id);

      onUpdate({ ...profile, first_name: firstName, last_name: lastName, bio });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900 mb-1">Profile</h1>
      <p className="text-sm text-gray-400 mb-6">
        This information may be visible to other users on the marketplace.
      </p>

      <div className="flex flex-col gap-5">
        <button onClick={() => setModalOpen(true)} className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
          {profile.avatar_url ? (
            <img src={profile.avatar_url} alt="Avatar" className="object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center rounded-full bg-blue-100 text-lg font-medium text-blue-700">
              {profile.initials}
            </div>
          )}
        </button>
        <AvatarChangeModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} userId={profile.userId} currentAvatarUrl={profile.avatar_url} />
        {/* Name fields */}
        <div className="grid grid-cols-2 gap-3">
          <Field label="First name">
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className={INPUT}
            />
          </Field>
          <Field label="Last name">
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className={INPUT}
            />
          </Field>
        </div>

        {/* Bio */}
        <Field label="Bio">
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            placeholder="Tell other users a bit about yourself…"
            className={`${INPUT} resize-none ${bioTooLong ? "border-red-300 focus:border-red-400" : ""}`}
          />
          <div className="flex justify-end mt-1.5">
            <span className={`text-xs ${bioTooLong ? "text-red-500 font-medium" : bioRemaining <= 20 ? "text-amber-500" : "text-gray-400"
              }`}>
              {bioRemaining} characters remaining
            </span>
          </div>
        </Field>

        {/* Save */}
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={handleSave}
            disabled={!hasChanges || saving || bioTooLong}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#1877F2] text-white text-sm font-semibold rounded-lg hover:bg-[#1567d3] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {saving ? <Loader2 size={15} className="animate-spin" /> : saved ? <Check size={15} /> : null}
            {saving ? "Saving…" : saved ? "Saved" : "Save changes"}
          </button>
          {hasChanges && !saving && (
            <button
              onClick={() => {
                setFirstName(profile.first_name);
                setLastName(profile.last_name);
                setBio(profile.bio ?? "");
              }}
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              Discard
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

const INPUT = "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 outline-none focus:border-[#1877F2] focus:ring-2 focus:ring-[#1877F2]/10 transition-all placeholder-gray-400";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">{label}</label>
      {children}
    </div>
  );
}
