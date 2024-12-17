// routes/notification-router.js
const express = require('express');
const router = express.Router();
const { getNotification, markAllNotificationsRead, markNotificationRead } = require('../controller/notification-controller');


router.get('/getNotification/:userId', getNotification);

router.post('/markAllRead/:userId', markAllNotificationsRead);

router.post('/markRead/:notificationId', markNotificationRead);

module.exports = router;