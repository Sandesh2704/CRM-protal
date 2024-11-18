import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PageHeader from '../component/PageHeader';
import { FaWpforms } from 'react-icons/fa6';
import { useAuth } from '../authProvider/AuthProvider';

export default function DailyUpdateList() {


    const [dailyUpdates, setDailyUpdates] = useState([]);
    const { token } = useAuth();

    useEffect(() => {
        const fetchUpdates = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_DOMAIN_URL}/dailyUpdateManage/gat-daily-update`, {
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
        <div>
            <div>
                <PageHeader title='Daily Update' icon={<FaWpforms />} />
            </div>

            {dailyUpdates.length ? (
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3'>
                    {dailyUpdates.map((update) => (
                        <div key={update._id} className="border  bg-white shadow shadow-black/5 rounded-lg p-4">
                            <div className='flex flex-col mb-3 text-sm '>
                                <p className=' '>

                                    {update.user.username}
                                </p>
                                <p className=''>
                                    {update.user.department}
                                </p>
                            </div>
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
    )
}

