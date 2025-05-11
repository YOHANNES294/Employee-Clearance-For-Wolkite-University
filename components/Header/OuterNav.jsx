import Image from "next/image";
import Link from "next/link";

const OuterNav = () => {
  return (
    <nav className="bg-salmon p-4 lg:pl-12 lg:pr-28 pr-8 w-full items-center">
      {/* Logo on the left */}
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <Image
            src="/images/logo/logo.png"
            alt="Logo"
            width={60}
            height={40}
          />
          <h2 className="pl-4 sm:text-xl text-lg sm:font-extrabold font-bold font-satoshi text-primary dark:text-bodydark1 ">
            WKU-ECMS
          </h2>
        </div>

        {/* Links on the right */}
        <div className="">
          <div className="flex gap-10 items-center">
            <Link
              href="/signIn"
              className="rounded-lg justify-center bg-primary  sm:py-2 sm:px-6 py-1 px-3 font-medium text-white hover:bg-opacity-95"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default OuterNav;
