const Attendance = require("../models/attendance-model");


// Fetch attendance by date
const getAttendanceByDate = async (req, res) => {
  const { parentId, date } = req.params;

  try {
      const attendance = await Attendance.find({ parentId, date }).populate("staffId", "username");
      res.status(200).json(attendance);
  } catch (error) {
      res.status(500).json({ message: "Failed to fetch attendance for the specified date", error });
  }
};

// Prevent duplicate submissions
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
      // Check for existing attendance
      const existingAttendance = await Attendance.find({
          parentId,
          date,
          staffId: { $in: attendance.map((entry) => entry.staffId) },
      });

      if (existingAttendance.length > 0) {
          const alreadySubmittedIds = existingAttendance.map((entry) => entry.staffId);
          return res.status(400).json({
              message: `Attendance already submitted for IDs: ${alreadySubmittedIds.join(", ")}`,
          });
      }

      await Attendance.insertMany(attendance);
      res.status(201).json({ message: "Attendance submitted successfully" });
  } catch (error) {
      res.status(500).json({ message: "Failed to submit attendance data", error });
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


// const updateAttendance = async (req, res) => {
//   const { parentId, staffId, date, newStatus } = req.body;

//   if (!parentId || !staffId || !date || !newStatus) {
//     return res.status(400).json({ message: "Missing required fields" });
//   }

//   try {
//     // Check if attendance already exists for the given date and staffId
//     let attendance = await Attendance.findOne({ parentId, staffId, date });

//     if (attendance) {
//       // If attendance exists, update the status
//       attendance.status = newStatus;
//       await attendance.save();
//       return res.status(200).json({ message: "Attendance updated successfully", attendance });
//     } else {
//       // If attendance does not exist, create a new attendance record
//       attendance = new Attendance({
//         parentId,
//         staffId,
//         date,
//         status: newStatus,
//       });
//       await attendance.save();
//       return res.status(201).json({ message: "Attendance created successfully", attendance });
//     }
//   } catch (error) {
//     console.log("Error updating or creating attendance:", error);
//     res.status(500).json({ message: "Failed to update or create attendance", error });
//   }
// ;
// }


const updateAttendance = async (req, res) => {
  const { parentId, staffId, date, newStatus } = req.body;

  if (!parentId || !staffId || !date || !newStatus) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    // Convert date to ISO string to remove potential timezone issues
    const formattedDate = new Date(date).toISOString().split("T")[0]; // Only keep YYYY-MM-DD

    // Check if attendance already exists for the given date and staffId
    let attendance = await Attendance.findOne({ parentId, staffId, date: formattedDate });

    if (attendance) {
      // If attendance exists, update the status
      attendance.status = newStatus;
      await attendance.save();
      return res.status(200).json({ message: "Attendance updated successfully", attendance });
    } else {
      // If attendance does not exist, create a new attendance record
      attendance = new Attendance({
        parentId,
        staffId,
        date: formattedDate,
        status: newStatus,
      });
      await attendance.save();
      return res.status(201).json({ message: "Attendance created successfully", attendance });
    }
  } catch (error) {
    console.log("Error updating or creating attendance:", error);
    res.status(500).json({ message: "Failed to update or create attendance", error });
  }
};





module.exports = { submitAttendance, getAttendanceByMonth, getUserAttendance, updateAttendance, getAttendanceByDate};

