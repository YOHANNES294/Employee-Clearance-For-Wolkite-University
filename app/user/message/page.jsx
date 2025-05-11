"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import ConversationInternal from "@/components/conversationInternal/ConversationInternal";
import ChatBox from "@/components/chatBox/ChatBox";
import Image from "next/image";
import { io } from "socket.io-client";
import { useSocket } from "@/context/SocketContext";
import { useSearchParams } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb/breadcrumb";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";

const Message = () => {
  const { data: session } = useSession();
  const user = session?.user;
  const scrollRef = useRef();
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [currentChat, setCurrentChat] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true); // New loading state

  const [isChatListVisible, setIsChatListVisible] = useState(true);
  const params = useSearchParams();
  const chatId = params.get("chatid");
  const member1 = params.get("member1");
  const member2 = params.get("member2");

  const socket = useSocket();
  useEffect(() => {
    if (chatId) {
      const conv = {
        _id: chatId,
        members: [member1, member2],
      };
      setCurrentChat(conv);
    }
  }, [chatId]);

  useEffect(() => {
    arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat]);

  useEffect(() => {
    socket.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });
  }, []);

  useEffect(() => {
    const getConversations = async () => {
      try {
        const response = await fetch(`/api/conversation/${user?.id}`);
        const data = await response.json();
        setConversations(data);
        setLoading(false); // Set loading to false after conversations are fetched
      } catch (err) {
        console.log(err);
      }
    };
    getConversations();
  }, [user?.id]);

  useEffect(() => {
    const getMessages = async () => {
      try {
        if (currentChat) {
          // Only fetch messages if currentChat exists
          const response = await fetch(`/api/message/${currentChat?._id}`);
          const data = await response.json();
          setMessages(data);
        }
      } catch (err) {
        console.log(err);
      }
    };
    getMessages();
  }, [currentChat]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const receiverId = currentChat.members.find(
      (member) => member !== user?.id
    );

    socket.emit("sendMessage", {
      senderId: user.id,
      receiverId,
      text: newMessage,
    });
    try {
      const response = await fetch("/api/message/", {
        method: "POST",
        body: JSON.stringify({
          sender: user?.id,
          text: newMessage,
          conversationId: currentChat._id,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessages([...messages, data]);
        setNewMessage("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-white sm:px-12 pb-8 dark:bg-black dark:border-black">
      <Breadcrumb title="Messages" mainRoute="User" subRoute="Message" />
      <button
        className="block xl:hidden  mx-4  text-primary dark-text-white"
        onClick={() => setIsChatListVisible(!isChatListVisible)}
      >
        <MenuOpenIcon />
      </button>
      <div class="h-[calc(100vh-186px)] mx-4 overflow-hidden sm:h-[calc(100vh-174px)] rounded-md">
        <div class="h-full rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark xl:flex">
          <div
            class={`h-full flex-col xl:flex xl:w-1/4 ${
              isChatListVisible ? "" : "hidden"
            }`}
          >
            {/* ====== Chat List Start  */}
            <div class="sticky border-b border-stroke px-6 py-7.5 dark:border-strokedark">
              <h3 class="text-lg font-medium text-black dark:text-white 2xl:text-xl">
                Previous Conversations
              </h3>
            </div>
            <div class="flex max-h-full flex-col overflow-auto p-5">
              <div class="no-scrollbar max-h-full space-y-2.5 overflow-auto">
                {/* <!-- Chat List Item --> */}
                {/* <ConversationInternal /> */}
                {conversations &&
                  conversations.map((c) => (
                    <div onClick={() => setCurrentChat(c)}>
                      <ConversationInternal
                        conversation={c}
                        currentUser={user}
                      />
                    </div>
                  ))}
              </div>
            </div>
            {/* <!-- ====== Chat List End --> */}
          </div>
          {/* Toggle Button */}

          <div class="flex h-full flex-col border-l border-stroke dark:border-strokedark xl:w-3/4">
            {" "}
            <div class="sticky flex items-center justify-between border-b border-stroke px-6 py-4.5 dark:border-strokedark">
              <div class="flex items-center">
                <div>
                  <p class="text-lg font-medium">Current Conversation</p>
                </div>
              </div>
            </div>
            {messages.length == 0 && (
              <div className="max-h-50 text-center py-16 ">
                <h2>please choose a conversation to chat</h2>
              </div>
            )}
            <div class="no-scrollbar max-h-full space-y-3.5 overflow-auto px-6 py-7.5">
              {messages.map((m) => (
                <div ref={scrollRef}>
                  {/* {console.log("sender id", m.sender)} */}
                  <ChatBox
                    message={m}
                    own={m.sender === user?.id}
                    currentUser={user}
                  />
                </div>
              ))}
            </div>
            <div class="sticky bottom-0 border-t border-stroke bg-white px-6 py-5 dark:border-strokedark dark:bg-boxdark">
              <form
                onSubmit={handleSubmit}
                class="flex items-center justify-between space-x-4.5"
              >
                <div class="relative w-full">
                  <input
                    type="text"
                    placeholder="Type something here"
                    class="h-13 w-full rounded-md border border-stroke bg-gray pl-5 pr-19 font-medium text-black placeholder-body outline-none focus:border-primary dark:border-strokedark dark:bg-boxdark-2 dark:text-white"
                    onChange={(e) => setNewMessage(e.target.value)}
                    value={newMessage}
                  />
                </div>
                <button
                  type="submit"
                  class="flex h-13 w-full max-w-13 items-center justify-center rounded-md bg-primary text-white hover:bg-opacity-90"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M22 2L11 13"
                      stroke="white"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>
                    <path
                      d="M22 2L15 22L11 13L2 9L22 2Z"
                      stroke="white"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>
                  </svg>
                </button>
              </form>
            </div>
          </div>
          {/* )} */}
          {/* <!-- ====== Chat Box Start --> */}

          {/* <!-- ====== Chat Box End --> */}
        </div>
      </div>
    </div>
  );
};

export default Message;
