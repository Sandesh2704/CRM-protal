const { User } = require("../models/user-model");
const DailyUpdate = require("../models/daily-update-model");

const submitDailyUpdate = async (req, res) => {
    try {
        const { projectName, description } = req.body;

        // Ensure user is authenticated and user ID is available in req.user
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const update = new DailyUpdate({
            projectName,
            description,
            user: req.user._id,
        });

        await update.save();

        res.status(201).json({ message: 'Daily update submitted successfully', update });
    } catch (error) {
        res.status(500).json({ message: 'Error creating daily update', error });
    }
};


const getDailyUpdate = async (req, res) => {
    try {
        const updates = await DailyUpdate.find()
            .populate('user', 'username department jobRole profileIMG') // Ensure all required fields are populated
            .sort({ createdAt: -1 });

        res.status(200).json(updates);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching daily updates', error });
    }
};

const getUserUpdates = async (req, res) => {
    try {
        const { userId } = req.params;

        // Validate the userId
        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        const updates = await DailyUpdate.find({ user: userId })
            .populate('user', 'username department') // Populate username and department
            .sort({ createdAt: -1 });

        res.status(200).json(updates);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user updates', error });
    }
};



const getTeamUpdates = async (req, res) => {
    try {
        const teamMembers = await User.find({ parentId: req.user._id }, '_id username department jobRole profileIMG');
        const teamMemberIds = teamMembers.map(member => member._id);

        const updates = await DailyUpdate.find({ user: { $in: teamMemberIds } })
            .populate('user', 'username department jobRole profileIMG')
            .sort({ createdAt: -1 });

        res.status(200).json({ teamMembers, updates });
    } catch (error) {
        console.error("Error fetching team updates:", error);
        res.status(500).json({ message: 'Error fetching team updates', error });
    }
};


module.exports = { getDailyUpdate, submitDailyUpdate,  getUserUpdates, getTeamUpdates };