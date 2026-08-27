"use client";

import { useState } from "react";
import { LogOut, Trash2, AlertTriangle, KeyRound, Phone } from "lucide-react";
import { EmailSection } from "../sections/EmailSection";
import { UserProfile } from "@/lib/types";
import { logout } from '@/app/actions/auth'
import { useTransition } from 'react'
import { PhoneSection } from "./PhoneSection";

interface SecuritySectionProps {
  profile: UserProfile;
}

export function SecuritySection({ profile }: SecuritySectionProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isPending, startTransition] = useTransition();

  const memberSince = profile.created_at
    ? new Date(profile.created_at).toLocaleDateString("en-IN", {
      month: "long", year: "numeric",
    })
    : "—";

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900 mb-1">Security</h1>
      <p className="text-sm text-gray-400 mb-6">
        Manage your account access and data.
      </p>

      <div className="border border-gray-200 rounded-xl p-4 mb-6">
        <p className="text-sm font-semibold text-gray-700 mb-3">Account overview</p>
        <div className="flex flex-col gap-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Member since</span>
            <span className="text-gray-700">{memberSince}</span>
          </div>
          {/* <div className="flex justify-between">
            <span className="text-gray-400">Account ID</span>
            <span className="text-gray-700 font-mono text-xs">{profile.id.slice(0, 12)}…</span>
          </div> */}
        </div>
      </div>

      <EmailSection profile={profile}/>
      <PhoneSection profile={profile}/>
      <button className="flex items-center gap-2 w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors mb-6">
        <KeyRound size={15} />
        Change Password
      </button>

      <button className="flex items-center gap-2 w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors mb-6"
        onClick={() => startTransition(() => logout())}
        disabled={isPending}
      >
        <LogOut size={15} />
        {isPending ? 'Logging out…' : 'Log out'}
      </button>

      {/* Danger zone */}
      <div className="border border-red-200 rounded-xl p-4 bg-red-50/40">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle size={15} className="text-red-500" />
          <p className="text-sm font-semibold text-red-700">Danger zone</p>
        </div>
        <p className="text-xs text-red-600/80 mb-3">
          Deleting your account is permanent and will remove all your listings, messages, and saved items. This cannot be undone.
        </p>

        {!confirmDelete ? (
          <button
            onClick={() => setConfirmDelete(true)}
            className="flex items-center gap-2 px-4 py-2 border border-red-300 text-red-600 text-sm font-medium rounded-lg hover:bg-red-100 transition-colors"
          >
            <Trash2 size={14} />
            Delete account
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition-colors">
              Yes, permanently delete my account
            </button>
            <button
              onClick={() => setConfirmDelete(false)}
              className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
