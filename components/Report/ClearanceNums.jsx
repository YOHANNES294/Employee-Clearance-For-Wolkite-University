import React from "react";

const ClearanceNums = ({ onProcessTotal, rejectedTotal, approvedNum }) => {
  return (
    <div>
      <div class="col-span-12 rounded-sm border border-stroke bg-salmon p-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
        <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 xl:gap-0">
          <div class="flex items-center justify-center gap-2 border-b border-stroke pb-5 dark:border-strokedark xl:border-b-0 xl:border-r xl:pb-0">
            <div>
              <h4 class="mb-0.5 text-xl font-semibold text-black dark:text-white md:text-title-lg">
                {onProcessTotal}
              </h4>
              <p class="text-sm font-medium">Total clearances On Process</p>
            </div>
          </div>
          <div class="flex items-center justify-center gap-2 border-b border-stroke pb-5 dark:border-strokedark xl:border-b-0 xl:border-r xl:pb-0">
            <div>
              <h4 class="mb-0.5 text-xl font-semibold text-black dark:text-white md:text-title-lg">
                {approvedNum}
              </h4>
              <p class="text-sm font-medium">Approved Clearances</p>
            </div>
          </div>
          <div class="flex items-center justify-center gap-2 border-b border-stroke pb-5 dark:border-strokedark sm:border-b-0 sm:pb-0 ">
            <div>
              <h4 class="mb-0.5 text-xl font-semibold text-black dark:text-white md:text-title-lg">
                {rejectedTotal}
              </h4>
              <p class="text-sm font-medium">
                Total currently rejected Clearances
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClearanceNums;
