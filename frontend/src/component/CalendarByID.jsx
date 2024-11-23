import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";

export default function CalendarByID({ updatedAttendance, month, year, setUpdatedAttendance, onYearChange, onMonthChange, staffId, fetchAttendanceData }) {
    const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();


    const [selectedDate, setSelectedDate] = useState(null);

    function debounce(func, wait) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    const debounceFetch = debounce(fetchAttendanceData, 300); // Delay by 300ms


    const submitUpdateForDay = async (day, status) => {
        try {
            console.log("Submitting attendance update:", { day, status, staffId });

            // Optimistically update the UI
            setUpdatedAttendance((prevAttendance) => ({
                ...prevAttendance,
                [staffId]: {
                    ...prevAttendance[staffId],
                    [day]: status,
                },
            }));

            // Make the API request
            const response = await axios.put(
                `${process.env.REACT_APP_DOMAIN_URL}/attendanceManage/update-attendance/${staffId}`,
                { date: `${year}-${month + 1}-${day}`, status }
            );

            console.log("Response from server:", response.data);
            toast.success(response.data.message, { position: "top-right", autoClose: 3000 });

            // Fetch fresh attendance data (optional)
            await fetchAttendanceData();
            debounceFetch();

            // Close the selector
            setSelectedDate(null);
        } catch (error) {
            console.error("Failed to update attendance:", error.response || error.message);
            toast.error(
                `Failed to update attendance: ${error.response?.data?.message || error.message}`,
                { position: "top-right", autoClose: 3000 }
            );

            // Revert UI change in case of error
            setUpdatedAttendance((prevAttendance) => ({
                ...prevAttendance,
                [staffId]: {
                    ...prevAttendance[staffId],
                    [day]: updatedAttendance[staffId]?.[day], // Revert to the previous state
                },
            }));
        }
    };

    return (
        <div className="">
            {/* Month and Year Selectors */}
            <div className="flex justify-end gap-2 items-center mb-4">
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

            {/* Weekdays */}
            <div className="grid grid-cols-7 text-center font-medium mb-2 text-gray-700">
                {daysOfWeek.map((day) => (
                    <div key={day}>{day}</div>
                ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 border-y-2 py-2 gap-1">
                {/* Empty cells for days before the 1st */}
                {Array.from({ length: firstDayOfMonth }).map((_, index) => (
                    <div key={`empty-${index}`} className="p-3 border rounded-md bg-gray-100"></div>
                ))}
                {/* Days of the month */}
                {Array.from({ length: daysInMonth }).map((_, dayIndex) => {
                    const day = dayIndex + 1;
                    const attendanceStatus = updatedAttendance[day];
                    let bgColor = "bg-white";
                    if (attendanceStatus === "Present") bgColor = "bg-green-600 text-white font-bold";
                    else if (attendanceStatus === "Absent") bgColor = "bg-red-600 text-white font-bold";
                    else if (attendanceStatus === "Leave") bgColor = "bg-yellow-500 text-white font-bold";
                    else if (attendanceStatus === "Half Day") bgColor = "bg-blue-600 text-white font-bold";
                    else if (attendanceStatus === "Late Mark") bgColor = "bg-purple-500 text-white font-bold";

                    return (
                        <div
                            key={day}
                            className={`${bgColor} border h-12 flex justify-end items-end p-2 rounded-md relative`}
                            onClick={() => setSelectedDate(day)}
                        >
                            <h1 className="text-sm">{day}</h1>
                            {selectedDate === day && (
                                <div className="absolute bg-white p-2 shadow-md rounded z-10">
                                    <select
                                        value={updatedAttendance[day] || ""}
                                        onChange={(e) => submitUpdateForDay(day, e.target.value)}
                                        className="border rounded-md p-1"
                                    >
                                        <option value="">Select</option>
                                        <option value="Present">Present</option>
                                        <option value="Absent">Absent</option>
                                        <option value="Leave">Leave</option>
                                        <option value="Half Day">Half Day</option>
                                        <option value="Late Mark">Late Mark</option>
                                    </select>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    )
}
