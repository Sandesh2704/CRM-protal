// routes/notification-router.js
const express = require('express');
const router = express.Router();
const { postNotification, getNotification } = require('../controller/notification-controller');



router.get('/:userId', getNotification);

router.post('/mark-read', postNotification);

module.exports = router;