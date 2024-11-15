const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    title: String,
    description: String,
    deadline: Date,
    status: String,
    assignerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    recipientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    documents: [{ name: String, url: String }],
    updates: [
        {
            description: String,
            updatedAt: { type: Date, default: Date.now }
        }
    ]
}, { timestamps: true });

const Task = mongoose.model('Task', TaskSchema);
module.exports = Task;