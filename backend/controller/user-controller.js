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
        console.error('Error in getUsers:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

const addUser = async (req, res) => {
    try {
        const { parentId, username, email, number, password,department, jobPosition, jobRole, city, state, gender, joiningDate } = req.body;

        const profileIMG = req.file ? req.file.path : null;

        console.log("Adding user with role:", jobPosition);
        console.log("Parent ID:", parentId);

        // Fetch parent user
        const parentUser = await User.findById(parentId);
        if (!parentUser) {
            console.log("Invalid parent user ID.");
            return res.status(400).json({ message: 'Invalid parent user.' });
        }

        console.log("Parent user found with job position:", parentUser.jobPosition);

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
                console.log(`Invalid parent role for ${jobPosition}. Expected one of: ${expectedRoles.join(', ')}`);
                return res.status(400).json({ message: `Invalid parent for ${jobPosition}.` });
            }
        } else if (expectedRoles !== jobPosition) {
            console.log(`Invalid parent role for ${jobPosition}. Expected parent role: ${expectedRoles}`);
            return res.status(400).json({ message: `Invalid parent for ${jobPosition}.` });
        }

        

        // Check if email is already registered
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log("Email already exists.");
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
        console.log("New user added successfully:", newUser);
        res.status(201).json({ message: `${jobPosition} added successfully`, user: newUser });
    } catch (err) {
        console.error('Error in addUser:', err);
        res.status(500).json({ message: 'Server error' });
    }
};


const editUser = async (req, res) => {
    try {
      console.log("Request received at editUser");
      console.log("Params:", req.params); // Log route parameters
      console.log("Body:", req.body);     // Log request body
      console.log("File:", req.file);     // Log uploaded file
  
      const { userId } = req.params;
      const { username, email, number, department, jobPosition, jobRole, city, state, gender, joiningDate } = req.body;
  
      const user = await User.findById(userId);
      if (!user) {
        console.error("User not found");
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
  
      await user.save();
  
      console.log("User updated successfully:", user);
      res.status(200).json({ message: 'User profile updated successfully.', user });
    } catch (err) {
      console.error("Error in editUser:", err);
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  };
  
module.exports = { addUser, getUsers, editUser };