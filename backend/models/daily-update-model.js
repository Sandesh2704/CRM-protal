const mongoose = require('mongoose');


const dailyUpdateSchema = new mongoose.Schema({
    projectName: { type: String, required: true },
    description: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the User model
}, { timestamps: true });

const DailyUpdate = mongoose.model('DailyUpdate', dailyUpdateSchema);
module.exports = DailyUpdate;
