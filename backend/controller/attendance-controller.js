const Attendance = require("../models/attendance-model");


const submitAttendance = async (req, res) => {
    const { parentId, attendance } = req.body;

    if (!parentId || !attendance || attendance.length === 0) {
        return res.status(400).json({ message: "Parent ID or attendance data is missing." });
    }

    const date = attendance[0]?.date;
    if (!date) {
        return res.status(400).json({ message: "Date is missing in attendance data." });
    }

    try {
        await Attendance.deleteMany({ parentId, date });
        await Attendance.insertMany(attendance);
        res.status(201).json({ message: "Attendance submitted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to submit attendance data", error });
    }
};

const getUserAttendance = async (req, res) => {
  const { year, month, userId } = req.params; // Retrieve year and month from the route params
  // const { userId } = req.query; // Extract userId from the query parameters

  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const attendanceData = await Attendance.find({
      staffId: userId, // Filter by the userId
      date: { $gte: startDate.toISOString(), $lte: endDate.toISOString() }
    });

    res.status(200).json(attendanceData);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve attendance data", error });
  }
};


const getAttendanceByMonth = async (req, res) => {
    const { parentId, year, month } = req.params;
    
    try {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);

        const attendanceData = await Attendance.find({
            parentId,
            date: { $gte: startDate.toISOString(), $lte: endDate.toISOString() }
        }).populate('staffId', 'username');

        res.status(200).json(attendanceData);
    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve attendance data", error });
    }
};

  




module.exports = { submitAttendance, getAttendanceByMonth, getUserAttendance, updateAttendance };

