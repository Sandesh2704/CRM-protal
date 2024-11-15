import axios from 'axios';
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [user, setUser] = useState("");

    const storeTokenInLS = (serverToken) => {
        localStorage.setItem('token', serverToken);
        setToken(serverToken);
    };

    const isLoggedIn = !!token;

    const LogoutUser = () => {
        setToken('');
        localStorage.removeItem('token');
        setUser(null);
    };

    // JWT Authentication - to get user currently logged-in user data
    const userAuthentication = useCallback(async () => {
        if (!token) return;  // Only fetch if token exists

        try {
            const response = await axios.get(`${process.env.REACT_APP_DOMAIN_URL}/auth/user`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                const { userData } = response.data;  // Assuming response contains userData
                setUser(userData);
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    }, [token]); // `token` is the dependency

    // Run user authentication whenever the token changes
    useEffect(() => {
        userAuthentication();
    }, [userAuthentication]);  // Add `userAuthentication` as a dependency

    const userJobPosition = user ? user.jobPosition : null;
console.log('userJobPosition', userJobPosition)
    return (
        <AuthContext.Provider value={{ storeTokenInLS, LogoutUser, user, token, isLoggedIn, userJobPosition}}>
            {children}
        </AuthContext.Provider>
    );
};

const useAuth = () => {
    const authContextValue = useContext(AuthContext);
    if (!authContextValue) {
        throw new Error("useAuth used outside of the provider");
    }
    return authContextValue;
};

export { AuthProvider, useAuth };