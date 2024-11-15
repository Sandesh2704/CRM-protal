import React from 'react'
import { LuMoveRight } from 'react-icons/lu'

export default function Button({ title }) {
    return (
        <>
            <div className="relative bg-gradiant py-3 px-6 overflow-hidden group w-fit">
                <span className="absolute top-0 right-0 translate-x-full translate-y-full bg-[#0f0d1d]/40 h-full w-full group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-500 ease-in-out"></span>
                <span className="absolute top-0 right-0 translate-x-full translate-y-full bg-theme2 h-full w-full group-hover:translate-x-0 group-hover:translate-y-0 transition-transform delay-150 duration-700 ease-in-out"></span>
                <div className="inline-flex items-center text-white uppercase text-sm font-medium whitespace-nowrap gap-2 relative  z-10 ">
                    {title} <i><LuMoveRight /></i>
                </div>
            </div>
        </>
    )
}
