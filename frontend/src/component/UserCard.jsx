import React from 'react'
import { Link } from 'react-router-dom';
import fakeimage from "../assets/fake-img2.webp"

export default function UserCard({ item, urlPath }) {
    const { jobPosition, username, profileIMG, } = item;
    return (
        <div>
            <div className="bg-white relative shadow shadow-black/5 rounded-lg pt-4 pb-2">
                <div className='absolute top-0  bg-gradiant rounded-t-lg h-44 w-full z-0' />
                <div className="photo-wrapper z-10 relative flex justify-center ">
                    {/* <img className="w-52 h-52 rounded-full mx-aut border-2 border-white" src={`${ profileIMG ? process.env.REACT_APP_DOMAIN_URL}/${profileIMG} : fakeimage`} alt="John Doe" /> */}
                    <img
                        className="w-52 h-52 rounded-full mx-auto border-2 border-white"
                        src={profileIMG ? `${process.env.REACT_APP_DOMAIN_URL}/${profileIMG}` : fakeimage}
                        alt={username || "user img "}
                    />
                </div>
                <div className="p-2 mt-2">
                    <h3 className="text-center text-2xl text-gray-900 font-medium leading-8">{username}</h3>
                    <p className='text-gray-600 text-sm mt-2 text-center '>{jobPosition}</p>

                    <div className="text-center mt-3">
                        <Link to={urlPath}
                            state={{ memberDetails: item }}
                            className="text-xs text-indigo-500 italic hover:underline hover:text-indigo-600 font-medium" >View Profile</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
