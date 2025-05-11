import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SidebarLinkGroup from "./SidebarLinkGroup";
import Image from "next/image";
import { useSession } from "next-auth/react";

// Admin Icons
import DashboardIcon from "@mui/icons-material/Dashboard";
import Groups2Icon from "@mui/icons-material/Groups2";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import StairsIcon from "@mui/icons-material/Stairs";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import BarChartIcon from "@mui/icons-material/BarChart";
import CampaignIcon from "@mui/icons-material/Campaign";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1"; // New icon

// User Icons
import CreditScoreIcon from "@mui/icons-material/CreditScore";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import HelpCenterIcon from "@mui/icons-material/HelpCenter";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import HomeIcon from "@mui/icons-material/Home";

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const { data: session } = useSession();
  const pathname = usePathname();

  const trigger = useRef(null);
  const sidebar = useRef(null);

  let storedSidebarExpanded = "true";
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === "true"
  );

  // Close sidebar when clicking outside
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!sidebar.current || !trigger.current) return;
      if (!sidebarOpen || sidebar.current.contains(target) || trigger.current.contains(target))
        return;
      setSidebarOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  // Close sidebar on ESC key
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  // Store sidebar state
  useEffect(() => {
    localStorage.setItem("sidebar-expanded", sidebarExpanded.toString());
    if (sidebarExpanded) {
      document.querySelector("body")?.classList.add("sidebar-expanded");
    } else {
      document.querySelector("body")?.classList.remove("sidebar-expanded");
    }
  }, [sidebarExpanded]);

  // Admin sidebar links
  const adminLinks = [
    { href: "/admin", icon: <DashboardIcon fontSize="large" />, text: "Dashboard", pathCheck: "/admin" },
    { 
      href: "/admin/manageAdmins", 
      icon: <AdminPanelSettingsIcon fontSize="large" />, 
      text: "Admins", 
      pathCheck: "manageAdmins" 
    },
    { 
      href: "/admin/staff", 
      icon: <Groups2Icon fontSize="large" />, 
      text: "Staffs", 
      pathCheck: "staff" 
    },
    { 
      href: "/admin/offices", 
      icon: <HomeWorkIcon fontSize="large" />, 
      text: "Offices", 
      pathCheck: "offices" 
    },
   
    
    { 
      href: "/admin/manageOffices", 
      icon: <StairsIcon fontSize="large" />, 
      text: "Steps", 
      pathCheck: "manageOffices" 
      
    },
    { 
      href: "/admin/employeeregister", 
      icon: <HowToRegIcon fontSize="large" />, 
      text: "Employee Register", 
      pathCheck: "employeeregister" 
    },
    { 
      href: "/admin/report", 
      icon: <BarChartIcon fontSize="large" />, 
      text: "Reports", 
      pathCheck: "report" 
    },
    { 
      href: "/admin/announcement", 
      icon: <CampaignIcon fontSize="large" />, 
      text: "Announcements", 
      pathCheck: "announcement" 
    },
    { 
      href: "/admin/accountreq", 
      icon: <PersonAddAlt1Icon fontSize="large" />, 
      text: "Account Request", 
      pathCheck: "accountreq" 
    },
    
  ];

  // User sidebar links
  const userLinks = [
    { href: "/user", icon: <HomeIcon fontSize="small" />, text: "Home", pathCheck: "/user" },
    { 
      href: "/user/myclearance", 
      icon: <CreditScoreIcon fontSize="small" />, 
      text: "My Clearance", 
      pathCheck: "myclearance" 
    },
    { 
      href: "/user/help", 
      icon: <HelpCenterIcon fontSize="small" />, 
      text: "Help", 
      pathCheck: "help" 
    }
  ];

  // Conditional user links for privileged users
  const privilegedUserLinks = [
    { 
      href: "/user/staffApproval", 
      icon: <Groups2Icon fontSize="small" />, 
      text: "Staff Approval", 
      pathCheck: "staffApproval" 
    },
    { 
      href: "/user/approvedUsers", 
      icon: <FactCheckIcon fontSize="small" />, 
      text: "Approved Requests", 
      pathCheck: "approvedUsers" 
    }
  ];

  return (
    <aside
      ref={sidebar}
      className={`absolute left-0 top-0 z-10 flex h-screen w-64 flex-col overflow-y-hidden bg-white drop-shadow-2 duration-300 ease-linear dark:bg-boxdark dark:drop-shadow-none lg:static lg:translate-x-0 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } ${
        pathname.includes("/user") && !session?.user?.privilege
          ? "lg:hidden "
          : ""
          
      }`}
      
    >
      {/* SIDEBAR HEADER */}
      <div className="flex items-center justify-between gap-2 px-6 lg:pt-4">
        <Link href="" className="flex flex-row items-center gap-3">
          <Image
            width={52}
            height={52}
            src={"/images/logo/logo.png"}
            alt="Logo"
          />
          <h5 className="text-title-md font-satoshi font-extrabold text-primary">
            WKU-ECMS!
          </h5>
        </Link>

        <button
          ref={trigger}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-controls="sidebar"
          aria-expanded={sidebarOpen}
          className="block lg:hidden"
        >
          <svg
            className="fill-current"
            width="20"
            height="18"
            viewBox="0 0 20 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z"
              fill=""
            />
          </svg>
        </button>
      </div>

      {/* USER SIDEBAR CONTENT */}
      {pathname.includes("/user") && (
        <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
          <nav className="mt-9 px-4 lg:mt-5">
            <div>
              <h3 className="mb-5 mt-5 ml-5 font-satoshi text-sm font-semibold text-primary dark:text-bodydark">
                MENU
               
              </h3>

              <ul className="mb-4 flex flex-col gap-0.5">
                {userLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`sidebar-link group relative flex items-center gap-2.5 rounded-md py-2 px-4 font-satoshi font-medium text-primary duration-300 ease-in-out hover:bg-gray dark:text-bodydark1 dark:hover:bg-meta-4 ${
                        pathname === link.href && "bg-gray dark:bg-meta-4"
                      }`}
                    >
                      {link.icon}
                      {link.text}
                    </Link>
                  </li>
                ))}

                <hr className="mx-4 mt-3 text-bodydark opacity-90 dark:text-bodydark" />

                {session?.user?.privilege && (
                  <>
                    <h3 className="mb-1 mt-4 ml-4 font-satoshi text-sm font-semibold text-primary dark:text-bodydark">
                      APPROVALS
                    </h3>

                    {privilegedUserLinks.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className={`sidebar-link group relative flex items-center gap-2.5 rounded-md py-2 px-4 font-satoshi font-medium text-primary duration-300 ease-in-out hover:bg-gray dark:text-bodydark1 dark:hover:bg-meta-4 ${
                            pathname.includes(link.pathCheck) &&
                            "bg-gray dark:bg-graydark dark:text-white"
                          }`}
                        >
                          {link.icon}
                          {link.text}
                        </Link>
                      </li>
                    ))}
                  </>
                )}

                <hr className="mx-4 mt-3 text-bodydark opacity-90 dark:text-bodydark" />
              </ul>
            </div>
          </nav>
        </div>
      )}

      {/* ADMIN SIDEBAR CONTENT */}
      {(pathname === "/admin" || pathname.includes("/admin")) && (
        <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
          <nav className="mt-2 px-4 lg:mt-5">
            <div>
              <h3 className="mb-1 mt-2 ml-4 font-satoshi text-sm font-semibold text-salmon dark:text-bodydark">
                MENU
              </h3>

              <ul className="mb-4 flex flex-col gap-0.5">
                {adminLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`sidebar-link group relative flex items-center gap-2.5 rounded-md py-2 px-4 font-satoshi font-medium text-primary duration-300 ease-in-out hover:bg-gray dark:text-bodydark1 dark:hover:bg-meta-4 ${
                        pathname.includes(link.pathCheck) && "bg-gray dark:bg-meta-4"
                      }`}
                    >
                      {link.icon}
                      {link.text}
                    </Link>
                  </li>
                ))}

                <hr className="mx-4 mt-1 text-bodydark opacity-90 dark:text-bodydark" />
              </ul>
            </div>
          </nav>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;