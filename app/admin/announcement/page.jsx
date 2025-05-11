"use client";
import React, { useState } from "react";
import Image from "next/image";
import { announcement } from "@/validations/userValidation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import AdminBreadcrumb from "@/components/Breadcrumb/adminBreadcrumb";
import { toast } from "react-toastify";

const ManageAnnouncement = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(announcement),
  });

  const [selectedImage, setProfilePic] = useState(null);
  const [selectedImageBase64, setImageBase64] = useState(null);

  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      const imageURL = URL.createObjectURL(selectedFile);

      const base64 = await convertToBase64(selectedFile);
      setImageBase64(base64);
      setProfilePic(imageURL);
    }
  };

  function convertToBase64(file) {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  }

  const onSubmit = async (data) => {
    if (data.title && data.description && selectedImageBase64) {
      try {
        const response = await fetch("/api/postAnnouncement", {
          method: "POST",
          body: JSON.stringify({
            userId: data.adminId,
            title: data.title,
            description: data.description,
            image: selectedImageBase64,
          }),
        });

        if (response.ok) {
          toast.success("Announcement posted Successfully!");
          reset();
          setProfilePic(null);
          setImageBase64(null);
        } else {
          toast.error(
            "Some Error occurred while posting announcements please retry!"
          );
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      toast.error("First fill all the required fields before posting!");
    }
  };

  return (
    <div className="col-span-12 xl:col-span-3 relative">
      {/* Vibrant gradient background */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-blue-500 to-teal-400 opacity-15"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-transparent via-transparent to-black/10"></div>
      </div>

      <AdminBreadcrumb
        title="Post Announcements"
        mainRoute="Admin"
        subRoute="Announcement"
      />
      
      <div className="relative rounded-xl p-8 bg-white dark:bg-boxdark shadow-xl
        border border-transparent
        before:absolute before:inset-0 before:rounded-xl before:p-[2px] 
        before:bg-gradient-to-r before:from-purple-600 before:via-pink-500 before:to-amber-400
        before:-z-10 before:transition-all before:duration-700 before:hover:opacity-80
        group">
        
        {/* Glowing border effect */}
        <div className="absolute inset-0 rounded-xl overflow-hidden -z-10">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-500 to-amber-400 opacity-70 group-hover:opacity-100 transition-all duration-700 blur-md group-hover:blur-lg"></div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-5">
            <label
              htmlFor="taskImg"
              className="mb-2.5 block font-medium text-black dark:text-white"
            >
              Add Image
            </label>
            <div>
              <div
                id="FileUpload"
                className="relative block w-full appearance-none rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 bg-white px-4 py-4 dark:bg-gray-800 sm:py-14 transition-all hover:border-primary hover:dark:border-primary"
              >
                <input
                  accept="image/*"
                  className="absolute inset-0 z-50 m-0 h-full w-full p-0 opacity-0 outline-none"
                  type="file"
                  {...register("image", { onChange: handleFileChange })}
                />
                {selectedImage && (
                  <Image
                    className="h-full w-full rounded-lg object-cover object-center"
                    src={selectedImage}
                    width={970}
                    height={260}
                    alt="User"
                  />
                )}
                {!selectedImage && (
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <span className="flex h-11.5 w-11.5 items-center justify-center rounded-full border-2 border-dashed border-primary bg-primary/5 dark:border-primary">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g clipPath="url(#clip0_75_12841)">
                          <path
                            d="M2.5 15.8333H17.5V17.5H2.5V15.8333ZM10.8333 4.85663V14.1666H9.16667V4.85663L4.1075 9.91663L2.92917 8.73829L10 1.66663L17.0708 8.73746L15.8925 9.91579L10.8333 4.85829V4.85663Z"
                            fill="#3C50E0"
                          ></path>
                        </g>
                        <defs>
                          <clipPath id="clip0_75_12841">
                            <rect width="20" height="20" fill="white"></rect>
                          </clipPath>
                        </defs>
                      </svg>
                    </span>
                    <p className="text-sm">
                      <span className="text-primary font-semibold">Click to upload</span> or drag and drop
                    </p>
                  </div>
                )}
                <div className="absolute bottom-1 right-1 z-10 xsm:bottom-4 xsm:right-4">
                  <label
                    htmlFor="cover"
                    className="flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-500 px-3 py-1.5 text-sm font-medium text-white hover:opacity-90 xsm:px-4 shadow-md hover:shadow-lg transition-all"
                  >
                    <input
                      type="file"
                      accept="image/*"
                      className="absolute inset-0 z-50 m-0 h-full w-full cursor-pointer p-0 opacity-0 outline-none"
                      {...register("image", { onChange: handleFileChange })}
                    />
                    <span>
                      <svg
                        className="fill-current"
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M4.76464 1.42638C4.87283 1.2641 5.05496 1.16663 5.25 1.16663H8.75C8.94504 1.16663 9.12717 1.2641 9.23536 1.42638L10.2289 2.91663H12.25C12.7141 2.91663 13.1592 3.101 13.4874 3.42919C13.8156 3.75738 14 4.2025 14 4.66663V11.0833C14 11.5474 13.8156 11.9925 13.4874 12.3207C13.1592 12.6489 12.7141 12.8333 12.25 12.8333H1.75C1.28587 12.8333 0.840752 12.6489 0.512563 12.3207C0.184375 11.9925 0 11.5474 0 11.0833V4.66663C0 4.2025 0.184374 3.75738 0.512563 3.42919C0.840752 3.101 1.28587 2.91663 1.75 2.91663H3.77114L4.76464 1.42638ZM5.56219 2.33329L4.5687 3.82353C4.46051 3.98582 4.27837 4.08329 4.08333 4.08329H1.75C1.59529 4.08329 1.44692 4.14475 1.33752 4.25415C1.22812 4.36354 1.16667 4.51192 1.16667 4.66663V11.0833C1.16667 11.238 1.22812 11.3864 1.33752 11.4958C1.44692 11.6052 1.59529 11.6666 1.75 11.6666H12.25C12.4047 11.6666 12.5531 11.6052 12.6625 11.4958C12.7719 11.3864 12.8333 11.238 12.8333 11.0833V4.66663C12.8333 4.51192 12.7719 4.36354 12.6625 4.25415C12.5531 4.14475 12.4047 4.08329 12.25 4.08329H9.91667C9.72163 4.08329 9.53949 3.98582 9.4313 3.82353L8.43781 2.33329H5.56219Z"
                          fill="white"
                        />
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M6.99992 5.83329C6.03342 5.83329 5.24992 6.61679 5.24992 7.58329C5.24992 8.54979 6.03342 9.33329 6.99992 9.33329C7.96642 9.33329 8.74992 8.54979 8.74992 7.58329C8.74992 6.61679 7.96642 5.83329 6.99992 5.83329ZM4.08325 7.58329C4.08325 5.97246 5.38909 4.66663 6.99992 4.66663C8.61075 4.66663 9.91659 5.97246 9.91659 7.58329C9.91659 9.19412 8.61075 10.5 6.99992 10.5C5.38909 10.5 4.08325 9.19412 4.08325 7.58329Z"
                          fill="white"
                        />
                      </svg>
                    </span>
                    {selectedImage ? <span>Edit</span> : <span>Upload</span>}
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div className="mb-5">
            <label
              htmlFor="taskTitle"
              className="mb-2.5 block font-medium text-black dark:text-white"
            >
              Title
            </label>
            <input
              id="taskTitle"
              placeholder="Enter title here..."
              className="w-full rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white px-4.5 py-3 text-black focus:border-primary focus:ring-2 focus:ring-primary/30 focus-visible:outline-none dark:bg-gray-800 dark:text-white dark:focus:border-primary transition-all"
              type="text"
              name="taskTitle"
              {...register("title")}
            />
          </div>
          <div className="mb-5">
            <label
              htmlFor="taskDescription"
              className="mb-2.5 block font-medium text-black dark:text-white"
            >
              Announcement Detail
            </label>
            <textarea
              name="taskDescription"
              id="taskDescription"
              cols="30"
              rows="7"
              placeholder="Write announcement detail here..."
              {...register("description")}
              className="w-full rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white px-4.5 py-3 text-black focus:border-primary focus:ring-2 focus:ring-primary/30 focus-visible:outline-none dark:bg-gray-800 dark:text-white dark:focus:border-primary transition-all"
            ></textarea>
          </div>

          <button
  type="submit"
  className="relative flex w-full items-center justify-center gap-2 rounded-lg bg-blue-500 px-4.5 py-3 font-medium text-primary hover:opacity-90 transition-all active:scale-[0.98] overflow-hidden group"

>
  {/* Main button content */}
  <span className="relative z-10 flex items-center gap-2">
    <svg
      className="fill-current"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_60_9740)">
        <path
          d="M18.75 9.3125H10.7187V1.25C10.7187 0.875 10.4062 0.53125 10 0.53125C9.625 0.53125 9.28125 0.84375 9.28125 1.25V9.3125H1.25C0.875 9.3125 0.53125 9.625 0.53125 10.0312C0.53125 10.4062 0.84375 10.75 1.25 10.75H9.3125V18.75C9.3125 19.125 9.625 19.4687 10.0312 19.4687C10.4062 19.4687 10.75 19.1562 10.75 18.75V10.7187H18.75C19.125 10.7187 19.4687 10.4062 19.4687 10C19.4687 9.625 19.125 9.3125 18.75 9.3125Z"
          fill="currentColor"
        ></path>
      </g>
      <defs>
        <clipPath id="clip0_60_9740">
          <rect width="20" height="20" fill="white"></rect>
        </clipPath>
      </defs>
    </svg>
    Post Announcement
  </span>
  
  {/* Stretched border effect */}
  <span className="absolute inset-0 flex items-center justify-center overflow-hidden">
    <span className="absolute h-[200%] w-[30px] bg-white/30 -rotate-12 translate-x-[-100%] group-hover:translate-x-[300%] transition-all duration-1000"></span>
  </span>
  
  {/* Glow effect */}
  <span className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.8)_0%,_transparent_70%)]"></span>
</button>
        </form>
      </div>
    </div>
  );
};

export default ManageAnnouncement;