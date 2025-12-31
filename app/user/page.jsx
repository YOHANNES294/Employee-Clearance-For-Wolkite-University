"use client";
import Announcement from "@/components/User/Announcement";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import KeyboardArrowRightOutlinedIcon from "@mui/icons-material/KeyboardArrowRightOutlined";
import ReplyAllOutlinedIcon from "@mui/icons-material/ReplyAllOutlined";
import { motion } from "framer-motion";

const clearanceInstructions = [
  "Return all borrowed university items.",
  "Clear any unpaid fees.",
  "Submit university-issued equipment.",
  "Complete the online clearance form.",
];

export default function Home() {
  const session = useSession();
  const router = useRouter();
  const firstName = session?.data?.user.firstname;

  return (
    <div className="bg-gray sm:px-6 px-2 pb-6 dark:bg-black dark:border-black">
      {/* Welcome Section */}
      <div className="pt-4 pb-2 px-4 gap-4 flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-2 py-4 px-6 lg:w-1/2 w-full bg-gray-2 dark:bg-boxdark flex flex-row gap-8 rounded-md"
        >
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <h2 className="text-salmon dark:text-bodydark1 font-extrabold font-satoshi text-2xl md:text-title-xl">
                Welcome, {firstName}!
              </h2>
              <h2 className="text-black dark:text-bodydark1 sm:text-base text-base">
                Streamline your clearance journey with us. Experience efficiency
                and ease like never before!
              </h2>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => router.push("/user/myclearance")}
              className="px-4 py-2 rounded-md bg-[#7752FE] text-base flex gap-2 text-white hover:bg-primary/80 max-w-fit"
            >
              Request Clearance <ArrowForwardIcon />
            </motion.button>
          </div>
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Image
              src={"/images/illustration/illustration-reports.png"}
              width={200}
              height={200}
              alt="Illustration"
            />
          </motion.div>
        </motion.div>

        {/* Clearance Preconditions */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-2 py-3 px-2 lg:w-1/2 w-full rounded-md border border-spacing-0.5 border-stroke bg-white dark:border-strokedark dark:bg-boxdark"
        >
          <div className="border-b border-stroke py-1 px-4 dark:border-strokedark">
            <h4 className="text-lg font-semibold text-black dark:text-white">
              Clearance Prerequisites
            </h4>
          </div>
          <div className="px-4 pt-4 pb-2 bg-gray space-y-2">
            {clearanceInstructions.map((instruction, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 * index }}
                className="flex gap-2 mb-1 text-primary dark:text-bodydark1 font-medium"
              >
                <KeyboardArrowRightOutlinedIcon /> <p>{instruction}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Clearance Process Steps */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="mt-4 mx-4 py-4 sm:px-6 px-2 bg-gray-2 dark:bg-boxdark rounded-md hidden md:block"
      >
        <h2 className="text-title-xl2 font-bold mb-4 text-primary dark:text-white font-satoshi">
          Overview of Clearance Process
        </h2>
        <div className="max-w-4xl mx-auto relative h-60">
          {[
            "Ensure you are free from any debt",
            "Request clearance in our unified platform",
            "Track your clearance status on realtime here.",
            "Download and print your clearance certificate.",
          ].map((text, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.2 }}
              className={`absolute bottom-${index * 7 + 0} left-[${index * 25}%] bg-salmon dark:bg-form-strokedark dark:hover:bg-form-strokedark/80 p-4 rounded-lg`}
              style={{
                width: "180px",
                left: `${index * 25}%`,
                bottom: `${index * 12 + 5}%`,
                border: "2px solid transparent",
                borderRadius: "8px",
                background: "none",
                backgroundImage:
                  "linear-gradient(to right, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8) 50%, rgba(119, 82, 254, 0.8))", // primary color with opacity 80%
                backgroundOrigin: "border-box",
                backgroundClip: "border-box",
              }}
            >
              <p className="text-center text-white">{text}</p>
              {index !== 3 && (
                <div className="absolute left-full bottom-5 transform translate-x-1/2 translate-y-1/2">
                  <ReplyAllOutlinedIcon
                    style={{ transform: "rotate(150deg)", color: "#000000" }}
                  />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Announcement Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="mt-4 mx-4 py-4 sm:px-6 px-2 bg-gray-2 dark:bg-boxdark rounded-md"
      >
        <h2 className="text-title-xl2 font-bold mb-4 text-primary dark:text-white font-satoshi">
          Announcements
        </h2>
        <Announcement />
      </motion.div>
    </div>
  );
}
