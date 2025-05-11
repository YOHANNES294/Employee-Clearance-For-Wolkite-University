"use client";

import { useState, useEffect, useRef } from "react";

const Filter = ({ officeData, collegeData }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCollege, setSearchCollege] = useState("");

  const [filteredOffices, setFilteredOffices] = useState([]);
  const [filteredColleges, setFilteredColleges] = useState([]);

  const [showDropdown, setShowDropdown] = useState(false);
  const [showCollegeDropdown, setShowCollegeDropdown] = useState(false);

  const dropdownRef = useRef(null);
  const collegeDropdownRef = useRef(null);

  const initialDropdownItems = officeData.slice(0, 5);
  const initialDropdownColleges = collegeData.slice(0, 5);

  const handleSearchInputFocus = () => {
    if (searchTerm) {
      setShowDropdown(true);
    } else {
      setFilteredOffices(initialDropdownItems);
      setShowDropdown(true);
    }
  };

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
      const filteredResults = collegeData.filter((college) =>
        college.name.toLowerCase().includes(searchCollege.toLowerCase())
      );
      setFilteredColleges(filteredResults);
    } else {
      setFilteredColleges(initialDropdownColleges);
    }
  }, [searchCollege, collegeData]);

  useEffect(() => {
    if (searchTerm) {
      const filteredResults = officeData.filter((office) =>
        office.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredOffices(filteredResults);
    } else {
      setFilteredOffices(initialDropdownItems);
    }
  }, [searchTerm, officeData]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        (dropdownRef.current && !dropdownRef.current.contains(event.target)) ||
        (collegeDropdownRef.current &&
          !collegeDropdownRef.current.contains(event.target))
      ) {
        setShowDropdown(false);
        setShowCollegeDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearchInputChange = (event) => {
    setSearchTerm(event.target.value);
    setShowDropdown(true);
  };

  const handleDropdownItemClick = (officeName) => {
    setSearchTerm(officeName);
    setShowDropdown(false);
  };

  const handleSearchCollegeChange = (event) => {
    setSearchCollege(event.target.value);
    setShowCollegeDropdown(true);
  };

  const handleDropdownCollegeClick = (collegeName) => {
    setSearchCollege(collegeName);
    setShowCollegeDropdown(false);
  };

  return (
    <div className="col-span-12 rounded-lg border border-stroke bg-white p-7.5 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-3">
      <div className="mb-6 justify-between gap-4 sm:flex">
        <div>
          <h4 className="text-xl font-semibold text-primary dark:text-white">
            Filter staff here
          </h4>
        </div>
      </div>

      <div className="flex w-full flex-wrap gap-3 sm:gap-8">
        <div className="relative">
          <p className="font-semibold text-primary mb-2 dark:text-white">
            College
          </p>
          <input
            type="text"
            placeholder="Search for a college..."
            value={searchCollege}
            onFocus={handleSearchCollegeFocus}
            onChange={handleSearchCollegeChange}
            className="w-full px-4 py-2 rounded-md border border-stroke bg-gray text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
          />
          {showCollegeDropdown && (
            <div
              ref={collegeDropdownRef}
              className="w-full py-1 rounded-md border border-stroke bg-gray text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
            >
              {filteredColleges.map((college) => (
                <div
                  key={college.id}
                  onClick={() => handleDropdownCollegeClick(college.name)}
                  className="px-4 py-2 cursor-pointer hover:bg-blue-100 hover:bg-bodydark1 dark:hover:bg-body"
                >
                  {college.name}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="relative">
          <p className="mb-2 font-semibold text-primary dark:text-white">
            Department
          </p>
          <input
            type="text"
            placeholder="Search for an office..."
            value={searchTerm}
            onFocus={handleSearchInputFocus}
            onChange={handleSearchInputChange}
            className="w-full px-4 py-2 rounded-md border border-stroke bg-gray text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
          />
          {showDropdown && (
            <div
              ref={dropdownRef}
              className="w-full py-1 rounded-md border border-stroke bg-gray text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
            >
              {filteredOffices.map((office) => (
                <div
                  key={office.id}
                  onClick={() => handleDropdownItemClick(office.name)}
                  className="px-4 py-2 cursor-pointer hover:bg-blue-100 hover:bg-bodydark1 dark:hover:bg-body"
                >
                  {office.name}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Filter;