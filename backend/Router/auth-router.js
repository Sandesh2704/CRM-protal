const express = require("express")
const { register, login, user, checkUser, registerUser } = require("../controller/auth-controller")
const authmiddleware = require("../middleware/auth-middleware")
const router = express.Router()
const upload = require('../multerconfig/uploadConfig')

router.get("/", (req, res) => {
    res.send("Welcome hi").status(200)
})

router.route("/register").post(upload.single('profileIMG'), register);
router.route("/login").post(login)
router.route("/check-user").get(checkUser)
router.route("/user").get(authmiddleware, user)
router.route("/registerUser").get(authmiddleware, registerUser)

module.exports = router