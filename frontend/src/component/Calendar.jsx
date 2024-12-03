import React from "react";
import { RiFileHistoryFill } from "react-icons/ri"

// export default function Calendar({ newAttendance, month, year, onYearChange, onMonthChange }) {
//     const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
//     const daysInMonth = new Date(year, month + 1, 0).getDate();
//     const firstDayOfMonth = new Date(year, month, 1).getDay();

//     return (
//         <div className="bg-white h-fit shadow rounded-lg py-6 px-4 lg:px-6">

//             <div className="flex flex-wrap items-center justify-between gap-5 mb-7">
//                 <div className='flex gap-3 items-center'>
//                     <div className={`group p-2 bg-gradiant text-xl text-white  rounded-md cursor-pointer`} >
//                         <RiFileHistoryFill />
//                     </div>
//                     <h1 className='font-medium text-xl'>Attendence Histroy</h1>
//                 </div>

//                 <div className="flex justify-end gap-2 items-center ">
//                     <select
//                         value={month}
//                         onChange={(e) => onMonthChange(Number(e.target.value))}
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
//                         onChange={(e) => onYearChange(Number(e.target.value))}
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


//             <div className="grid grid-cols-7 text-center font-medium mb-2 text-gray-700">
//                 {daysOfWeek.map((day) => (
//                     <div key={day}>{day}</div>
//                 ))}
//             </div>
//             <div className="grid grid-cols-7 border-y-2 py-2 gap-1">
//                 {Array.from({ length: firstDayOfMonth }).map((_, index) => (
//                     <div key={`empty-${index}`} className="p-3 border rounded-md bg-gray-100"></div>
//                 ))}
//                 {Array.from({ length: daysInMonth }).map((_, dayIndex) => {
//                     const day = dayIndex + 1;
//                     const attendanceStatus = newAttendance[day];
//                     let bgColor = "bg-white";
//                     if (attendanceStatus === "Present") bgColor = "bg-green-600 text-white font-bold";
//                     else if (attendanceStatus === "Absent") bgColor = "bg-red-600 text-white font-bold";
//                     else if (attendanceStatus === "Leave") bgColor = "bg-yellow-500 text-white font-bold";
//                     else if (attendanceStatus === "Half Day") bgColor = "bg-blue-600 text-white font-bold";
//                     else if (attendanceStatus === "Late Mark") bgColor = "bg-purple-500 text-white font-bold";
//                     return (
//                         <div key={day} className={`${bgColor} border h-12 flex justify-end items-end p-2 rounded-md`}>
//                             <h1 className="text-sm">{day}</h1>
//                         </div>
//                     );
//                 })}
//             </div>
//         </div>
//     );
// }


export default function Calendar({
    newAttendance,
    attendanceStats,
    month,
    year,
    onYearChange,
    onMonthChange,
}) {
    const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();


    const statusColors = {
        Present: "bg-green-600 text-white font-bold",
        Absent: "bg-red-600 text-white font-bold",
        Leave: "bg-yellow-500 text-white font-bold",
        "Half Day": "bg-blue-600 text-white font-bold",
        "Late Mark": "bg-purple-500 text-white font-bold",
    };

    return (
        <div className="bg-white h-fit shadow rounded-lg py-6 px-4 lg:px-6">
            <div className="flex flex-wrap items-center justify-between gap-5 mb-7">
                <div className="flex gap-3 items-center">
                    <div
                        className={`group p-2 bg-gradiant text-xl text-white rounded-md cursor-pointer`}
                    >
                        <RiFileHistoryFill />
                    </div>
                    <h1 className="font-medium text-xl">Attendance History</h1>
                </div>

                <div className="flex justify-end gap-2 items-center">
                    <select
                        value={month}
                        onChange={(e) => onMonthChange(Number(e.target.value))}
                        className="border rounded-md p-1"
                    >
                        {Array.from({ length: 12 }).map((_, index) => (
                            <option key={index} value={index}>
                                {new Date(0, index).toLocaleString("default", { month: "short" })}
                            </option>
                        ))}
                    </select>
                    <select
                        value={year}
                        onChange={(e) => onYearChange(Number(e.target.value))}
                        className="border rounded-md p-1"
                    >
                        {Array.from({ length: 4 }).map((_, index) => (
                            <option key={index} value={year - 2 + index}>
                                {year - 2 + index}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-7 text-center font-medium mb-2 text-gray-700">
                {daysOfWeek.map((day) => (
                    <div key={day}>{day}</div>
                ))}
            </div>
            <div className="grid grid-cols-7 border-y-2 py-2 gap-1">
                {Array.from({ length: firstDayOfMonth }).map((_, index) => (
                    <div
                        key={`empty-${index}`}
                        className="p-3 border rounded-md bg-gray-100"
                    ></div>
                ))}
                {Array.from({ length: daysInMonth }).map((_, dayIndex) => {
                    const day = dayIndex + 1;
                    const attendanceStatus = newAttendance[day];
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
                            className={`${bgColor} border h-12 flex justify-end items-end p-2 rounded-md`}
                        >
                            <h1 className="text-sm">{day}</h1>
                        </div>
                    );
                })}
            </div>

            {attendanceStats && Object.keys(attendanceStats).length > 0 && (
                <div className="mt-5">
                    <h2 className="font-medium text-lg">Attendance Summary</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 mt-2">
                        {Object.keys(attendanceStats).map((status) => (
                            <div
                                key={status}
                                className={`py-2 px-3 border rounded-md w-full ${statusColors[status]}`}
                            >
                                <h3 className="font-medium">{status}</h3>
                                <p>{attendanceStats[status]} Days</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}