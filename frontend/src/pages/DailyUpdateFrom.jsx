import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PageHeader from '../component/PageHeader';
import Button from '../component/Button';
import TextInput from '../component/TextInput';
import { useAuth } from '../authProvider/AuthProvider';
import { PiListPlusFill } from "react-icons/pi";
import { RiFileHistoryFill } from 'react-icons/ri';

export default function DailyUpdateForm() {
    const { token, user } = useAuth();
    const userId = user?._id;
    const [newUpdates, setNewUpdate] = useState({ projectName: '', description: '' });
    const [dailyUpdates, setDailyUpdates] = useState([]);

    const inputHandler = (e) => {
        const { name, value } = e.target;
        setNewUpdate((prev) => ({ ...prev, [name]: value }));
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_DOMAIN_URL}/dailyUpdateManage/submit-daily-update`,
                newUpdates,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setDailyUpdates((prev) => [response.data.update, ...prev]);
            setNewUpdate({ projectName: '', description: '' });
        } catch (error) {
            console.error('Error submitting update:', error.response?.data?.message || error.message);
        }
    };

    useEffect(() => {
        const fetchUpdates = async () => {
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_DOMAIN_URL}/dailyUpdateManage/user-updates/${userId}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setDailyUpdates(response.data);
            } catch (error) {
                console.error('Error fetching updates:', error.response?.data?.message || error.message);
            }
        };
        fetchUpdates();
    }, [userId, token]);

    // Current month and year state
    const currentDate = new Date();
    const [month, setMonth] = useState(currentDate.getMonth());
    const [year, setYear] = useState(currentDate.getFullYear());

    const onMonthChange = (newMonth) => {
        setMonth(newMonth);
    };

    const onYearChange = (newYear) => {
        setYear(newYear);
    };

    // Filter updates based on selected month and year
    const filteredUpdates = dailyUpdates.filter((update) => {
        const updateDate = new Date(update.createdAt);
        return (
            updateDate.getMonth() === month && updateDate.getFullYear() === year
        );
    });

    return (
        <>
            <div className='grid grid-cols-12 gap-5'>
                {/* Form Section */}
                <div className="col-span-12 lg:col-span-4">
                    <div>
                        <PageHeader title='Daily Update Form' icon={<PiListPlusFill />} />
                    </div>
                    <div className='bg-white shadow shadow-black/5 h-fit rounded-lg px-5 py-7'>
                        <form onSubmit={handleUpdateSubmit} className='flex flex-col gap-5'>
                            <TextInput
                                type='text'
                                label='Working Project Name*'
                                placeholder='Project Name*'
                                name="projectName"
                                value={newUpdates.projectName}
                                inputHandler={inputHandler}
                            />
                            <div>
                                <label className='font-medium'>Description*</label>
                                <textarea
                                    type="text"
                                    placeholder="Enter update description..."
                                    name="description"
                                    value={newUpdates.description}
                                    onChange={inputHandler}
                                    required
                                    className="text-theme1 placeholder:text-zinc-500 outline-none bg-white w-full text-sm text-gray-900 py-[16px] px-6 rounded-sm border rounded mt-4"
                                    cols={7}
                                    rows="3"
                                />
                            </div>
                            <button type='submit'>
                                <Button title='Submit Update' />
                            </button>
                        </form>
                    </div>
                </div>

                {/* Updates Section */}
                <div className='col-span-12 lg:col-span-8'>
                    <div className="flex flex-wrap items-center justify-between gap-5 bg-white my-6 py-4 px-4 rounded-lg shadow shadow-black/5">
                        <div className='flex gap-3 items-center'>
                            <div className={`group p-2 bg-gradiant text-xl text-white rounded-md cursor-pointer`}>
                                <RiFileHistoryFill />
                            </div>
                            <h1 className='font-medium text-xl'>Attendance History</h1>
                        </div>
                        <div className="flex justify-end gap-2 items-center">
                            <select
                                value={month}
                                onChange={(e) => onMonthChange(Number(e.target.value))}
                                className="border rounded-md p-1"
                            >
                                {Array.from({ length: 12 }).map((_, index) => (
                                    <option key={index} value={index}>
                                        {new Date(0, index).toLocaleString("default", { month: "short" })}
                                    </option>
                                ))}
                            </select>
                            <select
                                value={year}
                                onChange={(e) => onYearChange(Number(e.target.value))}
                                className="border rounded-md p-1"
                            >
                                {Array.from({ length: 4 }).map((_, index) => (
                                    <option key={index} value={year - 2 + index}>
                                        {year - 2 + index}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {filteredUpdates.length ? (
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                            {filteredUpdates.slice(0, 30).map((update) => (
                                <div key={update._id} className="border bg-white shadow shadow-black/5 rounded-lg p-4 h-fit">
                                    <h3 className='text-2xl font-semibold'>{update.projectName}</h3>
                                    <h5 className='text-base mt-3'>{update.description}</h5>
                                    <div className='flex justify-between gap-2 text-sm mt-4'>
                                        <p className=''>
                                            {new Date(update.createdAt)
                                                .toLocaleDateString('en-US', {
                                                    day: '2-digit',
                                                    month: 'short',
                                                    year: 'numeric',
                                                })
                                                .toLowerCase()}
                                        </p>
                                        <p className=''>
                                            {new Date(update.createdAt).toLocaleTimeString('en-US', {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                hour12: false,
                                            })}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white text-center py-16 rounded-lg shadow shadow-black/5">
                            <p className="text-gray-600 text-lg">No updates found for the selected month and year.</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}