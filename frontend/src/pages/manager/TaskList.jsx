// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { MdOutlineDownloading } from "react-icons/md";
// import { useAuth } from '../../authProvider/AuthProvider';

// export default function TaskList() {
//     const { user, token } = useAuth();
//     const [tasks, setTasks] = useState([]);
//     const [updateDescription, setUpdateDescription] = useState('');
//     const [taskStatus, setTaskStatus] = useState('pending');

//     useEffect(() => {
//         const fetchTasks = async () => {
//             try {
//                 const response = await axios.get(`${process.env.REACT_APP_DOMAIN_URL}/taskManage/get-assign-task/${user._id}`, {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                     },
//                 });
//                 console.log("Fetched tasks:", response.data); // Log fetched tasks
//                 setTasks(response.data);
//             } catch (error) {
//                 console.error("Error fetching tasks:", error);
//                 setTasks([]);
//             }
//         };

//         if (user._id) {
//             fetchTasks();
//         }
//     }, [user, token]);

//     const handleUpdateSubmit = async (taskId) => {
//         try {
//             const response = await axios.post(`${process.env.REACT_APP_DOMAIN_URL}/taskManage/task/update/${taskId}`, 
//             { 
//                 status: taskStatus,
//                 updateMessage: updateDescription 
//             },
//             {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                 },
//             });

//             console.log("Task update response:", response.data); // Log response data

//             // Update task list with the new description after successful update
//             setTasks(tasks.map(task => 
//                 task._id === taskId ? response.data.task : task
//             ));

//             setUpdateDescription(''); // Reset input field
//             setTaskStatus('pending'); // Reset status to pending
//         } catch (error) {
//             console.error("Error updating task:", error);
//         }
//     };


//     if (!tasks.length) return <p>No tasks available for you.</p>;

//     return (
//         <div>
//             <div className="max-w-3xl mx-auto p-6">
//                 <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Assigned Tasks</h2>
//                 <ul className="space-y-6">
//                     {tasks.slice().reverse().map((task) => (
//                         <li key={task._id} className="p-6 bg-white rounded-lg shadow-md border border-gray-200">
//                             <h3 className="text-xl font-semibold text-gray-800">{task.title}</h3>
//                             <p className="text-gray-600 mb-2">{task.description}</p>
//                             <p className="text-gray-500 text-sm"><strong>Assigned by:</strong> {task.assignerId.username}</p>
//                             <p className="text-gray-500 text-sm"><strong>Deadline:</strong> {new Date(task.deadline).toLocaleDateString()}</p>

//                             <div className="mt-4">
//                                 <h4 className="font-semibold text-gray-700 mb-2">Updates:</h4>
//                                 {task.updates && task.updates.length > 0 ? (
//                                     <ul className="space-y-2">
//                                         {task.updates.map((update, index) => (
//                                             <li key={index} className="text-gray-700">
//                                                 <strong>Date:</strong> {new Date(update.updatedAt).toLocaleDateString()}<br />
//                                                 <strong>Update:</strong> {update.description}
//                                             </li>
//                                         ))}
//                                     </ul>
//                                 ) : (
//                                     <p className="text-gray-500">No updates yet.</p>
//                                 )}
//                             </div>

//                             {task.documents && task.documents.length > 0 && (
//                                 <div className="mt-4">
//                                     <p className="font-semibold text-gray-700 mb-2">Documents:</p>
//                                     <ul className="space-y-2">
//                                         {task.documents.map((doc, index) => (
//                                             <li key={index} className="flex items-center justify-between bg-gray-100 p-2 rounded-md">
//                                                 <span className="text-gray-700">{doc.name}</span>
//                                                 <a
//                                                     href={`${process.env.REACT_APP_DOMAIN_URL}${doc.url}`}
//                                                     target="_blank"
//                                                     rel="noopener noreferrer"
//                                                     download
//                                                     className="text-blue-500 hover:text-blue-700 flex items-center"
//                                                 >
//                                                     <MdOutlineDownloading className="h-5 w-5 mr-1" />
//                                                     <span>Download</span>
//                                                 </a>
//                                             </li>
//                                         ))}
//                                     </ul>
//                                 </div>
//                             )}

//                             {/* Update Task Form */}
//                             <from className="mt-4">
//                                 <input
//                                     type="text"
//                                     placeholder="Enter update description..."
//                                     value={updateDescription}
//                                     onChange={(e) => setUpdateDescription(e.target.value)}
//                                     className="border border-gray-300 p-2 rounded-md w-full mb-2"
//                                 />
//                                 <div className="flex items-center mb-4">
//                                     <input
//                                         type="checkbox"
//                                         checked={taskStatus === 'complete'}
//                                         onChange={() => setTaskStatus(taskStatus === 'pending' ? 'complete' : 'pending')}
//                                         className="mr-2"
//                                     />
//                                     <label>Complete</label>
//                                 </div>
//                                 <button
//                                     onClick={() => handleUpdateSubmit(task._id)}
//                                     className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
//                                 >
//                                     Submit Update
//                                 </button>
//                             </from>
//                         </li>
//                     ))}
//                 </ul>
//             </div>
//         </div>
//     );
// }


// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { Link } from 'react-router-dom';
// import { useAuth } from '../../authProvider/AuthProvider';

// export default function TaskList() {
//     const { user, token } = useAuth();
//     const [tasks, setTasks] = useState([]);

//     useEffect(() => {
//         const fetchTasks = async () => {
//             try {
//                 console.log("Fetching tasks for user:", user._id);
//                 const response = await axios.get(`${process.env.REACT_APP_DOMAIN_URL}/taskManage/get-assign-task/${user._id}`, {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                     },
//                 });
//                 console.log("Tasks fetched:", response.data);
//                 setTasks(response.data);
//             } catch (error) {
//                 console.error("Error fetching tasks:", error);
//             }
//         };

//         if (user._id) {
//             fetchTasks();
//         }
//     }, [user, token]);

//     if (!tasks.length) return <p>No tasks available for you.</p>;

//     return (
//         <div className="max-w-3xl mx-auto p-6">
//             <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Assigned Tasks</h2>
//             {tasks.map((task) => {
//                 const { deadline, title, description, _id, status } = task;
//                 return (
//                     <div key={_id} className="bg-white shadow rounded-2xl px-4 py-6 mb-4">
//                         <p className={`rounded-full text-sm font-semibold ${status === 'completed' ? 'text-green-500' : 'text-red-500'}`}>
//                             {status.charAt(0).toUpperCase() + status.slice(1)}
//                         </p>
//                         <h3 className="font-semibold text-3xl mt-2 mb-4">{title}</h3>
//                         <p>{description.split(' ').slice(0, 50).join(' ') + '...'}</p>
//                         <p className="mt-4">Deadline: {new Date(deadline).toLocaleDateString()}</p>
//                         <div className="text-center mt-3">
//                             <Link
//                                 to={`/manager/yourTaskDeatils/${_id}`}
//                                 state={{ assignTaskDetails: task }}
//                                 className="text-xs text-indigo-500 italic hover:underline hover:text-indigo-600 font-medium"
//                             >
//                                 View Details
//                             </Link>
//                         </div>
//                     </div>
//                 );
//             })}
//         </div>
//     );
// }


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../../authProvider/AuthProvider';
import PageHeader from '../../component/PageHeader';
import { VscTasklist } from 'react-icons/vsc';

export default function TaskList() {
    const { user, token } = useAuth();
    const [tasks, setTasks] = useState([]);
    useEffect(() => {
        const fetchTasks = async () => {
            try {
                console.log("Fetching tasks for user:", user._id);
                const response = await axios.get(`${process.env.REACT_APP_DOMAIN_URL}/taskManage/get-assign-task/${user._id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                console.log("Tasks fetched:", response.data);
                setTasks(response.data);
            } catch (error) {
                console.error("Error fetching tasks:", error);
            }
        };

        if (user._id) {
            fetchTasks();
        }
    }, [user, token]);



    // Function to format assignment date for grouping
    const formatAssignmentDate = (date) => {
        const taskDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);

        if (taskDate.toDateString() === today.toDateString()) return 'Today';
        if (taskDate.toDateString() === yesterday.toDateString()) return 'Yesterday';
        return taskDate.toLocaleDateString();
    };

    // Group tasks by assignment date (createdAt)
    const groupedTasks = tasks.reduce((acc, task) => {
        const dateKey = formatAssignmentDate(task.createdAt);
        if (!acc[dateKey]) acc[dateKey] = [];
        acc[dateKey].push(task);
        return acc;
    }, {});

    return (
        <>
             <div>
                <PageHeader title='Your Task' icon={<VscTasklist />} />
            </div>

            {Object.keys(groupedTasks).length > 0 ? (
                Object.entries(groupedTasks).reverse().map(([date, tasks]) => (
                    <div key={date} className="mb-6">
                        <div className="flex justify-center items-center mb-7 gap-6">
                        <div className='h-[1px] w-full bg-gradient-to-r from-blue-400 to-purple-400 flex-1' />
                            <h2 className="text-gray-600 text-base">{date}</h2>
                            <div className='h-[1px] w-full bg-gradient-to-r from-blue-400 to-purple-400 flex-1' />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {tasks.map((task) => {
                                const { deadline, title, description, _id, status } = task;
                                return (
                                    <div key={_id} className="bg-white shadow shadow-black/5 rounded-2xl px-4 py-6">
                                        <div className="h-72">
                                            <p className={`rounded-full text-sm font-semibold ${status === 'completed' ? 'text-green-500' : 'text-red-500'}`}>
                                                {status.charAt(0).toUpperCase() + status.slice(1)}
                                            </p>
                                            <h3 className="font-semibold text-3xl mt-2 mb-4">{title}</h3>
                                            <p>{description.split(' ').slice(0, 50).join(' ') + '...'}</p>
                                        </div>

                                        <p className="mt-4">Deadline: {new Date(deadline).toLocaleDateString()}</p>

                                        <div className="text-center mt-3">
                                            <Link
                                                to={`/manager/yourTaskDeatils/${_id}`}
                                                state={{ assignTaskDetails: task }}
                                                className="text-xs text-indigo-500 italic hover:underline hover:text-indigo-600 font-medium"
                                            >
                                                View Details
                                            </Link>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))
            ) : (
                <div className='text-center text-xl py-20 bg-white rounded-lg shadow shadow-black/5 rounded-lg my-7 text-blue-600'>
                    No tasks found 
                    </div>
            )}
        </>
    );
}