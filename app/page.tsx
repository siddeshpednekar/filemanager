"use client";

import { useState, useEffect, useContext } from "react";
import FileList from "../components/File/FileList";
import FolderList from "../components/folder/FolderList";
import { useUser } from "@clerk/nextjs";
import { ParentFolderIdContext } from "../context/ParentFolderIdContext";
import SearchBar from "../components/SearchBar";
import { collection, getDocs, getFirestore, query, where } from "firebase/firestore";
import { app } from "@/Config/firebaseConfig";
import { useRouter } from "next/navigation";

export default function Home() {
  const [folderList, setFolderList] = useState([]);
  const [fileList, setFileList] = useState([]);
  const router = useRouter();
  const { isSignedIn, user } = useUser();
  const session = user?.emailAddresses?.[0]?.emailAddress || null; // Access user's email address
  const db = getFirestore(app);
  const { parentFolderId, setParentFolderId } = useContext(ParentFolderIdContext);

  // Fetch folder list and file list on component mount
  useEffect(() => {
    if (isSignedIn) {
      setParentFolderId(0); // Default to root folder
      getFolderList();
      getFileList();
    } else {
      router.push("/login"); // Redirect to login if not signed in
    }
  }, [isSignedIn, setParentFolderId, router]);

  // Function to fetch folder list
  const getFolderList = async () => {
    if (!session) return;

    try {
      console.log("Fetching folders for:", session);
      const folderQuery = query(collection(db, "Folders"), where("createBy", "==", session));
      const querySnapshot = await getDocs(folderQuery);

      const folders = querySnapshot.docs.map((doc) => ({
        id: doc.id, // Include folder ID
        ...doc.data(),
      }));

      setFolderList(folders);
    } catch (error) {
      console.error("Error fetching folder list:", error);
    }
  };

  // Function to fetch file list
  const getFileList = async () => {
    if (!session) return;

    try {
      console.log("Fetching files for:", session);
      const fileQuery = query(
        collection(db, "files"),
        where("parentFolderId", "==", parentFolderId || 0), // Use parentFolderId or default to 0
        where("createdBy", "==", session)
      );

      const querySnapshot = await getDocs(fileQuery);

      const files = querySnapshot.docs.map((doc) => ({
        id: doc.id, // Include file ID
        ...doc.data(),
      }));

      setFileList(files);
    } catch (error) {
      console.error("Error fetching file list:", error);
    }
  };

  return (
    <div className="p-5">
      <SearchBar />
      <FolderList folderList={folderList} />
      <FileList fileList={fileList} />
    </div>
  );
}
