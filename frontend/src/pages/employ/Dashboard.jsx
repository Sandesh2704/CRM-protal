import { CiGrid41 } from "react-icons/ci";
import PageHeader from "../../component/PageHeader";
import CountingCard from "../../component/CountingCard";
import axios from "axios";
import { useEffect, useState } from "react";
import { useAuth } from "../../authProvider/AuthProvider";
import Calendar from "../../component/Calendar";

export default function Dashboard({ yourPendingTasks, yourTasks }) {

  const [userAttendance, setUserAttendance] = useState([])
  const { user } = useAuth();
  const userId = user?._id;

  const currentDate = new Date()
  const [month, setMonth] = useState(currentDate.getMonth());
  const [year, setYear] = useState(currentDate.getFullYear());

  const fetchUserAttendanceData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_DOMAIN_URL}/attendanceManage/my-attendance/${userId}/${year}/${month + 1}`);
      // Modify the attendanceMap to include a direct day-to-status mapping
      const attendanceMap = response.data.reduce((acc, entry) => {
        const date = new Date(entry.date).getDate();
        acc[date] = entry.status; // Store attendance status directly by day
        return acc;
      }, {});
      setUserAttendance(attendanceMap);
    } catch (error) {
      console.error("Failed to fetch attendance data:", error);
    }
  };

  const onMonthChange = (newMonth) => {
    setMonth(newMonth);
  };

  const onYearChange = (newYear) => {
    setYear(newYear);
  };

  useEffect(() => {
    fetchUserAttendanceData();
  }, [month, year]);
  
  return (
    <>
      <div>
        <PageHeader title='Dashboard' icon={<CiGrid41 />} />
      </div>

      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 lg:gap-7'>

        <CountingCard items={yourTasks} lebal='Total Task' />
        <CountingCard items={yourPendingTasks} lebal='Pending Tasks' />

        <div className="col-span-2 ">
          <Calendar
            newAttendance={userAttendance}
            month={month}
            year={year}
            onMonthChange={onMonthChange}
            onYearChange={onYearChange}
          />
        </div>
      </div>
    </>
  )
}
