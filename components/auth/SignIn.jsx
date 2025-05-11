"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { loginSchema } from "../../validations/userValidation";
export const metadata = {
  title: "Signin Page | Wolkite University Employee Clearance Management System",
  description: "This is Signin page for WKU-ECMS",
};
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { getSession, signIn } from "next-auth/react";
import { useState } from "react";

const SignIn = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  let status, role;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const onSubmitHandler = async (data) => {
    const session = await getSession();
    const userId = data.id;
    const password = data.password;

    try {
      const url = "/api/user/byUserId";
      const fullUrl = `${url}?userId=${userId}`;
      const response = await fetch(fullUrl);

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const fetchedData = await response.json();
      status = fetchedData[0].status;
      role = fetchedData[0].role;
    } catch (error) {
      console.error("Error fetching user data:", error);
    }

    try {
      const res = await signIn("credentials", {
        userId,
        password,
        redirect: false,
      });

      if (res.error || status === "inactive") {
        if (res.error) toast.error("Invalid credentials");
        else if (status === "inactive") toast.error("You have been banned.");
        return;
      } else {
        toast.success("Login Successful!");
        if (role === "ADMIN") {
          router.replace("/admin");
        } else if (role === "STAFF") {
          router.replace("/user");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="relative rounded-lg border border-stroke shadow-meta-3 shadow-lg dark:border-strokedark dark:bg-boxdark">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src="/images/logo/back1.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Form Container */}
      <div className="relative z-10 w-full border-stroke dark:border-strokedark">
        <div className="w-full sm:p-14 p-6">
          <h1 className="lg:mb-9 mb-4 md:text-4xl text-3xl text-center font-extrabold text-black">
            SIGN IN WKU ECMS
          </h1>

          <form onSubmit={handleSubmit(onSubmitHandler)}>
            {/* Employee ID Field */}
            <div className="mb-4">
              <label className="mb-2.5 block font-medium text-black">
                Employee ID
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="id"
                  placeholder="Enter your Id"
                  {...register("id")}
                  className="w-full rounded-lg border border-stroke bg-white/80 py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                />
                <span className="absolute right-4 top-4">
                  <svg
                    className="fill-current"
                    width="22"
                    height="22"
                    viewBox="0 0 22 22"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g opacity="0.5">
                      <path
                        d="M19.2516 3.30005H2.75156C1.58281 3.30005 0.585938 4.26255 0.585938 5.46567V16.6032C0.585938 17.7719 1.54844 18.7688 2.75156 18.7688H19.2516C20.4203 18.7688 21.4172 17.8063 21.4172 16.6032V5.4313C21.4172 4.26255 20.4203 3.30005 19.2516 3.30005ZM19.2516 4.84692C19.2859 4.84692 19.3203 4.84692 19.3547 4.84692L11.0016 10.2094L2.64844 4.84692C2.68281 4.84692 2.71719 4.84692 2.75156 4.84692H19.2516ZM19.2516 17.1532H2.75156C2.40781 17.1532 2.13281 16.8782 2.13281 16.5344V6.35942L10.1766 11.5157C10.4172 11.6875 10.6922 11.7563 10.9672 11.7563C11.2422 11.7563 11.5172 11.6875 11.7578 11.5157L19.8016 6.35942V16.5688C19.8703 16.9125 19.5953 17.1532 19.2516 17.1532Z"
                        fill=""
                      />
                    </g>
                  </svg>
                </span>
              </div>
              <p className="text-red-500">{errors.id?.message}</p>
            </div>

            {/* Password Field with Visibility Toggle */}
            <div className="mb-6">
              <label className="mb-2.5 block font-medium text-black">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="password"
                  {...register("password")}
                  className="w-full rounded-lg border border-stroke bg-white/80 py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                />
                <span
                  className="absolute right-4 top-4 cursor-pointer"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.038.158-2.038.45-2.985M4.22 4.22l15.56 15.56M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-.488 1.554-1.387 2.947-2.542 4.05M15.536 15.536A9.956 9.956 0 0112 17c-2.5 0-4.78-.962-6.536-2.536" />
                    </svg>
                  )}
                </span>
              </div>
              <p className="text-red-500">{errors.password?.message}</p>
            </div>

            {/* Submit Button */}
            <div className="mb-5">
              <button
                type="submit"
                className="w-full cursor-pointer border border-primary bg-primary p-4 text-white hover:bg-opacity-90 rounded-md transform transition-transform duration-300 ease-in-out hover:scale-95"
              >
                Sign In
              </button>
            </div>

            {/* Additional Links */}
            <div className="mt-6 text-right">
              <p>
                <Link href="/forget-password" className="text-primary">
                  Forgot password?
                </Link>
              </p>
            </div>
            <div className="mt-2 text-right">
              <p>
                <Link href="/request-account" className="text-primary underline">
                  Don't have an account? Request one here
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
