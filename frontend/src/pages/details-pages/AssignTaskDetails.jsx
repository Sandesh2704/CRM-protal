import React from 'react'
import { useLocation } from 'react-router-dom';
import PageHeader from '../../component/PageHeader';
import { TbListDetails } from "react-icons/tb";
import { MdOutlineDownloading } from 'react-icons/md';
import { TbSubtask } from "react-icons/tb";


export default function AssignTaskDetails() {
  const location = useLocation();
  const assignTaskDetails = location.state?.assignTaskDetails;
 
  const { recipientId, deadline, title, description, updates, status, documents } = assignTaskDetails;
  return (
    <>
      <div>
        <PageHeader title='Task Details' icon={< TbListDetails />} />
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2   gap-5'>
        <div>
          <div className='bg-white shadow shadow-black/5 rounded-lg px-4 py-6'>

            <div className='flex items-center   gap-2'>
              <div
                className={`rounded-full p-[3px] ${status === 'Pending' ? 'bg-red-500' :
                  status === 'Complete' ? 'bg-green-600' :
                    status === 'Delay' ? 'bg-blue-500' : ''}`}
              />
              <p className={`text-sm font-semibold ${status === 'Pending' ? 'text-red-500' :
                status === 'Complete' ? 'text-green-600' :
                  status === 'Delay' ? 'text-blue-500' : ''}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </p>
            </div>

            <h3 className='font-semibold text-3xl mt-2 mb-4'>{title}</h3>
            <p>{description}</p>
            <p className='mt-4 text-sm  text-gray-700'>Deadline: {new Date(deadline).toLocaleDateString()}</p>



            <div className='text-sm flex gap-1  text-gray-700 '>
              <p>Assigned to: </p>
              <span className='font-semibold'>{recipientId?.username}</span>
              <span className='italic ' >({recipientId?.email})</span>
            </div>
          </div>

          {documents && documents.length > 0 && (
            <div className="mt-4 bg-white shadow shadow-black/5 rounded-lg px-4 py-6">

              <ul className="space-y-2">
                {documents.map((doc, index) => (
                  <li key={index} className="flex items-center justify-between bg-purple-200/40 p-2 rounded-md">
                    <span className="text-gray-700">{doc.name}</span>
                    <a
                      href={`${process.env.REACT_APP_DOMAIN_URL}${doc.url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                      className="text-blue-500 hover:text-blue-700 flex items-center"
                    >
                      <MdOutlineDownloading className="h-5 w-5 mr-1" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>


        <div className='flex flex-col gap-5'>

          <div className='flex items-center rounded-lg shadow shadow-black/5  bg-white py-3 px-4 gap-4'>
            <span
              className={`group p-2 text-xl  font-semibold  bg-gradiant text-white  rounded-md cursor-pointer `} >
              <TbSubtask />
            </span>
            <h1 className='text-lg font-semibold gap-1   rounded-lg '>
              Updates
            </h1>

          </div>

          {updates.length > 0 ? (
            <div className='flex flex-col gap-5'>
              {
                updates.slice().reverse().map((item, index) => (
                  <div key={item} className='bg-white shadow shadow-black/5 rounded-lg px-4 py-6'>
                    <div className='flex justify-between'>
                      <div className='flex items-center   gap-2'>
                        <div
                          className={`rounded-full p-[3px] ${item.status === 'Pending' ? 'bg-red-500' :
                            item.status === 'Complete' ? 'bg-green-600' :
                              item.status === 'Delay' ? 'bg-blue-500' : ''}`}
                        />
                        <p className={`text-sm font-semibold ${item.status === 'Pending' ? 'text-red-500' :
                          item.status === 'Complete' ? 'text-green-600' :
                            item.status === 'Delay' ? 'text-blue-500' : ''}`}>
                          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                        </p>
                      </div>
                      <span className='text-sm text-gray-600 ' >{new Date(item.updatedAt).toLocaleDateString()}</span>
                    </div>


                    <p className='text-lg mt-2'>{item.description}</p>
                  </div>
                ))
              }
            </div>
          ) : (
            <div className="bg-white text-center py-16 rounded-lg shadow shadow-black/5">
              <p className="text-gray-600 text-lg">No Update Available.</p>
            </div>
          )}

        </div>
      </div>
    </>
  )
}
