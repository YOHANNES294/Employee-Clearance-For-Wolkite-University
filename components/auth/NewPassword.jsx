import React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { newPasswordSchema } from "@/validations/userValidation";
import { yupResolver } from "@hookform/resolvers/yup";
import bcrypt from "bcryptjs";
import Link from "next/link";
import { toast } from "react-toastify";

const NewPassword = ({ userData }) => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(newPasswordSchema),
  });

  const onSubmit = async (data) => {
    if (data.newPassword === data.confirmPassword) {
      const hashedPassword = await bcrypt.hash(data.newPassword, 10);
      try {
        const response = await fetch(`/api/user/new/`, {
          method: "PATCH",
          body: JSON.stringify({
            objectId: userData[0]._id,
            userId: userData[0].userId,
            password: hashedPassword,
          }),
        });

        if (response.ok) {
          toast.success("Password updated successfully!");
          router.replace("/signIn");
        }
      } catch (error) {
        console.error(error);
      }

      reset();
    } else {
      toast.error("Passwords do not match!");
    }
  };

  const preventCopyPaste = (e) => {
    e.preventDefault();
    toast.error("Copy and Paste are disabled. Please type the password manually.", {
      position: toast.POSITION.TOP_CENTER,
      autoClose: 3000,
      hideProgressBar: true,
      closeButton: true,
      className: 'toast-warning',
    });
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

        <h3 className="text-2xl font-semibold text-gray-800 mb-2">Reset Password</h3>
        <p className="text-sm text-gray-500 mb-6">
          Please enter your new password and confirm it below.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
              New Password
            </label>
            <input
              id="newPassword"
              type="password"
              placeholder="Enter new password"
              {...register("newPassword")}
              onCopy={preventCopyPaste}
              onPaste={preventCopyPaste}
              className={`mt-1 w-full px-4 py-3 border ${
                errors.newPassword ? "border-red-500" : "border-gray-300"
              } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3D5AFE] transition-transform duration-300 transform focus:scale-105`}
            />
            {errors.newPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.newPassword.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="Confirm password"
              {...register("confirmPassword")}
              onCopy={preventCopyPaste}
              onPaste={preventCopyPaste}
              className={`mt-1 w-full px-4 py-3 border ${
                errors.confirmPassword ? "border-red-500" : "border-gray-300"
              } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3D5AFE] transition-transform duration-300 transform focus:scale-105`}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-[#3D5AFE] hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition-transform duration-300 transform hover:scale-105"
          >
            Update Password
          </button>
        </form>

        <div className="text-center mt-6">
          <Link href="/signIn" className="text-[#3D5AFE] hover:underline text-sm font-medium">
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NewPassword;
