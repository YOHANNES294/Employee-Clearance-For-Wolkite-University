"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import RegisterClearanceDuration from "@/components/Modals/RegisterClearanceDuration";
import Modal from "@mui/material/Modal";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const options = {
  legend: {
    show: false,
    position: "top",
    horizontalAlign: "left",
  },
  colors: ["#0040c9", "#27e627"],
  chart: {
    fontFamily: "Satoshi, sans-serif",
    height: 335,
    type: "area",
    dropShadow: {
      enabled: true,
      color: "#623CEA14",
      top: 10,
      blur: 4,
      left: 0,
      opacity: 0.1,
    },
    toolbar: {
      show: false,
    },
  },
  responsive: [
    {
      breakpoint: 1024,
      options: {
        chart: {
          height: 300,
        },
      },
    },
    {
      breakpoint: 1366,
      options: {
        chart: {
          height: 350,
        },
      },
    },
  ],
  stroke: {
    width: [2, 2],
    curve: "straight",
  },
  grid: {
    xaxis: {
      lines: {
        show: true,
      },
    },
    yaxis: {
      lines: {
        show: true,
      },
    },
  },
  dataLabels: {
    enabled: false,
  },
  markers: {
    size: 4,
    colors: "#27e627",
    strokeColors: ["#ffe400", "#e74c3c"],
    strokeWidth: 3,
    strokeOpacity: 0.9,
    strokeDashArray: 0,
    fillOpacity: 1,
    discrete: [],
    hover: {
      size: undefined,
      sizeOffset: 5,
    },
  },
  xaxis: {
    type: "category",
    categories: ["On Process", "Already Approved", "Currently Rejected"],
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  yaxis: {
    title: {
      style: {
        fontSize: "0px",
      },
    },
    min: 0,
    max: 5,
  },
};

const ChartOne = ({ adminStaffClearance, academicStaffClearance }) => {
  const [series, setSeries] = useState([]);

  useEffect(() => {
    const updateSeriesData = (clearanceData) => {
      const onProcessCount = clearanceData.filter(
        (item) =>
          !item.status.includes("APPROVED") && item.rejections.length === 0
      ).length;

      const approvedCount = clearanceData.filter((item) =>
        item.status.includes("APPROVED")
      ).length;

      const currentlyRejectedCount = clearanceData.filter(
        (item) => item.rejections.length > 0
      ).length;

      return [onProcessCount, approvedCount, currentlyRejectedCount];
    };

    const academicStaffSeriesData = updateSeriesData(academicStaffClearance);
    const adminStaffSeriesData = updateSeriesData(adminStaffClearance);

    setSeries([
      {
        name: "Academic Staff's Clearance",
        data: academicStaffSeriesData,
      },
      {
        name: "Admin Staff's Clearance",
        data: adminStaffSeriesData,
      },
    ]);
  }, [academicStaffClearance, adminStaffClearance]);

  const isWindowAvailable = () => typeof window !== "undefined";

  if (!isWindowAvailable()) return <></>;

  // for modal
  const [editOpen, setEditOpen] = useState(false);
  const handleEditOpen = () => {
    setEditOpen(true); // Assuming this state update is still needed
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
      handleEditClose();
    }
  };
  const handleEditClose = () => setEditOpen(false);
  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
      <div className="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap">
        <div className="flex justify-between w-full flex-wrap gap-3 sm:gap-5">
          <div className="flex min-w-47.5">
            <div className="w-full ">
              <p className="font-semibold text-lg text-primary">
                Clearance Status Overviews
              </p>
            </div>
          </div>
          <div className="w-10 flex justify-end  2xsm:w-1/2">
            <button
              onClick={handleEditOpen}
              className=" flex gap-2 rounded border border-stroke text-white p-3 text-center bg-salmon font-medium  transition hover:border-meta-5 hover:bg-meta-5 hover:text-white dark:border-strokedark dark:bg-meta-4 dark:text-white dark:hover:border-meta-5 dark:hover:bg-meta-5"
            >
              <CalendarTodayIcon className="" />
              <span>Manage clearance expiry date</span>
            </button>
          </div>
        </div>
      </div>

      <div>
        <div id="chartOne" className="-ml-5 h-[355px] w-[105%]">
          <ReactApexChart
            options={options}
            series={series}
            type="area"
            width="100%"
            height="100%"
          />
        </div>
      </div>

      <Modal
        open={editOpen}
        onClose={handleEditClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div
          onClick={handleOverlayClick}
          className="absolute top-0 left-0 z-999999 flex h-full min-h-screen w-full items-center justify-center bg-gray/10 dark:bg-black/90 px-4 py-5 "
        >
          <RegisterClearanceDuration onCancel={handleEditClose} />
        </div>
      </Modal>
    </div>
  );
};

export default ChartOne;