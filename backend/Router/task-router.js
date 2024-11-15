const express = require("express")
const router = express.Router()
const { assignTask, getAssignTask, updateTaskStatus, viewAssignedTasks } = require("../controller/task-controller")
const upload = require("../multerconfig/uploadConfig")
router.get("/", (req, res) => {
    res.send("Welcome hi").status(200)
})

router.route("/assign-task").post(upload.array('documents', 10), (req, res) => {
    console.log("Assign Task Endpoint Hit");               // Log when the endpoint is hit
    console.log("Request Body:", req.body);
    console.log("Files Received:", req.files);
    assignTask(req, res);
});

router.route("/get-assign-task/:userId").get(getAssignTask);

router.route("/view-assigned-task/:assignerId").get(viewAssignedTasks);

router.route("/task/update/:taskId").post(updateTaskStatus);


module.exports = router