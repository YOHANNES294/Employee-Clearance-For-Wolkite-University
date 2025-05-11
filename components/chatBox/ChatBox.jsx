import React, { useState, useEffect } from "react";
import { format } from "timeago.js";
import { useSession } from "next-auth/react";

const ChatBox = ({ message, own, currentUser }) => {
  const { data: session } = useSession();
  const [user, setUser] = useState([]);
  const [friendId, setFriendId] = useState(null);

  useEffect(() => {
    const currentUserId = session?.user?.id;
    if (message.sender !== currentUserId) {
      setFriendId(message.sender);
    }

    const getUser = async () => {
      try {
        const response = await fetch(`/api/user/${friendId}`);
        const data = await response.json();
        setUser(data);
      } catch (err) {
        console.log(err);
      }
    };

    if (friendId !== null) {
      getUser();
    }
  }, [session, message.sender, friendId]);

  return (
    <>
      {user !== null ? (
        <>
          {!own ? (
            <div className="max-w-125">
              <p className="mb-2.5 text-sm font-medium">
                {user[0]?.firstname} {user[0]?.middlename}
              </p>
              <div className="mb-2.5 rounded-2xl rounded-tl-none bg-gray px-5 py-3 dark:bg-boxdark-2">
                <p className="font-medium">{message.text}</p>
              </div>
              <p className="text-xs font-medium">{format(message.createdAt)}</p>
            </div>
          ) : (
            <div className="ml-auto max-w-125">
              <div className="mb-2.5 rounded-2xl rounded-br-none bg-primary px-5 py-3">
                <p className="font-medium text-white">{message.text}</p>
              </div>
              <p className="text-right text-xs font-medium">
                {format(message.createdAt)}
              </p>
            </div>
          )}
        </>
      ) : (
        <div>
          <h2>Please choose a user to chat</h2>
        </div>
      )}
    </>
  );
};

export default ChatBox;