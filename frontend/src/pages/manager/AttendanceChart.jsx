// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useAuth } from "../../authProvider/AuthProvider";
// import PageHeader from "../../component/PageHeader";
// import { FaCalendarDays } from "react-icons/fa6";
// import { toast } from "react-toastify";
// import Swal from "sweetalert2";
// import CalendarByID from "../../component/CalendarByID";
// import { IoSearchOutline } from "react-icons/io5";

// export default function AttendanceChart({ staffData }) {
//     const { user } = useAuth();
//     const parentId = user?._id;
//     console.log("User:", user);

//     const [attendanceData, setAttendanceData] = useState([]);
//     const [updatedAttendance, setUpdatedAttendance] = useState([]);
//     const [query, setQuery] = useState("");

//     const currentDate = new Date()
//     const today = currentDate.toISOString().split("T")[0];
//     const [month, setMonth] = useState(currentDate.getMonth());
//     const [year, setYear] = useState(currentDate.getFullYear());

//     const handleAttendanceChange = (staffId, status) => {
//         setAttendanceData((prevData) => {
//             const updatedData = { ...prevData };
//             updatedData[staffId] = status;
//             return updatedData;
//         });
//     };

//     useEffect(() => {
//         fetchAttendanceData();
//     }, [parentId, month, year]);

//     const fetchAttendanceData = async () => {
//         try {
//             const response = await axios.get(
//                 `${process.env.REACT_APP_DOMAIN_URL}/attendanceManage/get-attendance/${parentId}/${year}/${month + 1}`
//             );
//             const attendanceMap = response.data.reduce((acc, entry) => {
//                 acc[entry.staffId._id] = acc[entry.staffId._id] || {};
//                 const date = new Date(entry.date).getDate();
//                 acc[entry.staffId._id][date] = entry.status;
//                 return acc;
//             }, {});
//             setUpdatedAttendance(attendanceMap);
//         } catch (error) {
//             console.error("Failed to fetch attendance data:", error);
//         }
//     };



//     const handleSubmitAll = async (e) => {
//         e.preventDefault();

//         const submissionData = Object.keys(attendanceData).map((staffId) => ({
//             date: today,
//             parentId,
//             staffId,
//             status: attendanceData[staffId],
//         }));

//         try {
//             await axios.post(
//                 `${process.env.REACT_APP_DOMAIN_URL}/attendanceManage/submit-attendance`,
//                 { parentId, attendance: submissionData }
//             );

//             Swal.fire({
//                 title: 'Attendance submitted successfully',
//                 icon: 'success',
//                 confirmButtonText: 'OK',
//                 customClass: { popup: 'custom-popup' },
//             });
//             fetchAttendanceData();
//         } catch (error) {
//             toast.error(`Failed to submit attendance data: ${error.response?.data || error.message}`, {
//                 position: 'top-right',
//                 autoClose: 3000,
//             });
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
//                 part.toLowerCase() === query.toLowerCase() ? `<mark>${part}</mark>` : part
//             )
//             .join("");
//     };

//     const filteredStaffData = staffData.filter((staff) =>
//         staff.username.toLowerCase().includes(query)
//     );

//     const onMonthChange = (newMonth) => {
//         setMonth(newMonth);
//     };

//     const onYearChange = (newYear) => {
//         setYear(newYear);
//     };

//     return (
//         <>
//             <PageHeader title="Attendance" icon={<FaCalendarDays />} />

//             <div className='flex justify-center items-center mb-7 mt-10 gap-6'>
//                 <div className='h-[1px] w-full bg-gradient-to-r from-blue-400 to-purple-400 flex-1' />
//                 <h2 className='text-gray-600 text-base'>{today}</h2>
//                 <div className='h-[1px] w-full bg-gradient-to-l from-blue-400 to-purple-400 flex-1' />
//             </div>


//             <div className="w-full bg-white shadow rounded-lg py-6 px-7">
//                 <form onSubmit={handleSubmitAll} className="w-full overflow-x-auto">
//                     <table className="w-full overflow-x-auto">
//                         <thead className="text-base font-medium border-b">
//                             <tr className="">
//                                 <th className="py-4">Staff Member</th>
//                                 <th className="py-4">Present</th>
//                                 <th className="py-4">Absent</th>
//                                 <th className="py-4">Leave</th>
//                                 <th className="py-4">Half Day</th>
//                                 <th className="py-4">Late Mark</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {staffData.map((staff) => (
//                                 <tr key={staff._id} className="text-center  border-b text-gray-900">
//                                     <td className="py-4 border-b">{staff.username}</td>
//                                     <td className="py-4 border-b">
//                                         <input
//                                             type="radio"
//                                             name={`attendance-${staff._id}`}
//                                             value="Present"
//                                             checked={attendanceData[staff._id] === "Present"}
//                                             onChange={() => handleAttendanceChange(staff._id, "Present")}
//                                             className="form-radio text-green-600"
//                                         />
//                                     </td>
//                                     <td className=" py-4 border-b">
//                                         <input
//                                             type="radio"
//                                             name={`attendance-${staff._id}`}
//                                             value="Absent"
//                                             checked={attendanceData[staff._id] === "Absent"}
//                                             onChange={() => handleAttendanceChange(staff._id, "Absent")}
//                                             className="form-radio text-red-600"
//                                         />
//                                     </td>
//                                     <td className=" py-4 border-b">
//                                         <input
//                                             type="radio"
//                                             name={`attendance-${staff._id}`}
//                                             value="Leave"
//                                             checked={attendanceData[staff._id] === "Leave"}
//                                             onChange={() => handleAttendanceChange(staff._id, "Leave")}
//                                             className="form-radio text-yellow-600"
//                                         />
//                                     </td>

//                                     <td className=" py-4 border-b">
//                                         <input
//                                             type="radio"
//                                             name={`attendance-${staff._id}`}
//                                             value="Half Day"
//                                             checked={attendanceData[staff._id] === "Half Day"}
//                                             onChange={() => handleAttendanceChange(staff._id, "Half Day")}
//                                             className="form-radio text-green-600"
//                                         />
//                                     </td>

//                                     <td className=" py-4 border-b">
//                                         <input
//                                             type="radio"
//                                             name={`attendance-${staff._id}`}
//                                             value="Late Mark"
//                                             checked={attendanceData[staff._id] === "Late Mark"}
//                                             onChange={() => handleAttendanceChange(staff._id, "Late Mark")}
//                                             className="form-radio text-green-600"
//                                         />
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                     <div className="flex justify-center mt-6">
//                         <button
//                             type="submit"
//                             className={`w-fit bg-blue-600 py-2 px-7 rounded-lg text-white `}>
//                             Submit Attendance
//                         </button>
//                     </div>
//                 </form>
//             </div>


//             <div className="mt-20">
//                 <PageHeader title="Attendance Calendar" icon={<FaCalendarDays />} />

//                 <div className="flex justify-between flex-wrap gap-4 mb-6 bg-white py-4 px-4 rounded-lg shadow shadow-black/5">

//                     <div className='flex gap-4 w-full md:w-fit justify-between items-center py-2 px-3 rounded border'>
//                         <input
//                             type="text"
//                             value={query}
//                             onChange={handleSearchChange}
//                             className="placeholder:text-zinc-500 outline-none bg-transparent"
//                             placeholder="Search by username, email..."
//                         />
//                         <IoSearchOutline />
//                     </div>

//                     <div className="flex flex-row  flex-wrap gap-3">
//                         <div className="bg-green-600 text-center text-white px-5 py-2 rounded-md">Present</div>
//                         <div className="bg-red-600 text-center text-white px-5 py-2 rounded-md ">Absent</div>
//                         <div className="bg-yellow-500 text-center text-black px-5 py-2 rounded-md  ">Leave</div>
//                         <div className="bg-blue-600 text-center text-white px-5 py-2 rounded-md">Half Day</div>
//                         <div className="bg-purple-500 text-center text-white px-5 py-2 rounded-md">Late Mark</div>
//                     </div>

//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                     {filteredStaffData.map((staff) => (
//                         <div key={staff._id} className="bg-white shadow rounded-lg py-6 px-7">
//                             <h2 className="text-xl font-semibold mb-4" dangerouslySetInnerHTML={{ __html: highlightMatch(staff.username || '') }} />
//                             <CalendarByID
//                                 updatedAttendance={updatedAttendance[staff._id] || {}}
//                                 month={month}
//                                 year={year}
//                                 onMonthChange={onMonthChange}
//                                 onYearChange={onYearChange}
//                                 fetchAttendanceData={fetchAttendanceData}
//                                 setUpdatedAttendance={setUpdatedAttendance}
//                                 staffId={staff._id}
//                             />
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         </>
//     );
// }



// import React, { useState } from "react";
// import axios from "axios";
// import { useAuth } from "../../authProvider/AuthProvider";
// import PageHeader from "../../component/PageHeader";
// import { FaCalendarDays } from "react-icons/fa6";
// import { toast } from "react-toastify";
// import Swal from "sweetalert2";





// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useAuth } from "../../authProvider/AuthProvider";
// import PageHeader from "../../component/PageHeader";
// import { FaCalendarDays } from "react-icons/fa6";
// import Swal from "sweetalert2";
// import Button from '../../component/Button';
// import { toast } from "react-toastify";

// export default function AttendanceChart({ staffData }) {
//     const { user } = useAuth();
//     const parentId = user?._id;

//     const [attendanceData, setAttendanceData] = useState({});
//     const [submittedAttendance, setSubmittedAttendance] = useState({});
//     const [isAttendanceFetched, setIsAttendanceFetched] = useState(false);

//     const currentDate = new Date();
//     const today = currentDate.toISOString().split("T")[0];

//     // Fetch attendance for today
//     const fetchTodayAttendance = async () => {
//         try {
//             const response = await axios.get(
//                 `${process.env.REACT_APP_DOMAIN_URL}/attendanceManage/today-attendance/${parentId}`
//             );
//             const todayAttendance = response.data.reduce((acc, item) => {
//                 acc[item.staffId._id] = item.status;
//                 return acc;
//             }, {});
//             setSubmittedAttendance(todayAttendance);
//         } catch (error) {
//             console.error("Failed to fetch today's attendance:", error);
//         } finally {
//             setIsAttendanceFetched(true);
//         }
//     };

//     useEffect(() => {
//         fetchTodayAttendance();
//     }, []);

//     const handleAttendanceChange = (staffId, status) => {
//         setAttendanceData((prevData) => ({
//             ...prevData,
//             [staffId]: status,
//         }));
//     };

//     const handleSubmitAll = async (e) => {
//         e.preventDefault();

//          // Check if any attendance data is filled
//     if (Object.keys(attendanceData).length === 0) {
//         toast.error("Please mark attendance for at least one staff member.", {
//             position: "top-right",
//             autoClose: 3000,
//         });
//         return;
//     }


//         const submissionData = Object.keys(attendanceData).map((staffId) => ({
//             date: today,
//             parentId,
//             staffId,
//             status: attendanceData[staffId],
//         }));

//         try {
//             await axios.post(
//                 `${process.env.REACT_APP_DOMAIN_URL}/attendanceManage/submit-attendance`,
//                 { parentId, attendance: submissionData }
//             );
//             Swal.fire({
//                 title: "Attendance submitted successfully",
//                 icon: "success",
//                 confirmButtonText: "OK",
//                 customClass: { popup: "custom-popup" },
//             });
//             fetchTodayAttendance(); // Refresh attendance data
//         } catch (error) {
//             Swal.fire({
//                 title: "Error",
//                 text: error.response?.data.message || "Failed to submit attendance.",
//                 icon: "error",
//                 confirmButtonText: "OK",
//             });
//         }
//     };

//     if (!isAttendanceFetched) {
//         return <div>Loading...</div>;
//     }

//     return (
//         <>
//             <PageHeader title="Attendance" icon={<FaCalendarDays />} />

//             <div className="flex justify-center items-center mb-7 mt-10 gap-6">
//                 <div className="h-[1px] w-full bg-gradient-to-r from-blue-400 to-purple-400 flex-1" />
//                 <h2 className="text-gray-600 text-base">{today}</h2>
//                 <div className="h-[1px] w-full bg-gradient-to-l from-blue-400 to-purple-400 flex-1" />
//             </div>

//             <div className="w-full bg-white shadow rounded-lg py-6 px-7">
//                 <form onSubmit={handleSubmitAll} className="w-full overflow-x-auto">
//                     <table className="w-full">
//                         <thead className="text-base font-medium border-b ">
//                             <tr>
//                                 <th className="py-4">Sr No.</th>
//                                 <th className="py-4">Staff Member</th>
//                                 <th className="py-4">Present</th>
//                                 <th className="py-4">Absent</th>
//                                 <th className="py-4">Leave</th>
//                                 <th className="py-4">Half Day</th>
//                                 <th className="py-4">Late Mark</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {staffData.map((staff, index) => (
//                                 <tr
//                                     key={staff._id}
//                                     className={`text-center border-b ${
//                                         submittedAttendance[staff._id] ? "bg-[#e710d4] text-white opacity-30" : ""
//                                     }`}
//                                 >
//                                     <td className="py-4">{index + 1}</td>
//                                     <td className="py-4">{staff.username}</td>
//                                     {["Present", "Absent", "Leave", "Half Day", "Late Mark"].map((status) => (
//                                         <td className="py-4" key={status}>
//                                             <input
//                                                 type="radio"
//                                                 name={`attendance-${staff._id}`}
//                                                 value={status}
//                                                 checked={attendanceData[staff._id] === status}
//                                                 onChange={() => handleAttendanceChange(staff._id, status)}
//                                                 className={`form-radio ${
//                                                     status === "Present"
//                                                         ? "text-green-600 bg-green-600"
//                                                         : status === "Absent"
//                                                         ? "text-red-600"
//                                                         : "text-yellow-600"
//                                                 }`}
//                                                 disabled={!!submittedAttendance[staff._id]}
//                                             />
//                                         </td>
//                                     ))}
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                     <div className="flex justify-center mt-6">
//                         <button
//                             type="submit"
//                         >
//                             <Button title="Submit Attendance"/>
                            
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </>
//     );
// }

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../authProvider/AuthProvider";
import PageHeader from "../../component/PageHeader";
import { FaCalendarDays } from "react-icons/fa6";
import Swal from "sweetalert2";
import Button from "../../component/Button";
import { toast } from "react-toastify";

export default function AttendanceChart({ staffData }) {
    const { user } = useAuth();
    const parentId = user?._id;

    const [attendanceData, setAttendanceData] = useState({});
    const [submittedAttendance, setSubmittedAttendance] = useState({});
    const [isAttendanceFetched, setIsAttendanceFetched] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);

    const statusColors = {
        Present: "bg-green-600 text-white font-bold accent-green-600",
        Absent: "bg-red-600 text-white font-bold accent-red-600",
        Leave: "bg-yellow-500 text-white font-bold accent-yellow-500",
        "Half Day": "bg-blue-600 text-white font-bold accent-blue-600",
        "Late Mark": "bg-purple-500 text-white font-bold accent-purple-500",
    };

    // Fetch attendance for selected date
    const fetchAttendanceByDate = async (date) => {
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_DOMAIN_URL}/attendanceManage/today-attendance/${parentId}/${date}`
            );
            const attendanceByDate = response.data.reduce((acc, item) => {
                acc[item.staffId._id] = item.status;
                return acc;
            }, {});
            setSubmittedAttendance(attendanceByDate);
        } catch (error) {
            console.error("Failed to fetch attendance:", error);
        } finally {
            setIsAttendanceFetched(true);
        }
    };

    

    useEffect(() => {
        fetchAttendanceByDate(selectedDate);
    }, [selectedDate]);

    const handleAttendanceChange = (staffId, status) => {
        setAttendanceData((prevData) => ({
            ...prevData,
            [staffId]: status,
        }));
    };

    const handleSubmitAll = async (e) => {
        e.preventDefault();

        if (Object.keys(attendanceData).length === 0) {
            toast.error("Please mark attendance for at least one staff member.", {
                position: "top-right",
                autoClose: 3000,
            });
            return;
        }

        const submissionData = Object.keys(attendanceData).map((staffId) => ({
            date: selectedDate,
            parentId,
            staffId,
            status: attendanceData[staffId],
        }));

        try {
            await axios.post(
                `${process.env.REACT_APP_DOMAIN_URL}/attendanceManage/submit-attendance`,
                { parentId, attendance: submissionData }
            );

            // Update `submittedAttendance` state directly
            setSubmittedAttendance((prevState) => {
                const updatedState = { ...prevState };
                submissionData.forEach(({ staffId, status }) => {
                    updatedState[staffId] = status;
                });
                return updatedState;
            });

            // Clear the local attendanceData for the current session
            setAttendanceData({});

            Swal.fire({
                title: "Attendance submitted successfully",
                icon: "success",
                confirmButtonText: "OK",
                customClass: { popup: "custom-popup" },
            });
        } catch (error) {
            Swal.fire({
                title: "Error",
                text: error.response?.data.message || "Failed to submit attendance.",
                icon: "error",
                confirmButtonText: "OK",
            });
        }
    };

    if (!isAttendanceFetched) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <PageHeader title="Attendance" icon={<FaCalendarDays />} />
            <div className="flex justify-center items-center mb-7 mt-10 gap-5">
            <div className="h-[1px]  w-full bg-gradient-to-r from-blue-400 to-purple-400 flex-1 shadow shadow-black/5" />
                <input
                    type="date"
                    className="border rounded p-2 shadow shadow-black/5"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                />
                  <div className="h-[1px] w-full bg-gradient-to-r from-blue-400 to-purple-400 flex-1 shadow shadow-black/5" />
            </div>

            <div className="w-full bg-white shadow rounded-lg pb-6 px-4 lg:px-7">
                <form onSubmit={handleSubmitAll} className="w-full overflow-x-auto">
                    <table className="w-full">
                        <thead className="text-base font-medium border-b sticky top-[10px] z-10 ">
                            <tr className="">
                                <th className="py-4 ">Sr No.</th> 
                                <th className="py-4">Staff Member</th>
                                <th className="py-4">Present</th>
                                <th className="py-4">Absent</th>
                                <th className="py-4">Leave</th>
                                <th className="py-4">Half Day</th>
                                <th className="py-4">Late Mark</th>
                            </tr>
                        </thead>
                        <tbody>
                            {staffData.map((staff, index) => (
                                <tr key={staff._id} className={`text-center border-b `}>
                                    <td className="py-4">{index + 1}</td>
                                    <td className="py-4">{staff.username}</td>
                                    {["Present", "Absent", "Leave", "Half Day", "Late Mark"].map((status) => (
                                        <td className="" key={status}>
                                            {submittedAttendance[staff._id] === status ? (
                                                <div
                                                    className={`rounded py-4 ${statusColors[status]}`}
                                                >
                                                    {status}
                                                </div>
                                            ) : (
                                                <input
                                                    type="radio"
                                                    name={`attendance-${staff._id}`}
                                                    value={status}
                                                    checked={attendanceData[staff._id] === status}
                                                    onChange={() => handleAttendanceChange(staff._id, status)}
                                                    className={`h-3 w-3 cursor-pointer ${statusColors[status]}`}
                                                    disabled={!!submittedAttendance[staff._id]}
                                                />
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="flex justify-center mt-6">
                        <button type="submit">
                            <Button title="Submit Attendance" />
                        </button>
                    </div>
                </form>
            </div>



            
        </>
    );
}




