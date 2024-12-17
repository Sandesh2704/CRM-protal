const { User } = require("../models/user-model");
const Task = require("../models/task-model");
const Notification = require("../models/notification-model");

const assignTask = async (req, res) => {
    try {
        const { title, description, deadline, assignerId, recipientId } = req.body;
        const assigner = await User.findById(assignerId);
        const recipient = await User.findById(recipientId);
        // Log recipient details

        if (!assigner) return res.status(404).json({ message: 'Assigner not found.' });
        if (!recipient) return res.status(404).json({ message: 'Recipient not found.' });

        const documents = req.files.map(file => ({
            name: file.originalname,
            url: `/uploads/${file.filename}`  // URL to access the file
        }));
        // Log documents array

        const newTask = new Task({
            assignerId: assigner._id,
            recipientId: recipient._id,
            deadline,
            status: 'Pending',
            title,
            description,
            documents
        });

         // Create notifications
        await Notification.create([
            {
                userId: recipient._id,
                type: 'task',  // New task
                message: `You have been assigned a new task: ${title}`,
                taskId: newTask._id, // Add taskId
                taskType: 'new',  // Indicate this is a new task
            },
        ]);

        await newTask.save();
        res.status(201).json({ message: 'Task assigned successfully', task: newTask });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};


const getAssignTask = async (req, res) => {
    try {
        const tasks = await Task.find({ recipientId: req.params.userId })
        .populate('recipientId', 'username email')
        .populate('assignerId', 'username email');

        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: "Server error." });
    }
};



const viewAssignedTasks = async (req, res) => {
    try {
        const { assignerId } = req.params;

        const tasks = await Task.find({ assignerId })
            .populate('recipientId', 'username email')
            .populate('assignerId', 'username email');

        res.status(200).json({ tasks });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};


const updateTaskStatus = async (req, res) => {
    try {
        const { taskId } = req.params;
        const { status, updateMessage } = req.body;

        // Find the task by ID
        const task = await Task.findById(taskId);
        if (!task) return res.status(404).json({ message: 'Task not found.' });

        // Update the status and add to updates if there's a message
        if (status) {
            task.status = status;  // Update the task status
        }

        if (updateMessage) {
            task.updates.push({
                description: updateMessage,
                status: task.status  // Store the current status along with the update message
            });
        }

        await task.save();
        // Create notifications


        await Notification.create({
            userId: task.assignerId, // Ensure this exists in the task object
            type: 'task',
            message: `Task '${task.title}' that you assigned has been updated. Status: ${task.status}`,
            taskId: task._id, // Add taskId here
            taskType: 'update',
        });

        res.status(200).json({ message: "Task updated successfully", task });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { assignTask, getAssignTask, viewAssignedTasks, updateTaskStatus }