import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useSocket } from "@/context/SocketContext";
import { format } from "timeago.js";
import { useRouter } from "next/navigation";

const DropdownMessage = () => {
  const socket = useSocket();
  const { data: session } = useSession();
  const user = session?.user;
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifying, setNotifying] = useState(true);
  const [friendUsers, setFriendUsers] = useState({});
  const [messages, setMessages] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [lastMessages, setLastMessages] = useState({});
  const router = useRouter();
  const trigger = useRef(null);
  const dropdown = useRef(null);

  useEffect(() => {
    const getConversations = async () => {
      try {
        const response = await fetch(`/api/conversation/${user?.id}`);
        const data = await response.json();
        setConversations(data);
      } catch (err) {
        console.log(err);
      }
    };

    getConversations();
  }, [user?.id]);

  useEffect(() => {
    const fetchLastMessages = async () => {
      const newLastMessages = {};
      const newFriendUsers = {};

      for (const conversation of conversations) {
        try {
          const response = await fetch(`/api/message/${conversation._id}`);
          const data = await response.json();
          if (data.length > 0) {
            newLastMessages[conversation._id] = data[data.length - 1];
          }

          const friendId = conversation.members.find((m) => m !== user.id);
          const userResponse = await fetch(`/api/user/${friendId}`);
          const userData = await userResponse.json();
          newFriendUsers[conversation._id] = userData;
        } catch (err) {
          console.log(err);
        }
      }
      setLastMessages(newLastMessages);
      setFriendUsers(newFriendUsers);
    };

    if (conversations.length > 0) {
      fetchLastMessages();
    }
  }, [conversations, user]);

  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!dropdown.current) return;
      if (
        !dropdownOpen ||
        dropdown.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setDropdownOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!dropdownOpen || keyCode !== 27) return;
      setDropdownOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  const fetchMessages = async () => {
    try {
      const response = await fetch(`/api/conversation/${user?.id}`);
      const data = await response.json();
      setConversations(data);
    } catch (err) {
      console.log(err);
    }
  };
  // console.log("Conversation inside dropdown message ", conversations);
  return (
    <li className="relative">
      <Link
        ref={trigger}
        onClick={async () => {
          setNotifying(false);
          setDropdownOpen(!dropdownOpen);
          await fetchMessages();
        }}
        className="relative flex h-8.5 w-8.5 items-center justify-center rounded-full border-[0.5px] border-stroke bg-gray hover:text-primary dark:border-strokedark dark:bg-meta-4 dark:text-white"
        href="#"
      >
        <span
          className={`absolute -top-0.5 -right-0.5 z-1 h-2 w-2 rounded-full bg-meta-1 ${
            notifying === false ? "hidden" : "inline"
          }`}
        >
          <span className="absolute -z-1 inline-flex h-full w-full animate-ping rounded-full bg-meta-1 opacity-75"></span>
        </span>

        <svg
          className="fill-current duration-300 ease-in-out"
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10.9688 1.57495H7.03135C3.43135 1.57495 0.506348 4.41558 0.506348 7.90308C0.506348 11.3906 2.75635 13.8375 8.26885 16.3125C8.40947 16.3687 8.52197 16.3968 8.6626 16.3968C8.85947 16.3968 9.02822 16.3406 9.19697 16.2281C9.47822 16.0593 9.64697 15.75 9.64697 15.4125V14.2031H10.9688C14.5688 14.2031 17.522 11.3625 17.522 7.87495C17.522 4.38745 14.5688 1.57495 10.9688 1.57495ZM10.9688 12.9937H9.3376C8.80322 12.9937 8.35322 13.4437 8.35322 13.9781V15.0187C3.6001 12.825 1.74385 10.8 1.74385 7.9312C1.74385 5.14683 4.10635 2.8687 7.03135 2.8687H10.9688C13.8657 2.8687 16.2563 5.14683 16.2563 7.9312C16.2563 10.7156 13.8657 12.9937 10.9688 12.9937Z"
            fill=""
          />
          <path
            d="M5.42812 7.28442C5.0625 7.28442 4.78125 7.56567 4.78125 7.9313C4.78125 8.29692 5.0625 8.57817 5.42812 8.57817C5.79375 8.57817 6.075 8.29692 6.075 7.9313C6.075 7.56567 5.79375 7.28442 5.42812 7.28442Z"
            fill=""
          />
          <path
            d="M9.00015 7.28442C8.63452 7.28442 8.35327 7.56567 8.35327 7.9313C8.35327 8.29692 8.63452 8.57817 9.00015 8.57817C9.33765 8.57817 9.64702 8.29692 9.64702 7.9313C9.64702 7.56567 9.33765 7.28442 9.00015 7.28442Z"
            fill=""
          />
          <path
            d="M12.5719 7.28442C12.2063 7.28442 11.925 7.56567 11.925 7.9313C11.925 8.29692 12.2063 8.57817 12.5719 8.57817C12.9375 8.57817 13.2188 8.29692 13.2188 7.9313C13.2188 7.56567 12.9094 7.28442 12.5719 7.28442Z"
            fill=""
          />
        </svg>
      </Link>

      {/* <!-- Dropdown Start --> */}
      <div
        ref={dropdown}
        onFocus={() => setDropdownOpen(true)}
        onBlur={() => setDropdownOpen(false)}
        className={`absolute -right-16 mt-2.5 flex h-90 w-75 flex-col rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark sm:right-0 sm:w-80 ${
          dropdownOpen === true ? "block" : "hidden"
        }`}
      >
        <div className="px-4.5 py-3">
          <h5 className="text-sm font-medium text-bodydark2">Messages</h5>
        </div>
        {/* {friendUsers != null && */}
        {conversations.length > 0 &&
          conversations
            .sort((a, b) => {
              const lastMessageA = lastMessages[a._id];
              const lastMessageB = lastMessages[b._id];
              // if (lastMessageA && lastMessageB) {
              //   return (
              //     new Date(lastMessageB.createdAt) -
              //     new Date(lastMessageA.createdAt)
              //   );
              // }

              if (!lastMessageA && lastMessageB) {
                return 1; // Place conversation with last message (b) before conversation without (a)
              } else if (lastMessageA && !lastMessageB) {
                return -1; // Place conversation with last message (a) before conversation without (b)
              }

              // If both conversations have no last message, or both have last messages, sort based on timestamps
              if (lastMessageA && lastMessageB) {
                return (
                  new Date(lastMessageB.createdAt) -
                  new Date(lastMessageA.createdAt)
                );
              }
              return 0;
            })
            .map((conversation) => (
              <ul className="flex h-auto flex-col overflow-y-auto">
                <li>
                  <div
                    className="flex cursor-pointer gap-4.5 border-t border-stroke px-4.5 py-3 hover:bg-gray-2 dark:border-strokedark dark:hover:bg-meta-4"
                    onClick={() => {
                      router.push(
                        `/user/message?chatid=${conversation._id}&member1=${conversation.members[0]}&member2=${conversation.members[1]}`
                      );
                    }}
                    // href="/user/message"
                    // href={{
                    //   pathname: "/user/message",
                    //   query: { chatid: conversation._id },
                    // }}
                  >
                    <div className="h-12.5 w-12.5 rounded-full">
                      {/* <Image
                        width={112}
                        height={112}
                        src={"/images/user/user-02.png"}
                        alt="User"
                      /> */}
                      {friendUsers[conversation._id]?.[0]?.profilePic ? (
                        <Image
                          src={friendUsers[conversation._id]?.[0]?.profilePic} // Use the selected image URL
                          width={100}
                          height={100}
                          alt="User"
                          className="rounded-full"
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
                    </div>

                    <div>
                      {/* {user.length > 0 && ( */}
                      <h6 className="text-sm font-medium text-black dark:text-white">
                        {/* {user[0].firstname} {user[0].lastname} */}
                        {friendUsers[conversation._id]?.[0]?.firstname}
                      </h6>
                      {/* )} */}
                      <p className="text-sm">
                        {/* {messages.map((m) => ( */}
                        <div>
                          {lastMessages[conversation._id]?.text}
                          <p className="text-xs">
                            {format(lastMessages[conversation._id]?.createdAt)}
                          </p>
                        </div>
                        {/* ))} */}
                      </p>
                    </div>
                  </div>
                </li>
              </ul>
            ))}
        <Link
          href="/user/message"
          className="px-4.5 py-3 cursor-pointer text-center hover:bg-gray-2"
        >
          <h5 className="text-sm font-medium text-bodydark2">Go to messages</h5>
        </Link>
      </div>
      {/* <!-- Dropdown End --> */}
    </li>
  );
};

export default DropdownMessage;
