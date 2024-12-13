const { User } = require("../models/user-model");
//  Register logic 
const register = async (req, res) => {
  try {
      const { username, email, number, password, city, state, gender, jobRole, department, jobPosition } = req.body;

      // Check if user already exists
      const userExist = await User.findOne({ email });

      if (userExist) {
          return res.status(400).json({ msg: "Email already exists" });
      }

      // Create user with the uploaded image path
      const userCreated = await User.create({
          username,
          email,
          number,
          password,
          city,
          state,
          gender,
          jobRole,
          department,
          jobPosition,
          // profileIMG: req.file.path // Save the path to the uploaded image
      });

      // Token generation
      const token = await userCreated.generateToken();

      res.status(200).json({
          msg: 'Registration successful',
          token,
          userId: userCreated._id.toString()
      });

  } catch (err) {
      res.status(500).json({ msg: 'Internal server error' });
  }
};


// Login logic
const login = async (req, res, next) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ message: 'Please provide both email/phone number and password' });
    }

    const userExist = await User.findOne({
      $or: [{ email: identifier }, { number: identifier }]
    });


    if (!userExist) {
      return res.status(404).json({ message: 'User not found' }); // Return 404 for user not found
    }

    const isPasswordCorrect = await userExist.ComparePassword(password);

    if (!isPasswordCorrect) {
      return res.status(401).json({ message: 'Password does not match' }); // Return 401 for incorrect password
    }

    if (userExist.status === 'blocked') {
      return res.status(403).json({ message: 'User is blocked. Please contact the admin.' });
    }


    if (isPasswordCorrect) {
      res.status(200).json({
        msg: 'Login Successful',
        token: await userExist.generateToken(),
        userId: userExist._id.toString(),
      });
    } else {
      res.status(401).json({ message: 'Invalid Credentials' });
    }

  } catch (error) {
    res.status(500).json({ msg: 'Internal server error' });
  }
};

const checkUser = async (req, res) => {
  try {
    const { email, number } = req.query;

    if (!email && !number) {
      return res.status(400).json({ message: 'Email or number is not exist ' });
    }

    // Create an empty filter object
    let filter = {};

    // Add the email and number fields to the filter if they are provided
    if (email) filter.email = email;
    if (number) filter.number = number;

    // Find if a user with this email or number exists
    const user = await User.findOne({
      $or: [{ email: email }, { number: number }]
    });

    // Prepare the response based on which fields already exist
    let response = { emailExists: false, numberExists: false };

    if (user) {
      if (user.email === email) response.emailExists = true;
      if (user.number === number) response.numberExists = true;
    }

    return res.json(response);
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
}

// Get User deta logic 
const user = async (req, res, next) => {
  try {
    const userData = await req.user
    res.status(200).json({ userData })
  } catch (error) {
    return res.status(500).json({ msg: 'Internal server error' });
  }
}

const registerUser = async (req, res) => {
  try {
    const loggedInUserId = req.user._id; // Logged-in user ID from middleware

    // Fetch all users except the logged-in user
    const users = await User.find({ _id: { $ne: loggedInUserId } }).select('-password');

    res.status(200).json({ users }); // Return the list of users
  } catch (error) {
    res.status(500).json({ msg: 'Failed to retrieve users', error: error.message });
  }
};

module.exports = { register, login, user, checkUser, registerUser }

