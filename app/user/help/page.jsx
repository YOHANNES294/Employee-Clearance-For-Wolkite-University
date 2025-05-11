"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import GeneralInfo from "@/components/User/GeneralInfo";
import Faq from "@/components/User/Faq";

import QuizOutlinedIcon from "@mui/icons-material/QuizOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Breadcrumb from "@/components/Breadcrumb/breadcrumb";

export default function LabTabs() {
  const [value, setValue] = React.useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className="bg-white sm:px-6 px-2 dark:bg-black dark:border-black">
      <Breadcrumb title="Help" mainRoute="User" subRoute="Help" />
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
            className="pt-2 px-4 dark-border-body"
          >
            <TabList
              indicatorColor="primary"
              textColor="#AEB7C0"
              onChange={handleChange}
              aria-label="lab API tabs example"
            >
              <Tab
                sx={{ textTransform: "none", color: "black", fontSize: "1rem" }}
                className="dark:text-white "
                label={
                  <div className="flex font-satoshi">
                    <InfoOutlinedIcon fontSize="small" className="mr-2" />{" "}
                    Office Information
                  </div>
                }
                value="1"
              />
              <Tab
                sx={{ textTransform: "none", color: "black", fontSize: "1rem" }}
                className="dark:text-white "
                label={
                  <div className="flex font-satoshi">
                    <QuizOutlinedIcon fontSize="small" className="mr-2" /> FAQ
                  </div>
                }
                value="2"
              />
            </TabList>
          </Box>
          <TabPanel value="1">
            <GeneralInfo />
          </TabPanel>
          <TabPanel value="2">
            <Faq />
          </TabPanel>
        </TabContext>
      </Box>
    </div>
  );
}
