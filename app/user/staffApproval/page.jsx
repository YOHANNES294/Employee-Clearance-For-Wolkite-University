"use client";

import UserContainer from "@/components/User/UserContainer/UserContainer";
import React from "react";
import { useState, useEffect } from "react";
import RegisterStaff from "@/components/Modals/RegisterStaff";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import RejectionMessageBox from "@/components/Modals/RejectionMessageBox";
import Breadcrumb from "@/components/Breadcrumb/breadcrumb";

const columns = [
  { field: "userId", headerName: "ID", width: "120" },
  { field: "firstname", headerName: "First Name", width: "140" },
  { field: "middlename", headerName: "Last Name", width: "140" },
  { field: "director", headerName: "Director", width: "140" },
  { field: "departmentName", headerName: "Department Name", width: "200" },
  { field: "collegeName", headerName: "College Name", width: "200" },
  { field: "reason", headerName: "Reason", width: "160" },
  { field: "attachedFile", headerName: "Attachment", width: "100" },
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
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { data: session } = useSession();

  const previlage = session?.user?.privilege;
  //console.log("previlage inside staff approval", previlage);
  // Use SWR to fetch and cache data with automatic refresh every 10 seconds
  const { data: userData, error } = useSWR(`/api/staffApproval`, fetcher, {
    revalidateOnFocus: false,
    refreshInterval: 2000, // Set the refresh interval in milliseconds (e.g., 10000 for 10 seconds)
  });

  
  useEffect(() => {
    console.log("USER DATA inside approval", userData);
    const fetchSteps = async () => {
      if (userData && previlage && previlage !== "Head") {
        const filtered = userData.filter(async (request) => {
          const approvalRoles = request.approvals.map(
            (approval) => approval.role
          );
          const staffType = request.staffType;
          let step;

          if (staffType == "ACADEMIC") {
            let steps = {};
            // fetch the steps for academic staff
            const url = "/api/steps";
            const fullStaffUrl = `${url}?stepType=${staffType}`;
            const staffResponse = await fetch(fullStaffUrl);
            const staffData = await staffResponse.json();
            staffData.forEach((data, index) => {
              steps[data.name] = data.nextSteps;
            }
            );
        

            // end fetch

            step = steps;
          } else if (staffType == "ADMIN") {
            // fetch adminstaff steps
            let steps = {};
            // fetch the steps for academic staff
            const url = "/api/steps";
            const fullStaffUrl = `${url}?stepType=${staffType}`;
            const staffResponse = await fetch(fullStaffUrl);
            const staffData = await staffResponse.json();
            staffData.forEach((data, index) => {
              steps[data.name] = data.nextSteps;
            }
            );
          

            step = { ...steps };
            delete step.Director;
          }

          const stageKeys = Object.keys(step).filter((key) =>
            step[key].includes(previlage)
          );

          // Check if the request has approvals for all stageKeys
          const hasAllApprovals = stageKeys.every((key) =>
            approvalRoles.includes(key)
          );
              //console.log("hasAllApprovals",approvalRoles);
          // Check if the previlage is not in the rejections array
          const notRejected = !request.rejections.includes(previlage);
          return hasAllApprovals && notRejected;
        });
        console.log("filtered", filtered);
            setFilteredData(filtered);
          }
    }
    fetchSteps();

  }, [userData, previlage]);

  // Handle loading and fetch errors
  if (!userData && !error) {
    return <p>Loading...</p>;
  }

  if (error) {
    console.error("Error fetching data:", error);
    return <p>Failed to fetch data</p>;
  }

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };
  const clickableColumns = [7];
  return (
    <div className="bg-white sm:px-6 px-2 dark:bg-black dark:border-black">
      <Breadcrumb
        title="Staff Approval"
        mainRoute="User"
        subRoute="Staff Approval"
      />
      <div className="pt-2 px-4  ">
        <input
          type="text"
          placeholder="Search office requirement here"
          value={searchTerm}
          onChange={handleSearch}
          className=" w-full sm:hidden pt-4 pb-3 px-3 py-4 mb-7  rounded-md  border border-stroke bg-gray  text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary "
        />

        <div className=" grid grid-cols-12 ">
          <UserContainer
            columns={columns}
            rows={previlage !== "Head" ? filteredData : userData}
            modal={RejectionMessageBox}
            clickableColumns={clickableColumns}
          />
        </div>
      </div>
    </div>
  );
};

export default ApproveStaff;
