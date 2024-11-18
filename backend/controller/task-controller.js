const { User } = require("../models/user-model");
const Task = require("../models/task-model");

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

        await newTask.save();
        res.status(201).json({ message: 'Task assigned successfully', task: newTask });
    } catch (err) {
        console.error('Error in assignTask:', err);
        res.status(500).json({ message: 'Server error' });
    }
};


const getAssignTask = async (req, res) => {
    try {

        const tasks = await Task.find({ recipientId: req.params.userId }).populate('assignerId recipientId', 'username');
        

        
        if (tasks.length === 0) {
            return res.status(404).json({ message: "No tasks available for this user." });
        }
        res.json(tasks);
    } catch (error) {
        console.error("Error fetching tasks:", error);
        res.status(500).json({ message: "Server error." });
    }
};

const viewAssignedTasks = async (req, res) => {
    try {
        const { assignerId } = req.params; 

        const tasks = await Task.find({ assignerId })
            .populate('recipientId', 'name email')
            .populate('assignerId', 'name email');

        if (!tasks || tasks.length === 0) {
            return res.status(404).json({ message: 'No tasks found for this assigner.' });
        }

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
        task.status = status || task.status;
        if (updateMessage) {
            task.updates.push({ description: updateMessage });
        }

        await task.save();

        res.status(200).json({ message: "Task updated successfully", task });
    } catch (err) {
        console.error('Error in updateTaskStatus:', err);
        res.status(500).json({ message: 'Server error' });
    }
};


module.exports = {  assignTask, getAssignTask, viewAssignedTasks, updateTaskStatus }

