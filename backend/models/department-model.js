const mongoose = require('mongoose');


const DepartmentSchema = new mongoose.Schema({
    title: { type: String, required: true },
}, { timestamps: true });

const Department = mongoose.model('Department', DepartmentSchema);
module.exports = Department;
