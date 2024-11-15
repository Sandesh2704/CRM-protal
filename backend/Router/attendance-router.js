const express = require("express");
const router = express.Router();
const { submitAttendance,getAttendanceByMonth } = require("../controller/attendance-controller");

router.get("/", (req, res) => {
    res.status(200).send("Welcome to Attendance System");
});

router.post("/submit-attendance", submitAttendance);

router.get("/get-attendance/:parentId/:year/:month", getAttendanceByMonth);

module.exports = router;
