import Image from "next/image";
import React from "react";

function FolderItem({ folder }) {
  return (
    <div
      className="flex flex-col items-center justify-center h-[120px] w-full
      border border-gray-300 rounded-lg bg-white p-4
      transition-transform duration-200 hover:scale-105 hover:shadow-md cursor-pointer"
    >
      <Image
        src="/folder.png"
        alt="Folder Icon"
        width={40}
        height={40}
        className="mb-2"
      />
      <h2 className="text-center text-sm font-medium line-clamp-2">
        {folder.name}
      </h2>
    </div>
  );
}

export default FolderItem;