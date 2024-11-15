const mailjet = require('node-mailjet').apiConnect('c4ba9a2a3d4291445acdc74d7600443c', '26ec1c488342ec9c17f1b4116dfe5540');

// Function to send the email
const sendWelcomeEmail = (userData) => {
    const request = mailjet.post('send', { version: 'v3.1' }).request({
        Messages: [
            {
                From: {
                    Email: "sandeshdeshmukh2704@gmail.com",
                    Name: "Sandesh Deshmukh",
                },
                To: [
                    {
                        Email: userData.email,
                        Name: userData.username || 'New Member'
                    }
                ],
                Subject: 'Welcome to Vflyorions Technologies Pvt. Ltd.',
                TextPart: 'You have been added to our company platform.',
                HTMLPart: `
            <h1>Welcome to [Your Company Name]!</h1>
            <p>Hello ${userData.username || 'New Member'},</p>
            <p>We’re excited to inform you that you have been added to our platform.</p>
            <p>Here are your login details:</p>
            <ul>
            <li><strong>Email:</strong> ${userData.email}</li>
            <li><strong>Password:</strong> ${userData.password}</li>
          </ul>
          <p>Please log in to our website and explore your new workspace!</p>
          <p>Best Regards,</p>
          <p>Sandesh Deshmukh</p>
        `
            }
        ]
    });

    request
        .then((result) => {
            console.log(result.body);
        })
        .catch((err) => {
            console.error('Error sending email:', err.statusCode, err.response.data);
        });
};

module.exports = { sendWelcomeEmail };