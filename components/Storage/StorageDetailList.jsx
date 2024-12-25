import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where, getFirestore } from "firebase/firestore";
import { app } from "../../Config/firebaseConfig";
import { useUser } from "@clerk/nextjs";
import StorageDetailItem from "./StorageDetailItem";

function StorageDetails() {
  const db = getFirestore(app);
  const { user } = useUser(); // Clerk hook
  const [storageItems, setStorageItems] = useState([]);

  useEffect(() => {
    if (user) {
      fetchStorageData();
    }
  }, [user]);

  const fetchStorageData = async () => {
    const q = query(collection(db, "files"), where("createdBy", "==", user?.emailAddresses?.[0]?.emailAddress));
    const querySnapshot = await getDocs(q);

    // Process data into grouped categories
    const groupedData = {};
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const type = data.type || "Others"; // Categorize items by type, default to "Others"
      const size = data.size || 0;

      if (!groupedData[type]) {
        groupedData[type] = { type, totalFile: 0, size: 0, logo: getLogoPath(type) };
      }
      groupedData[type].totalFile += 1;
      groupedData[type].size += size;
    });

    // Convert grouped data into an array and format sizes
    const formattedData = Object.values(groupedData).map((item) => ({
      ...item,
      size: (item.size / 1024 ** 2).toFixed(2) + " MB", // Convert size to MB
    }));
    setStorageItems(formattedData);
  };

  // Function to return appropriate logo paths
  const getLogoPath = (type) => {
    switch (type) {
      case "Videos":
        return "M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6..."; // SVG path for video
      case "Documents":
        return "M5.25 5.25h13.5v13.5H5.25z..."; // SVG path for documents
      case "Others":
        return "M12 3.75L3.75 12 12 20.25..."; // SVG path for others
      default:
        return "M3.75 3.75h16.5v16.5H3.75z..."; // Default
    }
  };

  return (
    <div className="mt-5">
      {storageItems.map((item, index) => (
        <StorageDetailItem key={index} item={item} />
      ))}
    </div>
  );
}

export default StorageDetails;
