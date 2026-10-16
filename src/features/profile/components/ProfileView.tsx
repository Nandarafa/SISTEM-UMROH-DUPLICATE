"use client";

import { useState, useTransition } from "react";
import {
  updateProfileInfoAction,
  updatePasswordAction,
  deleteAccountAction,
} from "@/features/profile/services/profileActions";

interface ProfileViewProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export function ProfileView({ user }: ProfileViewProps) {
  const [profilePending, startProfileTransition] = useTransition();
  const [passwordPending, startPasswordTransition] = useTransition();
  const [deletePending, startDeleteTransition] = useTransition();

  const [profileMsg, setProfileMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [passwordMsg, setPasswordMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [deleteMsg, setDeleteMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleProfileSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setProfileMsg(null);
    const formData = new FormData(e.currentTarget);

    startProfileTransition(async () => {
      const res = await updateProfileInfoAction(formData);
      if (res?.error) {
        setProfileMsg({ type: "error", text: res.error });
      } else {
        setProfileMsg({ type: "success", text: "Informasi profil berhasil diperbarui." });
        setTimeout(() => setProfileMsg(null), 3500);
      }
    });
  };

  const handlePasswordSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPasswordMsg(null);
    const form = e.currentTarget;
    const formData = new FormData(form);

    startPasswordTransition(async () => {
      const res = await updatePasswordAction(formData);
      if (res?.error) {
        setPasswordMsg({ type: "error", text: res.error });
      } else {
        setPasswordMsg({ type: "success", text: "Password berhasil diperbarui." });
        form.reset();
        setTimeout(() => setPasswordMsg(null), 3500);
      }
    });
  };

  const handleDeleteAccount = () => {
    if (confirm("Apakah Anda yakin ingin menghapus akun Anda? Tindakan ini tidak dapat dibatalkan.")) {
      setDeleteMsg(null);
      startDeleteTransition(async () => {
        const res = await deleteAccountAction();
        if (res?.error) {
          setDeleteMsg({ type: "error", text: res.error });
        } else {
          setDeleteMsg({ type: "success", text: "Permintaan penghapusan akun telah dicatat." });
        }
      });
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      {/* 1. Profile Information Card */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-xs p-8">
        <h2 className="text-base font-bold text-gray-800">Profile Information</h2>
        <p className="text-xs text-gray-400 mt-0.5 mb-6">
          Update your account&apos;s profile information and email address.
        </p>

        {profileMsg && (
          <div
            className={`p-3 rounded-lg text-xs mb-4 ${
              profileMsg.type === "success"
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            {profileMsg.text}
          </div>
        )}

        <form onSubmit={handleProfileSubmit} className="space-y-4 max-w-md">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Name</label>
            <input
              type="text"
              name="name"
              defaultValue={user.name}
              required
              className="w-full text-xs rounded-lg border border-indigo-400/80 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 px-3.5 py-2.5 text-gray-800 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Email</label>
            <input
              type="email"
              name="email"
              defaultValue={user.email}
              required
              className="w-full text-xs rounded-lg border border-gray-200 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 px-3.5 py-2.5 text-gray-800 outline-none"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={profilePending}
              className="px-5 py-2 rounded-lg bg-[#1e293b] text-white text-xs font-semibold uppercase tracking-wider hover:bg-slate-800 transition disabled:opacity-50"
            >
              {profilePending ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>

      {/* 2. Update Password Card */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-xs p-8">
        <h2 className="text-base font-bold text-gray-800">Update Password</h2>
        <p className="text-xs text-gray-400 mt-0.5 mb-6">
          Ensure your account is using a long, random password to stay secure.
        </p>

        {passwordMsg && (
          <div
            className={`p-3 rounded-lg text-xs mb-4 ${
              passwordMsg.type === "success"
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            {passwordMsg.text}
          </div>
        )}

        <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-md">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Current Password</label>
            <input
              type="password"
              name="current_password"
              className="w-full text-xs rounded-lg border border-gray-200 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 px-3.5 py-2.5 text-gray-800 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">New Password</label>
            <input
              type="password"
              name="new_password"
              required
              className="w-full text-xs rounded-lg border border-gray-200 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 px-3.5 py-2.5 text-gray-800 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Confirm Password</label>
            <input
              type="password"
              name="confirm_password"
              required
              className="w-full text-xs rounded-lg border border-gray-200 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 px-3.5 py-2.5 text-gray-800 outline-none"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={passwordPending}
              className="px-5 py-2 rounded-lg bg-[#1e293b] text-white text-xs font-semibold uppercase tracking-wider hover:bg-slate-800 transition disabled:opacity-50"
            >
              {passwordPending ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>

      {/* 3. Delete Account Card */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-xs p-8">
        <h2 className="text-base font-bold text-gray-800">Delete Account</h2>
        <p className="text-xs text-gray-400 mt-0.5 mb-6">
          Once your account is deleted, all of its resources and data will be permanently deleted.
          Before deleting your account, please download any data or information that you wish to retain.
        </p>

        {deleteMsg && (
          <div
            className={`p-3 rounded-lg text-xs mb-4 ${
              deleteMsg.type === "success"
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            {deleteMsg.text}
          </div>
        )}

        <div>
          <button
            type="button"
            disabled={deletePending}
            onClick={handleDeleteAccount}
            className="px-5 py-2.5 rounded-lg bg-[#dc2626] text-white text-xs font-semibold uppercase tracking-wider hover:bg-red-700 transition disabled:opacity-50"
          >
            {deletePending ? "Processing..." : "Delete Account"}
          </button>
        </div>
      </div>
    </div>
  );
}
