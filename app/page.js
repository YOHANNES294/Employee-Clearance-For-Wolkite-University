import OuterNav from "@/components/Header/OuterNav";
import SignIn from "@/components/auth/SignIn";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

import RouteIcon from "@mui/icons-material/Route";
import AdsClickIcon from "@mui/icons-material/AdsClick";
import ElectricBoltIcon from "@mui/icons-material/ElectricBolt";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import StackedLineChartIcon from "@mui/icons-material/StackedLineChart";

export default async function Home() {
  const session = await getServerSession(authOptions);
  if (session) {
    const role = session?.user?.role;
    if (role == "ADMIN") {
      redirect("/admin");
    } else if (role == "STAFF") {
      redirect("/user");
    }
  }

  return (
    <main>
      <div className="flex flex-col bg-black h-screen">
        <div className="flex w-full">
          <OuterNav />
        </div>

        <div className="flex flex-col bg-white dark:bg-black">
          <div className="flex md:flex-row flex-col sm:px-18 px-6 sm:py-6 py-4 md:gap-0 gap-10">
            <div className="flex flex-col lg:items-start py-6 items-center md:w-1/2">
              <h1 className="md:text-left text-center text-3xl font-extrabold text-primary/90 dark:text-white xl:text-title-xxl">
                Experience a hassle-free clearance process with our centralized solution.
              </h1>

              <h1 className="md:text-center text-center text-6xl font-extrabold text-salmon/90 dark:text-white xxl:text-title-xxl">
                + Done Easy +
              </h1>

              <div className="mt-4 hidden md:block">
                <ul className="flex flex-wrap gap-12 p-4 rounded-lg bg-gradient-to-r from-gray-700 via-gray-500 to-gray-300">
                  <li className="group relative">
                    <div className="flex h-16 w-16 cursor-pointer items-center justify-center rounded-full bg-white shadow-lg border-4 border-gray-500 group-hover:scale-110 transition-all duration-300 ease-in-out transform hover:shadow-[0_4px_20px_rgba(0,0,0,0.1)]">
                      <RouteIcon className="text-meta-4" fontSize="large" />
                    </div>
                    <span className="absolute -top-16 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 group-hover:translate-y-4 transition-all duration-300 bg-gradient-to-r from-pink-400 via-red-500 to-orange-600 text-white rounded-md px-4 py-2 shadow-xl text-sm group-hover:text-primary">
                      Clear Pathway
                      <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 rotate-45 w-2 h-2 bg-white"></span>
                    </span>
                  </li>

                  <li className="group relative">
                    <div className="flex h-16 w-16 cursor-pointer items-center justify-center rounded-full bg-white shadow-lg border-4 border-gray-500 group-hover:scale-110 transition-all duration-300 ease-in-out transform hover:shadow-[0_4px_20px_rgba(0,0,0,0.1)]">
                      <AdsClickIcon fontSize="large" className="text-primary" />
                    </div>
                    <span className="absolute -top-16 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 group-hover:translate-y-4 transition-all duration-300 bg-gradient-to-r from-teal-500 to-cyan-600 text-white rounded-md px-4 py-2 shadow-xl text-sm group-hover:text-primary">
                      Efficient
                      <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 rotate-45 w-2 h-2 bg-white"></span>
                    </span>
                  </li>

                  <li className="group relative">
                    <div className="flex h-16 w-16 cursor-pointer items-center justify-center rounded-full bg-white shadow-lg border-4 border-gray-500 group-hover:scale-110 transition-all duration-300 ease-in-out transform hover:shadow-[0_4px_20px_rgba(0,0,0,0.1)]">
                      <ElectricBoltIcon className="text-meta-1" fontSize="large" />
                    </div>
                    <span className="absolute -top-16 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 group-hover:translate-y-4 transition-all duration-300 bg-gradient-to-r from-yellow-300 to-yellow-500 text-white rounded-md px-4 py-2 shadow-xl text-sm group-hover:text-primary">
                      Rapid Approval
                      <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 rotate-45 w-2 h-2 bg-white"></span>
                    </span>
                  </li>

                  <li className="group relative">
                    <div className="flex h-16 w-16 cursor-pointer items-center justify-center rounded-full bg-white shadow-lg border-4 border-gray-500 group-hover:scale-110 transition-all duration-300 ease-in-out transform hover:shadow-[0_4px_20px_rgba(0,0,0,0.1)]">
                      <AutoFixHighIcon className="text-warning" fontSize="large" />
                    </div>
                    <span className="absolute -top-16 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 group-hover:translate-y-4 transition-all duration-300 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-md px-4 py-2 shadow-xl text-sm group-hover:text-primary">
                      Seamless Experience
                      <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 rotate-45 w-2 h-2 bg-white"></span>
                    </span>
                  </li>

                  <li className="group relative">
                    <div className="flex h-16 w-16 cursor-pointer items-center justify-center rounded-full bg-white shadow-lg border-4 border-gray-500 group-hover:scale-110 transition-all duration-300 ease-in-out transform hover:shadow-[0_4px_20px_rgba(0,0,0,0.1)]">
                      <StackedLineChartIcon className="text-black" fontSize="large" />
                    </div>
                    <span className="absolute -top-16 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 group-hover:translate-y-4 transition-all duration-300 bg-gradient-to-r from-green-500 to-lime-500 text-white rounded-md px-4 py-2 shadow-xl text-sm group-hover:text-primary">
                      Transparent Tracking
                      <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 rotate-45 w-2 h-2 bg-white"></span>
                    </span>
                  </li>
                </ul>
              </div>

              <div className="md:mt-12 lg:mt-14 mt-8">
                <Link
                  href="/signIn"
                  className="text-primary dark:text-white text-base font-bold sm:py-3 sm:px-8 py-2 px-4 transition-all border border-primary rounded-full hover:bg-primary/90 hover:text-white"
                >
                  Get Start Now
                </Link>
              </div>
            </div>

            <div className="md:w-1/2 md:ml-24">
              <Image
                width={600}
                height={300}
                src={"/images/logo/pchand1.png"}
                alt="Illustration of a person holding a digital clearance certificate"
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
