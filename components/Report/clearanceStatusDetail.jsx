import React from "react";

const ClearanceStatusDetail = ({ title, clearance }) => {
  // Counting logic
  const onProcessCount = clearance.filter(
    (item) => !item.status.includes("APPROVED") && item.rejections.length === 0
  ).length;

  const currentlyRejectedCount = clearance.filter(
    (item) => item.rejections.length > 0
  ).length;

  const approvedCount = clearance.filter((item) =>
    item.status.includes("APPROVED")
  ).length;

  return (
    <div className="mb-4 mt-4 rounded-sm border border-stroke bg-gray p-4 shadow-default dark:border-strokedark dark:bg-boxdark md:mb-6 md:p-6 xl:p-7.5 2xl:mb-7.5 md:mt-6 2xl:mt-7.5">
      <div className="mb-7 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-black dark:text-white">
            Status of {title} clearances
          </h3>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="grid grid-cols-12 py-2">
          <div className="col-span-8">
            <p className="text-base font-semibold">Status</p>
          </div>
          <div className="col-span-4">
            <p className="text-center text-base font-semibold">Count</p>
          </div>
        </div>

        <div className="relative z-1 grid grid-cols-12 py-2">
          <span className="absolute left-0 top-0 -z-1 h-full w-[74%] rounded bg-gray dark:bg-meta-4"></span>
          <div className="col-span-8 pl-3.5">
            <p className="text-sm">On Process clearance</p>
          </div>
          <div className="col-span-4">
            <p className="text-center text-sm">{onProcessCount}</p>
          </div>
        </div>
        <div className="relative z-1 grid grid-cols-12 py-2">
          <span className="absolute left-0 top-0 -z-1 h-full w-[74%] rounded bg-gray dark:bg-meta-4"></span>
          <div className="col-span-8 pl-3.5">
            <p className="text-sm">Currently Rejected</p>
          </div>
          <div className="col-span-4">
            <p className="text-center text-sm">{currentlyRejectedCount}</p>
          </div>
        </div>
        <div className="relative z-1 grid grid-cols-12 py-2">
          <span className="absolute left-0 top-0 -z-1 h-full w-[74%] rounded bg-gray dark:bg-meta-4"></span>
          <div className="col-span-8 pl-3.5">
            <p className="text-sm">Approved clearance</p>
          </div>
          <div className="col-span-4">
            <p className="text-center text-sm">{approvedCount}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClearanceStatusDetail;
