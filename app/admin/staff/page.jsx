"use client";

import AdminContainer from "@/components/Admin/AdminContainer";
import React from "react";
import { useState } from "react";
import RegisterStaff from "@/components/Modals/RegisterStaff";
import { useEffect } from "react";
import useSWR from "swr";
import AdminBreadcrumb from "@/components/Breadcrumb/adminBreadcrumb";
const columns = [
  { field: "userId", headerName: "ID", width: "120" },
  { field: "firstname", headerName: "First Name", width: "120" },
  { field: "middlename", headerName: "Middle Name", width: "120" },
  { field: "lastname", headerName: "Last Name", width: "120" },
  { field: "departmentName", headerName: "Department", width: "170" },
  { field: "collegeName", headerName: "Directorate/College", width: "170" },
  { field: "privilege", headerName: "Previlege", width: "140" },
];

const rows = [];

const fetcher = async (url) => {
  const response = await fetch(url);
  const data = await response.json();
  const updatedData = data.map((user) => ({
    ...user,
    id: user._id,
    roleId: user._id,
  })); // Add id and roleId based on _id
  return updatedData;
};
const ManageStaff = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Use SWR to fetch and cache data
  const { data: userData, error } = useSWR(
    "/api/user/new/staff",
    fetcher,
    {
      initialData: rows, // Provide initial data (can be an empty array)
      revalidateOnFocus: true,
      refreshInterval: 2000, // Disable automatic revalidation on focus
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
      info.roleId.toString().includes(searchTerm) // Include roleId in filtering
  );

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <>
      <AdminBreadcrumb
        title="Manage Staffs"
        mainRoute="Admin"
        subRoute="Staff"
      />
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
          modal={RegisterStaff}
        />
      </div>
    </>
  );
};

export default ManageStaff;
