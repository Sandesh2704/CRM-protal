import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../authProvider/AuthProvider.js';
import PageHeader from '../../component/PageHeader.jsx';
import { VscTasklist } from "react-icons/vsc";
import { Link } from 'react-router-dom';
import { IoSearchOutline } from "react-icons/io5";
import { FaAnglesLeft, FaAnglesRight } from "react-icons/fa6";

export default function TaskUpdateList() {
    const { user } = useAuth();
    const assignerId = user?._id;

    const [tasksUpdate, setUpdateTasks] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(9);
    const [query, setQuery] = useState('');
    const [error, setError] = useState(null);
    const [showPendingOnly, setShowPendingOnly] = useState(false);
    const [currentDate, setCurrentDate] = useState('');

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
                setUpdateTasks(response.data.tasks);
            } catch (err) {
                setError(err.response ? err.response.data.message : 'Error fetching tasks');
            }
        };
        fetchTasks();
    }, [assignerId]);

    const filteredTasks = tasksUpdate.filter(task => {
        const taskDate = new Date(task.createdAt).toISOString().split('T')[0]; // Get only the date
        const matchesQuery = task.recipientId?.email.toLowerCase().includes(query.toLowerCase());
        const matchesPending = !showPendingOnly || task.status.toLowerCase() === 'pending';
        const matchesDate = !currentDate || taskDate === currentDate; // Match selected date or skip if no date is selected

        return matchesQuery && matchesPending && matchesDate;
    });

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
    const handleDateChange = (e) => setCurrentDate(e.target.value);

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

            {tasksUpdate.length === 0 ? (
                <div className="text-center text-xl py-20 bg-white rounded-lg shadow shadow-black/5 my-7 text-blue-600">
                    No tasks found assign
                </div>
            ) : (
                <div>
                    <div className='flex justify-between flex-wrap gap-7 bg-white py-4 px-4 rounded-lg shadow shadow-black/5'>
                        <div className="flex flex-row gap-7">
                            <div className='flex items-center bg-white w-full sm:w-fit py-2 px-3 rounded-sm border'>
                                <input
                                    type="date"
                                    value={currentDate}
                                    onChange={handleDateChange}
                                    className="outline-none text-sm placeholder:text-zinc-500"
                                />
                            </div>
                            <div className='flex gap-4 items-center'>
                                <label htmlFor="itemsPerPage" className="text-sm font-medium">Show</label>
                                <select
                                    id="itemsPerPage"
                                    className="border text-sm focus:ring focus:border-[rgba(60, 114, 252)] w-fit px-3 py-2 outline-none"
                                    value={itemsPerPage}
                                    onChange={handleItemsPerPageChange}
                                >
                                    <option value="9">9</option>
                                    <option value="15">15</option>
                                    <option value="21">21</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row gap-x-4 gap-y-5">
                            <div className='flex items-center w-full'>
                                <input
                                    type="checkbox"
                                    id="pendingOnly"
                                    checked={showPendingOnly}
                                    onChange={handleCheckboxChange}
                                    className="mr-2 bg-transparent"
                                />
                                <label htmlFor="pendingOnly" className="text-sm">Show Pending Tasks</label>
                            </div>
                            <div className='flex gap-2 w-full justify-between items-center py-2 px-3 rounded border'>
                                <input
                                    type="text"
                                    value={query}
                                    onChange={handleSearchChange}
                                    className="placeholder:text-zinc-500 w-full outline-none"
                                    placeholder="Search by username, email..."
                                />
                                <IoSearchOutline />
                            </div>
                        </div>
                    </div>

                    <div className=''>
                        {Object.keys(groupedTasks).length > 0 ? (
                            Object.entries(groupedTasks).slice().reverse().map(([date, tasks]) => (
                                <div key={date}>
                                    <div className='flex justify-center items-center mb-7 mt-10 gap-6'>
                                        <div className='h-[1px] w-full bg-gradient-to-r from-blue-400 to-purple-400 flex-1 rounded-full' />
                                        <h2 className='text-gray-600 text-base'>{date}</h2>
                                        <div className='h-[1px] w-full bg-gradient-to-l from-blue-400 to-purple-400 flex-1' />
                                    </div>

                                    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-5'>
                                        {tasks.slice().reverse().map((task) => {
                                            const { recipientId, deadline, title, description, _id, status } = task;
                                            return (
                                                <div key={_id} className='bg-white shadow shadow-black/5 rounded-lg px-4 py-6'>
                                                    <div className="h-fit">
                                                        <div className='flex items-center gap-2'>
                                                            <div className={`rounded-full p-[3px] ${status === 'Pending' ? 'bg-red-500' : 'bg-green-600'}`} />
                                                            <p className={`text-sm font-semibold ${status === 'Pending' ? 'text-red-500' : 'text-green-600'}`}>
                                                                {status.charAt(0).toUpperCase() + status.slice(1)}
                                                            </p>
                                                        </div>
                                                        <h3 className='font-semibold text-3xl mt-2 mb-4'>{title.split(' ').slice(0, 15).join(' ') + '...'}</h3>
                                                        <p>{description.split(' ').slice(0, 50).join(' ') + '...'}</p>
                                                    </div>
                                                    <p className='mt-4 text-sm text-gray-700'>Deadline: {new Date(deadline).toLocaleDateString()}</p>
                                                    <div className='text-sm flex gap-1 text-gray-700'>
                                                        <p>Assigned to: </p>
                                                        <span className='font-semibold' dangerouslySetInnerHTML={{ __html: highlightMatch(recipientId?.username || '') }} />
                                                        <div className='italic'>
                                                            (<span dangerouslySetInnerHTML={{ __html: highlightMatch(recipientId?.email || '') }} />)
                                                        </div>
                                                    </div>
                                                    <div className="text-center mt-3">
                                                        <Link
                                                            to={`/team-leader/assignTaskDetails/${_id}`}
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
                            <div className="text-center text-xl py-20 bg-white rounded-lg shadow shadow-black/5 my-7 text-blue-600">
                                No tasks found for the selected filters
                            </div>
                        )}
                    </div>

                   
                    <div className="flex justify-between mt-9">
                            <button
                                className={`flex items-center  bg-white py-2 px-4 rounded-lg shadow shadow-black/5 gap-1  ${currentPage === 1 && 'opacity-50 cursor-not-allowed'}`}
                                onClick={handlePreviousPage}
                                disabled={currentPage === 1}
                            >
                                <FaAnglesLeft className='text-[10px]' />
                                <h1 className='text-sm font-semibold'>Previous</h1>
                            </button>
                            <button
                                className={`flex items-center gap-1   bg-white py-2 px-4 rounded-lg shadow shadow-black/5  ${currentPage === totalPages && 'opacity-50 cursor-not-allowed'}`}
                                onClick={handleNextPage}
                                disabled={currentPage === totalPages}
                            >
                                <h1 className='text-sm font-semibold'>Next</h1>
                                <FaAnglesRight className='text-[10px]' />
                            </button>
                        </div>
                
                </div>
            )}
        </>
    );
}
