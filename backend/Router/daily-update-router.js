const express = require("express");
const router = express.Router();
const { submitDailyUpdate, getDailyUpdate, getUserUpdates, getTeamUpdates } = require("../controller/daily-update-controller");
const authmiddleware = require("../middleware/auth-middleware");

router.get("/", (req, res) => {
    res.status(200).send("Welcome to Daily Update System");
});

router.post("/submit-daily-update",authmiddleware, submitDailyUpdate);

router.get("/gat-daily-update",authmiddleware, getDailyUpdate);

router.get("/user-updates/:userId", authmiddleware, getUserUpdates);

router.get("/team-updates", authmiddleware, getTeamUpdates);

module.exports = router;