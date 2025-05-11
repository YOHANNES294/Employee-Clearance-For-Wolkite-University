"use client";
import AdminContainer from "@/components/Admin/AdminContainer";
import React from "react";
import { useState } from "react";
import RegisterOfficer from "@/components/Modals/RegisterOfficer";
import useSWR from "swr";

const columns = [
  { field: "userId", headerName: "ID", width: "100" },
  { field: "firstname", headerName: "First name", width: "240" },
  { field: "middlename", headerName: "Middle name", width: "240" },
  { field: "lastname", headerName: "Last name", width: "240" },
  { field: "role", headerName: "Role", width: "240" },
  { field: "privilege", headerName: "previlege", width: "240" },
];

const rows = [];

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

const ManageOfficer = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Use SWR to fetch and cache data with automatic refresh every 10 seconds
  const { data: userData, error } = useSWR(
    "/api/user/new/officer",
    fetcher,
    {
      initialData: rows,
      revalidateOnFocus: false,
      refreshInterval: 2000, // Set the refresh interval in milliseconds (e.g., 10000 for 10 seconds)
    }
  );

  // Handle loading and fetch errors
  if (!userData && !error) {
    return <p>Loading...</p>;
  }

  if (error) {
    console.error("Error fetching data:", error);
    return <p>Failed to fetch data</p>;
  }

  const filteredInfo = userData.filter(
    (info) =>
      info.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      info.roleId.toString().includes(searchTerm)
  );

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <>
      <input
        type="text"
        placeholder="Search office requirement here"
        value={searchTerm}
        onChange={handleSearch}
        className="w-full sm:hidden pt-4 pb-3 px-3 py-4 mb-7  rounded-md  border border-stroke bg-gray  text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary "
      />

      <div className="grid grid-cols-12 ">
        <AdminContainer
          columns={columns}
          rows={filteredInfo}
          modal={RegisterOfficer}
        />
      </div>
    </>
  );
};

export default ManageOfficer;
