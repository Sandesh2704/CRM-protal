import React from 'react'

export default function PageHeader({ title, icon }) {
  return (
    <div className='bg-white my-6 py-4 px-4 rounded-lg shadow shadow-black/5'>
      <div className='flex gap-3 items-center'>
        <div className={`group p-2 bg-gradiant text-xl text-white  rounded-md cursor-pointer`} >
          {icon}
        </div>
        <h1 className='font-medium text-xl'>{title}</h1>
      </div>

    </div>
  )
}
