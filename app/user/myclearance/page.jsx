"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Status from "@/components/User/Status";
import RequestClearance from "@/components/User/RequestClearance";
import History from "@/components/User/History";

import HistoryIcon from "@mui/icons-material/History";
import InventoryOutlinedIcon from "@mui/icons-material/InventoryOutlined";
import RuleOutlinedIcon from "@mui/icons-material/RuleOutlined";
import { useState, useEffect } from "react";
import useSWR from "swr";
import Breadcrumb from "@/components/Breadcrumb/breadcrumb";

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

let keyValuePairs = {};

export default function LabTabs() {
  const [value, setValue] = useState("3");
  const [adminStepData, setAdminStepData] = useState([]);
  const [academicStepData, setAcademicStepData] = useState([]);
  const [userStatusData, setUserData] = useState([]);
  const [stepError, setStepError] = useState(null);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const handleRequest = () => {
    setValue("1");
  };

  const a = [];
  const { data: userData, error } = useSWR("/api/userStatus", fetcher, {
    initialData: a,
    revalidateOnFocus: false,
    refreshInterval: 2000,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const adminType = "ADMIN";
        const academicType = "ACADEMIC";
        const url = "/api/steps";
        const fullAdminUrl = `${url}?stepType=${adminType}`;
        const fullAcademicUrl = `${url}?stepType=${academicType}`;

        const adminResponse = await fetch(fullAdminUrl);
        const academicResponse = await fetch(fullAcademicUrl);
        if (!academicResponse.ok || !adminResponse.ok) {
          throw new Error("Network response was not ok");
        }
        const adminData = await adminResponse.json();
        const academicData = await academicResponse.json();

        setAdminStepData(adminData);
        setAcademicStepData(academicData);
      } catch (error) {
        setStepError(error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (userData && userData[0]?.status[0]) {
      setValue("3");
    }
  }, [userData]);

  if (!userData && !error) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Failed to fetch data</p>;
  }

  return (
    <div className="bg-white sm:px-6 px-2 dark:bg-black dark:border-black">
      <Breadcrumb
        title="My Clearance"
        mainRoute="Dashboard"
        subRoute="Clearance"
      />
      <Box
        sx={{
          typography: "body1",
          backgroundColor: "white",
          minHeight: "100vh",
        }}
        className="dark:border-black dark:bg-black"
      >
        <TabContext value={value}>
          <Box
            sx={{ borderBottom: 1, borderColor: "divider" }}
            className="pt-2 px-4 dark:border-body"
          >
            <TabList
              indicatorColor="primary"
              textColor="#AEB7C0"
              onChange={handleChange}
              aria-label="lab API tabs example"
            >
              {!userData[0]?.status[0] && (
                <Tab
                  sx={{
                    textTransform: "none",
                    color: "black",
                    fontSize: "1rem",
                  }}
                  className="dark:text-white"
                  value="1"
                  label={
                    <div className="flex font-satoshi">
                      <InventoryOutlinedIcon
                        fontSize="small"
                        className="mr-2"
                      />{" "}
                      Request Clearance
                    </div>
                  }
                />
              )}
              <Tab
                sx={{ textTransform: "none", color: "black", fontSize: "1rem" }}
                className=" dark:text-white  "
                value="3"
                label={
                  <div className="flex font-satoshi ">
                    <RuleOutlinedIcon fontSize="small" className="mr-2" />{" "}
                    Status
                  </div>
                }
              />
              <Tab
                sx={{ textTransform: "none", color: "black", fontSize: "1rem" }}
                className=" dark:text-white  "
                value="2"
                label={
                  <div className="flex font-satoshi">
                    <HistoryIcon fontSize="small" className="mr-2 " /> History
                  </div>
                }
              />
            </TabList>
          </Box>

          <>
            <TabPanel value="1">
              <RequestClearance />
            </TabPanel>
            <TabPanel value="2">
              <History />
            </TabPanel>
            <TabPanel value="3">
              <Status
                adminStepData={adminStepData}
                academicStepData={academicStepData}
                handleRequest={handleRequest}
              />
            </TabPanel>
          </>
        </TabContext>
      </Box>
    </div>
  );
}