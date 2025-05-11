"use client";
import { useState, useRef, useEffect } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { rejectReasonSchema } from "@/validations/registrationValidation";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
import { useSocket } from "@/context/SocketContext";
import { v4 as uuidv4 } from "uuid";

const RejectionMessageBox = ({ selectedUser, onCancel }) => {
  const socket = useSocket();
  const { data: session } = useSession();
  const user = session?.user;
  const receiverId = selectedUser[0]?._userId;
  //console.log("user in rejection session", user);
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
    setValue,
  } = useForm({ resolver: yupResolver(rejectReasonSchema) });
  const dropdownRef = useRef(null);
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [newMessage, setNewMessage] = useState("");

  const [messages, setMessages] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
    if (conversations.length > 0) {
      // Filter conversations based on receiverId
      const filteredConversations = conversations.filter((conversation) => {
        // console.log("Members array for conversation:", conversation.members);
        return conversation.members.includes(receiverId);
      });

      console.log("conversations filtered", filteredConversations);

      if (filteredConversations.length > 0) {
        // Set the first filtered conversation as the current chat
        setCurrentChat(filteredConversations[0]);
        console.log("not new conversation needed");
      } else {
        console.log("but nothing is here");
      }
    }
  }, [conversations, receiverId]);

  // Now you can use 'currentChat' in other useEffects or parts of your component
  // ...
  useEffect(() => {
    const getMessages = async () => {
      console.log("changed current chat inside the get message", currentChat);
      try {
        const response = await fetch(`/api/message/${currentChat?._id}`);
        const data = await response.json();
        setMessages(data);
      } catch (err) {
        console.log(err);
      }
    };
    getMessages();
  }, [currentChat]);

  const rejectRequest = async () => {
    const len = selectedUser.length;
    try {
      const requests = selectedUser.map(async (eachData) => {
        if (eachData.role == "STAFF") {
          try {
            const response = await fetch(`/api/rejectStaffReq`, {
              method: "PATCH",
              body: JSON.stringify({
                objectId: eachData._id,
                arrLength: len,
              }),
            });

            if (response.ok) {
              return await response.text();
            }
          } catch (error) {
            console.log(error);
            return null;
          }
        }
      });

      const responses = await Promise.all(requests);

      let toastShown = false;

      responses.forEach((responsedata, index) => {
        if (responsedata) {
          if (
            selectedUser.length > 1 &&
            !toastShown &&
            index === responses.length - 1
          ) {
            toast.success(responsedata);
            toastShown = true;
          } else if (selectedUser.length === 1) {
            toast.success("Rejected Successfully");
          }
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmit = async (data) => {
    try {
      // Check if currentChat is not null before accessing its members property
      if (currentChat && currentChat.members) {
        const receiverId = currentChat.members.find(
          (member) => member !== user?.id
        );

        socket.emit("sendMessage", {
          senderId: user.id,
          receiverId,
          conversationId: currentChat._id,
          text: data.rejectionReason,
        });

        const type = 1;
        const notificationId = uuidv4();

        // Step 2: Emit the notification
        socket.emit("sendNotification", {
          senderId: user.id,
          receiverId,
          type,
          notificationId,
        });

        // Step 1: Send message and get the response data
        const messageResponse = await fetch("/api/message/", {
          method: "POST",
          body: JSON.stringify({
            sender: user?.id,
            text: data.rejectionReason,
            conversationId: currentChat._id,
            notificationId, // Include the unique notificationId in the message data
          }),
        });

        if (!messageResponse.ok) {
          // Handle the case where sending the message fails
          console.log("Failed to send the message");
          return;
        }

        const responseData = await messageResponse.json();

        setMessages([...messages, responseData]);
        const notificationResponse = await fetch("/api/notification/", {
          method: "POST",
          body: JSON.stringify({
            senderId: user.id,
            receiverId,
            type,
            notificationId,
          }),
        });

        if (notificationResponse.ok) {
          console.log("Notification saved successfully");
        } else {
          console.log("Failed to save the notification");
        }

        console.log("Rejected successfully");
        reset();
        rejectRequest();

        handleCancel();
      } else {
        // Create a new conversation and set it as the current chat
        const createConversations = async () => {
          console.log("creating new conversation inside submit ....");
          try {
            const conversationResp = await fetch("/api/conversation/", {
              method: "POST",
              body: JSON.stringify({
                senderId: user?.id,
                receiverId: selectedUser[0]?._userId,
              }),
            });

            const responseData = await conversationResp.json();
            console.log("response data while creating ", responseData._id);
            const conversationId = responseData._id;
            console.log("setting response data to current chat");
            setCurrentChat(responseData);
            console.log("trying to send the message");
            // console.log("tryn to get the current chat", currentChat);

            console.log("get in to the message sender after response ...");

            const type = 1;
            const notificationId = uuidv4();

            // Step 2: Emit the notification
            socket.emit("sendNotification", {
              senderId: user.id,
              receiverId: selectedUser[0]?._userId,
              type,
              notificationId,
            });
            // Step 1: Send message and get the response data
            const messageResponse = await fetch("/api/message/", {
              method: "POST",
              body: JSON.stringify({
                sender: user?.id,
                text: data.rejectionReason,
                conversationId: conversationId,
                notificationId, // Include the unique notificationId in the message data
              }),
            });

            if (!messageResponse.ok) {
              // Handle the case where sending the message fails
              console.log("Failed to send the message");
              return;
            }

            const msgResponseData = await messageResponse.json();

            setMessages([...messages, msgResponseData]);
            const notificationResponse = await fetch("/api/notification/", {
              method: "POST",
              body: JSON.stringify({
                senderId: user.id,
                receiverId,
                type,
                // notificationId,
              }),
            });

            if (notificationResponse.ok) {
              console.log("Notification saved successfully");
            } else {
              console.log("Failed to save the notification");
            }

            rejectRequest();
            reset();
            handleCancel();
          } catch (error) {
            console.log(error);
          }
        };

        createConversations();
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleCancel = () => {
    onCancel();
  };
  return (
    <div class="w-full max-w-142.5 rounded-lg bg-white py-6 px-6  dark:bg-boxdark md:py-8 md:px-8.5">
      <div className="flex flex-row place-content-between justify-center items-center">
        <div className="flex flex-col items-center ">
          <h3 className="pb-2  text-center text-lg font-bold text-black dark:text-white sm:text-2xl">
            Rejection reason
          </h3>
          <span class="mx-auto mb-6 inline-block h-1 w-22.5 rounded bg-primary"></span>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-2 flex flex-col gap-5.5 sm:flex-row">
          <div className="w-full ">
            <textarea
              className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
              type="text"
              name="rejectionReason"
              id="rejectionReason"
              cols="40"
              rows="5"
              placeholder="write you reason here ..."
              {...register("rejectionReason")}
            />
            <p>{errors.rejectionReason?.message}</p>
          </div>
        </div>

        <div class="-mx-3 mt-4 flex flex-wrap gap-y-4">
          <div class="w-full px-3 2xsm:w-1/2">
            <button
              type="submit"
              class="block w-full rounded border border-primary bg-primary p-3 text-center font-medium text-white transition hover:bg-opacity-90"
            >
              Send
            </button>
          </div>

          <div onClick={handleCancel} class="w-full px-3 2xsm:w-1/2">
            <button class="block w-full rounded border border-stroke bg-gray p-3 text-center font-medium text-black transition hover:border-meta-1 hover:bg-meta-1 hover:text-white dark:border-strokedark dark:bg-meta-4 dark:text-white dark:hover:border-meta-1 dark:hover:bg-meta-1">
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
export default RejectionMessageBox;