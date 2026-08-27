"use client";

import { useState } from "react";
import { UserProfile, ProfileSection as ProfileSectionType } from "@/lib/types";
import { ProfileSection } from "./sections/ProfileSection";
import { PasswordSection } from "./forms/PasswordUpdate";
import { SecuritySection } from "./sections/SecuritySection";
import React from 'react'
import { ProfileSidebar } from '@/components/profile/ProfileSidebar';

interface ProfilePageShellProps {
  profile: UserProfile;
}

export default function ProfilePageShell({ profile }: ProfilePageShellProps) {
  const [activeSection, setActiveSection] = useState<ProfileSectionType>("profile");

  return (
    <div className="flex h-full bg-white overflow-hidden">
      <ProfileSidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        profile={profile}
      />

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-8 py-8">
          { activeSection === "profile" && (
            <ProfileSection profile={profile} />
          )}
          {activeSection === "security" && <SecuritySection profile={profile} />}
          {activeSection === "password" && <PasswordSection />}
        </div>
      </main>
    </div>
  );
}
