import { useEffect, useState } from "react";
import { useAuth } from "../authProvider/AuthProvider";
import axios from "axios";

export const useFetchYourTasks = () => {
    const { user, token } = useAuth();
    const userId = user?._id;
    const [yourTasks, setYourTasks] = useState([]);
    const [yourPendingTasks, setYourPendingTasks] = useState([]);

    const fetchTasks = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_DOMAIN_URL}/taskManage/get-assign-task/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const tasks = response.data;
            setYourTasks(tasks);

            // Filter tasks with status "Pending"
            const pendingTasks = tasks.filter((task) => task.status === "Pending");
            setYourPendingTasks(pendingTasks);
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    };

    // Add a new task to the state


    useEffect(() => {
        const initializeTasks = async () => {
            if (userId && token) {
                await fetchTasks();
            }
        };
        initializeTasks();
    
        const interval = setInterval(() => {
            if (userId && token) {
                fetchTasks();
            }
        }, 5000); // Fetch tasks every 5 seconds
    
        return () => clearInterval(interval); // Cleanup interval on unmount
    }, [user, token]);

    return { yourTasks, yourPendingTasks, fetchTasks, setYourTasks };
};