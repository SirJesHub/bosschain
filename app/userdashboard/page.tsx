import { SignInButton, UserButton, useAuth, useUser } from "@clerk/nextjs";
import Link from "next/link";
import NavBar from "@/components/nav-bar";

export default function UserDashboardPage() {
  return (
    <>
      <p className="text-3xl font-medium text-sky-700">User Dashboard Page</p>
    </>
  );
}
