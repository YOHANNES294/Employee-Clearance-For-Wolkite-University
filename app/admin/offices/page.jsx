"use client";

import AdminContainer from "@/components/Admin/AdminContainer";
import React from "react";
import { useState, useEffect } from "react";
import RegisterOffice from "@/components/Modals/RegisterOffice";
import useSWR from "swr";
import AdminBreadcrumb from "@/components/Breadcrumb/adminBreadcrumb";

const columns = [
  { field: "officeId", headerName: "Office Id", width: "120" },
  { field: "officeName", headerName: "Office Name", width: "240" },
  { field: "location", headerName: "Location", width: "200" },
  { field: "items", headerName: "Items", width: "300" },
];

// const row = [
//   {
//     officeId: "100",
//     officeName: "eyob",
//     location: "dejen",
//     items: "qwer",
//   },
//   {
//     officeId: "101",
//     officeName: "eyob",
//     location: "dejen",
//     items: "qwer",
//   },
//   {
//     officeId: "102",
//     officeName: "eyob",
//     location: "dejen",
//     items: "qwer",
//   },
// ];
const row = [];
const ManageOffices = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Use useSWR to fetch data
  const { data: officeData, error } = useSWR(
    "/api/office",
    async (url) => {
      const response = await fetch(url);
      const data = await response.json();
      return data.map((office) => ({ ...office, id: office._id }));
    },
    {
      initialData: row, // Provide initial data (can be an empty array)
      revalidateOnFocus: false,
      refreshInterval: 2000,
    }
  );

  // Handle loading state
  if (!officeData) {
    return <p>Loading...</p>;
  }

  // Handle error state
  if (error) {
    console.error("Error fetching data:", error);
    return <p>Failed to fetch data</p>;
  }

  const getRowId = (row) => row.officeId;

  const filteredInfo = officeData.filter((info) =>
    info.officeName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <>
      {" "}
      <AdminBreadcrumb
        title="Manage Offices"
        mainRoute="Admin"
        subRoute="Office"
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
          getRowId={getRowId}
          columns={columns}
          rows={filteredInfo}
          modal={RegisterOffice}
        />
      </div>
    </>
  );
};

export default ManageOffices;
