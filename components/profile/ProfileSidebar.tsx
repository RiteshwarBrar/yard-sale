"use client";

import { User, Mail, Phone, Lock, ShieldCheck, CheckCircle2, AlertCircle } from "lucide-react";
import { ProfileSection, UserProfile } from "@/lib/types";

interface ProfileSidebarProps {
  activeSection: ProfileSection;
  setActiveSection: (s: ProfileSection) => void;
  profile: UserProfile;
}

export function ProfileSidebar({ activeSection, setActiveSection, profile }: ProfileSidebarProps) {
  const initials =
    `${profile.first_name?.[0] ?? ""}${profile.last_name?.[0] ?? ""}`.toUpperCase() || "U";
  const emailVerified = true;
  const phoneVerified = false;

  const NAV_ITEMS: { label: string; section: ProfileSection; icon: React.ElementType; badge?: boolean }[] = [
    { label: "Profile", section: "profile", icon: User },
    { label: "Security", section: "security", icon: ShieldCheck },
    { label: "Email address", section: "email", icon: Mail, badge: !emailVerified },
    { label: "Phone number", section: "phone", icon: Phone, badge: !phoneVerified },
    { label: "Password", section: "password", icon: Lock },
  ];

  return (
    <aside className="w-72 shrink-0 border-r border-gray-200 overflow-y-auto bg-white">
      <div className="p-5">
        {/* Nav */}
        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2 px-1">
          Account settings
        </p>
        <div className="flex flex-col gap-0.5">
          {NAV_ITEMS.map(({ label, section, icon: Icon, badge }) => {
            const active = activeSection === section;
            return (
              <button
                key={section}
                onClick={() => setActiveSection(section)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm w-full text-left transition-colors ${active
                  ? "bg-[#E7F3FF] text-[#1877F2] font-semibold"
                  : "text-gray-700 hover:bg-gray-100"
                  }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${active ? "bg-white" : "bg-gray-100"
                  }`}>
                  <Icon size={15} className={active ? "text-[#1877F2]" : "text-gray-500"} />
                </div>
                <span className="flex-1">{label}</span>
                {badge && (
                  <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" title="Action needed" />
                )}
              </button>
            );
          })}
        </div>

        {/* Verification status summary
        <div className="mt-5 pt-5 border-t border-gray-100 flex flex-col gap-2">
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-1 mb-1">
            Verification
          </p>
          <div className="flex items-center gap-2 px-1 text-xs">
            {profile.email_verified ? (
              <CheckCircle2 size={13} className="text-green-600" />
            ) : (
              <AlertCircle size={13} className="text-amber-500" />
            )}
            <span className={profile.email_verified ? "text-gray-500" : "text-amber-600"}>
              Email {profile.email_verified ? "verified" : "unverified"}
            </span>
          </div>
          <div className="flex items-center gap-2 px-1 text-xs">
            {profile.phone_verified ? (
              <CheckCircle2 size={13} className="text-green-600" />
            ) : (
              <AlertCircle size={13} className="text-amber-500" />
            )}
            <span className={profile.phone_verified ? "text-gray-500" : "text-amber-600"}>
              Phone {profile.phone_verified ? "verified" : profile.phone ? "unverified" : "not added"}
            </span>
          </div> */}
        {/* </div> */}
      </div>
    </aside>
  );
}
