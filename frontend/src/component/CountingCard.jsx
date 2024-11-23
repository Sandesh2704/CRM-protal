import React from 'react'

export default function CountingCard({ items, lebal }) {
    return (
        <div>
            <div className='bg-white shadow shadow-black/5  rounded-lg'>
                <div className='px-5 py-4 border-b border-dotted'>
                    <h3 className='text-base sm:text-lg'>{lebal} </h3>
                </div>
                <div className='px-5 py-5'>
                    <div>
                        {items !== null ? (
                            <div className='flex items-end'>
                                <h1 className='text-8xl font-bold text-gradient'>{items.length}</h1>
                            </div>
                        ) : (
                            <>
                                <p>No data available</p>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
