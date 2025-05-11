"use client";
import UserContainer from "@/components/User/UserContainer/UserContainer";
import useSWR from "swr";
import { useState } from "react";
import Breadcrumb from "@/components/Breadcrumb/breadcrumb";

const columns = [
  { field: "userId", headerName: "ID", width: "100" },
  { field: "firstname", headerName: "First Name", width: "160" },
  { field: "middlename", headerName: "Middle Name", width: "160" },
  { field: "reason", headerName: "Reason", width: "160" },
  { field: "status", headerName: "Status", width: "160" },
  { field: "dateRequested", headerName: "Date Requested", width: "160" },
  { field: "dateApproved", headerName: "Date Approved", width: "160" },
];

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

const ApproveStaff = () => {
  // Use useSWR to fetch data
  const [searchTerm, setSearchTerm] = useState("");

  // Use SWR to fetch and cache data with automatic refresh every 10 seconds
  const { data: userData, error } = useSWR(
    "/api/approvalHistory/approvedStaffHistory",
    fetcher,
    {
      revalidateOnFocus: false,
      refreshInterval: 2000, // Set the refresh interval in milliseconds (e.g., 10000 for 10 seconds)
    }
  );

  console.log("session from approval ad ", userData);
  // Handle loading and fetch errors
  if (!userData && !error) {
    return <p>Loading...</p>;
  }

  if (error) {
    console.error("Error fetching data:", error);
    return <p>Failed to fetch data</p>;
  }

  return (
    <div className="bg-white sm:px-6 px-2 dark:bg-black dark:border-black">
      <Breadcrumb
        title="Approved Requests"
        mainRoute="User"
        subRoute="Approved"
      />

      <div className="pt-2 px-4 grid grid-cols-12 gap-3 md:gap-6 2xl:gap-4.5">
        <UserContainer columns={columns} rows={userData} />
      </div>
    </div>
  );
};

export default ApproveStaff;