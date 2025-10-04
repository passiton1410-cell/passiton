"use client";

import { useState, useEffect } from "react";
import { Pencil, UserRound, CheckCircle } from "lucide-react";

interface User {
  fullName: string;
  username: string;
  email: string;
  collegeIdUrl?: string;
  mobile?: string;
  collegeName?: string;
  verified?: boolean;
}

export default function UserInfoCard() {
  const [user, setUser] = useState<User | null>(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    username: "",
    collegeIdUrl: "",
    mobile: "",
    collegeName: "",
  });
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data?.user) {
          setUser(data.user);
          setForm({
            fullName: data.user.fullName || "",
            username: data.user.username || "",
            collegeIdUrl: data.user.collegeIdUrl || "",
            mobile: data.user.mobile || "",
            collegeName: data.user.collegeName || "",
          });
        }
      });
  }, []);

  const handleEdit = () => setEditing(true);

  const handleSave = async () => {
    setError("");

    const res = await fetch("/api/user/update-profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Something went wrong");
    } else {
      setUser(data.user);
      setEditing(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setUploading(false);

    if (res.ok && data.url) {
      setForm((prev) => ({ ...prev, collegeIdUrl: data.url }));
    } else {
      setError("Image upload failed");
    }
  };

  if (!user) return <div className="text-black">Loading...</div>;

  return (
    <div className="p-6 bg-white rounded-2xl shadow-lg w-full max-w-2xl mx-auto mt-10 text-black">
      {/* Profile Image */}
      <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-4 mb-6">
        <div className="relative w-24 h-24 rounded-full overflow-hidden border border-[#5B3DF6]/50 shadow-md">
          {form.collegeIdUrl ? (
            <img
              src={form.collegeIdUrl}
              alt="Profile"
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-[#5B3DF6]/10">
              <UserRound className="text-[#5B3DF6]" size={32} />
            </div>
          )}
        </div>

        {editing && (
          <div>
            <input
              id="profile-upload"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="block text-sm mt-2"
            />
            {uploading && (
              <p className="text-xs text-gray-500 mt-1">Uploading...</p>
            )}
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Full Name */}
        <div>
          <label className="block text-sm font-semibold mb-1">Full Name</label>
          {editing ? (
            <input
              type="text"
              value={form.fullName}
              onChange={(e) =>
                setForm({ ...form, fullName: e.target.value })
              }
              className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5B3DF6]"
            />
          ) : (
            <p className="text-sm text-gray-800">{user.fullName}</p>
          )}
        </div>

        {/* Username + Verified */}
        <div>
          <label className="block text-sm font-semibold mb-1">Username</label>
          {editing ? (
            <input
              type="text"
              value={form.username}
              onChange={(e) =>
                setForm({ ...form, username: e.target.value })
              }
              className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5B3DF6]"
            />
          ) : (
            <p className="text-sm text-gray-800 flex items-center gap-1">
              @{user.username}
              {user.verified && (
                <CheckCircle
                  size={16}
                  className="text-green-500 inline-block"
                />
              )}
            </p>
          )}
        </div>

        {/* Mobile Number */}
        <div>
          <label className="block text-sm font-semibold mb-1">Mobile</label>
          {editing ? (
            <input
              type="text"
              value={form.mobile}
              onChange={(e) =>
                setForm({ ...form, mobile: e.target.value })
              }
              className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5B3DF6]"
            />
          ) : (
            <p className="text-sm text-gray-800">{user.mobile || "Not added"}</p>
          )}
        </div>

        {/* College Name */}
        <div>
          <label className="block text-sm font-semibold mb-1">College</label>
          {editing ? (
            <input
              type="text"
              value={form.collegeName}
              onChange={(e) =>
                setForm({ ...form, collegeName: e.target.value })
              }
              className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5B3DF6]"
            />
          ) : (
            <p className="text-sm text-gray-800">
              {user.collegeName || "Not added"}
            </p>
          )}
        </div>

        {/* Email */}
        <div className="sm:col-span-2">
          <label className="block text-sm font-semibold mb-1">Email</label>
          <p className="text-sm text-gray-800">{user.email}</p>
        </div>
      </div>

      {/* Error Message */}
      {error && <p className="text-red-600 text-sm mt-4">{error}</p>}

      {/* Action Buttons */}
      <div className="flex justify-end mt-6 space-x-3">
        {editing ? (
          <>
            <button
              onClick={() => setEditing(false)}
              className="text-sm px-4 py-2 border rounded-md hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={uploading}
              className="text-sm px-4 py-2 bg-[#5B3DF6] text-white rounded-md hover:bg-[#4a32d4] transition"
            >
              {uploading ? "Uploading..." : "Save"}
            </button>
          </>
        ) : (
          <button
            onClick={handleEdit}
            className="flex items-center gap-1 text-sm text-gray-600 hover:text-black"
          >
            <Pencil className="w-4 h-4" />
            Edit Info
          </button>
        )}
      </div>
    </div>
  );
}
