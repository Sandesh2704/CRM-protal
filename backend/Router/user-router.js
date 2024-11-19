const express = require("express");
const { addUser, getUsers, editUser } = require("../controller/user-controller");
const upload = require('../multerconfig/uploadConfig');
const authmiddleware = require("../middleware/auth-middleware");
const router = express.Router();

router.route("/user/add").post( upload.single('profileIMG'), addUser);
router.get('/user/:parentId',getUsers); 
router.route("/edit/:userId").put(upload.single('profileIMG'), editUser);

module.exports = router;