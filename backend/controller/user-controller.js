const { sendWelcomeEmail } = require("../mailconfig/mail-configration");
const { User } = require("../models/user-model");

const getUsers = async (req, res) => {
    try {
        const { parentId } = req.params;
        const creator = await User.findById(parentId);

        if (!creator) {
            return res.status(400).json({ message: 'Invalid creator.' });
        }

        // Find users created by this creator
        const users = await User.find({ parentId });

        if (users.length === 0) {
            return res.status(404).json({ message: 'No users found.' });
        }

        res.status(200).json({ users });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

const addUser = async (req, res) => {
    try {
        const { parentId, username, email, number, password, department, jobPosition, jobRole, city, state, gender, joiningDate } = req.body;

        const profileIMG = req.file ? req.file.path : null;

        // Fetch parent user
        const parentUser = await User.findById(parentId);
        if (!parentUser) {
            return res.status(400).json({ message: 'Invalid parent user.' });
        }

        const validRoles = {
            'Founder': 'Manager',
            'Manager': ['Team Leader', 'Employee'],
            'Team Leader': 'Employee',
        };

        // Check if the parent's role matches the validRoles map for the child role
        const expectedRoles = validRoles[parentUser.jobPosition];

        // If `expectedRoles` is an array, check if it includes `jobPosition`. Otherwise, compare directly.
        if (Array.isArray(expectedRoles)) {
            if (!expectedRoles.includes(jobPosition)) {
                return res.status(400).json({ message: `Invalid parent for ${jobPosition}.` });
            }
        } else if (expectedRoles !== jobPosition) {
            return res.status(400).json({ message: `Invalid parent for ${jobPosition}.` });
        }


        // Check if email is already registered
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists.' });
        }

        // Create new user with a direct reference to parentId
        const newUser = new User({
            username,
            email,
            number,
            password,
            department,
            jobPosition,
            jobRole,
            city,
            state,
            gender,
            profileIMG,
            joiningDate,
            parentId: parentUser._id, // Directly set the parentId
        });

        sendWelcomeEmail(newUser);


        await newUser.save();
        res.status(201).json({ message: `${jobPosition} added successfully`, user: newUser });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};


const editUser = async (req, res) => {
    try {
        // Log uploaded file

        const { userId } = req.params;
        const { username, email, number, department, jobPosition, jobRole, city, state, gender, joiningDate,  dateOfBirth } = req.body;

        const user = await User.findById(userId);
        if (!user) {

            return res.status(404).json({ message: 'User not found.' });
        }

        if (req.file) {
            user.profileIMG = req.file.path;
        }

        if (username) user.username = username;
        if (email) user.email = email;
        if (number) user.number = number;
        if (department) user.department = department;
        if (jobPosition) user.jobPosition = jobPosition;
        if (jobRole) user.jobRole = jobRole;
        if (city) user.city = city;
        if (state) user.state = state;
        if (gender) user.gender = gender;
        if (joiningDate) user.joiningDate = joiningDate;
        if (dateOfBirth) user.dateOfBirth =  dateOfBirth
        await user.save();


        res.status(200).json({ message: 'User profile updated successfully.', user });
        
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

const blockUser = async (req, res) => {
    try {
        const { userId } = req.body;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.status = 'blocked';
        await user.save();

        res.status(200).json({ message: `User ${user.username} has been blocked.` });
    } catch (error) {
        console.error('Block User Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


const unblockUser = async (req, res) => {
    try {
        const { userId } = req.body;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.status = 'active';
        await user.save();

        res.status(200).json({ message: `User ${user.username} has been unblocked.` });
    } catch (error) {
        console.error('Unblock User Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { addUser, getUsers, editUser };