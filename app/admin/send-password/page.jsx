'use client';
import { useState } from "react";
import toast from "react-hot-toast";
import { FiUser, FiLock, FiMail, FiSend, FiArrowLeft } from 'react-icons/fi';
import Link from "next/link";

export default function SendPasswordPage() {
  const [form, setForm] = useState({ username: "", userpassword: "", email: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/send-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || "Credential saved and email sent");
        setForm({ username: "", userpassword: "", email: "" });
      } else {
        throw new Error(data.message || "Failed to save credential or send email");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        background: "linear-gradient(135deg, rgba(61,90,254,0.15), rgba(61,90,254,0.05) 80%)",
        backdropFilter: "blur(6px)",
      }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md px-8 py-10 relative">
        <div className="flex items-center gap-2 mb-6">
          <img src="/images/logo/logo.png" alt="Logo" className="w-10 h-10" />
          <h2 className="text-xl font-bold text-[#3D5AFE]">WKU-ECMS</h2>
        </div>

        <h3 className="text-2xl font-semibold text-gray-800 mb-2">Create and Send Credentials</h3>
        <p className="text-sm text-gray-500 mb-6">
          Securely generate and share access credentials with users
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <FiUser />
              </div>
              <input
                type="text"
                name="username"
                placeholder="Enter username"
                value={form.username}
                onChange={handleChange}
                className="w-full pl-10 px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3D5AFE] transition-transform duration-300 transform focus:scale-[1.02]"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="userpassword" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <FiLock />
              </div>
              <input
                type="password"
                name="userpassword"
                placeholder="Enter password"
                value={form.userpassword}
                onChange={handleChange}
                className="w-full pl-10 px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3D5AFE] transition-transform duration-300 transform focus:scale-[1.02]"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Recipient Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <FiMail />
              </div>
              <input
                type="email"
                name="email"
                placeholder="Enter recipient email"
                value={form.email}
                onChange={handleChange}
                className="w-full pl-10 px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3D5AFE] transition-transform duration-300 transform focus:scale-[1.02]"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full mt-6 flex items-center justify-center py-3 px-4 rounded-lg font-medium text-white bg-[#3D5AFE] hover:bg-blue-600 transition-transform duration-300 transform hover:scale-[1.02] active:scale-100 ${
              isLoading ? 'opacity-70 cursor-not-allowed' : 'shadow-md'
            }`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              <>
                <FiSend className="mr-2" />
                Save and Send Email
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}