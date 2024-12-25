"use client";

import localFont from "next/font/local";
import SideNavBar from "../components/SideNavBar";
import Storage from "../components/Storage/Storage";
import Toast from "../components/Toast";
import CreateFolderModal from "../components/folder/CreateFolderModal";
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { ShowToastContext } from "../context/ShowToastContext";
import { ParentFolderIdContext } from "../context/ParentFolderIdContext";
import { useState } from "react";
import { usePathname } from "next/navigation"; // For checking the current route

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [showToastMsg, setShowToastMsg] = useState<string | undefined>();
  const [parentFolderId, setParentFolderId] = useState<string | undefined>();
  const pathname = usePathname();

  // Define paths where layout should not be displayed
  const noLayoutPaths = ["/login", "/signup"]; // Add paths as needed

  // Check if current path matches one of the no-layout paths
  const isNoLayout = noLayoutPaths.includes(pathname);

  if (isNoLayout) {
    return (
      <ClerkProvider>
        <div className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          {children}
        </div>
      </ClerkProvider>
    );
  }

  return (
    <ClerkProvider>
      <ParentFolderIdContext.Provider value={{ parentFolderId, setParentFolderId }}>
        <ShowToastContext.Provider value={{ showToastMsg, setShowToastMsg }}>
          <div className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
            <div className="flex">
              <SideNavBar />
              <div className="grid grid-cols-1 md:grid-cols-3 w-full">
                <div className="col-span-2">{children}</div>
                <div className="bg-white p-5 order-first md:order-last">
                  <Storage />
                </div>
              </div>
              {/* Uncomment CreateFolderModal when needed */}
              {/* <CreateFolderModal /> */}
            </div>
            {showToastMsg ? <Toast msg={showToastMsg} /> : null}
          </div>
        </ShowToastContext.Provider>
      </ParentFolderIdContext.Provider>
    </ClerkProvider>
  );
}
