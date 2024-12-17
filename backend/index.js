require("dotenv").config()
const express = require("express")
const app = express()
const connectDB = require("./dbconnect/dbconnect")
const cors = require('cors');
const path = require('path');
const authRoute = require("./Router/auth-router")
const taskManage = require("./Router/task-router")
const departementManage = require("./Router/department-router")
const userManage = require("./Router/user-router")
const attendanceManage = require('./Router/attendance-router');
const dailyUpdateManage = require('./Router/daily-update-router');
const notificationManage = require("./Router/notification-router")
const { createBirthdayNotifications } = require("./controller/brithday-Notification-controller");
const cron = require('node-cron');

// app.use(cors());
app.use(cors({
    origin: ['http://localhost:3000'], // Frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true // If you need to handle cookies or session tokens
}))


app.use(express.json())

//  to get all functionality for image uplaod  
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// auth 
app.use("/auth", authRoute)

app.use("/departementManage", departementManage)

app.use("/userManage", userManage)

app.use("/taskManage", taskManage)

app.use('/attendanceManage', attendanceManage);

app.use('/dailyUpdateManage', dailyUpdateManage);

app.use('/notificationManage', notificationManage);



// Schedule the task to run daily at midnight
cron.schedule('0 0 * * *', async () => {
    console.log('Running scheduled task for birthday notifications');
    await createBirthdayNotifications();
});


app.get("/", (req, res) => {
    res.status(200).send("welcome")
})


const PORT = 8000;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`server is running at port: ${PORT}`)
    })
})