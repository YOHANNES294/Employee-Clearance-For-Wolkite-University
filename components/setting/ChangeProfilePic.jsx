import { useSession } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { personalProfilePic } from "../../validations/userValidation";
import { toast } from "react-toastify";
import { useEffect } from "react";

const ChangeProfilePic = ({ userData }) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(personalProfilePic),
  });
  // console.log("wq",userData?.profilePic);
  // const { handleSubmit, register } = useForm();
  const [selectedImage, setProfilePic] = useState(null)
  const [selectedImageBase64, setImageBase64] = useState(null)


  // const [userData, setUserData] = useState([]);
  const session = useSession();
  const userId = session?.data?.user.userId;
  const objectId = session?.data?.user._id;

  // const handleFileUpload = async (e) => {
  //   const file = e.target.files[0];
  //   const base64 = await convertToBase64(file);
  //   console.log(base64)
  //   setPostImage({ ...postImage, myFile : base64 })
  // }

  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];
    // console.log("Image selectedImage:", selectedFile);
    if (selectedFile) {
      const imageURL = URL.createObjectURL(selectedFile);

      const base64 = await convertToBase64(selectedFile);
      // console.log("base64",base64)
      setImageBase64(base64);

      // console.log("Image profilePic:", userData.profilePic);
      setProfilePic(imageURL);
      // console.log("selectedImage", selectedImageBase64);
    }

  }

  function convertToBase64(file) {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result)
      };
      fileReader.onerror = (error) => {
        reject(error)
      }
    })
  }

  const onSubmit = async (data) => {
    // console.log("Submit button clicked", data.profilePic);
    if (selectedImage) {

      try {
        const response = await fetch(`/api/user/new/`, {
          method: "PATCH",
          body: JSON.stringify({
            objectId: objectId,
            userId: userId,
            profilePicture: selectedImageBase64,

          }),
        });

        if (response.ok) {
          // console.log("profile Pic updated Successfully!");
          toast.success("profile Pic updated Successfully!");
        }
      } catch (error) {

        console.log(error);
      }

      reset();
    } else {
      toast.error("First update the profile Pic before updating!");
    }
    // Now imageURL contains the link to the picked image.
  }



  // //fetch user data
  // useEffect(() => {
  //   const fetchUserData = async () => {
  //     try {
  //       const response = await fetch(`/api/user/new/${userId}`);
  //       if (!response.ok) {
  //         throw new Error('Network response was not ok');
  //       }
  //       const fetchedData = await response.json();
  //       // const updatedData = fetchedData.map((user) => ({
  //       //   ...user,
  //       //   id: user._id,
  //       // }));
  //       setUserData(fetchedData);
  //     } catch (error) {
  //       console.error("Error fetching user data:", error);
  //     }
  //   };

  //   fetchUserData();
  // }, [userId]);

  return (
    <div className="col-span-12 xl:col-span-3">
      <div className="rounded-lg border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
          <h3 className="font-lg  font-semibold text-primary dark:text-white">
            Your Photo
          </h3>
        </div>
        <div className="p-7">
          {/* <form action="#"> */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4 flex items-center gap-3">
              <div className="h-14 w-14 rounded-full overflow-hidden">
                {/* <Image
                  src={"/images/user/user-03.png"}
                  width={55}
                  height={55}
                  alt="User"
                /> */}

                {selectedImage ? (
                  <Image
                    src={selectedImage} // Use the selected image URL
                    width={55}
                    height={55}
                    alt="User"
                  />
                ) : userData?.profilePic ? (
                  <Image
                    src={userData.profilePic}
                    width={55}
                    height={55}
                    alt="User"
                  />
                ) :
                  <Image
                    src={"/images/user/default.png"}
                    width={55}
                    height={55}
                    alt="User"
                  />
                }
              </div>
              <div>
                <span className="mb-1.5 text-black dark:text-white">
                  Edit your photo
                </span>
              </div>
            </div>

            <div
              id="FileUpload"
              className="relative mb-5.5 block w-full cursor-pointer appearance-none rounded border-2 border-dashed border-primary bg-gray py-4 px-4 dark:bg-meta-4 sm:py-7.5"
            >
              <input
                type="file"
                accept="image/*"
                className="absolute inset-0 z-50 m-0 h-full w-full cursor-pointer p-0 opacity-0 outline-none"
                //  onChange={handleFileChange}
                // {...register("profilePic")}


                {...register("profilePic", { onChange: handleFileChange })}
              />
              <div className="flex flex-col items-center justify-center space-y-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-stroke bg-white dark:border-strokedark dark:bg-boxdark">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M1.99967 9.33337C2.36786 9.33337 2.66634 9.63185 2.66634 10V12.6667C2.66634 12.8435 2.73658 13.0131 2.8616 13.1381C2.98663 13.2631 3.1562 13.3334 3.33301 13.3334H12.6663C12.8431 13.3334 13.0127 13.2631 13.1377 13.1381C13.2628 13.0131 13.333 12.8435 13.333 12.6667V10C13.333 9.63185 13.6315 9.33337 13.9997 9.33337C14.3679 9.33337 14.6663 9.63185 14.6663 10V12.6667C14.6663 13.1971 14.4556 13.7058 14.0806 14.0809C13.7055 14.456 13.1968 14.6667 12.6663 14.6667H3.33301C2.80257 14.6667 2.29387 14.456 1.91879 14.0809C1.54372 13.7058 1.33301 13.1971 1.33301 12.6667V10C1.33301 9.63185 1.63148 9.33337 1.99967 9.33337Z"
                      fill="#3C50E0"
                    />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M7.5286 1.52864C7.78894 1.26829 8.21106 1.26829 8.4714 1.52864L11.8047 4.86197C12.0651 5.12232 12.0651 5.54443 11.8047 5.80478C11.5444 6.06513 11.1223 6.06513 10.8619 5.80478L8 2.94285L5.13807 5.80478C4.87772 6.06513 4.45561 6.06513 4.19526 5.80478C3.93491 5.54443 3.93491 5.12232 4.19526 4.86197L7.5286 1.52864Z"
                      fill="#3C50E0"
                    />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M7.99967 1.33337C8.36786 1.33337 8.66634 1.63185 8.66634 2.00004V10C8.66634 10.3682 8.36786 10.6667 7.99967 10.6667C7.63148 10.6667 7.33301 10.3682 7.33301 10V2.00004C7.33301 1.63185 7.63148 1.33337 7.99967 1.33337Z"
                      fill="#3C50E0"
                    />
                  </svg>
                </span>
                <p>
                  <span className="text-primary">Click to upload</span> or drag
                  and drop
                </p>
                <p className="mt-1.5">SVG, PNG, JPG or GIF</p>
                <p>(max, 800 X 800px)</p>
              </div>
            </div>

            <div className="flex justify-end gap-4.5">
              <button
                className="flex justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                type="submit"
              >
                Cancel
              </button>
              <button
                className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:bg-opacity-95"
                type="submit"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangeProfilePic;
