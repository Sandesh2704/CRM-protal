// Calendar.js
// import React from "react";

// export default function Calendar({ attendanceData, month, year, onMonthChange, onYearChange}) {
//     const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
//     const daysInMonth = new Date(year, month + 1, 0).getDate();
//     const firstDayOfMonth = new Date(year, month, 1).getDay();


//     return (
//         <div className="">
//             <div className="flex justify-between items-center mb-4">
//                 <select
//                     value={month}
//                     onChange={(e) => onMonthChange(Number(e.target.value))}
//                     className="border rounded-md p-1"
//                 >
//                     {Array.from({ length: 12 }).map((_, index) => (
//                         <option key={index} value={index}>
//                             {new Date(0, index).toLocaleString("default", { month: "long" })}
//                         </option>
//                     ))}
//                 </select>
//                 <select
//                     value={year}
//                     onChange={(e) => onYearChange(Number(e.target.value))}
//                     className="border rounded-md p-1"
//                 >
//                     {Array.from({ length: 20 }).map((_, index) => (
//                         <option key={index} value={year - 10 + index}>
//                             {year - 10 + index}
//                         </option>
//                     ))}
//                 </select>
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
//                     const attendanceStatus = attendanceData[day];
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





import React from "react";

export default function Calendar({ attendanceData, month, year, onYearChange, onMonthChange }) {
    const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();



    return (
        <div className="">
            <div className="flex justify-between items-center mb-4">
                <select
                    value={month}
                    onChange={(e) => onMonthChange(Number(e.target.value))}
                    className="border rounded-md p-1"
                >
                    {Array.from({ length: 12 }).map((_, index) => (
                        <option key={index} value={index}>
                            {new Date(0, index).toLocaleString("default", { month: "long" })}
                        </option>
                    ))}
                </select>
                <select
                    value={year}
                    onChange={(e) => onYearChange(Number(e.target.value))}
                    className="border rounded-md p-1"
                >
                    {Array.from({ length: 5 }).map((_, index) => (
                        <option key={index} value={year - 2 + index}>
                            {year - 2 + index}
                        </option>
                    ))}
                </select>
            </div>
            <div className="grid grid-cols-7 text-center font-medium mb-2 text-gray-700">
                {daysOfWeek.map((day) => (
                    <div key={day}>{day}</div>
                ))}
            </div>
            <div className="grid grid-cols-7 border-y-2 py-2 gap-1">
                {Array.from({ length: firstDayOfMonth }).map((_, index) => (
                    <div key={`empty-${index}`} className="p-3 border rounded-md bg-gray-100"></div>
                ))}
                {Array.from({ length: daysInMonth }).map((_, dayIndex) => {
                    const day = dayIndex + 1;
                    const attendanceStatus = attendanceData[day];
                    let bgColor = "bg-white";
                    if (attendanceStatus === "Present") bgColor = "bg-green-600 text-white font-bold";
                    else if (attendanceStatus === "Absent") bgColor = "bg-red-600 text-white font-bold";
                    else if (attendanceStatus === "Leave") bgColor = "bg-yellow-500 text-white font-bold";
                    else if (attendanceStatus === "Half Day") bgColor = "bg-blue-600 text-white font-bold";
                    else if (attendanceStatus === "Late Mark") bgColor = "bg-purple-500 text-white font-bold";
                    return (
                        <div key={day} className={`${bgColor} border h-12 flex justify-end items-end p-2 rounded-md`}>
                            <h1 className="text-sm">{day}</h1>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
