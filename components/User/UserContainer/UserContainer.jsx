"use client";
import { useState, useEffect } from "react";
import Modal from "@mui/material/Modal";
import Table from "../../Admin/Table";

import { usePathname } from "next/navigation";
import { toast } from "react-toastify";

const UserContainer = ({
  columns,
  rows,
  modal: OpenedModal,
  clickableColumns,
}) => {
  const pathname = usePathname();
 
  const [open, setOpen] = useState(false);
  const handleOpen = async (selectedRowsData) => {
    if (selectedRowsData.length > 0) {
      setOpen(true);
    }
  };
  const handleClose = () => setOpen(false);
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredRows, setFilteredRows] = useState(rows);
  const [isFiltering, setIsFiltering] = useState(false);

  useEffect(() => {
    setIsFiltering(false);
  }, [rows]);

  // start searching
  const handleSearch = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    setSearchTerm(event.target.value);
    // Filter rows based on year, department, and college
    const filteredRows = rows.filter((row) => {
      const userId = row.userId?.toLowerCase().includes(searchTerm);
      const firstname = row.firstname?.toLowerCase().includes(searchTerm);
      const reason = row.reason?.toLowerCase().includes(searchTerm);
      const dateApproved = row.dateApproved?.toLowerCase().includes(searchTerm);
      // Return true if any of the criteria match
     
      return userId || firstname || reason || dateApproved;
    });
    setIsFiltering(true);
    // Update the state with the filtered rows
    setFilteredRows(filteredRows);
  };

  const handleApproveAll = async (selectedRowsData) => {
    if (selectedRowsData.length > 0) {
      const len = selectedRowsData.length;
      try {
        const requests = selectedRowsData.map(async (eachData) => {
          if (eachData.role == "STAFF") {
            try {
              const response = await fetch(`/api/approveStaffReq`, {
                method: "PATCH",
                body: JSON.stringify({
                  objectId: eachData._id,
                  arrLength: len,
                }),
              });

              if (response.ok) {
                return await response.text();
              }
            } catch (error) {
              console.log(error);
              return null;
            }
          }
        });

        const responses = await Promise.all(requests);

        let toastShown = false;

        responses.forEach((responsedata, index) => {
          if (responsedata) {
            if (
              selectedRowsData.length > 1 &&
              !toastShown &&
              index === responses.length - 1
            ) {
              toast.success(responsedata);
              toastShown = true;
            } else if (selectedRowsData.length === 1) {
              toast.success("Approved Successfully");
            }
          }
        });
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div className="rounded-md border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5  col-span-12 ">
      <div className="flex-grow"></div>
      <div className="flex w-full justify-between items-center mb-4">
        <div className="flex w-1/3 ">
          <input
            type="text"
            placeholder="Search here ..."
            value={searchTerm}
            onChange={handleSearch}
            className=" w-full hidden sm:block px-4 py-2 rounded-md  border border-stroke bg-gray  text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
          />
        </div>

        {/* open modal because I don't use these buttons on the approved users page */}
        {OpenedModal && (
          <div className="flex gap-4 flex-inline  items-center rounded-md  p-1.5 ">
            <button
              onClick={() => handleOpen(selectedRows)}
              className="rounded-lg  justify-center  bg-gray hover:bg-meta-1 py-2 px-6 font-medium text-black dark:bg-meta-4 dark:text-white hover:text-whiten hover:bg-opacity-95 dark:hover:border-meta-1 dark:hover:bg-meta-1"
            >
              Reject
            </button>
            <button
              onClick={() => handleApproveAll(selectedRows)}
              className="rounded-lg  justify-center  bg-primary py-2 px-6 font-medium text-whiten hover:bg-opacity-95"
            >
              Approve
            </button>
          </div>
        )}
      </div>
      <div className="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap">
        <div className="flex w-full flex-wrap gap-3 sm:gap-5">
          <Table
            columns={columns}
            rows={isFiltering ? filteredRows : rows}
            setSelectedRows={setSelectedRows}
            handleApproveAll={handleApproveAll}
            clickableColumns={clickableColumns}
          />
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
          class="absolute top-0 left-0 z-999999 flex h-full min-h-screen w-full items-center justify-center bg-gray/10 dark:bg-black/90 px-4 py-5 "
        >
          <OpenedModal selectedUser={selectedRows} onCancel={handleClose} />
        </div>
      </Modal>
    </div>
  );
};

export default UserContainer;