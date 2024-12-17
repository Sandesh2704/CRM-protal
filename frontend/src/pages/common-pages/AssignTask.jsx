import React, { useState } from 'react';
import { useAuth } from '../../authProvider/AuthProvider';
import { toast } from 'react-toastify';
import axios from 'axios';
import Swal from 'sweetalert2';

import { CgGoogleTasks } from "react-icons/cg";
import { IoMdCloseCircle } from "react-icons/io";


import TextInput from '../../component/TextInput';
import PageHeader from '../../component/PageHeader';
import Button from '../../component/Button';
import { useFetchYourTasks } from '../../utils/useFetchYourTasks';



export default function AssignTask({ staffData }) {
  const { user, token } = useAuth();
  const { setYourTasks,   fetchTasks} = useFetchYourTasks();



  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    deadline: '',
    assignerId: user?._id || '',
    recipientId: '',
  });

  const [documents, setDocuments] = useState([]);

  const handleChange = (e) => {
    setTaskData({
      ...taskData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setDocuments([...documents, ...files]);
  };

  const handleRemoveFile = (index) => {
    const updatedDocs = documents.filter((_, i) => i !== index);
    setDocuments(updatedDocs);
  };
  
  const validateForm = () => {
    if (!taskData.title.trim()) {
      toast.error('Title is required.');
      return false;
    }
    if (!taskData.description.trim()) {
      toast.error('Description is required.');
      return false;
    }
    if (!taskData.deadline.trim()) {
      toast.error('Deadline is required.');
      return false;
    }
    if (!taskData.recipientId.trim()) {
      toast.error('Please select a recipient.');
      return false;
    }
    return true;
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();   // Log data on form submission
  //   if (!validateForm()) return;

  //   const formData = new FormData();
  //   formData.append('title', taskData.title);
  //   formData.append('description', taskData.description);
  //   formData.append('deadline', taskData.deadline);
  //   formData.append('assignerId', taskData.assignerId);
  //   formData.append('recipientId', taskData.recipientId);

  //   documents.forEach((file) => {
  //     formData.append('documents', file);   
  //   });

  //   try {
  //       await axios.post(
  //       `${process.env.REACT_APP_DOMAIN_URL}/taskManage/assign-task`,
  //       formData,
  //       {
  //         headers: {
  //           'Content-Type': 'multipart/form-data',
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );
  //     Swal.fire({
  //       title: 'Task Assign  successfully!',
  //       icon: 'success',
  //       confirmButtonText: 'OK',
  //       customClass: { popup: 'custom-popup' },
  //     });
  //     setTaskData({ title: '', description: '', deadline: '', assignerId: user?._id || '', recipientId: '' });
  //     setDocuments([]);
  //     fetchTasks()
  //   } catch (error) {
  //     console.error('Error assigning task:', error);
  //     alert('Failed to assign task.');
  //   }
  // };


const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validateForm()) return;

  const formData = new FormData();
  formData.append('title', taskData.title);
  formData.append('description', taskData.description);
  formData.append('deadline', taskData.deadline);
  formData.append('assignerId', taskData.assignerId);
  formData.append('recipientId', taskData.recipientId);
  documents.forEach((file) => {
      formData.append('documents', file);
  });

  try {
      const response = await axios.post(
          `${process.env.REACT_APP_DOMAIN_URL}/taskManage/assign-task`,
          formData,
          {
              headers: {
                  'Content-Type': 'multipart/form-data',
                  Authorization: `Bearer ${token}`,
              },
          }
      );

      Swal.fire({
          title: 'Task Assigned Successfully!',
          icon: 'success',
          confirmButtonText: 'OK',
          customClass: { popup: 'custom-popup' },
      });

       // Assuming the API returns the created task
      setYourTasks((prevTasks) => [...prevTasks, taskData]); // Add the new task to the list
      setTaskData({ title: '', description: '', deadline: '', assignerId: user?._id || '', recipientId: '' });
      setDocuments([]);
      fetchTasks()
  } catch (error) {
      console.error('Error assigning task:', error);
      toast.error('Failed to assign task.');
  }
};

  return (
    <>

      <div>
        <PageHeader title='Assign task ' icon={< CgGoogleTasks />} />
      </div>
      <div className="w-full bg-white shadow rounded-2xl p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          <TextInput type='text' placeholder='Title*' label='Title*' name='title' value={taskData.title} inputHandler={handleChange} />
          

          <TextInput type='date' placeholder='Title*' label='Deadline*' name='deadline' value={taskData.deadline} inputHandler={handleChange} />
            
          
            <label className="block">
              <span className="font-medium">Assign to:</span>
              <select
                name="recipientId"
                value={taskData.recipientId}
                onChange={handleChange}
                required
                className="text-theme1 placeholder:text-zinc-500 mt-4 outline-none bg-white w-full text-sm text-gray-900 py-[16px] px-6 rounded-sm border"
              >
                <option value="" disabled>Select a Assigner</option>
                { staffData.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.username}
                  </option>
                ))}
              </select>
            </label>
            
            <label className="block col-span-2">
              <span className="font-medium">Description:</span>
              <textarea
                name="description"
                value={taskData.description}
                onChange={handleChange}
                required
                className="text-theme1 placeholder:text-zinc-500 mt-4 outline-none bg-white w-full text-sm text-gray-900 py-[16px] px-6 rounded-sm border"
                cols={5}
                rows="3"
              ></textarea>
            </label>


       

            <label className="block">
              <span className="font-medium">Documents:</span>
              <input
                type="file"
                name="documents"
                onChange={handleFileChange}
                multiple
                accept=".pdf,.jpg,.jpeg,.png,.docx"
                className="text-theme1 placeholder:text-zinc-500 mt-4 outline-none bg-white w-full text-sm text-gray-900 py-[16px] px-6 rounded-sm border"
              />
            </label>
          </div>
          {
            documents && documents.length > 0 && (
              <div className="mt-4">
                <h4 className="text-base font-semibold mb-2">Uploaded Documents:</h4>
                <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-3">
                  {documents.slice().reverse().map((file, index) => (
                    <li key={index} className="flex items-center justify-between bg-gray-100 py-2 px-3 h-full rounded-lg">
                      <span className="text-gray-600">{file.name.slice(0, 20)}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFile(index)}
                        className="text-red-500 hover:text-red-700 font-semibold text-2xl"
                      >
                        <IoMdCloseCircle />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )
          }
          <div className="flex justify-center mt-8">
            <button>
              <Button title="Submit" />
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
