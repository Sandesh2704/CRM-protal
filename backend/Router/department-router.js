const { getDepartment, createDepartment, deleteDepartmentId } = require("../controller/department-controller");
const express = require("express")
const router = express.Router()

router.get("/", (req,res)=>{
    res
    .send("Welcome hi")
    .status(200)
})

router.route("/get-department").get(getDepartment);
router.route("/add-new-department").post(createDepartment)
router.route("/delete-department/:id").delete(deleteDepartmentId)


module.exports = router