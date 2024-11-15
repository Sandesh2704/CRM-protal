import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../authProvider/AuthProvider';
import { MdClose } from 'react-icons/md';
import { IoCloudUploadOutline } from 'react-icons/io5';
import TextInput from '../../component/TextInput';
import { BiHide, BiShow } from 'react-icons/bi';
import Button from '../../component/Button';
import Swal from 'sweetalert2';
import PageHeader from '../../component/PageHeader';
import { checkUserExists, validateInputs } from '../../userValidation/UserValidation';
import { toast } from 'react-toastify';
import { AiOutlineUserAdd } from 'react-icons/ai';

export default function AddTeamMember() {
  const { user } = useAuth();
  const parentId = user?._id;

  const [newStaff, setNewStaf] = useState({
    username: '',
    email: '',
    number: '',
    password: '',
    jobPosition: "Employee",
    department: `${user.department}`,
    jobRole: "",
    profileIMG: null,
    city: '',
    state: '',
    gender: '',
    joiningDate: '',
  });

  const [previewSrc, setPreviewSrc] = useState('');
  const [passwordShow, setPasswordShow] = useState(false);

  useEffect(() => {
    if (newStaff.profileIMG) {
      const objectUrl = URL.createObjectURL(newStaff.profileIMG);
      setPreviewSrc(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [newStaff.profileIMG]);
  ;


  const inputHandler = (e) => {
    const { name, value, files } = e.target;
    setNewStaf((prev) => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('parentId', parentId);

    for (const key in newStaff) {
      formData.append(key, newStaff[key]);
    }

    // Validate inputs before submission
    if (!validateInputs(newStaff)) return;

    // Check if the user already exists
    const userExists = await checkUserExists(newStaff.email, newStaff.number);
    if (userExists) return;

    if (newStaff.jobPosition === 'Employee' && !newStaff.jobRole) {
      toast.error('Job Role is required.', {
        position: 'top-right',
        autoClose: 3000,
      });
      return false;
    }
    try {
      const response = await axios.post(`${process.env.REACT_APP_DOMAIN_URL}/userManage/user/add`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log('Response from server:', response.data);

      setNewStaf({
        username: '',
        email: '',
        number: '',
        password: '',
        jobPosition: "",
        department: "",
        profileIMG: null,
        city: '',
        state: '',
        gender: '',
        joiningDate: '',
        jobRole: ""
      });
      setPreviewSrc('');



      Swal.fire({
        title: 'Manager added successfully!',
        icon: 'success',
        confirmButtonText: 'OK',
        customClass: { popup: 'custom-popup' },
      });

      // Fetch updated managers after adding a new one
    } catch (error) {
      console.error('Error adding manager:', error.response?.data || error.message);
      Swal.fire({
        title: 'Error!',
        text: error.response?.data?.message || 'An error occurred while adding the manager.',
        icon: 'error',
        confirmButtonText: 'OK',
        customClass: { popup: 'custom-popup' },
      });
    }
  };

  const deleteImage = () => {
    setNewStaf((prev) => ({ ...prev, profileIMG: null }));
    setPreviewSrc('');
  };

  const passwordHandler = () => {
    setPasswordShow(!passwordShow);
  };




  return (
    <>
      <div>
        <PageHeader title='Add New Manager' icon={<AiOutlineUserAdd />} />
      </div>

      <div className='w-full bg-white shadow rounded-lg py-6 px-7'>
        <form onSubmit={handleSubmit}>
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2  lg:grid-cols-3 xl:grid-cols-4 gap-x-7 gap-y-10'>
            <div className='w-full md:row-span-2 lg:row-span-2'>
              {newStaff.profileIMG ? (
                <div className='relative flex justify-center'>
                  <img src={previewSrc} alt='Profile' className='min-w-64 min-h-60 max-h-60 max-w-64  rounded-lg w-auto' />
                  <button
                    className='absolute right-3 top-2 text-black bg-blue-100 rounded p-1'
                    onClick={deleteImage}
                  >
                    <MdClose />
                  </button>
                </div>
              ) : (
                <div className='h-60  flex items-center rounded-lg justify-center border border-gray-400 border-dashed cursor-pointer'>
                  <label className='flex flex-col items-center justify-center'>
                    <IoCloudUploadOutline className='text-5xl text-gray-400 mb-5' />
                    <p className='text-gray-600 text-center'>
                      <span className='font-semibold text-black'>Click to upload profile image</span><br />
                      or drag and drop
                    </p>
                    <input
                      type='file'
                      name='profileIMG'
                      className='hidden'
                      onChange={inputHandler}
                    />
                  </label>
                </div>
              )}
            </div>

            <TextInput type='text' placeholder='Name*' label='Name*' name='username' value={newStaff.username} inputHandler={inputHandler} />
            <TextInput type='email' placeholder='Email*' label='Email*' name="email" value={newStaff.email} inputHandler={inputHandler} />
            <TextInput type='number' placeholder='Number*' label='Number*' name='number' value={newStaff.number} inputHandler={inputHandler} />
            <TextInput type='date' placeholder='Number*' label='Joining Date*' name='joiningDate' value={newStaff.joiningDate} inputHandler={inputHandler} />

            <div>
              <label className="font-medium">Password*</label>
              <div className='flex items-center justify-between mt-4 w-full bg-white py-4 px-6 border'>
                <input
                  type={passwordShow ? 'text' : 'password'}
                  placeholder='Password'
                  name='password'
                  value={newStaff.password}
                  onChange={inputHandler}
                  className="outline-none"
                />
                <span onClick={passwordHandler} className='text-lg cursor-pointer'>
                  {passwordShow ? <BiHide /> : <BiShow />}
                </span>
              </div>
            </div>




           



            <div>
              <label className='font-medium'>Job Postion:</label>
              <h1 className='flex py-[16px] px-6 text-sm  mt-4 rounded-sm border'>
                Employee
              </h1>
            </div>

            <div>
              <label className='font-medium'>Select a Departement*</label>
              <h1 className='flex py-[16px] px-6 text-sm  mt-4 rounded-sm border'>
                {user.department}
              </h1>
            </div>

            <TextInput
                    type='text'
                    label='Job Role*'
                    placeholder='Ex:- Developer, HR, Intern'
                    name="jobRole"
                    value={newStaff.jobRole}
                    inputHandler={inputHandler} />


       

            <TextInput type='text' placeholder='City*' label='City*' name='city' value={newStaff.city} inputHandler={inputHandler} />
            <TextInput type='text' label='State*' placeholder='State*' name="state" value={newStaff.state} inputHandler={inputHandler} />

            <div>
              <label className='font-medium'>Gender:</label>
              <div className='flex gap-5 py-4 px-6 mt-2'>
                <div className='flex items-center gap-2'>
                  <input type="radio" name="gender" value="male" checked={newStaff.gender === 'male'} onChange={inputHandler} />
                  <label>Male</label>
                </div>
                <div className='flex items-center gap-2'>
                  <input type="radio" name="gender" value="female" checked={newStaff.gender === 'female'} onChange={inputHandler} />
                  <label>Female</label>
                </div>
              </div>
            </div>

          </div>
          <div className='mt-12 flex justify-center'>
            <button type='submit'>
              <Button title='Submit' />
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

