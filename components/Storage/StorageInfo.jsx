import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { app } from '../../Config/firebaseConfig';
import { useUser } from '@clerk/nextjs';
import StorageSize from '../../Services/StorageSize';

function StorageInfo() {
  const { user } = useUser(); // Clerk hook to get user info
  const db = getFirestore(app);
  const [totalSizeUsed, setTotalSizeUsed] = useState(0);
  const [imageSize, setImageSize] = useState(0);

  const [fileList, setFileList] = useState([]);
  let totalSize = 0;

  useEffect(() => {
    if (user) {
      totalSize = 0;
      getAllFiles();
    }
  }, [user]);

  useEffect(() => {
    setImageSize(StorageSize.getStorageByType(fileList, ['png', 'jpg']));
  }, [fileList]);

  const getAllFiles = async () => {
    const q = query(collection(db, 'files'), where('createdBy', '==', user?.emailAddresses?.[0]?.emailAddress));
    const querySnapshot = await getDocs(q);
    setFileList([]);
    querySnapshot.forEach((doc) => {
      totalSize = totalSize + doc.data()['size'];
      setFileList((fileList) => [...fileList, doc.data()]);
    });

    setTotalSizeUsed((totalSize / 1024 ** 2).toFixed(2) + ' MB');
  };

  return (
    <div className="mt-7">
      <h2 className="text-[22px] font-bold">
        {totalSizeUsed}{' '}
        <span className="text-[14px] font-medium">used of</span> 50 MB
      </h2>
      <div className="w-full bg-gray-200 h-2.5 flex">
        <div className="bg-blue-600 h-2.5 w-[25%]"></div>
        <div className="bg-green-600 h-2.5 w-[35%]"></div>
        <div className="bg-yellow-400 h-2.5 w-[15%]"></div>
      </div>
    </div>
  );
}

export default StorageInfo;
