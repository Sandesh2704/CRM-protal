import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useAuth } from '../authProvider/AuthProvider';
import axios from 'axios';
import { MdOutlineDownloading } from 'react-icons/md';
import Button from '../component/Button';
import { TbListDetails, TbSubtask } from 'react-icons/tb';
import PageHeader from '../component/PageHeader';
import { toast } from 'react-toastify';

export default function YourTaskDetails({ fetchTasks }) {
    const { slug } = useParams();  // Corrected to use "slug"
    const { user, token } = useAuth();
    const location = useLocation();
    const [task, setTask] = useState(location.state?.assignTaskDetails || null);
    const [updateDescription, setUpdateDescription] = useState('');
    const [taskStatus, setTaskStatus] = useState('');

    useEffect(() => {
        const fetchTaskDetails = async () => {
            if (!task) { // Only fetch if task details are not already passed
                try {
                    const response = await axios.get(`${process.env.REACT_APP_DOMAIN_URL}/taskManage/get-assign-task/${slug}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    setTask(response.data);
                } catch (error) {
                    console.error("Error fetching task details:", error);
                }
            }
        };

        if (user._id && slug) {
            fetchTaskDetails();
        }
    }, [user, token, slug, task]);


    const handleUpdateSubmit = async () => {
        // Validation
        if (updateDescription.length < 20) {
            toast.error("Description must be at least 20 characters long.");
            return;
        }

        if (!taskStatus || !['Pending', 'Complete', 'Delay'].includes(taskStatus)) {
            toast.error("Please select a valid status (pending, complete, or delay).");
            return;
        }

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_DOMAIN_URL}/taskManage/task/update/${slug}`,
                { status: taskStatus, updateMessage: updateDescription },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setTask(response.data.task);
            setUpdateDescription('');
            setTaskStatus('');
            toast.success("Task updated successfully!");
            fetchTasks()
        } catch (error) {
            console.error("Error updating task:", error);
            toast.error("Failed to update the task.");
        }
    };



    const { assignerId, deadline, title, description, updates, status, documents } = task;

    return (
        <>

            <div>
                <PageHeader title='Task Details' icon={< TbListDetails />} />
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2   gap-5'>
                <div>
                    <div className='bg-white shadow shadow-black/5 rounded-2xl px-4 py-6'>


                        <div className='flex items-center gap-2'>
                            <div
                                className={`rounded-full p-[3px] ${status === 'Pending' ? 'bg-red-500' :
                                    status === 'Complete' ? 'bg-green-600' :
                                        status === 'Delay' ? 'bg-blue-500' : ''}`}
                            />
                            <p className={`text-sm font-semibold ${status === 'Pending' ? 'text-red-500' :
                                status === 'Complete' ? 'text-green-600' :
                                    status === 'Delay' ? 'text-blue-500' : ''}`}>
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                            </p>
                        </div>
                        <h3 className='font-semibold text-3xl mt-2 mb-4'>{title}</h3>
                        <p>{description}...</p>



                        <p className='mt-4 text-sm  text-gray-700'>Deadline: {new Date(deadline).toLocaleDateString()}</p>



                        <div className='text-sm flex gap-1  text-gray-700 '>
                            <p>Assigned bt: </p>
                            <span className='font-semibold'>{assignerId?.username}</span>
                            <div className='italic ' >
                                <span >{assignerId?.email}</span>
                            </div>



                        </div>
                    </div>

                    {documents && documents.length > 0 && (
                        <div className="mt-4 bg-white shadow shadow-black/5 rounded-2xl px-4 py-6">

                            <ul className="space-y-2">
                                {documents.map((doc, index) => (
                                    <li key={index} className="flex items-center justify-between bg-gray-100 p-2 rounded-md">
                                        <span className="text-gray-700">{doc.name}</span>
                                        <a
                                            href={`${process.env.REACT_APP_DOMAIN_URL}${doc.url}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            download
                                            className="text-blue-500 hover:text-blue-700 flex items-center"
                                        >
                                            <MdOutlineDownloading className="h-5 w-5 mr-1" />
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                <div className='flex flex-col gap-5'>


                    <div className='flex items-center rounded-lg shadow shadow-black/5  bg-white py-3 px-4 gap-4'>
                        <span
                            className={`group p-2 text-xl  font-semibold  bg-gradiant text-white  rounded-md cursor-pointer `} >

                            <TbSubtask />

                        </span>
                        <h1 className='text-lg font-semibold gap-1   rounded-lg '>
                            Updates Histroy
                        </h1>

                    </div>

                    {updates.length > 0 ? (
                        <div className='flex flex-col gap-5'>
                            {
                                updates.slice().reverse().map((item, index) => (

                                    <div key={index} className='bg-white shadow shadow-black/5 rounded-lg px-4 py-6'>
                                        <div className='flex justify-between'>
                                            <div className='flex items-center gap-2'>
                                                <div
                                                    className={`rounded-full p-[3px] ${item.status === 'Pending' ? 'bg-red-500' :
                                                        item.status === 'Complete' ? 'bg-green-600' :
                                                            item.status === 'Delay' ? 'bg-blue-500' : ''}`}
                                                />
                                                <p className={`text-sm font-semibold ${item.status === 'Pending' ? 'text-red-500' :
                                                    item.status === 'Complete' ? 'text-green-600' :
                                                        item.status === 'Delay' ? 'text-blue-500' : ''}`}>
                                                    {item.status} {/* Added fallback */}
                                                </p>
                                            </div>
                                            <span className='text-sm text-gray-600 ' >{new Date(item.updatedAt).toLocaleDateString()}</span>
                                        </div>

                                        <p className='text-lg mt-2'>{item.description}</p>
                                    </div>
                                ))
                            }
                        </div>
                    ) : (
                        <div className="bg-white text-center py-16 rounded-lg shadow shadow-black/5">
                            <p className="text-gray-600 text-lg">No Update Available.</p>
                        </div>
                    )}

                    {task.status !== 'Complete' && (

                        <div className="bg-white shadow shadow-black/5 rounded-2xl px-4 py-4">
                            <from >
                                <textarea
                                    type="text"
                                    placeholder="Enter update description..."
                                    value={updateDescription}
                                    onChange={(e) => setUpdateDescription(e.target.value)}
                                    required
                                    className="text-theme1 placeholder:text-zinc-500  outline-none bg-white w-full text-sm text-gray-900 py-[16px] px-6 rounded-sm border rounded"
                                    cols={7}
                                    rows="3"
                                />


                                <div className="flex items-center mb-7 mt-3">
                                    <input
                                        type="radio"
                                        checked={taskStatus === 'Pending'}
                                        onChange={() => setTaskStatus('Pending')}
                                        className="mr-2"
                                    />
                                    <label>Pending</label>
                                    <input
                                        type="radio"
                                        checked={taskStatus === 'Complete'}
                                        onChange={() => setTaskStatus('Complete')}
                                        className="mr-2 ml-4"
                                    />
                                    <label>Complete</label>
                                    <input
                                        type="radio"
                                        checked={taskStatus === 'Delay'}
                                        onChange={() => setTaskStatus('Delay')}
                                        className="mr-2 ml-4"
                                    />
                                    <label>Delay</label>
                                </div>
                                <button
                                    onClick={() => handleUpdateSubmit(task._id)}
                                >
                                    <Button title=' Submit Update' />
                                </button>
                            </from>
                        </div>
                    )}
                </div>
            </div>
        </>

    );
}