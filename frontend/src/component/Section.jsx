import React from 'react'

export default function Section({ children }) {
    return (
        <div className='bg-white my-6 py-4 px-4 rounded-lg shadow shadow-black/5'>
            {children}
        </div>
    )
}
