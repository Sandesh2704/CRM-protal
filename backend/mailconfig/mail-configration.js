// const mailjet = require('node-mailjet').apiConnect('c4ba9a2a3d4291445acdc74d7600443c', '26ec1c488342ec9c17f1b4116dfe5540');

// // Function to send the email
// const sendWelcomeEmail = (userData) => {
//     const request = mailjet.post('send', { version: 'v3.1' }).request({
//         Messages: [
//             {
//                 From: {
//                     Email: "sandeshdeshmukh2704@gmail.com",
//                     Name: "Sandesh Deshmukh",
//                 },
//                 To: [
//                     {
//                         Email: userData.email,
//                         Name: userData.username || 'New Member'
//                     }
//                 ],
//                 Subject: 'Welcome to Vflyorions Technologies Pvt. Ltd.',
//                 TextPart: 'You have been added to our company platform.',
//                 HTMLPart: `
//                 <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; color: #333;">
//                     <div style="max-width: 600px; margin: auto; background-color: #fff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); overflow: hidden;">
//                         <!-- Header Section -->
//                         <div style="background: linear-gradient(90deg, rgba(106,3,194,1) 50%, rgba(231,16,212,1) 100%); color: #fff; padding: 20px; text-align: center;">
//                             <h1 style="margin: 0;">Welcome to Vflyorions Technologies Pvt. Ltd!</h1>
//                         </div>
                
//                         <!-- Body Section -->
//                         <div style="padding: 20px;">
//                             <p style="font-size: 16px;">Hello <strong>${userData.username || 'New Member'}</strong>,</p>
//                             <p style="font-size: 16px; line-height: 1.5;">
//                                 We’re excited to inform you that you’ve been added to our platform! Below are your login details:
//                             </p>
//                             <ul style="list-style-type: none; padding: 0; font-size: 16px;">
//                                 <li style="margin-bottom: 10px;">
//                                     <strong>Email:</strong> ${userData.email}
//                                 </li>
//                                 <li style="margin-bottom: 10px;">
//                                     <strong>Password:</strong> ${userData.password}
//                                 </li>
//                             </ul>
//                             <p style="font-size: 16px; line-height: 1.5;">Please log in to our website to explore your new workspace!</p>
                
//                             <!-- Call-to-Action Button -->
//                             <div style="text-align: center; margin: 20px 0;">
//                                 <a href="https://your-login-url.com" style="background: linear-gradient(90deg, rgba(106,3,194,1) 50%, rgba(231,16,212,1) 100%);; color: #fff; text-decoration: none; padding: 12px 25px; font-size: 16px; border-radius: 5px; display: inline-block; font-weight: bold;">
//                                     Login Now
//                                 </a>
//                             </div>
//                         </div>
                
//                         <!-- Footer Section -->
//                         <div style="background-color: #f4f4f4; padding: 15px; text-align: center; font-size: 14px; color: #666;">
//                             <p style="margin: 0;">
//                                 If you have any questions, feel free to reach out to our support team at 
//                                 <a href="mailto:support@vflyorions.com" style="color: #007bff; text-decoration: none;">support@vflyorions.com</a>.
//                             </p>
//                             <p style="margin: 0; margin-top: 10px;">Best Regards,</p>
//                             <p style="margin: 0; font-weight: bold;">Vflyorions Technologies Pvt. Ltd!</p>
//                         </div>
//                     </div>
//                 </div>
//                 `
//             }
//         ]
//     });

//     request
//         .then((result) => {
//             console.log(result.body);
//         })
//         .catch((err) => {
//             console.error('Error sending email:', err.statusCode, err.response.data);
//         });
// };

// module.exports = { sendWelcomeEmail };

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
                        <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; color: #333;">
                            <div style="max-width: 600px; margin: auto; background-color: #fff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); overflow: hidden;">
                                <!-- Header Section -->
                                <div style="background: linear-gradient(90deg, rgba(106,3,194,1) 50%, rgba(231,16,212,1) 100%); color: #fff; padding: 20px; text-align: center;">
                                    <h1 style="margin: 0;">Welcome to Vflyorions Technologies Pvt. Ltd!</h1>
                                </div>
                        
                                <!-- Body Section -->
                                <div style="padding: 20px;">
                                    <p style="font-size: 16px;">Hello <strong>${userData.username || 'New Member'}</strong>,</p>
                                    <p style="font-size: 16px; line-height: 1.5;">
                                        We’re excited to inform you that you’ve been added to our platform! Below are your login details:
                                    </p>
                                    <ul style="list-style-type: none; padding: 0; font-size: 16px;">
                                        <li style="margin-bottom: 10px;">
                                            <strong>Email:</strong> ${userData.email}
                                        </li>
                                        <li style="margin-bottom: 10px;">
                                            <strong>Password:</strong> ${userData.password}
                                        </li>
                                    </ul>
                                    <p style="font-size: 16px; line-height: 1.5;">Please log in to our website to explore your new workspace!</p>
                        
                                    <!-- Call-to-Action Button -->
                                    <div style="text-align: center; margin: 20px 0;">
                                        <a href="https://your-login-url.com" style="background: linear-gradient(90deg, rgba(106,3,194,1) 50%, rgba(231,16,212,1) 100%);; color: #fff; text-decoration: none; padding: 12px 25px; font-size: 16px; border-radius: 5px; display: inline-block; font-weight: bold;">
                                            Login Now
                                        </a>
                                    </div>
                                </div>
                        
                                <!-- Footer Section -->
                                <div style="background-color: #f4f4f4; padding: 15px; text-align: center; font-size: 14px; color: #666;">
                                    <p style="margin: 0;">
                                        If you have any questions, feel free to reach out to our support team at 
                                        <a href="mailto:support@vflyorions.com" style="color: #007bff; text-decoration: none;">support@vflyorions.com</a>.
                                    </p>
                                    <p style="margin: 0; margin-top: 10px;">Best Regards,</p>
                                    <p style="margin: 0; font-weight: bold;">Vflyorions Technologies Pvt. Ltd!</p>
                                </div>
                            </div>
                        </div>
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