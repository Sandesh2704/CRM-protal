import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../../authProvider/AuthProvider";
import { RiFileHistoryFill } from "react-icons/ri";

export default function AttendanceDetails() {
    const { user } = useAuth();
    const parentId = user?._id || null;
    const location = useLocation();
    const { staff } = location.state || {};

    const [attendanceByStaff, setAttendanceByStaff] = useState({});
    const [selectedDate, setSelectedDate] = useState(null);
    const [newStatus, setNewStatus] = useState("");
    const [month, setMonth] = useState(new Date().getMonth()); // Set initial month
    const [year, setYear] = useState(new Date().getFullYear()); // Set initial year

    useEffect(() => {
        fetchAttendanceData();
    }, [month, year]); // Fetch data when month or year changes



    if (!staff) {
        return <div>Loading...</div>;
    }

    const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();

    const formatToISODate = (year, month, day) => {
        const date = new Date(year, month, day);
        return date.toISOString();
    };

    const fetchAttendanceData = async () => {
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_DOMAIN_URL}/attendanceManage/get-attendance/${parentId}/${year}/${month + 1}`
            );
            const data = response.data;
            const mappedAttendance = {};

            data.forEach((entry) => {
                const day = new Date(entry.date).getDate();
                if (!mappedAttendance[entry.staffId._id]) {
                    mappedAttendance[entry.staffId._id] = {};
                }
                mappedAttendance[entry.staffId._id][day] = entry.status;
            });

            setAttendanceByStaff(mappedAttendance);
        } catch (error) {
            console.error("Error fetching attendance:", error);
            toast.error("Error fetching attendance data");
        }
    };


    const updateAttendance = async (day) => {
        if (!newStatus) {
            toast.error("Please select a status");
            return;
        }

        const formattedDate = formatToISODate(year, month, day);

        try {
            const response = await axios.put(
                `${process.env.REACT_APP_DOMAIN_URL}/attendanceManage/update-attendance`,
                {
                    parentId,
                    staffId: staff._id,
                    date: formattedDate,
                    newStatus,
                }
            );

            toast.success(response.data.message);

            // Update the state to reflect the new attendance status
            setAttendanceByStaff((prevState) => {
                const updatedAttendance = { ...prevState };
                // Update the specific staff's attendance for the selected day
                updatedAttendance[staff._id] = {
                    ...updatedAttendance[staff._id],
                    [day]: newStatus, // Update the status for the selected day
                };
                return updatedAttendance;
            });

            // Reset the selected date and new status
            setSelectedDate(null);
            setNewStatus("");

        } catch (error) {
            console.error("Error updating attendance:", error);
            toast.error(error.response?.data?.message || "Unexpected error occurred");
        }
    };


    // Handle month change
    const onMonthChange = (newMonth) => {
        setMonth(newMonth);
    };

    // Handle year change
    const onYearChange = (newYear) => {
        setYear(newYear);
    };

    return (
        <div>
 
          

            <div className="flex flex-wrap items-center justify-between gap-5 bg-white my-6 py-4 px-4 rounded-lg shadow shadow-black/5">
                        <div className='flex gap-3 items-center'>
                            <div className={`group p-2 bg-gradiant text-xl text-white rounded-md cursor-pointer`}>
                                <RiFileHistoryFill />
                            </div>
                            <h1 className='font-medium text-xl'> Attendance History for {staff.username}</h1>
                        </div>
                        <div className="flex justify-start gap-2 items-center">
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
                    {Array.from({ length: 5 }).map((_, index) => (
                        <option key={index} value={year - 3 + index}>
                            {year - 3 + index}
                        </option>
                    ))}
                </select>
            </div>

                    </div>


            <div className="bg-white shadow rounded-lg py-6 px-4 lg:px-6">
                <div className="grid grid-cols-7 text-center font-medium mb-2 text-gray-700">
                    {daysOfWeek.map((day) => (
                        <div key={day}>{day}</div>
                    ))}
                </div>

                <div className="grid grid-cols-7 border-y-2 py-2 gap-1">
                    {Array.from({ length: firstDayOfMonth }).map((_, index) => (
                        <div key={`empty-${index}`} className="p-3 border bg-gray-100"></div>
                    ))}
                    {Array.from({ length: daysInMonth }).map((_, dayIndex) => {
                        const day = dayIndex + 1;
                        const attendanceStatus = attendanceByStaff[staff._id]?.[day] || "";
                        let bgColor = "bg-white";
                        if (attendanceStatus === "Present") bgColor = "bg-green-600 text-white font-bold";
                        if (attendanceStatus === "Absent") bgColor = "bg-red-600 text-white font-bold";
                        if (attendanceStatus === "Leave") bgColor = "bg-yellow-500 text-white font-bold";
                        if (attendanceStatus === "Half Day") bgColor = "bg-blue-600 text-white font-bold";
                        if (attendanceStatus === "Late Mark") bgColor = "bg-purple-500 text-white font-bold";

                        return (
                            <div key={day}>
                                <div
                                    className={`${bgColor} border h-16 flex justify-end items-end p-2 rounded-md relative`}
                                    onClick={() => setSelectedDate(day)}
                                >
                                    <h1 className="text-sm">{day}</h1>
                                    {selectedDate  === day && (
                                        <div className="absolute z-50 bg-purple-200 p-2 shadow rounded">
                                            <select
                                                value={newStatus}
                                                onChange={(e) => setNewStatus(e.target.value)}
                                                className="border p-2 text-black font-normal w-full"
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
                                                className="bg-gradiant text-white p-1 mt-1 w-full rounded"
                                            >
                                                Submit
                                            </button>
                                     
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
