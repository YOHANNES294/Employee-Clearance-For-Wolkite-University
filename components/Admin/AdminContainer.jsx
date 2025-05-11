"use client";
import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { toast } from "react-toastify";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Table from "./Table";
import EditStaff from "../Modals/EditStaff";
import { usePathname, useRouter } from "next/navigation";
import { keyframes } from "@mui/system";

const AdminContainer = ({ columns, rows, modal: OpenedModal }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [selectedRows, setSelectedRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [userId, setUserData] = useState();
  const [filteredRows, setFilteredRows] = useState(rows);
  const [isFilter, setIsFilter] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const modalEntrance = keyframes`
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  `;

  const buttonHover = keyframes`
    from { transform: translateY(0); box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    to { transform: translateY(-2px); box-shadow: 0 4px 8px rgba(0,0,0,0.15); }
  `;

  const buttonClick = keyframes`
    0% { transform: scale(1); }
    50% { transform: scale(0.95); }
    100% { transform: scale(1); }
  `;

  useEffect(() => {
    setIsFilter(false);
  }, []);

  const handleSearch = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    setSearchTerm(event.target.value);
    const filteredRows = rows.filter((row) => {
      const userId = row.userId?.toLowerCase().includes(searchTerm);
      const firstname = row.firstname?.toLowerCase().includes(searchTerm);
      const privilege = row.privilege?.toLowerCase().includes(searchTerm);
      const officeId = row.officeId?.toLowerCase().includes(searchTerm);
      const officeName = row.officeName?.toLowerCase().includes(searchTerm);
      const location = row.location?.toLowerCase().includes(searchTerm);
      return userId || firstname || privilege || officeId || officeName || location;
    });

    setIsFilter(true);
    setFilteredRows(filteredRows);
  };

  const handleOpen = () => setOpen(true);
  const handleEditOpen = () => setEditOpen(true);

  const handleDelete = async () => {
    const len = selectedRows.length;
    try {
      const requests = selectedRows.map(async (eachData) => {
        try {
          const response = await fetch(`/api/office`, {
            method: "DELETE",
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
      });

      const responses = await Promise.all(requests);

      let toastShown = false;

      responses.forEach((responsedata, index) => {
        if (responsedata) {
          if (selectedRows.length > 1 && !toastShown && index === responses.length - 1) {
            toast.success("Selected Offices Deleted Successfully");
            toastShown = true;
          } else if (selectedRows.length === 1) {
            toast.success("Deleted Successfully");
          }
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleActivateAll = async (selectedRowsData) => {
    const len = selectedRowsData.length;
    try {
      const requests = selectedRowsData.map(async (eachData) => {
        try {
          const response = await fetch(`/api/activateUser`, {
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
      });

      const responses = await Promise.all(requests);

      let toastShown = false;

      responses.forEach((responsedata, index) => {
        if (responsedata) {
          if (selectedRowsData.length > 1 && !toastShown && index === responses.length - 1) {
            toast.success(responsedata);
            toastShown = true;
          } else if (selectedRowsData.length === 1) {
            if (selectedRowsData[0].status === "active") {
              toast.success("Deactivate Successfully");
            } else if (selectedRowsData[0].status === "inactive") {
              toast.success("Activate Successfully");
            }
          }
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const ur = `/api/user/new/staff/${selectedRows[0]._id}`;
        const response = await fetch(ur);

        if (response.ok) {
          const responseData = await response.text();
          setUserData(responseData);
          toast.success("Approved Successfully");
        } else {
          console.error("Error fetching data:", response.statusText);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };
    if (selectedRows.length) {
      fetchStaff();
    }
  }, [selectedRows]);

  const handleClose = () => setOpen(false);
  const handleEditClose = () => setEditOpen(false);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
      handleEditClose();
    }
  };

  const handleSendAccount = () => {
    router.push("/admin/send-password");
  };

  return (
    <div className="rounded-lg border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 col-span-12 transition-all duration-300">
      <div className="flex-grow"></div>
      <div className="flex w-full justify-between items-center mb-4">
        <div className="flex w-1/3">
          <input
            type="text"
            placeholder="Search here ..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full hidden sm:block px-4 py-2 rounded-md border border-stroke bg-gray text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary transition-all duration-300 focus:ring-2 focus:ring-primary/50"
          />
        </div>

        <div className="flex gap-4 flex-inline items-center rounded-md p-1.5">
          {selectedRows[0]?.status === "active" && (
            <button
              onClick={() => handleActivateAll(selectedRows)}
              className="rounded-lg justify-center bg-gray hover:bg-meta-1 py-2 px-6 font-medium text-black dark:bg-meta-4 dark:text-white hover:text-white hover:bg-opacity-95 dark:hover:border-meta-1 dark:hover:bg-meta-1 transition-all duration-300 hover:shadow-md"
            >
              Deactivate
            </button>
          )}

          {selectedRows[0]?.status === "inactive" && (
            <button
              onClick={() => handleActivateAll(selectedRows)}
              className="rounded-lg justify-center bg-gray hover:bg-meta-3 py-2 px-6 font-medium text-black dark:bg-meta-4 dark:text-white hover:text-white hover:bg-opacity-95 dark:hover:border-meta-3 dark:hover:bg-meta-3 transition-all duration-300 hover:shadow-md"
            >
              Activate
            </button>
          )}

          <button
            onClick={handleOpen}
            className="rounded-lg justify-center bg-primary py-2 px-6 font-medium text-white hover:bg-opacity-95 transition-all duration-300 hover:shadow-md"
          >
            Register
          </button>

          {/* Staff or Office Admin selected -> show Edit + Send Account */}
          {selectedRows[0] && (
            <>
              {pathname === "/admin/staff" && (
                <button
                  onClick={handleEditOpen}
                  className="rounded-lg justify-center bg-primary py-2 px-6 font-medium text-white hover:bg-opacity-95 transition-all duration-300 hover:shadow-md"
                >
                  Edit
                </button>
              )}

              <button
                onClick={handleSendAccount}
                className="rounded-lg justify-center bg-meta-3 py-2 px-6 font-medium text-white hover:bg-opacity-95 transition-all duration-300 hover:shadow-md"
              >
                Send Account
              </button>
            </>
          )}

          {pathname === "/admin/offices" && selectedRows[0] && (
            <button
              onClick={handleDelete}
              className="rounded-lg justify-center bg-gray hover:bg-meta-1 py-2 px-6 font-medium text-black dark:bg-meta-4 dark:text-white hover:text-white hover:bg-opacity-95 dark:hover:border-meta-1 dark:hover:bg-meta-1 transition-all duration-300 hover:shadow-md"
            >
              Delete
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap transition-all duration-300">
        <div className="flex w-full flex-wrap gap-3 sm:gap-5">
          <Table
            columns={columns}
            rows={isFilter ? filteredRows : rows}
            setSelectedRows={setSelectedRows}
          />
        </div>
      </div>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{
          '& .MuiBackdrop-root': {
            backdropFilter: 'blur(4px)',
            transition: 'all 0.3s ease',
          }
        }}
      >
        <div
          onClick={handleOverlayClick}
          className="absolute top-0 left-0 z-999999 flex h-full min-h-screen w-full items-center justify-center bg-gray/10 dark:bg-black/90 px-4 py-5"
        >
          <Box
            sx={{
              animation: `${modalEntrance} 0.3s ease-out`,
              transition: 'all 0.3s ease',
            }}
          >
            <OpenedModal onCancel={handleClose} />
          </Box>
        </div>
      </Modal>

      {editOpen && (
        <Modal
          open={editOpen}
          onClose={handleEditClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          sx={{
            '& .MuiBackdrop-root': {
              backdropFilter: 'blur(4px)',
              transition: 'all 0.3s ease',
            }
          }}
        >
          <div
            onClick={handleOverlayClick}
            className="absolute top-0 left-0 z-999999 flex h-full min-h-screen w-full items-center justify-center bg-gray/10 dark:bg-black/90 px-4 py-5"
          >
            <Box
              sx={{
                animation: `${modalEntrance} 0.3s ease-out`,
                transition: 'all 0.3s ease',
              }}
            >
              <EditStaff userData={selectedRows} onCancel={handleEditClose} />
            </Box>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AdminContainer;
