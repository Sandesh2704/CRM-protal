const Notification = require('../models/notification-model');

const getNotification = async (req, res) => {
    try {
        const { userId } = req.params;
        const notifications = await Notification.find({ userId })
            .sort({ createdAt: -1 });
        res.status(200).json(notifications);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
}


const markNotificationRead = async (req, res) => {
    const { notificationId } = req.params;
    try {
        const notification = await Notification.findByIdAndUpdate(
            notificationId,
            { read: true },
            { new: true }
        );
        res.status(200).json(notification);
    } catch (error) {
        res.status(500).json({ message: 'Error marking notification as read' });
    }
};

const markAllNotificationsRead = async (req, res) => {
    const { userId } = req.params;
    try {
        await Notification.updateMany(
            { userId, read: false },
            { read: true }
        );
        res.status(200).json({ message: 'All notifications marked as read' });
    } catch (error) {
        res.status(500).json({ message: 'Error marking all notifications as read' });
    }
};

module.exports = { getNotification, markAllNotificationsRead, markNotificationRead };