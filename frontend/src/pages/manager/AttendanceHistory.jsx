import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../authProvider/AuthProvider";
import PageHeader from "../../component/PageHeader";
import { FaCalendarDays } from "react-icons/fa6";
import CalendarByID from "../../component/CalendarByID";
import { IoSearchOutline } from "react-icons/io5";
import { toast } from "react-toastify";

export default function AttendanceHistory({ staffData }) {
    const { user } = useAuth();
    const parentId = user?._id || null;

    const [attendanceByStaff, setAttendanceByStaff] = useState({});
    const [query, setQuery] = useState("");

    const currentDate = new Date();
    const [month, setMonth] = useState(currentDate.getMonth());
    const [year, setYear] = useState(currentDate.getFullYear());

    useEffect(() => {
        console.log("User object:", user);
        console.log("Parent ID:", parentId);
        if (parentId) {
            fetchAttendanceData();
        } else {
            console.warn("Parent ID is null; attendance data fetch skipped.");
        }
    }, [parentId, month, year]);

    // const fetchAttendanceData = async () => {
    //     console.log("Fetching attendance data...");
    //     try {
    //         const response = await axios.get(
    //             `${process.env.REACT_APP_DOMAIN_URL}/attendanceManage/get-attendance/${parentId}/${year}/${month + 1}`
    //         );
    //         console.log("Attendance API response:", response.data);
    //         const attendanceData = response.data;
    
    //         // Filter out invalid or null staffId entries
    //         const validAttendanceData = attendanceData.filter(
    //             (entry) => entry.staffId && entry.staffId._id
    //         );
    
    //         // Map valid attendance data to staff-specific objects
    //         const mappedAttendance = {};
    //         validAttendanceData.forEach((entry) => {
    //             const day = new Date(entry.date).getDate();
    //             if (!mappedAttendance[entry.staffId._id]) {
    //                 mappedAttendance[entry.staffId._id] = {};
    //             }
    //             mappedAttendance[entry.staffId._id][day] = entry.status;
    //         });
    
    //         console.log("Mapped attendance data:", mappedAttendance);
    //         setAttendanceByStaff(mappedAttendance);
    //     } catch (error) {
    //         console.error("Failed to fetch attendance data:", error);
    //         toast.error("Failed to load attendance data.");
    //     }
    // };


    const fetchAttendanceData = async () => {
        console.log("Fetching attendance data...");
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_DOMAIN_URL}/attendanceManage/get-attendance/${parentId}/${year}/${month + 1}`
            );
            console.log("Attendance API response:", response.data);
            const attendanceData = response.data;
    
            // Filter out invalid or null staffId entries
            const validAttendanceData = attendanceData.filter(
                (entry) => entry.staffId && entry.staffId._id
            );
    
            // Map valid attendance data to staff-specific objects
            const mappedAttendance = {};
            validAttendanceData.forEach((entry) => {
                const day = new Date(entry.date).getDate();
                if (!mappedAttendance[entry.staffId._id]) {
                    mappedAttendance[entry.staffId._id] = {};
                }
                mappedAttendance[entry.staffId._id][day] = entry.status;
            });
    
            console.log("Mapped attendance data:", mappedAttendance);
            setAttendanceByStaff(mappedAttendance);
        } catch (error) {
            console.error("Failed to fetch attendance data:", error);
            toast.error("Failed to load attendance data.");
        }
    };

    const handleSearchChange = (e) => {
        setQuery(e.target.value.toLowerCase());
    };

    const highlightMatch = (text) => {
        if (!query) return text;
        const parts = text.split(new RegExp(`(${query})`, "gi"));
        return parts
            .map((part, index) =>
                part.toLowerCase() === query.toLowerCase() ? `<mark>${part}</mark>` : part
            )
            .join("");
    };

    const filteredStaffData = staffData.filter((staff) =>
        staff.username.toLowerCase().includes(query)
    );

    const onMonthChange = (newMonth) => {
        console.log("Month changed to:", newMonth);
        setMonth(newMonth);
    };

    const onYearChange = (newYear) => {
        console.log("Year changed to:", newYear);
        setYear(newYear);
    };

    if (!user) {
        return <div>Loading...</div>;
    }

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
                <div className="flex flex-row flex-wrap gap-3">
                    <div className="bg-green-600 text-center text-white px-5 py-2 rounded-md">
                        Present
                    </div>
                    <div className="bg-red-600 text-center text-white px-5 py-2 rounded-md">
                        Absent
                    </div>
                    <div className="bg-yellow-500 text-center text-black px-5 py-2 rounded-md">
                        Leave
                    </div>
                    <div className="bg-blue-600 text-center text-white px-5 py-2 rounded-md">
                        Half Day
                    </div>
                    <div className="bg-purple-500 text-center text-white px-5 py-2 rounded-md">
                        Late Mark
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredStaffData.map((staff) => (
                    <div
                        key={staff._id}
                        className="bg-white shadow rounded-lg py-6 px-7"
                    >
                        <h2
                            className="text-xl font-semibold mb-4"
                            dangerouslySetInnerHTML={{
                                __html: highlightMatch(staff.username || ""),
                            }}
                        />
                        <CalendarByID
                            updatedAttendance={attendanceByStaff[staff._id] || {}}
                            month={month}
                            year={year}
                            onMonthChange={onMonthChange}
                            onYearChange={onYearChange}
                            staffId={staff._id}
                            fetchAttendanceData={fetchAttendanceData}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}



