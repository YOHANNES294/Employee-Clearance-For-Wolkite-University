"use client";

import Link from "next/link";
import OuterNav from "@/components/Header/OuterNav";
import { useForm } from "react-hook-form";
import { forgotPassword } from "../../validations/userValidation";
export const metadata = {
  title: "Signin Page | Wolkite University Employee Clearance Management System ",
  description: "This is Signin page for WKU-ECMS",
  // other metadata
};
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import { getSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useEffect } from "react";
import Verify from "@/components/auth/Verify";
import RouteIcon from "@mui/icons-material/Route";
import AdsClickIcon from "@mui/icons-material/AdsClick";
import ElectricBoltIcon from "@mui/icons-material/ElectricBolt";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import StackedLineChartIcon from "@mui/icons-material/StackedLineChart";

const Page = () => {
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(forgotPassword),
  });

  const onSubmitHandler = async (data) => {
    try {
      const response = await fetch("/api/auth/resetPassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("There was an error sending the reset password email.");
      }

      toast.success(
        "If the email is associated with an account, a password reset email will be sent."
      );

      const userId = data.userId;
      if (response.ok) {
        try {
          const url = "/api/user/byUserId";
          const fullUrl = `${url}?userId=${userId}`;
          const response = await fetch(fullUrl);

          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const fetchedData = await response.json();
          console.log("fetchedData", fetchedData);
          setUserData(fetchedData);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }

        setLoading(true);
      }
    } catch (error) {
      toast.error(error.message || "Failed to send reset password email.");
    }
  };

  return (
    <>
      {loading ? (
        <Verify userData={userData} />
      ) : (
        <div className="relative flex flex-col h-screen overflow-hidden">
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
          

          {/* Content */}
          <div className="relative z-10 flex flex-col bg-white/90 h-screen">
            <div className="flex w-full">
              <OuterNav />
            </div>
            <div className="flex md:flex-row flex-col lg:px-24 md:px-12 md:py-12">
              <div className="md:w-1/2 w-full">
                <div className="flex flex-col gap-8 pt-8">
                  <h1 className="md:text-left text-center text-3xl font-extrabold text-primary dark:text-white xl:text-title-xxl">
                    Wolkite University Employee Clearance Management System
                  </h1>
                  <h1 className="md:text-left text-center text-3xl font-extrabold text-salmon dark:text-white xl:text-title-xxl">
                    "+ Done Easy +"
                  </h1>
                  <div className="hidden md:block">
                    <p className="mb-6 text-base font-medium text-black">
                      Use our all-in-one solution, enjoy a stress-free clearance
                      process.
                    </p>
                    <ul className="flex flex-wrap gap-12 p-4 rounded-lg bg-gradient-to-r from-gray-700 via-gray-500 to-gray-300">
  <li className="group relative">
    <div className="flex h-16 w-16 cursor-pointer items-center justify-center rounded-full bg-white shadow-lg border-4 border-gray-500 group-hover:scale-110 transition-all duration-300 ease-in-out transform hover:shadow-2xl">
      <RouteIcon className="text-meta-4" fontSize="large" />
    </div>
    <span className="absolute -top-12 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 group-hover:translate-y-2 transition-all duration-300 bg-gradient-to-r from-pink-400 via-red-500 to-orange-600 text-white rounded-md px-4 py-2 shadow-xl text-sm group-hover:text-primary">
      Clear Pathway
      <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 rotate-45 w-2 h-2 bg-white"></span>
    </span>
  </li>

  <li className="group relative">
    <div className="flex h-16 w-16 cursor-pointer items-center justify-center rounded-full bg-white shadow-lg border-4 border-gray-500 group-hover:scale-110 transition-all duration-300 ease-in-out transform hover:shadow-2xl">
      <AdsClickIcon fontSize="large" className="text-primary" />
    </div>
    <span className="absolute -top-12 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 group-hover:translate-y-2 transition-all duration-300 bg-gradient-to-r from-teal-500 to-cyan-600 text-white rounded-md px-4 py-2 shadow-xl text-sm group-hover:text-primary">
      Efficient
      <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 rotate-45 w-2 h-2 bg-white"></span>
    </span>
  </li>

  <li className="group relative">
    <div className="flex h-16 w-16 cursor-pointer items-center justify-center rounded-full bg-white shadow-lg border-4 border-gray-500 group-hover:scale-110 transition-all duration-300 ease-in-out transform hover:shadow-2xl">
      <ElectricBoltIcon className="text-meta-1" fontSize="large" />
    </div>
    <span className="absolute -top-12 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 group-hover:translate-y-2 transition-all duration-300 bg-gradient-to-r from-yellow-300 to-yellow-500 text-white rounded-md px-4 py-2 shadow-xl text-sm group-hover:text-primary">
      Rapid Approval
      <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 rotate-45 w-2 h-2 bg-white"></span>
    </span>
  </li>

  <li className="group relative">
    <div className="flex h-16 w-16 cursor-pointer items-center justify-center rounded-full bg-white shadow-lg border-4 border-gray-500 group-hover:scale-110 transition-all duration-300 ease-in-out transform hover:shadow-2xl">
      <AutoFixHighIcon className="text-warning" fontSize="large" />
    </div>
    <span className="absolute -top-12 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 group-hover:translate-y-2 transition-all duration-300 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-md px-4 py-2 shadow-xl text-sm group-hover:text-primary">
      Seamless Experience
      <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 rotate-45 w-2 h-2 bg-white"></span>
    </span>
  </li>

  <li className="group relative">
    <div className="flex h-16 w-16 cursor-pointer items-center justify-center rounded-full bg-white shadow-lg border-4 border-gray-500 group-hover:scale-110 transition-all duration-300 ease-in-out transform hover:shadow-2xl">
      <StackedLineChartIcon className="text-black" fontSize="large" />
    </div>
    <span className="absolute -top-12 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 group-hover:translate-y-2 transition-all duration-300 bg-gradient-to-r from-green-500 to-lime-500 text-white rounded-md px-4 py-2 shadow-xl text-sm group-hover:text-primary">
      Transparent Tracking
      <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 rotate-45 w-2 h-2 bg-white"></span>
    </span>
  </li>
</ul>

                  </div>
                  <div className="flex mt-6 items-center gap-4"></div>
                </div>
              </div>
              <div className="lg:mx-16 mx-4 my-4">
                <div className="rounded-lg border border-stroke shadow-meta-3 shadow-lg bg-back1/80 dark:border-strokedark dark:bg-boxdark">
                  <div className="w-full border-stroke dark:border-strokedark">
                    <div className="w-full sm:p-14 p-6">
                      <h1 className="lg:mb-9 mb-4 md:text-4xl text-3xl text-center font-extrabold text-black dark:text-white">
                        Forgot Password
                      </h1>

                      <form onSubmit={handleSubmit(onSubmitHandler)}>
                        <div className="mb-4">
                          <label className="mb-2.5 block font-medium text-black dark:text-white">
                            Employee Id
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              id="id"
                              placeholder="Enter your id"
                              {...register("userId")}
                              className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
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
                          <p>{errors.id?.message}</p>
                        </div>

                        <div className="mb-4">
                          <label className="mb-2.5 block font-medium text-black dark:text-white">
                            Email
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              id="email"
                              placeholder="Enter your email"
                              {...register("email")}
                              className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
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
                                <g opacity="0.7">
                                  <path
                                    d="M19.2516 3.30005H2.75156C1.58281 3.30005 0.585938 4.26255 0.585938 5.46567V16.6032C0.585938 17.7719 1.54844 18.7688 2.75156 18.7688H19.2516C20.4203 18.7688 21.4172 17.8063 21.4172 16.6032V5.4313C21.4172 4.26255 20.4203 3.30005 19.2516 3.30005ZM19.2516 4.84692C19.2859 4.84692 19.3203 4.84692 19.3547 4.84692L11.0016 10.2094L2.64844 4.84692C2.68281 4.84692 2.71719 4.84692 2.75156 4.84692H19.2516ZM19.2516 17.1532H2.75156C2.40781 17.1532 2.13281 16.8782 2.13281 16.5344V6.35942L10.1766 11.5157C10.4172 11.6875 10.6922 11.7563 10.9672 11.7563C11.2422 11.7563 11.5172 11.6875 11.7578 11.5157L19.8016 6.35942V16.5688C19.8703 16.9125 19.5953 17.1532 19.2516 17.1532Z"
                                    fill=""
                                  />
                                </g>
                              </svg>
                            </span>
                          </div>
                          <p>{errors.id?.message}</p>
                        </div>

                        <div className="mb-5">
                          <button
                            type="submit"
                            className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
                          >
                            Reset
                          </button>
                        </div>

                        <div className="mt-6 text-right">
                          <p>
                            <Link href="/signIn" className="text-primary">
                              Sign In ?
                            </Link>
                          </p>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Page;