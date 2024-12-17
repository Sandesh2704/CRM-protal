const Notification = require('../models/notification-model'); 
const { User } = require('../models/user-model');


async function createBirthdayNotifications() {
    try {
        const today = new Date();
        const todayDate = today.toISOString().split('T')[0]; 
        const todayYearMonth = todayDate.slice(5); 

        const birthdayPeople = await User.find({
            dateOfBirth: { $regex: todayYearMonth }, 
        });

   
        if (birthdayPeople.length === 0) {
            console.log('No birthdays today');
            return;
        }


        for (const birthdayPerson of birthdayPeople) {

            const companyMembers = await User.find({ _id: { $ne: birthdayPerson._id } });

            const birthdayPersonNotification = new Notification({
                userId: birthdayPerson._id,
                type: 'birthday',
                message: `Happy Birthday, ${birthdayPerson.username}! Wishing you a wonderful year ahead from the company!`,
                createdAt: new Date(),
                read: false,
            });
            await birthdayPersonNotification.save();

            for (const member of companyMembers) {
                const otherMemberNotification = new Notification({
                    userId: member._id,
                    type: 'birthday',
                    message: `${birthdayPerson.name}'s birthday today! Don’t forget to wish them.`,
                    createdAt: new Date(),
                    read: false,
                });
                await otherMemberNotification.save();
            }
        }
    } catch (error) {
        console.error('Error creating birthday notifications:', error);
    }
}

module.exports = { createBirthdayNotifications };