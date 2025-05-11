"use client";
import { useState, useRef, useEffect } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { registerOfficerSchema } from "@/validations/registrationValidation";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { privilegeData, ROLES } from "@/utils/constants";

const RegisterOfficer = ({ onCancel }) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
    setValue,
  } = useForm({ resolver: yupResolver(registerOfficerSchema) });

  const [selectedCollege, setSelectedCollege] = useState(null);
  const [searchCollege, setSearchCollege] = useState("");
  const [filteredColleges, setFilteredColleges] = useState([]);
  const [showCollegeDropdown, setShowCollegeDropdown] = useState(false);
  const collegeDropdownRef = useRef(null);

  const initialDropdownColleges = privilegeData.slice(0, 1);

  const handleSearchCollegeFocus = () => {
    if (searchCollege) {
      setShowCollegeDropdown(true);
    } else {
      setFilteredColleges(initialDropdownColleges);
      setShowCollegeDropdown(true);
    }
  };

  useEffect(() => {
    if (searchCollege) {
      const filteredResults = privilegeData.filter((college) =>
        college.name.toLowerCase().includes(searchCollege.toLowerCase())
      );
      setFilteredColleges(filteredResults);
    } else {
      setFilteredColleges(initialDropdownColleges);
    }
  }, [searchCollege]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        collegeDropdownRef.current &&
        !collegeDropdownRef.current.contains(event.target)
      ) {
        setShowCollegeDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

  const onSubmit = async (data) => {
    const fromFirstName = data.firstName.toLowerCase();
    const fromMiddleName = data.middleName.charAt(0).toLowerCase();
    const password = `${fromFirstName}@${fromMiddleName}1234`;

    try {
      const response = await fetch("/api/user/new", {
        method: "POST",
        body: JSON.stringify({
          userId: data.officerId,
          firstname: data.firstName,
          middlename: data.middleName,
          lastname: data.lastName,
          password: password,
          privilege: data.collegeName,
          role: ROLES.STAFF,
        }),
      });

      if (response.ok) {
        toast.success("Officer registered Successfully!");
      }
    } catch (error) {
      console.log(error);
    }
    setSearchCollege("");
    reset();
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <div className="w-full max-w-142.5 rounded-lg bg-white py-12 px-8 dark:bg-boxdark md:py-15 md:px-8.5">
      <div className="flex flex-row place-content-between">
        <div>
          <h3 className="pb-2 text-left text-lg font-bold text-black dark:text-white sm:text-2xl">
            Register Officer
          </h3>
          <span className="mx-auto mb-6 inline-block h-1 w-22.5 rounded bg-primary"></span>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
          <div className="w-full sm:w-1/2">
            <label
              className="mb-3 block text-sm font-medium text-black dark:text-white"
              htmlFor="firstName"
            >
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
            <p>{errors.firstName?.message}</p>
          </div>

          <div className="w-full sm:w-1/2">
            <label
              className="mb-3 block text-sm font-medium text-black dark:text-white"
              htmlFor="middleName"
            >
              Middle Name
            </label>
            <div className="relative">
              <input
                className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                type="text"
                name="middleName"
                id="middleName"
                placeholder="Father's name"
                {...register("middleName")}
              />
              <p>{errors.middleName?.message}</p>
            </div>
          </div>
        </div>
        <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
          <div className="w-full sm:w-1/2">
            <label
              className="mb-3 block text-sm font-medium text-black dark:text-white"
              htmlFor="lastName"
            >
              Last Name
            </label>
            <input
              className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
              type="text"
              name="lastName"
              id="lastName"
              placeholder="Grand father's Name"
              {...register("lastName")}
            />
            <p>{errors.lastName?.message}</p>
          </div>

          <div className="w-full sm:w-1/2">
            <label
              className="mb-3 block text-sm font-medium text-black dark:text-white"
              htmlFor="officerId"
            >
              Officer Id
            </label>
            <input
              className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
              type="text"
              name="officerId"
              id="officerId"
              placeholder=".../..../.."
              {...register("officerId")}
            />
            <p>{errors.officerId?.message}</p>
          </div>
        </div>
        <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
          <div className="w-full sm:w-1/2">
            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
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
            <p>{errors.collegeName?.message}</p>
            {showCollegeDropdown && (
              <div
                ref={collegeDropdownRef}
                className="w-full py-1 rounded-md border border-stroke bg-gray text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
              >
                {filteredColleges.map((college) => (
                  <div
                    key={college.id}
                    onClick={() => handleDropdownCollegeClick(college)}
                    className="px-4 py-2 cursor-pointer hover:bg-blue-100 hover:bg-bodydark1 dark:hover:bg-body"
                  >
                    {college.name}
                  </div>
                ))}
              </div>
            )}
          </div>
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
              onClick={handleCancel}
              className="block w-full rounded border border-stroke bg-gray p-3 text-center font-medium text-black transition hover:border-meta-1 hover:bg-meta-1 hover:text-white dark:border-strokedark dark:bg-meta-4 dark:text-white dark:hover:border-meta-1 dark:hover:bg-meta-1"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default RegisterOfficer;