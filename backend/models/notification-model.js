const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['task', 'announcement', 'birthday', 'other'], required: true },
    message: { type: String, required: true },
    taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' }, // Add taskId
    taskType: { type: String, enum: ['new', 'update'] }, // Add taskType
    createdAt: { type: Date, default: Date.now },
    read: { type: Boolean, default: false },
});

notificationSchema.index({ userId: 1, read: 1 });

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
