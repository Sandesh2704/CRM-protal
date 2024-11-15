import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../authProvider/AuthProvider.js';
import PageHeader  from '../../component/PageHeader.jsx'
import { VscTasklist } from "react-icons/vsc";
import { Link } from 'react-router-dom';
import { IoSearchOutline } from "react-icons/io5";
import { FaAnglesLeft, FaAnglesRight } from "react-icons/fa6";

export default function TaskUpdateList() {
    const { user } = useAuth();
    const assignerId = user?._id;

    const [tasks, setTasks] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(9);
    const [query, setQuery] = useState('');
    const [error, setError] = useState(null);
    const [showPendingOnly, setShowPendingOnly] = useState(false);

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

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_DOMAIN_URL}/taskManage/view-assigned-task/${assignerId}`);
                console.log("API Response for tasks:", response.data);
                setTasks(response.data.tasks);
            } catch (err) {
                setError(err.response ? err.response.data.message : 'Error fetching tasks');
            }
        };
        fetchTasks();
    }, [assignerId]);

    const filteredTasks = tasks
        .filter(task =>
            (task.recipientId?.email.toLowerCase().includes(query.toLowerCase())) &&
            (!showPendingOnly || task.status === 'pending')
        );

    const highlightMatch = (text) => {
        if (!query) return text;
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, (match) => `<span class="text-blue-700 font-semibold">${match}</span>`);
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredTasks.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredTasks.length / itemsPerPage);

    const handleNextPage = () => setCurrentPage(prev => (prev < totalPages ? prev + 1 : prev));
    const handlePreviousPage = () => setCurrentPage(prev => (prev > 1 ? prev - 1 : prev));
    const handleItemsPerPageChange = (e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); };
    const handleSearchChange = (e) => { setQuery(e.target.value); setCurrentPage(1); };

    const handleCheckboxChange = () => setShowPendingOnly(prev => !prev);

    if (error) return <p>{error}</p>;

    const groupedTasks = currentItems.reduce((acc, task) => {
        const dateKey = formatAssignmentDate(task.createdAt);
        if (!acc[dateKey]) acc[dateKey] = [];
        acc[dateKey].push(task);
        return acc;
    }, {});

    return (
        <>
            <div>
                <PageHeader title='Assign Task List' icon={<VscTasklist />} />
            </div>

            <div className='flex justify-between flex-wrap gap-4 bg-white py-4 px-4 rounded-lg shadow shadow-black/5'>
                <div className='flex gap-4 items-center'>
                    <label htmlFor="countries" className="text-sm font-medium">Show</label>
                    <select
                        id="itemsPerPage"
                        className="border text-sm focus:ring- focus:border-[rgba(60, 114, 252)] w-full px-3 py-2"
                        value={itemsPerPage}
                        onChange={handleItemsPerPageChange}
                    >
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="15">15</option>
                    </select>
                </div>
                <div className="flex flex-warp gap-7">

                    <div className='flex items-center'>
                        <input
                            type="checkbox"
                            id="pendingOnly"
                            checked={showPendingOnly}
                            onChange={handleCheckboxChange}
                            className="mr-2"
                        />
                        <label htmlFor="pendingOnly" className="text-sm">Show Pending Tasks</label>
                    </div>
                    <div className='flex gap-2 text-theme1 justify-between items-center bg-white w-full sm:w-fit py-2 px-3 rounded-sm border'>
                        <input
                            type="text"
                            value={query}
                            onChange={handleSearchChange}
                            className="placeholder:text-zinc-500 outline-none"
                            placeholder="Search by username, email..."
                        />
                        <IoSearchOutline />
                    </div>

                </div>

            </div>

            <div className=''>
                {Object.keys(groupedTasks).length > 0 ? (
                    Object.entries(groupedTasks).map(([date, tasks]) => (
                        <div key={date}>
                            <div className='flex justify-center items-center mb-7 mt-10 gap-6'>
                                <div className='h-[1px] w-full bg-gradient-to-r from-blue-400 to-purple-400 flex-1' />
                                <h2 className='text-gray-600 text-base'>{date}</h2>
                                <div className='h-[1px] w-full bg-gradient-to-l from-blue-400 to-purple-400 flex-1' />
                            </div>

                            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-5'>
                                {tasks.map((task) => {
                                    const { recipientId, deadline, title, description, _id, status } = task;
                                    return (
                                        <div key={_id} className='bg-white shadow rounded-2xl px-4 py-6'>
                                            <div className="h-72">
                                                <p className={`rounded-full text-sm font-semibold ${status === 'completed' ? 'text-green-500' : 'text-red-500'}`}>
                                                    {status.charAt(0).toUpperCase() + status.slice(1)}
                                                </p>
                                                <h3 className='font-semibold text-3xl mt-2 mb-4' >{title}</h3>
                                                <p>{description.split(' ').slice(0, 50).join(' ') + '...'}</p>
                                            </div>
                                            <p className='mt-4'>Deadline: {new Date(deadline).toLocaleDateString()}</p>
                                            <p>Assigned to: <span dangerouslySetInnerHTML={{ __html: highlightMatch(recipientId?.username || '') }} /> <span dangerouslySetInnerHTML={{ __html: highlightMatch(recipientId?.email || '') }} /></p>

                                            <div className="text-center mt-3">
                                                <Link
                                                    to={`/team-leader/assignTaskDetails/${_id}`}
                                                    state={{ assignTaskDetails: task }}
                                                    className="text-xs text-blue-500 hover:text-blue-700"
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
                        No tasks found matching <div className='font-semibold text-xl text-red-900'>{query}</div>
                    </div>
                )}
            </div>

            <div className="flex justify-between mt-7">
                <button
                    className={`flex items-center gap-1 px-4 ${currentPage === 1 && 'opacity-50 cursor-not-allowed'}`}
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                >
                    <FaAnglesLeft className='text-[10px]' />
                    <h1 className='text-sm'>Previous</h1>
                </button>
                <button
                    className={`flex items-center gap-1 px-4 ${currentPage === totalPages && 'opacity-50 cursor-not-allowed'}`}
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                >
                    <h1 className='text-sm'>Next</h1>
                    <FaAnglesRight className='text-[10px]' />
                </button>
            </div>
        </>
    );
}