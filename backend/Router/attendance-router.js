const express = require("express");
const router = express.Router();
const { submitAttendance,getAttendanceByMonth, getUserAttendance, updateAttendance, getAttendanceByDate  } = require("../controller/attendance-controller");

router.get("/", (req, res) => {
    res.status(200).send("Welcome to Attendance System");
});

router.post("/submit-attendance", submitAttendance);

router.get("/get-attendance/:parentId/:year/:month", getAttendanceByMonth);

router.get("/my-attendance/:userId/:year/:month", getUserAttendance);

router.put("/update-attendance", updateAttendance); 

router.get("/today-attendance/:parentId/:date", getAttendanceByDate); // New route

module.exports = router;
