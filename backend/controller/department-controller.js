const Department = require("../models/department-model");

const createDepartment = async (req, res) => {
    try {
        await Department.create(req.body);
        return res.status(200).json({ mess: "Department is created successfully" });
    } catch (err) {
        return res.status(500).json({ msg: 'Department is not created - server error' });
    }
};

const getDepartment = async (req, res, next) => {
    try {
        const departmentList = await Department.find();
        if (!departmentList || departmentList.length === 0) {
            return res.status(404).json({ message: "No departments found" });
        }
        return res.status(200).json(departmentList);
    } catch (err) {
        next(err);
    }
};

const deleteDepartmentId = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deletedDepartment = await Department.findByIdAndDelete(id);
        if (!deletedDepartment) {
            return res.status(404).json({ message: "Helps not found" });
        }
        return res.status(200).json({ message: "Helps deleted successfully" });
    } catch (err) {
        next(err);
    }
};


module.exports = { createDepartment, getDepartment, deleteDepartmentId };