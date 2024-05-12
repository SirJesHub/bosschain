import { SignInButton, UserButton, useAuth, useUser } from "@clerk/nextjs";
import Link from "next/link";

export default function NavBar() {
  return (
    <>
      <nav className="bg-navigation-bar border-gray-200 dark:bg-gray-900 fixed top-0 z-10 w-full">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-3">
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
              className="text-white py-2 px-3 bg-blue-700 md:hover:bg-orange-300 md:bg-transparent md:text-white md:p-5 md:dark:text-blue-500"
              aria-current="page"
            >
              Teacher Mode
            </Link>
          </div>
          <div className="pr-35 items-center md:order-4 space-x-0 md:space-x-5 rtl:space-x-reverse">
            <UserButton afterSignOutUrl="/" />
          </div>
          <div
            className="pl-40 items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
            id="navbar-user"
          >
            <ul className="flex flex-col font-salsa border-gray-100 bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-navigation-bar dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
              <li>
                <Link
                  href="/"
                  className="hover:scale-y-300 before:w-full text-white py-2 px-3 bg-blue-700 md:hover:bg-orange-300 md:bg-transparent md:text-white md:p-5 md:dark:text-blue-500"
                  aria-current="page"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/browse"
                  className="text-white font-salsa relative hover:bg-gray-100 md:hover:bg-orange-300 md:p-5 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                >
                  Explore Crypto World
                  <div className="absolute inset-x-0 bottom-0 h-5 bg-orange-300 transform origin-bottom scale-y-0 transition-transform duration-300 hover:scale-y-100" />
                </Link>
              </li>
              <li>
                <Link
                  href="/userdashboard"
                  className="py-2 px-3 text-white font-salsa hover:bg-gray-100 md:hover:bg-orange-300 md:p-5 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/news"
                  className="py-2 px-3 text-white font-salsa hover:bg-gray-100 md:hover:bg-orange-300 md:p-5 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
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
