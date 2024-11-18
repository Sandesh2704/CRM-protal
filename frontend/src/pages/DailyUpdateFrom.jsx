import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PageHeader from '../component/PageHeader';
import { FaWpforms } from 'react-icons/fa6';
import Button from '../component/Button';

import TextInput from '../component/TextInput';
import { useAuth } from '../authProvider/AuthProvider';

export default function DailyUpdateForm() {
    const { token, user } = useAuth();
    const userId = user?._id;
    const [newUpdates, setNewUpdate] = useState({ projectName: '', description: '' });


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


    const [dailyUpdates, setDailyUpdates] = useState([]);

    useEffect(() => {
        const fetchUpdates = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_DOMAIN_URL}/dailyUpdateManage/user-updates/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setDailyUpdates(response.data);
            } catch (error) {
                console.error('Error fetching updates:', error.response?.data?.message || error.message);
            }
        }
        fetchUpdates();
    }, []);
  


    return (
        <>
            <div>
                <PageHeader title='Daily Update Form' icon={<FaWpforms />} />
            </div>

            <div className='grid grid-cols-12 gap-5'>

                <div className="col-span-4 bg-white shadow shadow-black/5 h-fit rounded-lg px-5 py-7">
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


                <div className='col-span-8 '>
                    {dailyUpdates.length ? (
                        <div className='grid grid-cols-3 gap-3'>
                            {dailyUpdates.map((update) => (
                                <div key={update._id} className="border  bg-white shadow shadow-black/5 rounded-lg p-4">
                                   
                                    <h3 className='text-2xl font-semibold'>{update.projectName}</h3>
                                    <h5 className='text-base mt-3'>{update.description}</h5>

                                    <div className='flex justify-between gap-2 text-sm mt-4'>
                                        <p className=' '>

                                            {new Date(update.createdAt)
                                                .toLocaleDateString('en-US', {
                                                    day: '2-digit',
                                                    month: 'short',
                                                    year: 'numeric',
                                                })
                                                .replace(/(\d{2}) (\w{3}), (\d{4})/, '$1$2$3')
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
                            <p className="text-gray-600 text-lg">No updates found.</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}