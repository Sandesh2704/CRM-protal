import React from 'react'

export default function Heading({ icon, title }) {
    return (
        <div>
            <div className='flex gap-3 items-center'>
                <div className={`group p-2 bg-gradiant text-xl text-white  rounded-md cursor-pointer`} >
                    {icon}
                </div>
                <h1 className='font-medium text-xl'>{title}</h1>
            </div>
        </div>
    )
}
