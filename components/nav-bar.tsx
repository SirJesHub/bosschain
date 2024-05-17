import { SignInButton, UserButton, useAuth, useUser } from "@clerk/nextjs";
import Link from "next/link";

//   <Link
//   href="/"
//   className="flex items-center space-x-3 rtl:space-x-reverse h-full"
// >
//   <img
//     src={process.env.NEXT_PUBLIC_COURSE_ASSETS_BASE_URL +
//       "BossChainFinal.png"}
//     alt="BossChain Logo"
//     width={80} // Adjust the width as needed
//     height={80} // Adjust the height as needed
//     className="self-center"
//   />
//   </Link>

export default function NavBar() {
  return (
    <>
      <nav className="bg-gradient-to-r from-black to-blue-700 border-b-2 border-gray-400 p-4 border-grey-700 fixed top-0 z-50 w-full block">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto">
          <Link
            href="/"
            className="flex items-center space-x-3 rtl:space-x-reverse"
          >
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white text-white">
              BossChain
            </span>
          </Link>

          <div className="pl-40 items-center md:order-3 space-x-0 md:space-x-5 rtl:space-x-reverse">
            <Link
              href="/teacher/courses"
              className="text-white py-2 px-3 bg-blue-700 md:hover:text-blue-500 md:bg-transparent md:text-white md:p-5 md:dark:text-blue-500"
              aria-current="page"
            >
              Teacher Mode
            </Link>
          </div>
          <div className="pr-35 items-center md:order-4 space-x-0 md:space-x-5 rtl:space-x-reverse">
            {/* Fixed width container for UserButton */}
            <div style={{ height: "30px", width: "100px" }}>
              {" "}
              {/* Adjust the width as needed */}
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
          <div
            className="pl-40 items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
            id="navbar-user"
          >
            <ul className="flex flex-col font-salsa border-gray-100 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0">
              <li>
                <Link
                  href="/"
                  className="hover:scale-y-300 before:w-full text-white py-2 px-3 bg-blue-700 md:bg-transparent md:hover:text-blue-500 md:text-white md:p-5 md:dark:text-blue-500"
                  aria-current="page"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/browse"
                  className="text-white font-salsa relative hover:text-blue-500 md:p-5 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                >
                  Browse
                  <div className="absolute inset-x-0 bottom-0 h-5 transform origin-bottom scale-y-0 transition-transform duration-300 hover:scale-y-100 md:hover:text-blue-500" />
                </Link>
              </li>
              <li>
                <Link
                  href="/userdashboard"
                  className="py-2 px-3 text-white font-salsa md:p-5 dark:text-white md:hover:text-blue-500 md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/news"
                  className="py-2 px-3 text-white font-salsa md:p-5 dark:text-white md:hover:text-blue-500 md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                >
                  News
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}
