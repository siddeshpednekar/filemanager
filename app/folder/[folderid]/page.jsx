"use client";

import { useSearchParams } from "next/navigation";
import { useContext, useState, useEffect } from "react";
import SearchBar from '@/components/SearchBar';
import { useUser } from "@clerk/nextjs";
import { ParentFolderIdContext } from "../../../context/ParentFolderIdContext";
import { getFirestore } from "firebase/firestore";
import { app } from "@/Config/firebaseConfig";
import { collection, getDocs, query, where,deleteDoc,doc } from "firebase/firestore";
import { ShowToastContext } from "../../../context/ShowToastContext";
import FolderList from "@/components/folder/FolderList";
import axios from "axios";
import { useRouter } from "next/navigation";
import FileList from "@/components/File/FileList"; // Added missing import for FileList

function FolderDetails() {
  const {user} = useUser();
  const router=useRouter();
  const searchParams = useSearchParams();
  const { parentFolderId, setParentFolderId } = useContext(ParentFolderIdContext);
  const [folderList, setFolderList] = useState([]);
  const [fileList, setFileList] = useState([]); // Define fileList state

  const { showToastMsg,setShowToastMsg } = useContext(ShowToastContext); // Assuming this context is for showing toast messages

  // Access query parameters
  const name = searchParams.get("name");
  const id = searchParams.get("id");

  const db = getFirestore(app);

  // Fetch data when `id` is available
  useEffect(() => {
    if (id) {
      setParentFolderId(id);  // Set parent folder ID
      getFolderList();         // Fetch folders
      getFileList();           // Fetch files
    }
  }, [id, setParentFolderId,showToastMsg]); // Removed unnecessary dependency on `showToastMsg`
  const deleteFolder = async () => {
    try {
      // Step 1: Loop through each file and fetch its SHA
      for (let file of fileList) {
        const githubRepo = "siddeshpednekar/cloud-file-manager-storage";
        const encodedFilePath = `uploads/${file.name}`; // Encoding the file path
  
        const githubToken = process.env.NEXT_PUBLIC_GITHUB_TOKEN;
        // Fetch file details from GitHub to get the SHA
        let fileSha = file.sha;  // Assuming `file.sha` was initially passed correctly
  
        if (!fileSha) {
          // If `sha` is missing, we need to fetch it
          const response = await axios.get(
            `https://api.github.com/repos/${githubRepo}/contents/${encodedFilePath}`,
            {
              headers: {
                Authorization: `Bearer ${githubToken}`,
              },
            }
          );
  
          // Get the SHA from the response if it's not available locally
          fileSha = response.data.sha;
        }
        console.log(fileSha)
        // Ensure that fileSha is available
        if (!fileSha) {
          console.error(`SHA missing for file: ${file.name}`);
          continue;  // Skip deletion if SHA is missing
        }
  
        // Now delete the file
        await axios.delete(
          `https://api.github.com/repos/${githubRepo}/contents/${encodedFilePath}`,
          {
            headers: {
              Authorization: `Bearer ${githubToken}`,
            },
            data: {
              message: `Delete ${file.name}`, // Commit message
              sha: fileSha, // The SHA of the file to delete
            },
          }
        );
      }
  
      // Step 2: Delete folder document from Firestore
      await deleteDoc(doc(db, "Folders", id));
  
      // Step 3: Show success message
      setShowToastMsg('Folder and its files deleted!');
      router.back();
    } catch (error) {
      console.error("Error deleting folder and files:", error);
      setShowToastMsg('Error deleting folder or files');
    }
  };
  
  
  
  const getFolderList = async () => {
    try {
      setFolderList([]); // Reset folder list before fetching new data
      const q = query(
        collection(db, "Folders"),
        where("createBy", "==", user?.emailAddresses?.[0]?.emailAddress),
        where("parentFolderId", "==", id)
      );
      const querySnapshot = await getDocs(q);
      const folders = [];
      querySnapshot.forEach((doc) => {
        folders.push(doc.data());
      });
      setFolderList(folders); // Update state with fetched folders
    } catch (error) {
      console.error("Error fetching folder list:", error);
    }
  };

  const getFileList = async () => {
    try {
      setFileList([]); // Reset file list before fetching new data
      const q = query(
        collection(db, "files"),
        where("parentFolderId", "==", id),
        where("createdBy", "==", user?.emailAddresses?.[0]?.emailAddress)
      );
      const querySnapshot = await getDocs(q);
      const files = [];
      querySnapshot.forEach((doc) => {
        files.push(doc.data());
      });
      setFileList(files); // Update state with fetched files
      console.log("Fetched files:", files);
    } catch (error) {
      console.error("Error fetching file list:", error);
    }
  };

  // If folder details (name or id) are missing, show an error message
  if (!name || !id) {
    return <div>Error: Folder details are missing!</div>;
  }

  return (
    <div className='p-5'>
        <SearchBar/>
        <h2 className='text-[20px] font-bold mt-5'>{name}
        <svg xmlns="http://www.w3.org/2000/svg" 
        onClick={()=>deleteFolder()}
          fill="none" viewBox="0 0 24 24" 
          strokeWidth={1.5} stroke="currentColor"
           className="w-5 h-5 float-right text-red-500
           hover:scale-110 transition-all cursor-pointer">
       <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
        </svg>
        </h2>
   
       {folderList.length>0? <FolderList 
        folderList={folderList}
        isBig={false}/>:
        <h2 className='text-gray-400
        text-[16px] mt-5'>No Folder Found</h2>}

        <FileList fileList={fileList} />
    </div>
  );
}

export default FolderDetails;
