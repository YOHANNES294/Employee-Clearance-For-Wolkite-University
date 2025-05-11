import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";

const ConversationInternal = ({ conversation, currentUser }) => {
  const [user, setUser] = useState([]);
  const { data: session } = useSession();

  useEffect(() => {
    const currentUserId = session?.user?.id;

    const friendId = conversation.members.find((m) => m !== currentUserId);

    const getUser = async () => {
      try {
        const response = await fetch(`/api/user/${friendId}`);
        const data = await response.json();
        setUser(data);
      } catch (err) {
        console.log(err);
      }
    };

    if (friendId) {
      getUser();
    }
  }, [session, conversation, currentUser]);

  return (
    <div>
      <div className="flex cursor-pointer items-center rounded px-4 py-2 hover:bg-gray-2 dark:hover:bg-strokedark">
        <div className="relative mr-3.5 h-11 w-full max-w-11 rounded-full">
          {user[0]?.profilePic ? (
            <Image
              src={user[0]?.profilePic}
              width={100}
              height={100}
              alt="User"
              className="rounded-full h-full w-full object-cover object-center"
            />
          ) : (
            <Image
              src="/images/user/default.png"
              width={100}
              height={100}
              alt="User"
              className="rounded-full"
            />
          )}
          <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full border-2 border-gray-2 bg-success"></span>
        </div>
        <div className="w-full">
          <h5 className="text-sm font-medium text-black dark:text-white">
            {user[0]?.firstname} {user[0]?.middlename}
          </h5>
          <p className="text-sm font-medium">
            Check out {user[0]?.firstname}'s chat here
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConversationInternal;