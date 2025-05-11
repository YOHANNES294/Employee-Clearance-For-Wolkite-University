"use client";
import { useState, useRef, useEffect } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { registerOfficerSchema } from "@/validations/registrationValidation";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { CollegeData, DepartmentData, ROLES } from "@/utils/constants";
import * as XLSX from "xlsx";

const RegisterStaff = ({ onCancel }) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
    setValue,
  } = useForm({ resolver: yupResolver(registerOfficerSchema) });

  const staffTypes = ["ACADEMIC", "ADMIN"];
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedCollege, setSelectedCollege] = useState(null);
  const [selectedPrevilege, setSelectedPrevilege] = useState(null);
  const [selectedDirector, setSelectedDirector] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCollege, setSearchCollege] = useState("");
  const [searchPrevilege, setSearchPrevilege] = useState("");
  const [searchStaffType, setSearchStaffType] = useState("");
  const [searchDirector, setSearchDirector] = useState("");
  const [filteredOffices, setFilteredOffices] = useState([]);
  const [filteredColleges, setFilteredColleges] = useState([]);
  const [filteredPrevilege, setFilteredPrevilege] = useState([]);
  const [filteredStaffType, setFilteredStaffType] = useState([]);
  const [filteredDirector, setFilteredDirector] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showCollegeDropdown, setShowCollegeDropdown] = useState(false);
  const [showPrevilegeDropdown, setShowPrevilegeDropdown] = useState(false);
  const [showStaffType, setShowStaffType] = useState(false);
  const [showDirectorDropdown, setShowDirectorDropdown] = useState(false);
  const collegeDropdownRef = useRef(null);
  const dropdownRef = useRef(null);
  const previlegeDropdownRef = useRef(null);
  const staffTypeDropdownRef = useRef(null);
  const directorDropdownRef = useRef(null);
  const initialDropdownItems = DepartmentData.slice(0, 1);
  const initialDropdownColleges = CollegeData.slice(0, 1);
  const [previlege, setPrevilege] = useState([]);
  const [director, setDirector] = useState([]);

  // Initialize staffType state with available options
  useEffect(() => {
    setFilteredStaffType(staffTypes);
  }, []);

  // Fetch privilege and director data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = searchStaffType
          ? `/api/steps?stepType=${searchStaffType}`
          : "/api/steps";
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Failed to fetch data. Status: ${response.status}`);
        }
        const data = await response.json();
        const keyValuePairs = {};
        data.forEach((item) => {
          keyValuePairs[item.name] = item.nextSteps;
        });
        const roles = Object.keys(keyValuePairs).map((role, index) => ({
          id: (index + 1).toString(),
          name: role,
        }));
        setPrevilege(roles);
        setDirector(roles);
        setFilteredPrevilege(roles);
        setFilteredDirector(roles);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load privilege/director data.");
      }
    };
    fetchData();
  }, [searchStaffType]);

  // Filter dropdowns based on search terms
  useEffect(() => {
    setFilteredColleges(
      searchCollege
        ? CollegeData.filter((college) =>
            college.name.toLowerCase().includes(searchCollege.toLowerCase())
          )
        : initialDropdownColleges
    );
    setFilteredOffices(
      searchTerm
        ? DepartmentData.filter((dept) =>
            dept.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
        : initialDropdownItems
    );
    setFilteredPrevilege(
      searchPrevilege
        ? previlege.filter((p) =>
            p.name.toLowerCase().includes(searchPrevilege.toLowerCase())
          )
        : previlege
    );
    setFilteredDirector(
      searchDirector
        ? director.filter((d) =>
            d.name.toLowerCase().includes(searchDirector.toLowerCase())
          )
        : director
    );
    setFilteredStaffType(
      searchStaffType
        ? staffTypes.filter((type) =>
            type.toLowerCase().includes(searchStaffType.toLowerCase())
          )
        : staffTypes
    );
  }, [searchTerm, searchCollege, searchPrevilege, searchDirector, searchStaffType, previlege, director]);

  // Handle outside clicks to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (collegeDropdownRef.current && !collegeDropdownRef.current.contains(event.target)) {
        setShowCollegeDropdown(false);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
      if (previlegeDropdownRef.current && !previlegeDropdownRef.current.contains(event.target)) {
        setShowPrevilegeDropdown(false);
      }
      if (directorDropdownRef.current && !directorDropdownRef.current.contains(event.target)) {
        setShowDirectorDropdown(false);
      }
      if (staffTypeDropdownRef.current && !staffTypeDropdownRef.current.contains(event.target)) {
        setShowStaffType(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Dropdown focus and change handlers
  const handleSearchInputFocus = () => {
    setShowDropdown(true);
  };

  const handleSearchCollegeFocus = () => {
    setShowCollegeDropdown(true);
  };

  const handleSearchPrevilegeFocus = () => {
    setShowPrevilegeDropdown(true);
  };

  const handleSearchDirectorFocus = () => {
    setShowDirectorDropdown(true);
  };

  const handleSearchStaffTypeChange = (event) => {
    setSearchStaffType(event.target.value);
    setShowStaffType(true);
  };

  const handleSearchInputChange = (event) => {
    setSearchTerm(event.target.value);
    setShowDropdown(true);
  };

  const handleSearchPrevilegeChange = (event) => {
    setSearchPrevilege(event.target.value);
    setShowPrevilegeDropdown(true);
  };

  const handleSearchDirectorChange = (event) => {
    setSearchDirector(event.target.value);
    setShowDirectorDropdown(true);
  };

  const handleDropdownItemClick = (office) => {
    setValue("departmentName", office.name);
    setValue("departmentId", office.id);
    setSelectedDepartment(office);
    setSearchTerm(office.name);
    setShowDropdown(false);
  };

  const handleDropdownPrevilegeItemClick = (priv) => {
    setValue("previlegeName", priv.name);
    setValue("previlegeId", priv.id);
    setSelectedPrevilege(priv);
    setSearchPrevilege(priv.name);
    setShowPrevilegeDropdown(false);
  };

  const handleDropdownDirectorItemClick = (dir) => {
    setValue("directorName", dir.name);
    setValue("directorId", dir.id);
    setSelectedDirector(dir);
    setSearchDirector(dir.name);
    setShowDirectorDropdown(false);
  };

  const handleDropdownStaffTypeItemClick = (type) => {
    setSearchStaffType(type);
    setShowStaffType(false);
  };

  const handleSearchCollegeChange = (event) => {
    setSearchCollege(event.target.value);
    setShowCollegeDropdown(true);
  };

  const handleDropdownCollegeClick = (college) => {
    setValue("collegeName", college.name);
    setValue("collegeId", college.id);
    setSelectedCollege(college);
    setSearchCollege(college.name);
    setShowCollegeDropdown(false);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = async (e) => {
      try {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const parsedData = XLSX.utils.sheet_to_json(sheet);
        const response = await fetch("/api/user/import", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(parsedData),
        });
        if (response.ok) {
          toast.success("Staff imported successfully!");
        } else {
          const errorData = await response.json();
          toast.error(errorData.error || "Failed to import staff.");
        }
      } catch (error) {
        console.error("Error importing file:", error);
        toast.error("An error occurred while importing the file.");
      }
    };
    reader.onerror = () => {
      toast.error("Failed to read the file.");
    };
  };

  const onSubmit = async (data) => {
    // Validate required fields
    if (!searchStaffType) {
      toast.error("Please select a staff type.");
      return;
    }
    if (!data.previlegeName) {
      toast.error("Please select a privilege.");
      return;
    }
    if (searchStaffType === "ACADEMIC" && (!data.collegeName || !data.departmentName)) {
      toast.error("Please select both college and department for academic staff.");
      return;
    }
    if (searchStaffType === "ADMIN" && !data.directorName) {
      toast.error("Please select a director for admin staff.");
      return;
    }
    if (data.previlegeName === "Dormitory" && !data.blockNo) {
      toast.error("Please provide a dorm block number.");
      return;
    }

    // Generate password safely
    const fromFirstName = data.firstName.toLowerCase();
    const fromMiddleName = data.middleName ? data.middleName.charAt(0).toLowerCase() : "x";
    const password = `${fromFirstName}@${fromMiddleName}1234`;

    // Construct payload
    const payload = {
      userId: data.staffId,
      firstname: data.firstName,
      middlename: data.middleName || "",
      lastname: data.lastName,
      password,
      privilege: data.previlegeName,
      collegeName: data.collegeName || "",
      departmentName: data.departmentName || "",
      role: ROLES.STAFF,
      staffType: searchStaffType,
      director: data.directorName || "",
      blockNo: data.blockNo || "",
    };

    console.log("Submitting payload:", payload); // Debug payload

    try {
      const response = await fetch("/api/user/new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      let responseData;
      try {
        responseData = await response.json();
      } catch (jsonError) {
        console.error("Error parsing response:", jsonError);
        responseData = { error: "Invalid server response" };
      }

      if (response.ok) {
        toast.success("Officer registered successfully!");
        // Reset form and states
        reset();
        setSearchCollege("");
        setSearchTerm("");
        setSearchPrevilege("");
        setSearchStaffType("");
        setSearchDirector("");
        setSelectedCollege(null);
        setSelectedDepartment(null);
        setSelectedPrevilege(null);
        setSelectedDirector(null);
      } else {
        toast.error(`Failed to register officer: ${responseData.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("An error occurred while registering the officer.");
    }
  };

  const handleCancel = () => {
    onCancel();
  };

  const handleDownloadAcademicForm = () => {
    const link = document.createElement("a");
    link.href = "/files/AcademicForm.xlsx";
    link.setAttribute("download", "AcademicForm.xlsx");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadAdminForm = () => {
    const link = document.createElement("a");
    link.href = "/files/AdminForm.xlsx";
    link.setAttribute("download", "AdminForm.xlsx");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="relative w-full max-w-142.5 rounded-lg bg-white py-12 px-8 dark:bg-boxdark md:py-15 md:px-8.5">
      <button
        onClick={handleDownloadAdminForm}
        className="absolute top-1 right-12 text-sm hover:text-primary text-meta-5 font-satoshi"
      >
        Get Importing Format (Admin)
      </button>
      <button
        onClick={handleDownloadAcademicForm}
        className="absolute top-6 right-12 text-sm hover:text-primary text-meta-5 font-satoshi"
      >
        Get Importing Format (Academic)
      </button>
      <div className="flex flex-row place-content-between">
        <div>
          <h3 className="pb-2 text-left text-lg font-bold text-black dark:text-white sm:text-2xl">
            Register Staff
          </h3>
          <span className="mx-auto mb-6 inline-block h-1 w-22.5 rounded bg-primary"></span>
        </div>
        <div className="px-3">
          <label
            htmlFor="file-upload"
            className="flex flex-row gap-3 rounded-md border border-primary bg-primary px-6 py-2 text-center font-medium text-white transition hover:bg-opacity-90 cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 15v4c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2v-4M17 9l-5 5-5-5M12 12.8V2.5" />
            </svg>
            Import
          </label>
          <input
            id="file-upload"
            type="file"
            style={{ display: "none" }}
            onChange={handleFileUpload}
            accept=".xlsx,.xls"
          />
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
          <div className="w-full sm:w-1/2">
            <label className="mb-3 block text-sm font-medium text-black dark:text-white" htmlFor="firstName">
              First Name
            </label>
            <input
              className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
              type="text"
              name="firstName"
              id="firstName"
              placeholder="Staff's name"
              {...register("firstName")}
            />
            {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName.message}</p>}
          </div>
          <div className="w-full sm:w-1/2">
            <label className="mb-3 block text-sm font-medium text-black dark:text-white" htmlFor="middleName">
              Middle Name
            </label>
            <input
              className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
              type="text"
              name="middleName"
              id="middleName"
              placeholder="Father's name"
              {...register("middleName")}
            />
            {errors.middleName && <p className="text-red-500 text-sm">{errors.middleName.message}</p>}
          </div>
        </div>
        <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
          <div className="w-full sm:w-1/2">
            <label className="mb-3 block text-sm font-medium text-black dark:text-white" htmlFor="lastName">
              Last Name
            </label>
            <input
              className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
              type="text"
              name="lastName"
              id="lastName"
              placeholder="Grandfather's name"
              {...register("lastName")}
            />
            {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName.message}</p>}
          </div>
          <div className="w-full sm:w-1/2">
            <label className="mb-3 block text-sm font-medium text-black dark:text-white" htmlFor="staffId">
              Staff ID
            </label>
            <input
              className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
              type="text"
              name="staffId"
              id="staffId"
              placeholder="Name@wku.edu.et"
              {...register("staffId")}
            />
            {errors.staffId && <p className="text-red-500 text-sm">{errors.staffId.message}</p>}
          </div>
        </div>
        <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
          <div className="w-full sm:w-1/2">
            <label className="mb-3 block text-sm font-medium text-black dark:text-white" htmlFor="staffType">
              Staff Type
            </label>
            <input
              className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
              type="text"
              name="staffType"
              id="staffType"
              placeholder="Search for a staff type..."
              value={searchStaffType}
              onChange={handleSearchStaffTypeChange}
            />
            {showStaffType && (
              <div
                className="absolute z-10 w-full rounded-md border border-stroke bg-gray text-black dark:border-strokedark dark:bg-meta-4 dark:text-white"
                ref={staffTypeDropdownRef}
              >
                {filteredStaffType.map((type) => (
                  <div
                    className="px-4 py-2 cursor-pointer hover:bg-blue-100 dark:hover:bg-body"
                    key={type}
                    onClick={() => handleDropdownStaffTypeItemClick(type)}
                  >
                    {type}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="w-full sm:w-1/2">
            <label className="mb-3 block text-sm font-medium text-black dark:text-white" htmlFor="previlegeName">
              Privilege
            </label>
            <input
              type="text"
              name="previlegeName"
              id="previlegeName"
              placeholder="Search for a privilege..."
              value={searchPrevilege}
              onFocus={handleSearchPrevilegeFocus}
              onChange={handleSearchPrevilegeChange}
              className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
            />
            {errors.previlegeName && <p className="text-red-500 text-sm">{errors.previlegeName.message}</p>}
            {showPrevilegeDropdown && (
              <div
                className="absolute z-10 w-full rounded-md border border-stroke bg-gray text-black dark:border-strokedark dark:bg-meta-4 dark:text-white"
                ref={previlegeDropdownRef}
              >
                {filteredPrevilege.map((priv) => (
                  <div
                    key={priv.id}
                    onClick={() => handleDropdownPrevilegeItemClick(priv)}
                    className="px-4 py-2 cursor-pointer hover:bg-blue-100 dark:hover:bg-body"
                  >
                    {priv.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        {searchStaffType === "ACADEMIC" && (
          <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
            <div className="w-full sm:w-1/2">
              <label className="mb-3 block text-sm font-medium text-black dark:text-white" htmlFor="collegeName">
                College
              </label>
              <input
                type="text"
                name="collegeName"
                id="collegeName"
                placeholder="Search for a college..."
                value={searchCollege}
                onFocus={handleSearchCollegeFocus}
                onChange={handleSearchCollegeChange}
                className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
              />
              {errors.collegeName && <p className="text-red-500 text-sm">{errors.collegeName.message}</p>}
              {showCollegeDropdown && (
                <div
                  className="absolute z-10 w-full rounded-md border border-stroke bg-gray text-black dark:border-strokedark dark:bg-meta-4 dark:text-white"
                  ref={collegeDropdownRef}
                >
                  {filteredColleges.map((college) => (
                    <div
                      key={college.id}
                      onClick={() => handleDropdownCollegeClick(college)}
                      className="px-4 py-2 cursor-pointer hover:bg-blue-100 dark:hover:bg-body"
                    >
                      {college.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="w-full sm:w-1/2">
              <label className="mb-3 block text-sm font-medium text-black dark:text-white" htmlFor="departmentName">
                Department
              </label>
              <input
                type="text"
                name="departmentName"
                id="departmentName"
                placeholder="Search for a department..."
                value={searchTerm}
                onFocus={handleSearchInputFocus}
                onChange={handleSearchInputChange}
                className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
              />
              <input type="hidden" name="departmentId" {...register("departmentId")} />
              {errors.departmentName && <p className="text-red-500 text-sm">{errors.departmentName.message}</p>}
              {showDropdown && (
                <div
                  className="absolute z-10 w-full rounded-md border border-stroke bg-gray text-black dark:border-strokedark dark:bg-meta-4 dark:text-white"
                  ref={dropdownRef}
                >
                  {filteredOffices.map((office) => (
                    <div
                      key={office.id}
                      onClick={() => handleDropdownItemClick(office)}
                      className="px-4 py-2 cursor-pointer hover:bg-blue-100 dark:hover:bg-body"
                    >
                      {office.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
        <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
          {searchStaffType === "ADMIN" && (
            <div className="w-full sm:w-1/2">
              <label className="mb-3 block text-sm font-medium text-black dark:text-white" htmlFor="directorName">
                Director
              </label>
              <input
                type="text"
                name="directorName"
                id="directorName"
                placeholder="Search for a director..."
                value={searchDirector}
                onFocus={handleSearchDirectorFocus}
                onChange={handleSearchDirectorChange}
                className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
              />
              {errors.directorName && <p className="text-red-500 text-sm">{errors.directorName.message}</p>}
              {showDirectorDropdown && (
                <div
                  className="absolute z-10 w-full rounded-md border border-stroke bg-gray text-black dark:border-strokedark dark:bg-meta-4 dark:text-white"
                  ref={directorDropdownRef}
                >
                  {filteredDirector.map((dir) => (
                    <div
                      key={dir.id}
                      onClick={() => handleDropdownDirectorItemClick(dir)}
                      className="px-4 py-2 cursor-pointer hover:bg-blue-100 dark:hover:bg-body"
                    >
                      {dir.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          {searchPrevilege === "Dormitory" && (
            <div className="w-full sm:w-1/2">
              <label className="mb-3 block text-sm font-medium text-black dark:text-white" htmlFor="blockNo">
                Dorm Block
              </label>
              <input
                className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                type="text"
                name="blockNo"
                id="blockNo"
                placeholder="Block number"
                {...register("blockNo")}
              />
              {errors.blockNo && <p className="text-red-500 text-sm">{errors.blockNo.message}</p>}
            </div>
          )}
        </div>
        <div className="-mx-3 mt-10 flex flex-wrap gap-y-4">
          <div className="w-full px-3 2xsm:w-1/2">
            <button
              type="submit"
              className="block w-full rounded border border-primary bg-primary p-3 text-center font-medium text-white transition hover:bg-opacity-90"
            >
              Save
            </button>
          </div>
          <div className="w-full px-3 2xsm:w-1/2">
            <button
              type="button"
              onClick={handleCancel}
              className="block w-full rounded border border-stroke bg-gray p-3 text-center font-medium text-black transition hover:border-meta-1 hover:bg-meta-1 hover:text-white dark:border-strokedark dark:bg-meta-4 dark:text-white"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default RegisterStaff;