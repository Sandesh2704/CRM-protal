import { CiGrid41 } from "react-icons/ci";
import PageHeader from "../../component/PageHeader";
import CountingCard from "../../component/CountingCard";
import axios from "axios";
import { useEffect, useState } from "react";
import { useAuth } from "../../authProvider/AuthProvider";
import Calendar from "../../component/Calendar";


export default function Dashboard({ staffData, yourPendingTasks, yourTasks }) {
  const [userAttendance, setUserAttendance] = useState([]);
  const [attendanceStats, setAttendanceStats] = useState({
    Present: 0,
    Absent: 0,
    Leave: 0,
    "Half Day": 0,
    "Late Mark": 0,
  });

  const { user } = useAuth();
  const userId = user?._id;

  const currentDate = new Date();
  const [month, setMonth] = useState(currentDate.getMonth());
  const [year, setYear] = useState(currentDate.getFullYear());

  const fetchUserAttendanceData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_DOMAIN_URL}/attendanceManage/my-attendance/${userId}/${year}/${month + 1}`
      );

      const attendanceMap = response.data.reduce((acc, entry) => {
        const date = new Date(entry.date).getDate();
        acc[date] = entry.status; // Store attendance status directly by day
        return acc;
      }, {});

      const statusCount = response.data.reduce((acc, entry) => {
        const status = entry.status;
        if (acc[status]) {
          acc[status] += 1;
        } else {
          acc[status] = 1;
        }
        return acc;
      }, {});

      setUserAttendance(attendanceMap);
      setAttendanceStats(statusCount);
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
        <PageHeader title="Dashboard" icon={<CiGrid41 />} />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 lg:gap-7">
        <CountingCard items={staffData} lebal="Team Members" />
        <CountingCard items={yourTasks} lebal="Total Tasks" />
        <CountingCard items={yourPendingTasks} lebal="Pending Tasks" />

        <div className="col-span-3 lg:col-span-3">
          <Calendar
            newAttendance={userAttendance}
            attendanceStats={attendanceStats}
            month={month}
            year={year}
            onMonthChange={onMonthChange}
            onYearChange={onYearChange}
          />
        </div>
      </div>
    </>
  );
}