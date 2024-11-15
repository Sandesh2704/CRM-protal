import axios from 'axios';
import { toast } from 'react-toastify';

export const checkUserExists = async (email, number) => {
    try {
        const response = await axios.get(`${process.env.REACT_APP_DOMAIN_URL}/auth/check-user`, {
            params: { email, number },
        });

        const { emailExists, numberExists } = response.data;

        if (emailExists) {
            toast.error('Email already exists in the database.', {
                position: 'top-right',
                autoClose: 3000,
            });
            return true;
        }

        if (numberExists) {
            toast.error('Phone number already exists in the database.', {
                position: 'top-right',
                autoClose: 3000,
            });
            return true;
        }

        return false;
    } catch (error) {
        console.error('Error checking user:', error);
        toast.error('Failed to check user. Please try again.', {
            position: 'top-right',
            autoClose: 3000,
        });
        return true;
    }
};

export const validateInputs = (user) => {
    const { username, email, number, password } = user;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;



    if (!emailRegex.test(email)) {
        toast.error('Please enter a valid email address.', {
            position: 'top-right',
            autoClose: 3000,
        });
        return false;
    }

    if (!phoneRegex.test(number)) {
        toast.error('Phone number must be exactly 10 digits.', {
            position: 'top-right',
            autoClose: 3000,
        });
        return false;
    }

    if (password.length < 5 || password.length > 10) {
        toast.error('Password must be between 5 and 10 characters long.', {
            position: 'top-right',
            autoClose: 3000,
        });
        return false;
    }

    if (!username || !email || !number || !password) {
        toast.error('Username, email, phone number,  and password are required.', {
            position: 'top-right',
            autoClose: 3000,
        });
        return false;
    }

    return true;
};