const mongoose = require("mongoose")
// const mongo_url = 'mongodb+srv://sandeshdeshmukh2704:egaCa2CxbnvkQzW8@cluster0.fcubh.mongodb.net/Data?retryWrites=true&w=majority&appName=Cluster0'


const mongo_url = process.env.MONGO_URL

const connectDB = async () => {
    try {
        await mongoose.connect(mongo_url)
        console.log('Mongodb Connected Successfully...')
    } catch (err) {
        console.error("Database connection failed", err)
        process.exit(0)
    }
}

module.exports = connectDB

// const mongoose = require('mongoose')
// const mongo_url = process.env.MONGO_URL;
// // const Joi = require('joi');
// mongoose.connect(mongo_url)
// .then(()=>{
//     console.log("Mongodb Connected Successfully...");
// }).catch((err)=>{
//     console.log('', err)
// })