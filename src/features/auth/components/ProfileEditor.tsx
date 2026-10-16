"use client";

import { useState } from "react";
import {
  updateProfileInfoAction,
  updatePasswordAction,
  requestAccountDeletionAction,
  ActionResult,
} from "@/features/auth/services/profileActions";

interface ProfileEditorProps {
  initialName: string;
  initialEmail: string;
}

export function ProfileEditor({ initialName, initialEmail }: ProfileEditorProps) {
  // State Profile Info
  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);
  const [infoLoading, setInfoLoading] = useState(false);
  const [infoResult, setInfoResult] = useState<ActionResult | null>(null);

  // State Update Password
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passLoading, setPassLoading] = useState(false);
  const [passResult, setPassResult] = useState<ActionResult | null>(null);

  // State Delete Account
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteReason, setDeleteReason] = useState("");
  const [delLoading, setDelLoading] = useState(false);
  const [delResult, setDelResult] = useState<ActionResult | null>(null);

  const handleConfirmDelete = async () => {
    setDelLoading(true);
    setDelResult(null);
    try {
      const res = await requestAccountDeletionAction(deleteReason);
      setDelResult(res);
      setShowDeleteModal(false);
    } catch {
      setDelResult({ success: false, error: "Gagal memproses permohonan hapus akun." });
    } finally {
      setDelLoading(false);
    }
  };

  const handleUpdateInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    setInfoLoading(true);
    setInfoResult(null);
    try {
      const formData = new FormData();
      formData.set("name", name);
      formData.set("email", email);
      const res = await updateProfileInfoAction(formData);
      setInfoResult(res);
    } catch {
      setInfoResult({ success: false, error: "Gagal memperbarui profil." });
    } finally {
      setInfoLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassLoading(true);
    setPassResult(null);
    try {
      const formData = new FormData();
      formData.set("current_password", currentPassword);
      formData.set("new_password", newPassword);
      formData.set("confirm_password", confirmPassword);
      const res = await updatePasswordAction(formData);
      setPassResult(res);
      if (res.success) {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch {
      setPassResult({ success: false, error: "Gagal memperbarui password." });
    } finally {
      setPassLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Profile Information */}
      <div className="p-6 sm:p-8 bg-white shadow-sm rounded-xl border border-gray-100">
        <div className="max-w-xl">
          <h2 className="text-base font-semibold text-gray-900">Profile Information</h2>
          <p className="mt-1 text-xs text-gray-500">
            Update your account&apos;s profile information and email address.
          </p>

          {infoResult?.success && (
            <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-lg">
              ✓ {infoResult.message}
            </div>
          )}
          {infoResult?.error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">
              ✕ {infoResult.error}
            </div>
          )}

          <form onSubmit={handleUpdateInfo} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-gray-300 text-sm px-3 py-2 focus:border-brand focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-gray-300 text-sm px-3 py-2 focus:border-brand focus:outline-none"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={infoLoading}
                className="px-4 py-2 bg-gray-900 text-white rounded-lg text-xs font-semibold uppercase tracking-widest hover:bg-gray-800 transition disabled:opacity-50"
              >
                {infoLoading ? "SAVING…" : "SAVE"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* 2. Update Password */}
      <div className="p-6 sm:p-8 bg-white shadow-sm rounded-xl border border-gray-100">
        <div className="max-w-xl">
          <h2 className="text-base font-semibold text-gray-900">Update Password</h2>
          <p className="mt-1 text-xs text-gray-500">
            Ensure your account is using a long, random password to stay secure.
          </p>

          {passResult?.success && (
            <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-lg">
              ✓ {passResult.message}
            </div>
          )}
          {passResult?.error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">
              ✕ {passResult.error}
            </div>
          )}

          <form onSubmit={handleUpdatePassword} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Current Password</label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full rounded-lg border border-gray-300 text-sm px-3 py-2 focus:border-brand focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">New Password</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full rounded-lg border border-gray-300 text-sm px-3 py-2 focus:border-brand focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Confirm Password</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-lg border border-gray-300 text-sm px-3 py-2 focus:border-brand focus:outline-none"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={passLoading}
                className="px-4 py-2 bg-gray-900 text-white rounded-lg text-xs font-semibold uppercase tracking-widest hover:bg-gray-800 transition disabled:opacity-50"
              >
                {passLoading ? "SAVING…" : "SAVE"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* 3. Delete Account */}
      <div className="p-6 sm:p-8 bg-white shadow-sm rounded-xl border border-gray-100">
        <div className="max-w-xl">
          <h2 className="text-base font-semibold text-gray-900">Delete Account</h2>
          <p className="mt-1 text-xs text-gray-500">
            Once your account deletion is submitted, it will be sent to the Super Admin for confirmation. The account can be easily restored at any time.
          </p>

          {delResult?.success && (
            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded-lg">
              ✓ {delResult.message}
            </div>
          )}
          {delResult?.error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">
              ✕ {delResult.error}
            </div>
          )}

          <div className="mt-6">
            <button
              type="button"
              onClick={() => setShowDeleteModal(true)}
              className="px-4 py-2 bg-red-600 text-white rounded-lg text-xs font-semibold uppercase tracking-widest hover:bg-red-700 transition"
            >
              DELETE ACCOUNT
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-sm">Konfirmasi Hapus Akun</h3>
                <p className="text-xs text-gray-500">Apakah Anda benar-benar ingin menghapus akun ini?</p>
              </div>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed mb-4">
              Permohonan penghapusan akan dikirimkan ke <strong>Super Admin</strong> untuk dikonfirmasi. Status akun Anda akan ditandai non-aktif, namun data Anda tetap tersimpan dan <strong>dapat dipulihkan sewaktu-waktu</strong> oleh Super Admin jika diperlukan.
            </p>

            <div className="mb-5">
              <label className="block text-xs font-medium text-gray-700 mb-1">Alasan Penghapusan (Opsional)</label>
              <textarea
                value={deleteReason}
                onChange={(e) => setDeleteReason(e.target.value)}
                placeholder="Tuliskan alasan ingin menghapus akun..."
                rows={3}
                className="w-full rounded-lg border border-gray-300 text-xs p-2.5 focus:border-red-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50 transition"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={delLoading}
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold uppercase tracking-wider transition disabled:opacity-50"
              >
                {delLoading ? "Memproses…" : "Ya, Ajukan Hapus"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
