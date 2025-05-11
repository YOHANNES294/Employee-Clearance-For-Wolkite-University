import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { format } from "timeago.js";

const Conversation = ({ conversation, currentUser }) => {
  const [user, setUser] = useState([]);
  const [messages, setMessages] = useState([]);

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

    getUser();
  }, [session, conversation.members]);

  useEffect(() => {
    const getMessages = async () => {
      try {
        const response = await fetch(`/api/message/${conversation?._id}`);
        const data = await response.json();
        setMessages(data);
      } catch (err) {
        console.log(err);
      }
    };

    getMessages();
  }, [conversation?._id]);

  return (
    <ul className="flex h-auto flex-col overflow-y-auto">
      <li>
        <Link
          className="flex gap-4.5 border-t border-stroke px-4.5 py-3 hover:bg-gray-2 dark:border-strokedark dark:hover:bg-meta-4"
          href="/messages"
        >
          <div className="h-12.5 w-12.5 rounded-full">
            <Image
              width={112}
              height={112}
              src={"/images/user/user-02.png"}
              alt="User"
            />
          </div>

          <div>
            {user.length > 0 && (
              <h6 className="text-sm font-medium text-black dark:text-white">
                {user[0].firstname} {user[0].lastname}
              </h6>
            )}
            <p className="text-sm">
              {messages.map((m, index) => (
                <div key={index}>
                  {m.text}
                  <p className="text-xs">{format(m.createdAt)}</p>
                </div>
              ))}
            </p>
          </div>
        </Link>
      </li>
    </ul>
  );
};

export default Conversation;