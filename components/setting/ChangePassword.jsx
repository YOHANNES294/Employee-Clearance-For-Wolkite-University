import { yupResolver } from "@hookform/resolvers/yup";
import { changePasswordSchema } from "../../validations/userValidation";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
import bcrypt from "bcryptjs";
import { useState } from "react";
import { useEffect } from "react";

const ChangePassword = ({ userData }) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(changePasswordSchema),
  });


  // const [userData, setUserData] = useState([]);
  const session = useSession();
  const userId = session?.data?.user.userId;

  // // fetch user password for checking
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

  const onSubmit = async (data) => {
    console.log(data.oldPassword, "aaa", data.newPassword, "bb", data.confirmPassword, "userPassword", userData.password);

    const passwordMatch = await bcrypt.compare(data.oldPassword, userData.password);

   if(passwordMatch){
       if(data.newPassword===data.confirmPassword){
        const hashedPassword = await bcrypt.hash(data.newPassword, 10);
        try {
          const response = await fetch(`/api/user/new/`, {
            method: "PATCH",
            body: JSON.stringify({
              objectId: userData._id,
              userId: userData.userId,
              password: hashedPassword,
  
            }),
          });
  
          if (response.ok) {
            toast.success("Password updated Successfully!");
          }
        } catch (error) {
  
          console.log(error);
        }
         
         reset();
       }else{
        toast.error("Password match error!");

       }
   }else{
    toast.error("Password unmatch!");

   }
  };

  return (
    <div className="col-span-12 xl:col-span-4">
      <div className="rounded-lg border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
          <h3 className="font-lg  font-semibold text-primary dark:text-white">
            Change Password
          </h3>
        </div>

        <div className="p-7">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-5.5">
              <label
                className="mb-3 block text-sm font-medium text-black dark:text-white"
                htmlFor="emailAddress"
              >
                Old Password
              </label>

              <input
                className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                type="password"
                name="oldPassword"
                id="oldPassword"
                placeholder="Old password"
                {...register("oldPassword")}
              />
              <p>{errors.oldPassword?.message}</p>
            </div>

            <div className="mb-5.5">
              <label
                className="mb-3 block text-sm font-medium text-black dark:text-white"
                htmlFor="Username"
              >
                New Password
              </label>
              <input
                className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                type="password"
                name="newPassword"
                id="newPassword"
                placeholder="New password"
                {...register("newPassword")}
              />
              <p>{errors.newPassword?.message}</p>
            </div>

            <div className="mb-5.5">
              <label
                className="mb-3 block text-sm font-medium text-black dark:text-white"
                htmlFor="Username"
              >
                Confirm Password
              </label>
              <input
                className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                placeholder="Confirm password"
                {...register("confirmPassword")}
              />
              <p>{errors.confirmPassword?.message}</p>
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

export default ChangePassword;
