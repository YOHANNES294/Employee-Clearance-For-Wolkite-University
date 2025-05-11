import { useSession } from "next-auth/react";
import React, { useState } from "react";
import { useEffect } from "react";
import { toast } from "react-toastify";
import Image from "next/image";
import SendIcon from "@mui/icons-material/Send";

const requestForStaff = [
  {
    value: "Campus Residency",
    label: "Campus Residency",
  },
  {
    value: "Job Relocation",
    label: "Job Relocation",
  },
  {
    value: "End of Contract",
    label: "End of Contract",
  },
  {
    value: "Resignation",
    label: "Resignation",
  },
];

const TaskItem = () => {
  const [selectedTask, setSelectedTask] = useState(null);
  const [guarantorName, setGuarantorName] = useState("");
  const [guarantorId, setGuarantorId] = useState("");

  // fetch the steps from db
  const [stepData, setStepData] = useState(null);
  const [stepError, setStepError] = useState(null);

  const [draggedData, setDraggedData] = useState([]);

  const [selectedImage, setProfilePic] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);

  const session = useSession();
  const userId = session?.data?.user.userId;
  const firstname = session?.data?.user.firstname;
  const middlename = session?.data?.user.middlename;
  const collegeName = session?.data?.user.collegeName;
  const departmentName = session?.data?.user.departmentName;
  const _userId = session?.data?.user.id;
  const role = session?.data?.user.role;

  let stepType;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userUrl = "/api/user/byUserId";
        const fullUserUrl = `${userUrl}?userId=${userId}`;
        const userResponse = await fetch(fullUserUrl);
        const userData = await userResponse.json();

        stepType = userData[0].staffType;

        const url = "/api/steps";
        const fullUrl = `${url}?stepType=${stepType}`;
        const response = await fetch(fullUrl);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        let steps = {};
        const data = await response.json();

        data.forEach((data, index) => {
          steps[data.name] = data.nextSteps;
        });
        const key = Object.keys(steps);

        const firstkey = [];
        firstkey.push(key[0]);

        const updatedData = data.map((user) => ({
          ...user,
          id: user._id,
        }));
        setStepData(updatedData);
        setDraggedData(firstkey);
      } catch (error) {
        setStepError(error);
      }
    };

    fetchData();
  }, []);

  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const imageURL = URL.createObjectURL(selectedFile);
      const base64 = await convertToBase64(selectedFile);
      setImageBase64(base64);
      setProfilePic(imageURL);
    }
  };

  function convertToBase64(file) {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  }

  const handleTaskSelection = (task) => {
    setSelectedTask(task);
  };

  const handleGuarantorNameChange = (event) => {
    setGuarantorName(event.target.value);
  };

  const handleGuarantorIdChange = (event) => {
    setGuarantorId(event.target.value);
  };

  const handleSend = async () => {
    if (selectedTask != null) {
      if (session?.data?.user.role == "STAFF") {
        let staffType;
        let director;
        try {
          const url = "/api/user/byUserId";
          const fullUrl = `${url}?userId=${userId}`;
          const response = await fetch(fullUrl);

          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const fetchedData = await response.json();

          staffType = fetchedData[0].staffType;
          director = fetchedData[0].director;
        } catch (error) {
          console.error("Error fetching user data:", error);
        }

        if (guarantorName != "" && guarantorId != "") {
          if (staffType == "ACADEMIC") {
            try {
              const response = await fetch("/api/staffRequest", {
                method: "POST",
                body: JSON.stringify({
                  userId: userId,
                  reason: selectedTask,
                  status: draggedData,
                  staffType: staffType,
                  firstname: firstname,
                  middlename: middlename,
                  collegeName: collegeName,
                  departmentName: departmentName,
                  _userId: _userId,
                  role: "STAFF",
                  attachedFile: imageBase64,
                  guarantorName: guarantorName,
                  guarantorId: guarantorId,
                }),
                headers: {
                  "Content-Type": "application/json",
                },
              });

              if (response.ok) {
                const responseData = await response.text();
                toast.success(responseData);
              }
            } catch (error) {
              toast.error("Invalid request");
              console.log(error);
            }
          } else if (staffType == "ADMIN") {
            try {
              const response = await fetch("/api/staffRequest", {
                method: "POST",
                body: JSON.stringify({
                  userId: userId,
                  reason: selectedTask,
                  status: [director],
                  staffType: staffType,
                  firstname: firstname,
                  middlename: middlename,
                  collegeName: collegeName,
                  departmentName: departmentName,
                  _userId: _userId,
                  role: "STAFF",
                  director: director,
                  attachedFile: imageBase64,
                  guarantorName: guarantorName,
                  guarantorId: guarantorId,
                }),
                headers: {
                  "Content-Type": "application/json",
                },
              });

              if (response.ok) {
                const responseData = await response.text();
                toast.success(responseData);
              }
            } catch (error) {
              toast.error("Invalid request");
              console.log(error);
            }
          }
        } else {
          toast.error("Please fill the guarantor's information");
        }
      }
    } else {
      toast.error("Select your reason first");
    }
  };

  return (
    <div class="rounded-md border border-stroke bg-white px-5 sm:pt-4 shadow-default dark:border-strokedark dark:bg-boxdark ">
      <div class="lg:px-12 md:px-6">
        <div class="mt-7.5 mb-3  text-left">
          {role == "STAFF" && (
            <div className="mb-7.5">
              {" "}
              <h2 class="sm:mb-6 mb-4 px-4 py-2 sm:text-xl text-lg sm:font-bold font-semibold bg-gray-2 text-black dark:text-white font-satoshi">
                Guarantor's information
              </h2>
              <div className="grid sm:grid-cols-2 grid-cols-1 items-center md:mx-12 lg:mx-20 gap-4">
                <div>
                  <label class="mb-3 block text-base font-medium font-satoshi text-black  dark:text-white">
                    Guaranter's Full Name
                  </label>
                  <input
                    placeholder="Guaranter's Full Name"
                    class="w-full rounded-lg border-[1px] border-stroke bg-transparent px-5 py-3 text-boxdark outline-none    dark:border-form-strokedark dark:bg-form-input dark:text-white"
                    type="text"
                    value={guarantorName}
                    onChange={handleGuarantorNameChange}
                  />
                </div>{" "}
                <div>
                  <label class="mb-3 block text-base font-medium font-satoshi text-boxdark dark:text-white">
                    Guaranter's Id
                  </label>
                  <input
                    placeholder=" Guaranter's Id"
                    class="w-full rounded-lg border-[1px] border-stroke bg-transparent px-5 py-3 text-black outline-none    dark:border-form-strokedark dark:bg-form-input dark:text-white"
                    type="text"
                    value={guarantorId}
                    onChange={handleGuarantorIdChange}
                  />
                </div>
              </div>
            </div>
          )}

          <div>
            <h2 class="sm:mb-6 mb-4  px-4 py-2  sm:text-xl text-lg sm:font-bold font-semibold bg-gray-2 text-black dark:text-white font-satoshi">
              Select your clearance reason
            </h2>
            <div className="grid sm:grid-cols-2 grid-cols-1 items-center md:mx-12 lg:mx-20 gap-4">
              {requestForStaff.map((req) => (
                <label
                  htmlFor={req.value}
                  for={req.value}
                  class="flex mr-4 gap-3 cursor-pointer select-none items-center font-satoshi text-base font-medium text-boxdark-2 dark:text-white bg-gray-2 dark:bg-black/60 px-4 py-3 rounded-md"
                >
                  <div>
                    <input
                      type="radio"
                      id={req.value}
                      name="task-radio-group"
                      value={req.value}
                      checked={selectedTask === req.value}
                      onChange={() => handleTaskSelection(req.value)}
                      class="sm:scale-105 scale-90 bg-primary"
                    />
                  </div>
                  {req.label}
                </label>
              ))}
            </div>{" "}
          </div>
          <div className="mt-7.5 mb-3  text-left">
            <h2 className="sm:mb-6 mb-4  px-4 py-2 sm:text-xl text-lg sm:font-bold font-semibold bg-gray-2 text-black dark:text-white font-satoshi">
              Upload additional documents (Optional)
            </h2>

            <div className=" md:mx-12 lg:mx-20 gap-4 rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div class="p-6.5">
                <label
                  for="fileInput"
                  class="rounded-md  dark:bg-graydark  dz-clickable"
                >
                  <div
                    id="FileUpload"
                    class="flex flex-col items-center cursor-pointer justify-center py-4 border-dashed border-2 border-bodydark1 hover:border-bodydark2 dark:hover:border-primary dark:border-strokedark"
                  >
                    {!selectedImage && (
                      <>
                        <div class="mb-2.5 flex justify-center ">
                          <div class="flex h-15 w-15 items-center justify-center rounded-full bg-gray-2 text-black shadow-10 dark:bg-black dark:text-white">
                            <svg
                              class="fill-current"
                              width="20"
                              height="20"
                              viewBox="0 0 20 20"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <g clip-path="url(#clip0_1867_11682)">
                                <path
                                  d="M18.75 13.75C18.375 13.75 18.0313 14.0625 18.0313 14.4687V17.25C18.0313 17.5312 17.8125 17.75 17.5312 17.75H2.46875C2.1875 17.75 1.96875 17.5312 1.96875 17.25V14.4687C1.96875 14.0625 1.625 13.75 1.25 13.75C0.875 13.75 0.53125 14.0625 0.53125 14.4687V17.25C0.53125 18.3125 1.375 19.1562 2.4375 19.1562H17.5312C18.5938 19.1562 19.4375 18.3125 19.4375 17.25V14.4687C19.4688 14.0625 19.125 13.75 18.75 13.75Z"
                                  fill=""
                                ></path>
                                <path
                                  d="M5.96875 6.46875L9.3125 3.21875V14.0313C9.3125 14.4063 9.625 14.75 10.0312 14.75C10.4062 14.75 10.75 14.4375 10.75 14.0313V3.21875L14.0937 6.46875C14.2187 6.59375 14.4062 6.65625 14.5938 6.65625C14.7812 6.65625 14.9688 6.59375 15.0938 6.4375C15.375 6.15625 15.3438 5.71875 15.0938 5.4375L10.5 1.0625C10.2187 0.8125 9.78125 0.8125 9.53125 1.0625L4.96875 5.46875C4.6875 5.75 4.6875 6.1875 4.96875 6.46875C5.25 6.71875 5.6875 6.75 5.96875 6.46875Z"
                                  fill=""
                                ></path>
                              </g>
                              <defs>
                                <clipPath id="clip0_1867_11682">
                                  <rect
                                    width="20"
                                    height="20"
                                    fill="white"
                                  ></rect>
                                </clipPath>
                              </defs>
                            </svg>
                          </div>
                        </div>
                        <span class="font-medium px-2 text-center sm:text-base font-satoshi text-primary dark:text-white">
                          Upload additional documents that help you for
                          clearance approval.
                        </span>
                        <p className="mt-1.5 text-sm">SVG, PNG, JPG </p>
                      </>
                    )}
                    <div>
                      {selectedImage && (
                        <Image
                          src={selectedImage}
                          width={195}
                          height={175}
                          alt="User"
                        />
                      )}
                    </div>
                  </div>
                </label>
                <input
                  type="file"
                  id="fileInput"
                  className="hidden"
                  accept=".svg, .png, .jpg"
                  onChange={handleFileChange}
                />
              </div>
            </div>
          </div>
          <div className=" md:mx-12 mt-4 mb-12 lg:mx-20 gap-4">
            <button
              onClick={handleSend}
              class="flex w-full items-center justify-center gap-3 font-satoshi rounded bg-primary px-4.5 py-2.5 font-medium text-white hover:bg-opacity-90"
            >
              <SendIcon />
              Send Request
            </button>
          </div>
        </div>{" "}
      </div>
    </div>
  );
};

export default TaskItem;