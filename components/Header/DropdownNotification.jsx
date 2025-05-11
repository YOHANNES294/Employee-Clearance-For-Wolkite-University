"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSocket } from "@/context/SocketContext";
import { useSession } from "next-auth/react";
import { format } from "timeago.js";
import useSWR from "swr";

const fetcher = async (url) => {
  const response = await fetch(url);
  const data = await response.json();
  const updatedData = data.map((user) => ({
    ...user,
    id: user._id,
    roleId: user._id,
  }));
  return updatedData;
};

const DropdownNotification = () => {
  const socket = useSocket();
  const { data: session } = useSession();
  const user = session?.user;
  const previlage = user?.privilege;

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifying, setNotifying] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [arrivalNotification, setArrivalNotification] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [filteredStaffData, setFilteredStaffData] = useState([]);

  const trigger = useRef(null);
  const dropdown = useRef(null);

  useEffect(() => {
    if (arrivalNotification) {
      setNotifications((prev) => [...prev, arrivalNotification]);
      setUnreadCount((prevCount) => prevCount + 1);
    }
  }, [arrivalNotification, user?.id]);

  useEffect(() => {
    socket.on("getNotification", (data) => {
      setArrivalNotification({
        senderId: data.senderId,
        type: data.type,
        notificationId: data.notificationId,
        createdAt: Date.now(),
      });
      setNotifying(true);
    });
  }, []);

  useEffect(() => {
    const getNotification = async () => {
      try {
        const response = await fetch(`/api/notification/${user?.id}`);
        const data = await response.json();
        const unreadCount = data.filter(
          (notification) => !notification.isChecked
        ).length;
        setNotifications(data);
        setUnreadCount(unreadCount);
      } catch (err) {
        console.log(err);
      }
    };
    getNotification();
  }, [user?.id]);

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
      setNotifying(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  }, [dropdownOpen]);

  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!dropdownOpen || keyCode !== 27) return;
      setDropdownOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  const displayNotification = ({
    length,
    senderId,
    type,
    notificationId,
    createdAt,
  }) => {
    let action;

    if (type == 1) {
      action = "Your clearance request has been rejected. Please review the reason provided.";
    } else if (type == 2) {
      action = `You have ${length} unapproved staff clearance requests. Please check it out.`;
    } else {
      action = "shared";
    }
    return (
      <li key={notificationId}>
        <Link
          className="flex flex-col gap-2.5 border-t border-stroke px-4.5 py-3 hover:bg-gray dark:border-strokedark dark:hover:bg-meta-4"
          href="#"
        >
          <p className="text-sm">
            <span className="text-black dark:text-white">{`${action} `}</span>
          </p>
          <p className="text-xs"> {format(createdAt)}</p>
        </Link>
      </li>
    );
  };

  const handleRead = () => {
    setUnreadCount(0);
  };

  const updateStatus = async () => {
    await fetch(`/api/notification/${user?.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });
  };

  const { data: staffData } = useSWR("/api/staffApproval", fetcher, {
    revalidateOnFocus: false,
    refreshInterval: 2000,
  });

  useEffect(() => {
    const fetchSteps = async () => {
      if (staffData && previlage && previlage !== "Head") {
        const results = await Promise.all(
          staffData.map(async (request) => {
            const approvalRoles = request.approvals.map((approval) => approval.role);
            const staffType = request.staffType;
            let step = {};

            const url = `/api/steps?stepType=${staffType}`;
            const res = await fetch(url);
            const data = await res.json();

            data.forEach((d) => {
              step[d.name] = d.nextSteps;
            });

            if (staffType === "Admin") {
              delete step.Director;
            }

            const stageKeys = step && typeof step === "object"
              ? Object.keys(step).filter((key) => step[key].includes(previlage))
              : [];

            const hasAllApprovals = stageKeys.every((key) => approvalRoles.includes(key));
            const notRejected = !request.rejections.includes(previlage);

            return hasAllApprovals && notRejected ? request : null;
          })
        );
        setFilteredStaffData(results.filter(Boolean));
      }
    };
    if (user?.role === "STAFF" && previlage != null) {
      fetchSteps();
    }
  }, [staffData, previlage]);

  useEffect(() => {
    const getStaffApprovals = async () => {
      try {
        let unApprovedLength;
        if (previlage !== "Head") {
          unApprovedLength = filteredStaffData.length;
          if (unApprovedLength > 0) {
            const newNotification = {
              senderId: "system",
              type: 2,
              notificationId: "systemstaff" + Date.now(),
              createdAt: Date.now(),
              length: unApprovedLength,
            };
            const exists = notifications.find(
              (n) => n.notificationId === newNotification.notificationId
            );
            if (!exists) {
              setArrivalNotification(newNotification);
              setNotifying(true);
            }
          }
        } else {
          unApprovedLength = staffData?.length || 0;
          if (unApprovedLength > 0) {
            const newNotification = {
              senderId: "system",
              type: 2,
              notificationId: "systemstaff" + Date.now(),
              createdAt: Date.now(),
              length: unApprovedLength,
            };
            const exists = notifications.find(
              (n) => n.notificationId === newNotification.notificationId
            );
            if (!exists) {
              setArrivalNotification(newNotification);
              setNotifying(true);
            }
          }
        }
      } catch (err) {
        console.log(err);
      }
    };
    if (user?.role === "STAFF" && previlage != null) {
      getStaffApprovals();
    }
  }, [staffData, filteredStaffData]);

  return (
    <li className="relative">
      <Link
        ref={trigger}
        onClick={() => {
          updateStatus();
          setNotifying(false);
          setUnreadCount(0);
          setDropdownOpen(!dropdownOpen);
        }}
        href="#"
        className="relative flex h-8.5 w-8.5 items-center justify-center rounded-full border-[0.5px] border-stroke bg-gray hover:text-primary dark:border-strokedark dark:bg-meta-4 dark:text-white"
      >
        <span
          className={`absolute -m-0.5 -top-0.5 right-0 z-1 h-2 w-2 text-meta-1  ${
            notifying === false ? "hidden" : "inline"
          }`}
        >
          {unreadCount > 0 && (
            <p className="absolute -z-1 text-black-2 ">{unreadCount}</p>
          )}
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
            d="M16.1999 14.9343L15.6374 14.0624C15.5249 13.8937 15.4687 13.7249 15.4687 13.528V7.67803C15.4687 6.01865 14.7655 4.47178 13.4718 3.31865C12.4312 2.39053 11.0812 1.7999 9.64678 1.6874V1.1249C9.64678 0.787402 9.36553 0.478027 8.9999 0.478027C8.6624 0.478027 8.35303 0.759277 8.35303 1.1249V1.65928C8.29678 1.65928 8.24053 1.65928 8.18428 1.6874C4.92178 2.05303 2.4749 4.66865 2.4749 7.79053V13.528C2.44678 13.8093 2.39053 13.9499 2.33428 14.0343L1.7999 14.9343C1.63115 15.2155 1.63115 15.553 1.7999 15.8343C1.96865 16.0874 2.2499 16.2562 2.55928 16.2562H8.38115V16.8749C8.38115 17.2124 8.6624 17.5218 9.02803 17.5218C9.36553 17.5218 9.6749 17.2405 9.6749 16.8749V16.2562H15.4687C15.778 16.2562 16.0593 16.0874 16.228 15.8343C16.3968 15.553 16.3968 15.2155 16.1999 14.9343ZM3.23428 14.9905L3.43115 14.653C3.5999 14.3718 3.68428 14.0343 3.74053 13.6405V7.79053C3.74053 5.31553 5.70928 3.23428 8.3249 2.95303C9.92803 2.78428 11.503 3.2624 12.6562 4.2749C13.6687 5.1749 14.2312 6.38428 14.2312 7.67803V13.528C14.2312 13.9499 14.3437 14.3437 14.5968 14.7374L14.7655 14.9905H3.23428Z"
            fill=""
          />
        </svg>
      </Link>

      <div
        ref={dropdown}
        onFocus={() => setDropdownOpen(true)}
        onBlur={() => setDropdownOpen(false)}
        className={`absolute -right-27 mt-2.5 flex h-90 w-75 flex-col rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark sm:right-0 sm:w-80 ${
          dropdownOpen === true ? "block" : "hidden"
        }`}
      >
        <div className="px-4.5 py-3">
          <h5 className="text-sm font-medium text-bodydark2">Notification</h5>
        </div>
        <ul className="flex h-auto flex-col overflow-y-auto">
          {notifications.length > 0 ? (
            notifications.map((notification) =>
              displayNotification(notification)
            )
          ) : (
            <p className="text-sm text-gray-500">No notifications</p>
          )}
        </ul>

        <button className="nButton" onClick={handleRead}>
          Mark as read
        </button>
      </div>
    </li>
  );
};

export default DropdownNotification;
