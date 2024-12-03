
// filter is not working properly 

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useAuth } from "../../authProvider/AuthProvider";
// import PageHeader from "../../component/PageHeader";
// import { FaCalendarDays } from "react-icons/fa6";
// import CalendarByID from "../../component/CalendarByID";
// import { IoSearchOutline } from "react-icons/io5";
// import { toast } from "react-toastify";

// export default function AttendanceHistory({ staffData }) {
//     const { user } = useAuth();
//     const parentId = user?._id || null;

//     const [attendanceByStaff, setAttendanceByStaff] = useState({});
//     const [query, setQuery] = useState("");

//     const currentDate = new Date();
//     const [month, setMonth] = useState(currentDate.getMonth());
//     const [year, setYear] = useState(currentDate.getFullYear());

//     // Pagination states
//     const [currentPage, setCurrentPage] = useState(1);
//     const itemsPerPage = 6;

    

//     useEffect(() => {
//         console.log("User object:", user);
//         console.log("Parent ID:", parentId);
//         if (parentId) {
//             fetchAttendanceData();
//         } else {
//             console.warn("Parent ID is null; attendance data fetch skipped.");
//         }
//     }, [parentId, month, year]);


//     const fetchAttendanceData = async () => {
//                 try {
//                     const response = await axios.get(
//                         `${process.env.REACT_APP_DOMAIN_URL}/attendanceManage/get-attendance/${parentId}/${year}/${month + 1}`
//                     );
//                     const attendanceData = response.data;

//                     console.log("attenda", attendanceData)
        
//                     // Filter out invalid or null staffId entries
//                     const validAttendanceData = attendanceData.filter(
//                         (entry) => entry.staffId && entry.staffId._id
//                     );
//                     console.log("vallidattendance", validAttendanceData)
        
//                     // Map valid attendance data to staff-specific objects
//                     const mappedAttendance = {};
//                     console.log("mapp", mappedAttendance)
//                     validAttendanceData.forEach((entry) => {
//                         const day = new Date(entry.date).getDate();
//                         if (!mappedAttendance[entry.staffId._id]) {
//                             mappedAttendance[entry.staffId._id] = {};
//                         }
//                         mappedAttendance[entry.staffId._id][day] = entry.status;
//                     });
        
//                     setAttendanceByStaff(mappedAttendance);
        
//                     console.log("validAttendanceData", validAttendanceData)
        
//                 } catch (error) {
//                     console.error("Failed to fetch attendance data:", error);
//                     toast.error("Failed to load attendance data.");
//                 }
//             };
    


//     const handleSearchChange = (e) => {
//         setQuery(e.target.value.toLowerCase());
//     };

//     const highlightMatch = (text) => {
//         if (!query) return text;
//         const parts = text.split(new RegExp(`(${query})`, "gi"));
//         return parts
//             .map((part, index) =>
//                 part.toLowerCase() === query.toLowerCase() ? `<mark>${part}</mark>` : part
//             )
//             .join("");
//     };

//     const filteredStaffData = staffData.filter((staff) =>
//         staff.username.toLowerCase().includes(query)
//     );

//     // Pagination logic
//     const indexOfLastItem = currentPage * itemsPerPage;
//     const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//     const currentStaffData = filteredStaffData.slice(indexOfFirstItem, indexOfLastItem);
//     const totalPages = Math.ceil(attendanceByStaff.length / itemsPerPage);

//     const paginate = (pageNumber) => setCurrentPage(pageNumber);

//     const onMonthChange = (newMonth) => {
//         console.log("Month changed to:", newMonth);
//         setMonth(newMonth);
//     };

//     const onYearChange = (newYear) => {
//         console.log("Year changed to:", newYear);
//         setYear(newYear);
//     };

//     if (!user) {
//         return <div>Loading...</div>;
//     }

//     return (
//         <div>
//             <PageHeader title="Attendance Calendar" icon={<FaCalendarDays />} />
//             <div className="flex justify-between flex-wrap gap-4 mb-6 bg-white py-4 px-4 rounded-lg shadow shadow-black/5">
//                 <div className="flex gap-4 w-full md:w-fit justify-between items-center py-2 px-3 rounded border">
//                     <input
//                         type="text"
//                         value={query}
//                         onChange={handleSearchChange}
//                         className="placeholder:text-zinc-500 outline-none bg-transparent"
//                         placeholder="Search by username, email..."
//                     />
//                     <IoSearchOutline />
//                 </div>
//                 <div className="flex flex-row flex-wrap gap-3">
//                     <div className="bg-green-600 text-center text-white px-5 py-2 rounded-md">
//                         Present
//                     </div>
//                     <div className="bg-red-600 text-center text-white px-5 py-2 rounded-md">
//                         Absent
//                     </div>
//                     <div className="bg-yellow-500 text-center text-black px-5 py-2 rounded-md">
//                         Leave
//                     </div>
//                     <div className="bg-blue-600 text-center text-white px-5 py-2 rounded-md">
//                         Half Day
//                     </div>
//                     <div className="bg-purple-500 text-center text-white px-5 py-2 rounded-md">
//                         Late Mark
//                     </div>
//                 </div>
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {currentStaffData.map((staff) => (
//                     <div
//                         key={staff._id}
//                         className="bg-white shadow rounded-lg py-6 px-4 lg:px-6"
//                     >
//                         <h2
//                             className="text-xl font-semibold mb-4 text-center"
//                             dangerouslySetInnerHTML={{
//                                 __html: highlightMatch(staff.username || ""),
//                             }}
//                         />
//                         <CalendarByID
//                             updatedAttendance={attendanceByStaff[staff._id] || {}}
//                             month={month}
//                             year={year}
//                             onMonthChange={onMonthChange}
//                             onYearChange={onYearChange}
//                             staffId={staff._id}
//                             fetchAttendanceData={fetchAttendanceData}
//                         />
//                     </div>
//                 ))}
//             </div>

//             {/* Pagination Controls */}
//             <div className="flex justify-between mt-9">
//                 <button
//                     className={`flex items-center  bg-white py-2 px-4 rounded-lg shadow shadow-black/5 gap-1  ${currentPage === 1 && 'opacity-50 cursor-not-allowed'}`}
//                     onClick={() => paginate(currentPage - 1)}
//                     disabled={currentPage === 1}
//                 >
//                     Prev
//                 </button>
//                 <button
//                     className={`flex items-center gap-1   bg-white py-2 px-4 rounded-lg shadow shadow-black/5  ${currentPage === totalPages && 'opacity-50 cursor-not-allowed'}`}
//                     onClick={() => paginate(currentPage + 1)}
//                     disabled={indexOfLastItem >= filteredStaffData.length}
//                 >
//                     Next
//                 </button>
//             </div>
//         </div>
//     );
// }



// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useAuth } from "../../authProvider/AuthProvider";
// import PageHeader from "../../component/PageHeader";
// import { FaCalendarDays } from "react-icons/fa6";
// import { IoSearchOutline } from "react-icons/io5";
// import { toast } from "react-toastify";
// import { Link } from "react-router-dom"; // Import Link from React Router

// export default function AttendanceHistory({ staffData }) {
//     const { user } = useAuth();
//     const parentId = user?._id || null;

//     const [attendanceByStaff, setAttendanceByStaff] = useState({});
//     const [query, setQuery] = useState("");
//     const [month, setMonth] = useState(new Date().getMonth());
//     const [year, setYear] = useState(new Date().getFullYear());

//     // Pagination states
//     const [currentPage, setCurrentPage] = useState(1);
//     const itemsPerPage = 6;

//     useEffect(() => {
//         if (parentId) {
//             fetchAttendanceData();
//         } else {
//             console.warn("Parent ID is null; attendance data fetch skipped.");
//         }
//     }, [parentId, month, year]);


    

//     const fetchAttendanceData = async () => {
//         try {
//             const response = await axios.get(
//                 `${process.env.REACT_APP_DOMAIN_URL}/attendanceManage/get-attendance/${parentId}/${year}/${month + 1}`
//             );
//             const attendanceData = response.data;

//             // Filter out invalid or null staffId entries
//             const validAttendanceData = attendanceData.filter(
//                 (entry) => entry.staffId && entry.staffId._id
//             );

//             // Map valid attendance data to staff-specific objects
//             const mappedAttendance = {};
//             validAttendanceData.forEach((entry) => {
//                 const day = new Date(entry.date).getDate();
//                 if (!mappedAttendance[entry.staffId._id]) {
//                     mappedAttendance[entry.staffId._id] = {};
//                 }
//                 mappedAttendance[entry.staffId._id][day] = entry.status;
//             });

//             setAttendanceByStaff(mappedAttendance);

//         } catch (error) {
//             console.error("Failed to fetch attendance data:", error);
//             toast.error("Failed to load attendance data.");
//         }
//     };

//     const handleSearchChange = (e) => {
//         setQuery(e.target.value.toLowerCase());
//     };

//     const highlightMatch = (text) => {
//         if (!query) return text;
//         const parts = text.split(new RegExp(`(${query})`, "gi"));
//         return parts
//             .map((part, index) =>
//                 part.toLowerCase() === query.toLowerCase() ? <mark key={index}>{part}</mark> : part
//             )
//             .join("");
//     };

//     const filteredStaffData = staffData.filter((staff) =>
//         staff.username.toLowerCase().includes(query)
//     );

//     // Pagination logic
//     const indexOfLastItem = currentPage * itemsPerPage;
//     const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//     const currentStaffData = filteredStaffData.slice(indexOfFirstItem, indexOfLastItem);
//     const totalPages = Math.ceil(staffData.length / itemsPerPage);

//     const paginate = (pageNumber) => setCurrentPage(pageNumber);


//     return (
//         <div>
//             <PageHeader title="Attendance Calendar" icon={<FaCalendarDays />} />
//             <div className="flex justify-between flex-wrap gap-4 mb-6 bg-white py-4 px-4 rounded-lg shadow shadow-black/5">
//                 <div className="flex gap-4 w-full md:w-fit justify-between items-center py-2 px-3 rounded border">
//                     <input
//                         type="text"
//                         value={query}
//                         onChange={handleSearchChange}
//                         className="placeholder:text-zinc-500 outline-none bg-transparent"
//                         placeholder="Search by username, email..."
//                     />
//                     <IoSearchOutline />
//                 </div>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {currentStaffData.map((staff) => (
//                     <div key={staff._id} className="bg-white shadow rounded-lg py-6 px-4 lg:px-6">
//                         <h2
//                             className="text-xl font-semibold mb-4 text-center"
//                             dangerouslySetInnerHTML={{
//                                 __html: highlightMatch(staff.username || ""),
//                             }}
//                         />
//                         <Link
//                             to={`/manager/attendance-history/${staff._id}`}
//                             state={{
//                                 staff
//                             }}
//                             className="text-blue-600 hover:underline"
//                         >
//                             View Attendance Calendar
//                         </Link>
//                     </div>
//                 ))}
//             </div>

//             {/* Pagination Controls */}
//             <div className="flex justify-between mt-9">
//                 <button
//                     className={`bg-white py-2 px-4 rounded-lg shadow shadow-black/5 gap-1 ${currentPage === 1 && "opacity-50 cursor-not-allowed"}`}
//                     onClick={() => paginate(currentPage - 1)}
//                     disabled={currentPage === 1}
//                 >
//                     Prev
//                 </button>
//                 <button
//                     className={`bg-white py-2 px-4 rounded-lg shadow shadow-black/5 gap-1 ${currentPage === totalPages && "opacity-50 cursor-not-allowed"}`}
//                     onClick={() => paginate(currentPage + 1)}
//                     disabled={currentPage === totalPages}
//                 >
//                     Next
//                 </button>
//             </div>
//         </div>
//     );
// }

   

import React, { useState } from "react";
import PageHeader from "../../component/PageHeader";
import { FaCalendarDays } from "react-icons/fa6";
import { IoSearchOutline } from "react-icons/io5";
import { Link } from "react-router-dom"; // Import Link from React Router

export default function AttendanceHistory({ staffData }) {

    const [query, setQuery] = useState("");
  
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 16;


    const handleSearchChange = (e) => {
        setQuery(e.target.value.toLowerCase());
    };

    const highlightMatch = (text) => {
        if (!query) return text;
        const parts = text.split(new RegExp(`(${query})`, "gi"));
        return parts
            .map((part, index) =>
                part.toLowerCase() === query.toLowerCase() ? <mark key={index}>{part}</mark> : part
            )
            .join("");
    };

    const filteredStaffData = staffData.filter((staff) =>
        staff.username.toLowerCase().includes(query)
    );

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentStaffData = filteredStaffData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(staffData.length / itemsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);


    return (
        <div>
            <PageHeader title="Attendance Calendar" icon={<FaCalendarDays />} />
            <div className="flex justify-between flex-wrap gap-4 mb-6 bg-white py-4 px-4 rounded-lg shadow shadow-black/5">
                <div className="flex gap-4 w-full md:w-fit justify-between items-center py-2 px-3 rounded border">
                    <input
                        type="text"
                        value={query}
                        onChange={handleSearchChange}
                        className="placeholder:text-zinc-500 outline-none bg-transparent"
                        placeholder="Search by username, email..."
                    />
                    <IoSearchOutline />
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
                {currentStaffData.map((staff) => (
                    <div key={staff._id} className="bg-white shadow rounded-lg py-6 px-4 lg:px-6  text-center">
                        <h2
                            className="text-xl font-semibold mb-4"
                            dangerouslySetInnerHTML={{
                                __html: highlightMatch(staff.username || ""),
                            }}
                        />
                        <Link
                            to={`/manager/attendance-history/${staff._id}`}
                            state={{
                                staff
                            }}
                              className="text-xs text-indigo-500 italic hover:underline hover:text-indigo-600 font-medium"
                        >
                            View Attendance Calendar
                        </Link>

                        
                    </div>
                ))}
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-between mt-9">
                <button
                    className={`bg-white py-2 px-4 rounded-lg shadow shadow-black/5 gap-1 ${currentPage === 1 && "opacity-50 cursor-not-allowed"}`}
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    Prev
                </button>
                <button
                    className={`bg-white py-2 px-4 rounded-lg shadow shadow-black/5 gap-1 ${currentPage === totalPages && "opacity-50 cursor-not-allowed"}`}
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>
        </div>
    );
}