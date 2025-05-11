"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const options = {
  chart: {
    type: "donut",
  },
  colors: ["#f39c12", "#52be80", "#259AE6", "#FFA70B"],
  labels: ["Total Requesters", "Total Approvers"],
  legend: {
    show: true,
    position: "bottom",
  },
  plotOptions: {
    pie: {
      donut: {
        size: "65%",
        background: "transparent",
      },
    },
  },
  dataLabels: {
    enabled: false,
  },
  responsive: [
    {
      breakpoint: 2600,
      options: {
        chart: {
          width: 380,
        },
      },
    },
    {
      breakpoint: 640,
      options: {
        chart: {
          width: 200,
        },
      },
    },
  ],
};

const ChartThree = ({ totalRequester, totalApprovers }) => {
  const [series, setSeries] = useState([totalRequester, totalApprovers]);
  const ratio = totalRequester / totalApprovers;
  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
      <div className="mb-3 justify-between gap-4 sm:flex">
        <div>
          <h5 className="text-xl font-semibold text-salmon dark:text-white">
            Approver - Requester Ratio
          </h5>
        </div>
      </div>
      <div className="flex flex-row">
        <div className="mb-2">
          <div id="chartThree" className="mx-auto flex justify-center">
            <ReactApexChart
              options={options}
              series={series}
              type="donut"
              height={350}
              width="100%"
            />
          </div>
        </div>
        <div className="flex items-center justify-center gap-y-3">
          <div className="w-full px-8 py-8 bg-gray">
            <div className="flex w-full items-center">
              <p className="flex w-full justify-between font-bold text-lg text-salmon dark:text-white">
                <span>Total Approver</span> / <span>Total Requester</span> ={" "}
                {totalApprovers} / {totalRequester} = {ratio.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartThree;