"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import { UserProfile, BIO_MAX_LENGTH } from "@/lib/types";
import { AvatarChangeModal } from '@/components/profile/AvatarChangeModal';

interface ProfileSectionProps {
  profile: UserProfile;
  onUpdate: (p: UserProfile) => void;
}

export function ProfileSection({ profile, onUpdate }: ProfileSectionProps) {
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

        {/* Avatar Section */}
        <div className="relative w-32 h-32">
          <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center border-2 border-gray-200">
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt="Avatar" className="object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center rounded-full bg-gray-100 text-lg font-medium text-blue-700">
                {profile.initials}
              </div>
            )}
          </div>
          <button
            aria-label="Edit Avatar"
            onClick={() => setModalOpen(true)}
            className="absolute bottom-1 right-1 bg-white border border-gray-300 rounded-full p-1 shadow-md hover:bg-gray-100 transition"
          >
            <Pencil size={16} className="text-gray-500" />
          </button>
        </div>

        <AvatarChangeModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} userId={profile.userId} currentAvatarUrl={profile.avatar_url} />
        {/* Name fields */}
        <div className="grid grid-cols-2 gap-3 border border-gray-200 rounded-xl p-4 mb-6">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Username</p>
            <p>
              {profile.username}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">First Name</p>
            <p>
              {firstName}
            </p>
          </div>
          {lastName && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Last Name</p>
              <p>
                {lastName}
              </p>
            </div>
          )}
        </div>

        {/* Bio */}
        <div className="border border-gray-200 rounded-xl p-4 mb-6">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Bio</p>
          {bio ? <p className="text-sm">{bio}</p> : <p className="text-sm text-gray-400 mb-6">No bio provided.</p>}
        </div>

          
        {/* Contact & identity
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Phone Number</p>
            <p>
              {profile.phone_number}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Email</p>
            <p>
              {profile.email}
            </p>
          </div>
        </div> */}
      </div>

    </div>
  );
}