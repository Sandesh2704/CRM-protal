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

// const getAttendanceByMonth = async (req, res) => {
//   const { parentId, year, month } = req.params;

//   try {
//       // Define the start and end of the month
//       const startDate = new Date(`${year}-${month}-01T00:00:00.000Z`);
//       const endDate = new Date(`${year}-${month}-${new Date(year, month, 0).getDate()}T23:59:59.999Z`);

//       // Fetch attendance data
//       const attendanceData = await Attendance.find({
//           parentId,
//           date: {
//               $gte: startDate, // Include all dates greater than or equal to start
//               $lte: endDate,   // Include all dates less than or equal to end
//           },
//       }).populate("staffId", "username");

//       // Convert all dates to ISO format
//       const formattedAttendanceData = attendanceData.map((record) => ({
//           ...record._doc, // Spread the existing data
//           date: new Date(record.date).toISOString(), // Ensure ISO format for the date
//       }));

//       res.status(200).json(formattedAttendanceData);
//   } catch (error) {
//       console.error("Error fetching attendance data:", error);
//       res.status(500).json({ message: "Failed to retrieve attendance data", error });
//   }
// };



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
//       console.log("Attendance created successfully",attendance)
//       return res.status(200).json({ message: "Attendance updated successfully", attendance });
   
//     } else {
//       // If attendance does not exist, create a new attendance record
//       attendance = new Attendance({
//         parentId,
//         staffId,
//         date,
//         status: newStatus,
//       });
//       console.log("Attendance created successfully",attendance)
//       await attendance.save();
//       return res.status(201).json({ message: "Attendance created successfully", attendance });
//     }
//   } catch (error) {
//     console.log("Error updating or creating attendance:", error);
//     res.status(500).json({ message: "Failed to update or create attendance", error });
//   }
// };




const updateAttendance = async (req, res) => {
  const { parentId, staffId, date, newStatus } = req.body;

  if (!parentId || !staffId || !date || !newStatus) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    // Check if attendance already exists for the given date and staffId
    let attendance = await Attendance.findOne({ parentId, staffId, date });

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
        date,
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


module.exports = { submitAttendance, getAttendanceByMonth, getUserAttendance, updateAttendance};

