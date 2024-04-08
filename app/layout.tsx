import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import NavBar from "@/components/nav-bar";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import Layout from "@/components/layout/layout";
import { RoleContextProvider } from "@/context/roleContext";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <RoleContextProvider>
          <body className={inter.className}>
            <NavBar />
            <Toaster />
            {children}
          </body>
        </RoleContextProvider>
      </html>
    </ClerkProvider>
  );
}
