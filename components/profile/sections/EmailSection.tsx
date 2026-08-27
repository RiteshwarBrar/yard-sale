"use client";

import { CheckCircle2, AlertCircle } from "lucide-react";
import { UserProfile } from "@/lib/types";
import { Pencil } from "lucide-react";
import { useRef, useState } from "react";
import { EmailUpdateForm } from "../forms/EmailUpdate";

interface EmailSectionProps {
  profile: UserProfile;
}
export function EmailSection({ profile }: EmailSectionProps) {
  const changeEmailDialog = useRef<HTMLDialogElement>(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const handleOpenModal = () => {
    changeEmailDialog.current?.showModal();
    setModalIsOpen(true);
  }
  const handleCloseModal = () => {
    changeEmailDialog.current?.close();
    setModalIsOpen(false);
  }
  const handleSubmit = (newEmail: string) => {
    handleCloseModal();
  }
  return (
    <div className="border border-gray-200 rounded-xl p-4 mb-6">
      <p className="text-sm font-semibold text-gray-700 mb-3">Email address</p>
      {/* <p className="text-sm text-gray-400 mb-6">
          Used for sign-in and important account notifications.
        </p> */}
      <div className="flex items-center justify-between p-2">
        <div className="flex items-center justify-left gap-2">
          <div>
            <p className="text-sm font-medium text-gray-500">{profile.email}</p>
          </div>
          <button
            onClick={handleOpenModal}
          >{/* Open the change email step */}
            <Pencil size={15} className="text-gray-500 hover:text-gray-700 transition-colors" />
          </button>
          <dialog
            ref={changeEmailDialog}
            onClose={handleCloseModal}
            className="rounded-xl p-8 max-w-md w-[95%] m-auto backdrop:bg-black/40 backdrop:backdrop-blur-md"
          >
            <EmailUpdateForm currentEmail={profile.email} onClose={handleCloseModal} onSubmit={handleSubmit} />
          </dialog>
        </div>
        {/* email verified */}
        <div className="flex items-center gap-1.5 mt-1">
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
    </div>
  );
}