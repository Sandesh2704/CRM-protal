const express = require("express");
const { addUser, getUsers } = require("../controller/user-controller");
const upload = require('../multerconfig/uploadConfig');
const router = express.Router();

router.route("/user/add").post(upload.single('profileIMG'), addUser);
router.get('/user/:parentId', getUsers); 

module.exports = router;