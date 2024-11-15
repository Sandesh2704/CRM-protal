const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const attendanceSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true,
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // or any relevant model
    required: true // or remove if not required
  },
  staffId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    enum: ["Present", "Absent", "Leave", "Half Day", "Late Mark"],
    required: true,
  },
});

const Attendance = mongoose.model("Attendance", attendanceSchema);
module.exports = Attendance;