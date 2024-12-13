


const Notification = require('../models/notification-model');

const getNotification =  async (req, res) => {
    try {
        const { userId } = req.params;
        const notifications = await Notification.find({ userId })
            .sort({ createdAt: -1 });

        res.status(200).json(notifications);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
}

const postNotification =  async (req, res) => {
    try {
        const { notificationIds } = req.body; // Array of notification IDs to mark as read

        await Notification.updateMany(
            { _id: { $in: notificationIds } },
            { $set: { read: true } }
        );

        res.status(200).json({ message: 'Notifications marked as read' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
}

module.exports = { postNotification, getNotification };