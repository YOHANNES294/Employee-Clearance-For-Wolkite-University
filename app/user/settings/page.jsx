"use client";

import PersonalInfo from "@/components/setting/PersonalInfo";
import ChangePassword from "@/components/setting/ChangePassword";
import ChangeProfilePic from "@/components/setting/ChangeProfilePic";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useState } from "react";

const Setting = () => {
  const session = useSession();
  const [userData, setUserData] = useState([]);
  const userId = session?.data?.user.userId;
  const Id = session?.data?.user.id;
  useEffect(() => {
      const fetchUserData = async () => {
       
        try {
          const response = await fetch(`/api/user/new/${Id}`);
          if (!response.ok) {
           
            throw new Error('Network response was not ok');
          }
          const fetchedData = await response.json();
          // const updatedData = fetchedData.map((user) => ({
          //   ...user,
          //   id: user._id,
          // }));
          // console.log("parent a ",fetchedData);
          setUserData(fetchedData);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };
    
      fetchUserData();
    }, [userId,userData])

  return (
    <div className="my-12 mx-11">
      <div className="mx-auto max-w-fit">
        <div className="grid grid-cols-12 gap-8">
          <PersonalInfo userData={userData} />
          <ChangePassword userData={userData}/>
          <ChangeProfilePic userData={userData}/>
        </div>
      </div>
    </div>
  );
};

export default Setting;
