import OuterNav from "@/components/Header/OuterNav";
import SignIn from "@/components/auth/SignIn";
import RouteIcon from "@mui/icons-material/Route";
import AdsClickIcon from "@mui/icons-material/AdsClick";
import ElectricBoltIcon from "@mui/icons-material/ElectricBolt";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import StackedLineChartIcon from "@mui/icons-material/StackedLineChart";

export default function Home() {
  const features = [
    {
      icon: <RouteIcon className="text-meta-4" fontSize="large" />,
      label: "Clear Pathway",
    },
    {
      icon: <AdsClickIcon className="text-primary" fontSize="large" />,
      label: "Efficient",
    },
    {
      icon: <ElectricBoltIcon className="text-meta-1" fontSize="large" />,
      label: "Rapid Approval",
    },
    {
      icon: <AutoFixHighIcon className="text-warning" fontSize="large" />,
      label: "Seamless Experience",
    },
    {
      icon: <StackedLineChartIcon className="text-black" fontSize="large" />,
      label: "Transparent Tracking",
    },
  ];

  return (
    <main>
      <div className="flex flex-col bg-white h-screen overflow-y-auto">
        <div className="w-full">
          <OuterNav />
        </div>

        <div className="flex flex-col md:flex-row lg:px-24 md:px-12 md:py-12 px-4 py-8">
          {/* Left Content */}
          <div className="md:w-1/2 w-full">
            <div className="flex flex-col gap-8">
              <h1 className="text-3xl font-extrabold text-primary dark:text-white text-center md:text-left xl:text-title-xxl">
                Wolkite University Employee Clearance Management System
              </h1>
              <h1 className="text-3xl font-extrabold text-salmon dark:text-white text-center md:text-left xl:text-title-xxl">
                + Done Easy +
              </h1>

              <p className="text-base font-medium text-black hidden md:block">
                Use our all-in-one solution, enjoy a stress-free clearance
                process.
              </p>

              {/* Feature Icons Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mt-6">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center justify-center bg-white p-4 rounded-2xl shadow-md hover:shadow-xl border-b-4 border-gray-300 transform transition-transform duration-300 hover:scale-105 animate-fade-in"
                  >
                    <div className="flex items-center justify-center h-16 w-16 rounded-full bg-salmon bg-opacity-20">
                      {feature.icon}
                    </div>
                    <p className="mt-3 text-center text-sm font-semibold text-gray-800 dark:text-white">
                      {feature.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side Sign In */}
          <div className="lg:mx-16 mx-4 md:my-4 mt-12 md:mt-0">
            <SignIn />
          </div>
        </div>
      </div>
    </main>
  );
}
