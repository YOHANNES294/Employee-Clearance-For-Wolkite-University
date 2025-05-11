import React, { useState } from "react";

const faq = [
  {
    q: "What is a clearance in Wolkite University?",
    ans: "A clearance in Wolkite University is a formal process that ensures an employee has settled all obligations, returned university property, and completed required procedures before leaving or transitioning.",
  },
  {
    q: "Who needs to apply for clearance?",
    ans: "All departing employees, including academic and administrative staff, need to apply for clearance before leaving the university.",
  },
  {
    q: "What documents are required for clearance?",
    ans: "The specific documents required may vary depending on your status, but for employees, they typically include clearance forms from HR, finance, and the library, proof of returned university property, and any settlement of outstanding dues.",
  },
  {
    q: "How do I apply for clearance?",
    ans: "You can apply for clearance through the clearance management system. Simply log in with your credentials and follow the instructions to submit your clearance application by going to the clearance requesting page.",
  },
  {
    q: "How long does it take to process a clearance application?",
    ans: "The processing time for a clearance application varies depending on factors such as the completeness of the submitted documents and the workload of the clearance officers. However, we strive to process applications as quickly as possible.",
  },
  {
    q: "Can I track the status of my clearance application?",
    ans: "Yes, you can track the status of your clearance application through the clearance management system. Once logged in, you will be able to see where your application is in the approval process inside my clearance page.",
  },
  {
    q: "What should I do if my clearance application is rejected?",
    ans: "If your clearance application is rejected, you will receive notification specifying the reason for the rejection. You may need to take corrective actions as advised and reinitiate your application.",
  },
  {
    q: "Who approves clearance applications?",
    ans: "Clearance applications are typically reviewed and approved by designated clearance officers within Wolkite University. These officers may include HR personnel, finance staff, and other relevant administrative officers.",
  },
  {
    q: "What happens after my clearance application is approved?",
    ans: "After your clearance application is approved, you will receive confirmation, and you will be considered cleared to leave the university. You may also receive a clearance certificate as proof of your clearance status.",
  },
];

const Faq = () => {
  const [accordionOpen, setAccordionOpen] = useState(
    Array(faq.length).fill(false)
  );

  const handleAccordionClick = (index) => {
    const newAccordionState = [...accordionOpen];
    newAccordionState[index] = !newAccordionState[index];
    setAccordionOpen(newAccordionState);
  };

  return (
    <div class="rounded-md border border-stroke bg-white px-5  py-10 shadow-default dark:border-strokedark dark:bg-boxdark ">
      <div className=" grid grid-cols-1 gap-4 md:gap-6 xl:grid-cols-2 ">
        {faq.map((f, index) => (
          <div className="flex flex-col gap-6" key={index}>
            <div
              onClick={() => handleAccordionClick(index)}
              className={` py-3 px-4 shadow  shadow-stroke rounded-md border border-stroke shadow-9 dark:border-strokedark dark:bg-boxdark dark:shadow-none  ${
                accordionOpen[index] ? "bg-gray-2" : ""
              }`}
            >
              <button className="flex w-full items-center gap-1.5 sm:gap-3 xl:gap-6">
                <div
                  className={`flex h-10.5 w-10.5 items-center justify-center rounded-md bg-[#F3F5FC] dark:bg-meta-4 ${
                    accordionOpen[index] ? "rotate-180" : ""
                  }`}
                >
                  <svg
                    className="duration-200 ease-in-out fill-primary stroke-primary dark:fill-white dark:stroke-white"
                    width="18"
                    height="10"
                    viewBox="0 0 18 10"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8.28882 8.43257L8.28874 8.43265L8.29692 8.43985C8.62771 8.73124 9.02659 8.86001 9.41667 8.86001C9.83287 8.86001 10.2257 8.69083 10.5364 8.41713L10.5365 8.41721L10.5438 8.41052L16.765 2.70784L16.771 2.70231L16.7769 2.69659C17.1001 2.38028 17.2005 1.80579 16.8001 1.41393C16.4822 1.1028 15.9186 1.00854 15.5268 1.38489L9.41667 7.00806L3.3019 1.38063L3.29346 1.37286L3.28467 1.36548C2.93287 1.07036 2.38665 1.06804 2.03324 1.41393L2.0195 1.42738L2.00683 1.44184C1.69882 1.79355 1.69773 2.34549 2.05646 2.69659L2.06195 2.70196L2.0676 2.70717L8.28882 8.43257Z"
                      fill=""
                      stroke=""
                    ></path>
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-lg text-left font-satoshi  text-black dark:text-white">
                    {f.q}
                  </h4>
                </div>
              </button>

              {accordionOpen[index] && (
                <div className="  mt-5 ml-16.5 duration-200 ease-in-out ">
                  <p className="font-satoshi text-body text-justify text-lg dark:text-bodydark1 leading-8">
                    {f.ans}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Faq;
