// filter is not working properly 

// import React, { useState } from "react";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { useAuth } from "../authProvider/AuthProvider";

// export default function CalendarByID({
//     updatedAttendance,
//     month,
//     year,
//     onMonthChange,
//     onYearChange,
//     staffId,
//     fetchAttendanceData,
// }) {
//     const { user } = useAuth();
//     const parentId = user?._id || null;
//     const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
//     const daysInMonth = new Date(year, month + 1, 0).getDate();
//     const firstDayOfMonth = new Date(year, month, 1).getDay();

//     const [selectedDate, setSelectedDate] = useState(null);
//     const [newStatus, setNewStatus] = useState("");

//     const formatToISODate = (year, month, day) => {
//         const date = new Date(year, month, day);
//         // Ensure the date is in ISO format
//         return date.toISOString();
//     };

//     const updateAttendance = async (day) => {
//         if (!newStatus) {
//             toast.error("Please select a status");
//             return;
//         }

//         if (day > daysInMonth) {
//             toast.error("Invalid date selected");
//             return;
//         }

//         const formattedDate = formatToISODate(year, month, day);

//         try {
//             const response = await axios.put(
//                 `${process.env.REACT_APP_DOMAIN_URL}/attendanceManage/update-attendance`,
//                 {
//                     parentId,
//                     staffId,
//                     date: formattedDate,
//                     newStatus,
//                 }
//             );

//             console.log("Attendance update response:", response.data);
//             toast.success(response.data.message);

//             // Refresh attendance data
//             await fetchAttendanceData();
//             setSelectedDate(null);
//         } catch (error) {
//             console.error("Error updating attendance:", error);
//             if (error.response) {
//                 toast.error(`Error: ${error.response.data.message}`);
//             } else if (error.request) {
//                 toast.error("Network error: No response from the server");
//             } else {
//                 toast.error("Unexpected error occurred");
//             }
//         }
//     };



//     return (
//         <div>
//             {/* Month and Year selectors */}
//             <div className="flex justify-end gap-2 items-center mb-4">
//                 <select
//                     value={month}
//                     onChange={(e) => onMonthChange(Number(e.target.value))}
//                     className="border rounded-md p-1"
//                 >
//                     {Array.from({ length: 12 }).map((_, index) => (
//                         <option key={index} value={index}>
//                             {new Date(0, index).toLocaleString("default", { month: "short" })}
//                         </option>
//                     ))}
//                 </select>
//                 <select
//                     value={year}
//                     onChange={(e) => onYearChange(Number(e.target.value))}
//                     className="border rounded-md p-1"
//                 >
//                     {Array.from({ length: 4 }).map((_, index) => (
//                         <option key={index} value={year - 2 + index}>
//                             {year - 2 + index}
//                         </option>
//                     ))}
//                 </select>
//             </div>

//             {/* Days of the week */}
//             <div className="grid grid-cols-7 text-center font-medium mb-2 text-gray-700">
//                 {daysOfWeek.map((day) => (
//                     <div key={day}>{day}</div>
//                 ))}
//             </div>

//             {/* Calendar grid */}
//             <div className="grid grid-cols-7 border-y-2 py-2 gap-1">
//                 {Array.from({ length: firstDayOfMonth }).map((_, index) => (
//                     <div key={`empty-${index}`} className="p-3 border rounded-md bg-gray-100"></div>
//                 ))}
//                 {Array.from({ length: daysInMonth }).map((_, dayIndex) => {
//                     const day = dayIndex + 1;
//                     const attendanceStatus = updatedAttendance[day];
//                     let bgColor = "bg-white";
//                     if (attendanceStatus === "Present") bgColor = "bg-green-600 text-white font-bold";
//                     else if (attendanceStatus === "Absent") bgColor = "bg-red-600 text-white font-bold";
//                     else if (attendanceStatus === "Leave") bgColor = "bg-yellow-500 text-white font-bold";
//                     else if (attendanceStatus === "Half Day") bgColor = "bg-blue-600 text-white font-bold";
//                     else if (attendanceStatus === "Late Mark") bgColor = "bg-purple-500 text-white font-bold";

//                     return (
//                         <div
//                             key={day}
//                             className={`${bgColor} border h-12 flex justify-end items-end p-2 rounded-md relative`}
//                             onClick={() => setSelectedDate(day)}
//                         >
//                             <h1 className="text-sm">{day}</h1>
//                             {selectedDate === day && (
//                                 <div className="absolute z-50 bg-purple-200 p-2 shadow shadow-black/5 rounded z-10">
//                                     <select
//                                         value={newStatus}
//                                         onChange={(e) => setNewStatus(e.target.value)}
//                                         className="border p-1 text-black"
//                                     >
//                                         <option value="">Select</option>
//                                         <option value="Present">Present</option>
//                                         <option value="Absent">Absent</option>
//                                         <option value="Leave">Leave</option>
//                                         <option value="Half Day">Half Day</option>
//                                         <option value="Late Mark">Late Mark</option>
//                                     </select>
//                                     <button
//                                         onClick={() => updateAttendance(day)}
//                                         className="bg-blue-500 text-white p-1 mt-1 w-full"
//                                         disabled={!newStatus}
//                                     >
//                                         Submit
//                                     </button>
//                                 </div>
//                             )}
//                         </div>
//                     );
//                 })}
//             </div>

//         </div>
//     );
// }


import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../authProvider/AuthProvider";

export default function CalendarByID({
    updatedAttendance,
    month,
    year,
    onMonthChange,
    onYearChange,
    staffId,
    fetchAttendanceData,
}) {
    const { user } = useAuth();
    const parentId = user?._id || null;
    const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();

    const [selectedDate, setSelectedDate] = useState(null);
    const [newStatus, setNewStatus] = useState("");

    const formatToISODate = (year, month, day) => {
        const date = new Date(year, month, day);
        return date.toISOString();
    };

    const updateAttendance = async (day) => {
        if (!newStatus) {
            toast.error("Please select a status");
            return;
        }

        if (day > daysInMonth) {
            toast.error("Invalid date selected");
            return;
        }

        const formattedDate = formatToISODate(year, month, day);

        try {
            const response = await axios.put(
                `${process.env.REACT_APP_DOMAIN_URL}/attendanceManage/update-attendance`,
                {
                    parentId,
                    staffId,
                    date: formattedDate,
                    newStatus,
                }
            );

            toast.success(response.data.message);

            // Refresh attendance data for the specific staffId
            await fetchAttendanceData(staffId);
            setSelectedDate(null);
        } catch (error) {
            console.error("Error updating attendance:", error);
            toast.error(
                error.response?.data?.message || "Unexpected error occurred"
            );
        }
    };

    const handleMonthChange = (direction) => {
        const newMonth = month + direction;
        if (newMonth < 0) {
            onYearChange(year - 1);
            onMonthChange(11);
        } else if (newMonth > 11) {
            onYearChange(year + 1);
            onMonthChange(0);
        } else {
            onMonthChange(newMonth);
        }
    };

    return (
        <div>
            {/* Month and Year Selectors */}
            <div className="flex justify-between text-sm items-center mb-4">
                <button
                    onClick={() => handleMonthChange(-1)}
                    className="bg-gray-100 px-2 py-1 rounded"
                >
                    Prev
                </button>
                <div className="text-sm font-bold">
                    {new Date(year, month).toLocaleString("default", {
                        month: "long",
                        year: "numeric",
                    })}
                </div>
                <button
                    onClick={() => handleMonthChange(1)}
                    className="bg-gray-100 px-2 py-1 rounded"
                >
                    Next
                </button>
            </div>

            {/* Days of the Week */}
            <div className="grid grid-cols-7 text-center font-medium mb-2 text-gray-700">
                {daysOfWeek.map((day) => (
                    <div key={day}>{day}</div>
                ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 border-y-2 py-2 gap-1">
                {Array.from({ length: firstDayOfMonth }).map((_, index) => (
                    <div key={`empty-${index}`} className="p-3 border bg-gray-100"></div>
                ))}
                {Array.from({ length: daysInMonth }).map((_, dayIndex) => {
                    const day = dayIndex + 1;
                    const attendanceStatus = updatedAttendance[day];
                    let bgColor = "bg-white";
                    if (attendanceStatus === "Present")
                        bgColor = "bg-green-600 text-white font-bold";
                    else if (attendanceStatus === "Absent")
                        bgColor = "bg-red-600 text-white font-bold";
                    else if (attendanceStatus === "Leave")
                        bgColor = "bg-yellow-500 text-white font-bold";
                    else if (attendanceStatus === "Half Day")
                        bgColor = "bg-blue-600 text-white font-bold";
                    else if (attendanceStatus === "Late Mark")
                        bgColor = "bg-purple-500 text-white font-bold";

                    return (
                        <div
                            key={day}
                            className={`${bgColor} border h-12 flex justify-end items-end p-2 rounded-md relative`}
                            onClick={() => setSelectedDate(day)}
                        >
                            <h1 className="text-sm">{day}</h1>
                            {selectedDate === day && (
                                <div className="absolute  z-50 bg-purple-200 p-2 shadow rounded">
                                    <select
                                        value={newStatus}
                                        onChange={(e) => setNewStatus(e.target.value)}
                                        className="border p-1 text-black font-normal"
                                    >
                                        <option value="">Select</option>
                                        <option value="Present">Present</option>
                                        <option value="Absent">Absent</option>
                                        <option value="Leave">Leave</option>
                                        <option value="Half Day">Half Day</option>
                                        <option value="Late Mark">Late Mark</option>
                                    </select>
                                    <button
                                        onClick={() => updateAttendance(day)}
                                        className="bg-gradiant text-white p-1 mt-1 w-full"
                                        disabled={!newStatus}
                                    >
                                        Submit
                                    </button>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}




// import React, { useState } from "react";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { useAuth } from "../authProvider/AuthProvider";

// export default function CalendarByID({
//     updatedAttendance,
//     initialMonth,
//     initialYear,
//     staffId,
//     fetchAttendanceData,
// }) {
//     const { user } = useAuth();
//     const parentId = user?._id || null;
//     const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
//     const [month, setMonth] = useState(initialMonth);
//     const [year, setYear] = useState(initialYear);
//     const daysInMonth = new Date(year, month + 1, 0).getDate();
//     const firstDayOfMonth = new Date(year, month, 1).getDay();

//     const [selectedDate, setSelectedDate] = useState(null);
//     const [newStatus, setNewStatus] = useState("");

//     const formatToISODate = (year, month, day) => {
//         const date = new Date(year, month, day);
//         return date.toISOString();
//     };

//     const updateAttendance = async (day) => {
//         if (!newStatus) {
//             toast.error("Please select a status");
//             return;
//         }

//         if (day > daysInMonth) {
//             toast.error("Invalid date selected");
//             return;
//         }

//         const formattedDate = formatToISODate(year, month, day);

//         try {
//             const response = await axios.put(
//                 `${process.env.REACT_APP_DOMAIN_URL}/attendanceManage/update-attendance`,
//                 {
//                     parentId,
//                     staffId,
//                     date: formattedDate,
//                     newStatus,
//                 }
//             );

//             console.log("Attendance update response:", response.data);
//             toast.success(response.data.message);

//             // Refresh attendance data
//             await fetchAttendanceData();
//             setSelectedDate(null);
//         } catch (error) {
//             console.error("Error updating attendance:", error);
//             if (error.response) {
//                 toast.error(`Error: ${error.response.data.message}`);
//             } else if (error.request) {
//                 toast.error("Network error: No response from the server");
//             } else {
//                 toast.error("Unexpected error occurred");
//             }
//         }
//     };

//     const handleNextMonth = () => {
//         if (month === 11) {
//             setMonth(0);
//             setYear(year + 1);
//         } else {
//             setMonth(month + 1);
//         }
//     };

//     const handlePrevMonth = () => {
//         if (month === 0) {
//             setMonth(11);
//             setYear(year - 1);
//         } else {
//             setMonth(month - 1);
//         }
//     };

//     return (
//         <div>
//             {/* Month and Year selectors with Next/Prev buttons */}
//             <div className="flex justify-between items-center mb-4">
//                 <button
//                     onClick={handlePrevMonth}
//                     className="bg-gray-300 p-2 rounded hover:bg-gray-400"
//                 >
//                     Prev
//                 </button>
//                 <div className="flex gap-2 items-center">
//                     <select
//                         value={month}
//                         onChange={(e) => setMonth(Number(e.target.value))}
//                         className="border rounded-md p-1"
//                     >
//                         {Array.from({ length: 12 }).map((_, index) => (
//                             <option key={index} value={index}>
//                                 {new Date(0, index).toLocaleString("default", { month: "short" })}
//                             </option>
//                         ))}
//                     </select>
//                     <select
//                         value={year}
//                         onChange={(e) => setYear(Number(e.target.value))}
//                         className="border rounded-md p-1"
//                     >
//                         {Array.from({ length: 4 }).map((_, index) => (
//                             <option key={index} value={year - 2 + index}>
//                                 {year - 2 + index}
//                             </option>
//                         ))}
//                     </select>
//                 </div>
//                 <button
//                     onClick={handleNextMonth}
//                     className="bg-gray-300 p-2 rounded hover:bg-gray-400"
//                 >
//                     Next
//                 </button>
//             </div>

//             {/* Days of the week */}
//             <div className="grid grid-cols-7 text-center font-medium mb-2 text-gray-700">
//                 {daysOfWeek.map((day) => (
//                     <div key={day}>{day}</div>
//                 ))}
//             </div>

//             {/* Calendar grid */}
//             <div className="grid grid-cols-7 border-y-2 py-2 gap-1">
//                 {Array.from({ length: firstDayOfMonth }).map((_, index) => (
//                     <div key={`empty-${index}`} className="p-3 border rounded-md bg-gray-100"></div>
//                 ))}
//                 {Array.from({ length: daysInMonth }).map((_, dayIndex) => {
//                     const day = dayIndex + 1;
//                     const attendanceStatus = updatedAttendance[day];
//                     let bgColor = "bg-white";
//                     if (attendanceStatus === "Present") bgColor = "bg-green-600 text-white font-bold";
//                     else if (attendanceStatus === "Absent") bgColor = "bg-red-600 text-white font-bold";
//                     else if (attendanceStatus === "Leave") bgColor = "bg-yellow-500 text-white font-bold";
//                     else if (attendanceStatus === "Half Day") bgColor = "bg-blue-600 text-white font-bold";
//                     else if (attendanceStatus === "Late Mark") bgColor = "bg-purple-500 text-white font-bold";

//                     return (
//                         <div
//                             key={day}
//                             className={`${bgColor} border h-12 flex justify-end items-end p-2 rounded-md relative`}
//                             onClick={() => setSelectedDate(day)}
//                         >
//                             <h1 className="text-sm">{day}</h1>
//                             {selectedDate === day && (
//                                 <div className="absolute z-50 bg-purple-200 p-2 shadow shadow-black/5 rounded z-10">
//                                     <select
//                                         value={newStatus}
//                                         onChange={(e) => setNewStatus(e.target.value)}
//                                         className="border p-1 text-black"
//                                     >
//                                         <option value="">Select</option>
//                                         <option value="Present">Present</option>
//                                         <option value="Absent">Absent</option>
//                                         <option value="Leave">Leave</option>
//                                         <option value="Half Day">Half Day</option>
//                                         <option value="Late Mark">Late Mark</option>
//                                     </select>
//                                     <button
//                                         onClick={() => updateAttendance(day)}
//                                         className="bg-blue-500 text-white p-1 mt-1 w-full"
//                                         disabled={!newStatus}
//                                     >
//                                         Submit
//                                     </button>
//                                 </div>
//                             )}
//                         </div>
//                     );
//                 })}
//             </div>
//         </div>
//     );
// }





// 31st date  is not working properly 
// import React, { useState } from "react";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { useAuth } from "../authProvider/AuthProvider";

// export default function CalendarByID({
//     updatedAttendance,
//     initialMonth,
//     initialYear,
//     staffId,
//     fetchAttendanceData,
// }) {
//     const { user } = useAuth();
//     const parentId = user?._id || null;
//     const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
//     const [month, setMonth] = useState(initialMonth);
//     const [year, setYear] = useState(initialYear);
//     const daysInMonth = new Date(year, month + 1, 0).getDate();
//     const firstDayOfMonth = new Date(year, month, 1).getDay();

//     const [selectedDate, setSelectedDate] = useState(null);
//     const [newStatus, setNewStatus] = useState("");

//     const formatToISODate = (year, month, day) => {

//                 const date = new Date(year, month, day);
//         return date.toISOString();
//     };

//     const updateAttendance = async (day) => {
//         if (!newStatus) {
//             toast.error("Please select a status");
//             return;
//         }

//         if (day > daysInMonth) {
//             toast.error("Invalid date selected");
//             return;
//         }

//         const formattedDate = formatToISODate(year, month, day);

//         try {
//             const response = await axios.put(
//                 `${process.env.REACT_APP_DOMAIN_URL}/attendanceManage/update-attendance`,
//                 {
//                     parentId,
//                     staffId,
//                     date: formattedDate,
//                     newStatus,
//                 }
//             );

//             toast.success(response.data.message);

//             // Refresh attendance data
//             await fetchAttendanceData();
//             setSelectedDate(null);
//         } catch (error) {
//             console.error("Error updating attendance:", error);
//             if (error.response) {
//                 toast.error(`Error: ${error.response.data.message}`);
//             } else if (error.request) {
//                 toast.error("Network error: No response from the server");
//             } else {
//                 toast.error("Unexpected error occurred");
//             }
//         }
//     };

//     return (
//         <div>
//             {/* Month and Year selectors */}
//             <div className="flex justify-between items-center mb-4">
//                 <div className="flex gap-2 items-center">
//                     <select
//                         value={month}
//                         onChange={(e) => setMonth(Number(e.target.value))}
//                         className="border rounded-md p-1"
//                     >
//                         {Array.from({ length: 12 }).map((_, index) => (
//                             <option key={index} value={index}>
//                                 {new Date(0, index).toLocaleString("default", { month: "short" })}
//                             </option>
//                         ))}
//                     </select>
//                     <select
//                         value={year}
//                         onChange={(e) => setYear(Number(e.target.value))}
//                         className="border rounded-md p-1"
//                     >
//                         {Array.from({ length: 4 }).map((_, index) => (
//                             <option key={index} value={year - 2 + index}>
//                                 {year - 2 + index}
//                             </option>
//                         ))}
//                     </select>
//                 </div>
//             </div>

//             {/* Days of the week */}
//             <div className="grid grid-cols-7 text-center font-medium mb-2 text-gray-700">
//                 {daysOfWeek.map((day) => (
//                     <div key={day}>{day}</div>
//                 ))}
//             </div>

//             {/* Calendar grid */}
//             <div className="grid grid-cols-7 border-y-2 py-2 gap-1">
//                 {Array.from({ length: firstDayOfMonth }).map((_, index) => (
//                     <div key={`empty-${index}`} className="p-3 border rounded-md bg-gray-100"></div>
//                 ))}
//                 {Array.from({ length: daysInMonth }).map((_, dayIndex) => {
//                     const day = dayIndex + 1;
//                     const attendanceStatus = updatedAttendance[day];
//                     let bgColor = "bg-white";
//                     if (attendanceStatus === "Present") bgColor = "bg-green-600 text-white font-bold";
//                     else if (attendanceStatus === "Absent") bgColor = "bg-red-600 text-white font-bold";
//                     else if (attendanceStatus === "Leave") bgColor = "bg-yellow-500 text-white font-bold";
//                     else if (attendanceStatus === "Half Day") bgColor = "bg-blue-600 text-white font-bold";
//                     else if (attendanceStatus === "Late Mark") bgColor = "bg-purple-500 text-white font-bold";

//                     return (
//                         <div
//                             key={day}
//                             className={`${bgColor} border h-12 flex justify-end items-end p-2 rounded-md relative`}
//                             onClick={() => setSelectedDate(day)}
//                         >
//                             <h1 className="text-sm">{day}</h1>
//                             {selectedDate === day && (
//                                 <div className="absolute z-50 bg-purple-200 p-2 shadow shadow-black/5 rounded z-10">
//                                     <select
//                                         value={newStatus}
//                                         onChange={(e) => setNewStatus(e.target.value)}
//                                         className="border p-1 text-black"
//                                     >
//                                         <option value="">Select</option>
//                                         <option value="Present">Present</option>
//                                         <option value="Absent">Absent</option>
//                                         <option value="Leave">Leave</option>
//                                         <option value="Half Day">Half Day</option>
//                                         <option value="Late Mark">Late Mark</option>
//                                     </select>
//                                     <button
//                                         onClick={() => updateAttendance(day)}
//                                         className="bg-blue-500 text-white p-1 mt-1 w-full"
//                                         disabled={!newStatus}
//                                     >
//                                         Submit
//                                     </button>
//                                 </div>
//                             )}
//                         </div>
//                     );
//                 })}
//             </div>
//         </div>
//     );
// }







