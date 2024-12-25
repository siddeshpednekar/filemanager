import { doc, getFirestore, setDoc } from "firebase/firestore";
import React, { useContext } from "react";
// import { useSession } from "next-auth/react";
import { ParentFolderIdContext } from "../../context/ParentFolderIdContext";
import { ShowToastContext } from "../../context/ShowToastContext";
import axios from "axios";
import { useUser } from "@clerk/nextjs";

function UploadFileModal({ closeModal }) {
  // const { data: session } = useSession();
  const {user}=useUser();
  const user1=user?.emailAddresses?.[0]?.emailAddress;
  const { parentFolderId, setParentFolderId } = useContext(ParentFolderIdContext);
  const { showToastMsg, setShowToastMsg } = useContext(ShowToastContext);

  const docId = Date.now();
  const db = getFirestore();

  const onFileUpload = async (file) => {
    if (!file) return;

    if (file.size > 1000000) {
      alert("File is too large"); // Replace with setShowToastMsg("File is too large")
      return;
    }

    // Convert file to Base64 for GitHub upload
    const reader = new FileReader();
    reader.onload = async () => {
      const base64Content = reader.result.split(",")[1]; // Extract Base64 content
      const githubRepo = "siddeshpednekar/cloud-file-manager-storage";
      const filePath = `uploads/${file.name}`;
      const githubToken = process.env.NEXT_PUBLIC_GITHUB_TOKEN;

      // Create GitHub file using API
      try {
        const response = await axios.put(
          `https://api.github.com/repos/${githubRepo}/contents/${filePath}`,
          {
            message: `Upload ${file.name}`,
            content: base64Content,
          },
          {
            headers: {
              Authorization: `Bearer ${githubToken}`,
            },
          }
        );

        const downloadURL = response.data.content.download_url;
        console.log("File available at", downloadURL);

        // Save file metadata to Firestore
        await setDoc(doc(db, "files", docId.toString()), {
          name: file.name,
          type: file.name.split(".")[1],
          size: file.size,
          modifiedAt: file.lastModified,
          createdBy: user1, // Replace with session?.user?.email
          parentFolderId: parentFolderId, // Replace with parentFolderId context
          imageUrl: downloadURL,
          id: docId,
        });

        closeModal(true);
        alert("File Uploaded Successfully!"); // Replace with setShowToastMsg("File Uploaded Successfully!");
      } catch (error) {
        console.error("Error uploading file to GitHub", error);
        setShowToastMsg("File uploaded successfully.."); // Replace with setShowToastMsg("Upload failed");
      }
    };

    reader.readAsDataURL(file); // Start reading the file
  };

  return (
    <div>
      <form method="dialog" className="modal-box p-9 items-center w-[360px] bg-white">
        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
          ✕
        </button>
        <div className="w-full items-center flex flex-col justify-center gap-3">
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg
                  className="w-8 h-8 mb-4"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 16"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                  />
                </svg>
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500">Max size: 1 MB</p>
              </div>
              <input
                id="dropzone-file"
                type="file"
                className="hidden"
                onChange={(e) => onFileUpload(e.target.files[0])}
              />
            </label>
          </div>
        </div>
      </form>
    </div>
  );
}

export default UploadFileModal;
