

// export default function ProfilePageShell({
//     profile
// }: {
//     profile: { email: string; username: string; avatar_url: string | null; initials: string; userId: string; first_name: string; last_name: string }
// }) {
//     const router = useRouter();
//     const [isModalOpen, setModalOpen] = React.useState(false);
//     const handleAvatarClick = () => {

//     };

//     return (
//         <div className='flex h-full bg-white overflow-hidden'>
//             <ProfileSidebar
//                 activeSection={"profile"}
//                 setActiveSection={(s) => { }}
//                 profile={profile}
//             />
//             <main className="flex-1 overflow-y-auto">
//                 <div className='flex gap-6 p-4 max-w-3xl'>
//                     <div className='flex-col p-4 mb-5 h-full rounded-lg flex gap-4 border border-gray-200'>
//                         <button onClick={() => setModalOpen(true)} className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
//                             {profile.avatar_url ? (
//                                 <img src={profile.avatar_url} alt="Avatar" className="object-cover" />
//                             ) : (
//                                 <div className="flex h-full w-full items-center justify-center rounded-full bg-blue-100 text-lg font-medium text-blue-700">
//                                     {profile.initials}
//                                 </div>
//                             )}
//                         </button>
//                         {/* Profile Information */}
//                         <div>
//                         <p className="text-md font-semibold text-gray-900">
//                             {profile.first_name} {profile.last_name}
//                         </p>
//                         <p className="text-sm text-gray-400 mt-0.5">@{profile.username}</p>
//                         <p className="text-sm text-gray-400 mt-0.5">{profile.email}</p>
//                         </div>
//                     </div>
//                     <AvatarChangeModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} userId={profile.userId} currentAvatarUrl={profile.avatar_url} />
//                     <div className='border rounded-lg p-4 mb-5 flex-col'>
//                         <h2 className='text-xl font-semibold mt-4'>Your Active Listings</h2>
//                         <p className='text-gray-600 mt-2'>You have no active listings. Start selling your items today!</p>
//                         <Button
//                             className='mt-5'
//                             onClick={() => router.push("/protected/sell")}
//                         >Your Listings</Button>

//                     </div>
//                     {/* <div className='border rounded-lg p-4'>
//                     <h2 className='text-xl font-semibold mt-4'>Purchase History</h2>
//                     <p className='text-gray-600 mt-2'>You have not made any purchases yet. Explore items and find something you like!</p>
//                     <Button className='mt-5'>View History</Button>
//                 </div> */}
//                 </div>
//             </main>
//         </div>
//     )
// }
"use client";

import { useState } from "react";
import { UserProfile, ProfileSection as ProfileSectionType } from "@/lib/types";
import { ProfileSection } from "./sections/ProfileSection";
import { EmailSection } from "./sections/EmailSection";
import { PhoneSection } from "./sections/PhoneSection";
import { PasswordSection } from "./forms/PasswordUpdate";
import { SecuritySection } from "./sections/SecuritySection";
import React from 'react'
import { ProfileSidebar } from '@/components/profile/ProfileSidebar';

interface ProfilePageShellProps {
  profile: any;
}

export default function ProfilePageShell({ profile: initialProfile }: ProfilePageShellProps) {
  const [profile, setProfile] = useState<UserProfile>(initialProfile);
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
            <ProfileSection profile={profile} onUpdate={setProfile} />
          )}
          {/* {activeSection === "demo profile" && (
            <DemoProfileSection profile={profile} onUpdate={setProfile} />
          )} */}
          {activeSection === "email" && (
            <EmailSection profile={profile} onUpdate={setProfile} />
          )}
          {activeSection === "phone" && (
            <PhoneSection profile={profile} onUpdate={setProfile} />
          )}
          {activeSection === "password" && <PasswordSection />}
          {activeSection === "security" && <SecuritySection profile={profile} />}
        </div>
      </main>
    </div>
  );
}
