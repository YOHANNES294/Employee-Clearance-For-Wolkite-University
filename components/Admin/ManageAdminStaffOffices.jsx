"use client";
import React, { useState, useEffect, useRef } from "react";

import RegisterOffice from "@/components/Modals/RegisterOffice";
import Modal from "@mui/material/Modal";
import { toast } from "react-toastify";
import AddIcon from "@mui/icons-material/Add";

import HorizontalRuleIcon from "@mui/icons-material/HorizontalRule";

const ManageAdminStaffOffices = () => {
  const [keyValuePairs, setKeyValuePairs] = useState({});
  const [selectedRows, setSelectedRows] = useState([]);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const [steps, setSteps] = useState({});
  // const [steps, setSteps] = useState({});
  const [selectedKey, setSelectedKey] = useState(null); // State for selected key
  //  setSteps({"yes":["College Dean"]})
  const [stepData, setStepData] = useState([]);
  const [stepError, setStepError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const stepType = "ADMIN"; // Define your stepType here
        const url = "/api/steps"; // Define the URL

        // Construct URL with query parameter
        const fullUrl = `${url}?stepType=${stepType}`;

        // Make the GET request using fetch
        const response = await fetch(fullUrl);

        // Check if response is successful
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        // Extract JSON data from response
        const data = await response.json();

        // Update data format if needed
        const updatedData = data.map((user) => ({
          ...user,
          id: user._id,
        }));

        // Set data into state
        setStepData(data);
      } catch (error) {
        // Handle errors
        setStepError(error);
      }
    };

    // Call fetchData when component mounts
    fetchData();

    // No cleanup or dependency array needed as we only want to fetch data once
  }, [stepData]);

  

  // Render loading state
  if (!stepData && !stepError) {
    return <p>Loading...</p>;
  }

  const list = [];

  const data = stepData[0];
  
  for (let index = 0; index < stepData.length; index++) {
    Object.keys(data).forEach((key) => {
      
      if (key === "name") {
        list.push(data[key]);
      }
    });
  }
  const values = stepData[0]?.nextSteps;

  // const keys = Object.keys(steps);
  // const values = Object.values(steps);

  const modifySteps = async (key, value) => {
    setSteps((prevSteps) => ({
      ...prevSteps,
      newProperty: ["New Value"],
      // You can add more properties here if needed
    }));

    try {
      const response = await fetch("/api/steps", {
        method: "PATCH",
        body: JSON.stringify({
          key,
          value,
          stepType: "ADMIN",
        }),
      });
      if (response.ok) {
        toast.success("Steps updated successfully!");
        // Optionally, you can redirect or show a success message here
      } else {
        console.error("Failed to create steps");
        // Handle the error, maybe show an error message to the user
      }
    } catch (error) {
      console.error("Error creating steps:", error);
      // Handle any unexpected errors
    }
  };

  // const keyValuePairs = {};
  stepData.forEach((data, index) => {
    keyValuePairs[data.name] = data.nextSteps;
  });

  const addItem = (key, value) => {
    if(key!="Select an office for adjusting its step") {
    keyValuePairs[key]?.push(value);

    if (keyValuePairs[key] && key != value && key != "Select an office for adjusting its step") {
      setKeyValuePairs((prevKeyValuePairs) => {
        const updatedPairs = { ...prevKeyValuePairs };
        updatedPairs[key] = [...(updatedPairs[key] || []), value];
        return updatedPairs;
      });
    }
  }
  };

  // const removeItem = (key, value) => {
  //   keyValuePairs[key].pop(value);
  //   setSteps((prevSteps) => ({
  //     ...prevSteps,
  //     [key]: prevSteps[key]?.filter((item) => item !== value),
  //   }));
  // };
  const removeItem = (key, value) => {

    if (keyValuePairs[key]) {
      const index = keyValuePairs[key].indexOf(value);
      if (index !== -1) {
        keyValuePairs[key].splice(index, 1);
      }
    }

    const updatedArray = keyValuePairs[key].filter(item => item !== value);

    // Update keyValuePairs with the new array
    keyValuePairs[key] = updatedArray;


    setSteps(prevSteps => ({
      ...prevSteps,
      [key]: updatedArray
    }));


  };

  // Iterate over the key-value pairs of the object
  Object.entries(keyValuePairs).forEach(([key, value]) => {
   
  });
  const keys = Object.keys(keyValuePairs);
  const value = Object.values(keyValuePairs);

  const Approved = {
    key: "APPROVED",
    name: "APPROVED",
    nextSteps: [],
  };
  return (
    <div
      className={`rounded-lg border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5  
        } col-span-12 xs:col-span-9 `}
    >
      <div className="flex-grow"></div>
      <div className="flex w-full justify-between items-center mb-4">
        <div className="flex w-1/3 "></div>

        <div className="flex gap-4 flex-inline  items-center rounded-md  p-1.5 ">
          <button
            onClick={handleOpen}
            className="rounded-lg  justify-center  bg-primary py-2 px-6 font-medium text-whiten hover:bg-opacity-95"
          >
            Register
          </button>
        </div>
      </div>
      <div className="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap">
        <div className="flex w-full flex-wrap gap-3 sm:gap-5">
          <main className="flex min-h-screen flex-col items-center space-y-4">
            <select
              class="ml-1 mr-15 font-medium text-black dark:text-white text-md font-satoshi   inline-flex items-center gap-2.5 bg-gray border-stroke rounded-md dark:bg-boxdark-2 px-5.5 py-3 "
              value={selectedKey}
              onChange={(e) => setSelectedKey(e.target.value)}
            >
              <option value={null}>
                Select an office for adjusting its step
              </option>
              {stepData.map((data, key) => (
                <option key={key} value={data.name}>
                  {data.name}
                </option>
              ))}
            </select>
            <div className="flex flex-col gap-15 md:flex-row">
              {/* && !stepData[selectedKey]?.includes(value.name )  */}

              {/* List of available values to add (Right Box - Minus) */}
              <div className="mt-5">
                <ul className="pl-5 py-3  ">
                  {Object.entries(keyValuePairs).map(
                    ([key, value]) =>
                      key !== selectedKey &&
                      !keyValuePairs[selectedKey]?.includes(key) && (
                        <div key={key}>
                          <li className="relative w-1/1.5 text-black dark:text-white text-md font-satoshi font-medium  bg-gray dark:bg-boxdark-2 flex space-x-3 border-none rounded p-2  mb-5 mr-3 ">
                            <div className="justify-center">{key}</div>
                            <button
                              className="flex flex-1 justify-end"
                              onClick={() => addItem(selectedKey, key)}
                            >
                              {/* <ArrowCircleRightIcon /> */}
                              <AddIcon />
                            </button>
                          </li>
                        </div>
                      )
                  )}
                  {selectedKey?.toUpperCase() === "Human Resource Management Directorate" &&
                    !keyValuePairs[selectedKey]?.includes(Approved.name) && (
                      <div key={Approved.name}>
                        <li className="relative w-1/1.5 text-black dark:text-white text-md font-satoshi font-medium  bg-gray dark:bg-boxdark-2 flex space-x-3 border-none rounded p-2  mb-5 mr-3 ">
                          <div className="justify-center">{Approved.name}</div>
                          <button
                            className="flex flex-1 justify-end"
                            onClick={() =>selectedKey && addItem(selectedKey, Approved.name)}
                          >
                            {/* <ArrowCircleRightIcon /> */}
                            <AddIcon />
                          </button>
                        </li>
                      </div>
                    )}
                </ul>
              </div>
              {/* rounded-md border border-stroke bg-white shadow-default dark:border-black dark:bg-black */}
              {/* remover */}
              {selectedKey && selectedKey !== "Select a Step" && (
                <p className="text-base font-medium text-center dark:text-stroke text-black bg-gray-2 border-none dark:bg-boxdark-2 leading-10 font-satoshi  text-wrap   line-clamp-3 w-1/4 flex  justify-center  border rounded-lg p-10 bg-gray-100 mb-5 mt-5 ml-10">
                  Upon clicking the 'Add' button on the left side, the newly
                  added item becomes the subsequent step following the current
                  status {selectedKey}.
                </p>
              )}
              <div className="mt-5 ">
                <ul className="pl-5 py-3">
                  {keyValuePairs[selectedKey]?.map((value) => (
                    <li
                      className="relative w-1/1.5 text-black dark:text-white text-md font-satoshi font-medium  bg-gray dark:bg-boxdark-2 flex space-x-3 border-none rounded p-2 bg-gray-100 mb-5 mr-3"
                      key={value}
                    >
                      <button
                        className="flex flex-1 justify-start"
                        onClick={() => removeItem(selectedKey, value)}
                      >
                        {/* <ArrowCircleLeftIcon /> */}
                        <HorizontalRuleIcon />
                      </button>
                      <div className="justify-center">{value}</div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className=" w-full px-1 ">
              <button
                onClick={() =>
                  modifySteps(selectedKey, keyValuePairs[selectedKey])
                }
                className="ml-5 block w-60 rounded border border-primary bg-primary p-3 text-center font-medium text-white transition hover:bg-opacity-90"
              >
                Save
              </button>
            </div>
          </main>
        </div>
      </div>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div
          onClick={handleOverlayClick}
          className="absolute top-0 left-0 z-999999 flex h-full min-h-screen w-full items-center justify-center bg-gray/10 dark:bg-black/90 px-4 py-5 "
        >
          <RegisterOffice onCancel={handleClose} />
        </div>
      </Modal>
    </div>
  );
};

export default ManageAdminStaffOffices;
