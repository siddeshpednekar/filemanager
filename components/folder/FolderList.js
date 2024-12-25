"use client";
import React, { useEffect, useState } from "react";
import FolderItem from "./FolderItem";
import { useRouter } from "next/navigation";

function FolderList({ folderList }) {
  const [activeFolder, setActiveFolder] = useState(null);
  const router = useRouter();

  const onFolderClick = (index, item) => {
    setActiveFolder(index);
    router.push(`/folder/${item.id}?name=${item.name}&id=${item.id}`);
  };

  useEffect(() => {
    console.log("Folder list:", folderList);
  }, [folderList]);

  return (
    <div className="p-6 mt-6 bg-white rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold flex justify-between items-center">
        Recent Folders
        <span className="text-blue-500 text-sm font-normal cursor-pointer hover:underline">
          View All
        </span>
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-4">
        {folderList.map((item, index) => (
          <div
            key={index}
            onClick={() => onFolderClick(index, item)}
            className={`cursor-pointer transition-transform duration-200 ${
              activeFolder === index ? "ring-2 ring-blue-400 scale-105" : ""
            }`}
          >
            <FolderItem folder={item} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default FolderList;