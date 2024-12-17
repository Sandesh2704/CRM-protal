import React, { useEffect, useState } from 'react';
import TextInput from '../../component/TextInput.jsx';
import Button from '../../component/Button.jsx';
import axios from 'axios';
import { toast } from 'react-toastify';
import { MdClose } from "react-icons/md";
import { IoCloudUploadOutline } from "react-icons/io5";
import Swal from 'sweetalert2';
import SelectInput from '../../component/SelectInput.jsx';
import { BiHide, BiShow } from 'react-icons/bi';

export default function RagistrationForm() {
  const [registerUser, setRegisterUser] = useState({
    username: '',
    email: '',
    number: '',
    password: '',
    jobRole: "",
    department: "",
    jobPosition: "",
    profileIMG: null,
    city: '',
    state: '',
    gender: '',
  });
  const [previewSrc, setPreviewSrc] = useState('');

  useEffect(() => {
    if (registerUser.profileIMG) {
      const objectUrl = URL.createObjectURL(registerUser.profileIMG);
      setPreviewSrc(objectUrl);
      return () => URL.revokeObjectURL(objectUrl); // Clean up the object URL
    }
  }, [registerUser.profileIMG]);

  const inputHandler = (e) => {
    const { name, value, files } = e.target;
    setRegisterUser((prev) => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const checkUserExists = async (email, number) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_DOMAIN_URL}/auth/check-user`, {
        params: { email, number }
      });

      const { emailExists, numberExists } = response.data;

      if (emailExists) {
        toast.error('Email already exists in the database.', { position: 'top-right', autoClose: 3000 });
        return true; // Email exists
      }

      if (numberExists) {
        toast.error('Phone number already exists in the database.', { position: 'top-right', autoClose: 3000 });
        return true; // Phone number exists
      }

      return false; // No conflicts, continue with registration
    } catch (error) {
      console.error('Error checking user:', error);
      toast.error('Failed to check user. Please try again.', { position: 'top-right', autoClose: 3000 });
      return true; // Assume there's an issue to prevent form submission
    }
  };


  const validateInputs = () => {
    const { username, email, number, password, jobPosition } = registerUser;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/; // Validate phone number with exactly 10 digits
    const passwordLength = password.length;

    if (!username || !email || !number || !password || !jobPosition) {
      toast.error('Username, email, phone number, jobPosition and password are required.', { position: "top-right", autoClose: 3000, });
      return false;
    }

    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address.', { position: "top-right", autoClose: 3000, });
      return false;
    }

    if (!phoneRegex.test(number)) {
      toast.error('Phone number must be exactly 10 digits.', { position: "top-right", autoClose: 3000, });
      return false;
    }

    if (passwordLength < 5 || passwordLength > 10) {
      toast.error('Password must be between 5 and 10 characters long.', { position: "top-right", autoClose: 3000, });
      return false;
    }
    return true;
  };


  const SubmitNewAdmin = async (e) => {
    e.preventDefault();

    // Validate inputs
    if (!validateInputs()) return;


    const email = registerUser.email;
    const number = registerUser.number;
    const userExists = await checkUserExists(email, number);
    if (userExists) {
      // Don't submit the form if email or number already exists
      return;
    }

    try {
      const formData = new FormData();

      // Append user data to formData
      for (const key in registerUser) {
        formData.append(key, registerUser[key]);
      }

      await axios.post(`${process.env.REACT_APP_DOMAIN_URL}/auth/register`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data' // Set the content type to multipart/form-data
        }
      });

      // Reset the form
      setRegisterUser({
        username: '',
        email: '',
        number: '',
        city: '',
        state: '',
        gender: '',
        password: '',
        jobRole: "",
        profileIMG: null, // Reset the image file
        department: "",
        jobPosition: ""
      });

      // Reset the image preview
      setPreviewSrc('');

      Swal.fire({
        title: 'Your message has been sent successfully!',
        icon: 'success',
        confirmButtonText: 'OK',
        customClass: {
          popup: 'custom-popup'
        }
      });

    } catch (error) {
      console.error('Error saving contact:', error);
      if (error.response) {
        console.error('Server error:', error.response.data);
        toast.error(`Server Error: ${error.response.data.message || 'Failed to send your message.'}`, {
          position: "top-right",
          autoClose: 3000,
        });
      } else if (error.request) {
        console.error('No response from server:', error.request);
        toast.error('No response from the server. Please try again later.', {
          position: "top-right",
          autoClose: 3000,
        });
      } else {
        console.error('Error:', error.message);
        toast.error('Something went wrong. Please try again later.', {
          position: "top-right",
          autoClose: 3000,
        });
      }
    }
  };

  const deleteImage = () => {
    console.log('Deleting image');
    setRegisterUser((prev) => ({
      ...prev,
      profileIMG: null // Correctly set to null
    }));
    setPreviewSrc(''); // Reset preview source
  };


  const [passwordShow, setPasswordShow] = useState(false);
  const passwordHandler = () => {
    setPasswordShow(!passwordShow);
  };

  return (
    <div className='bg-gradiant flex justify-center   p-4 md:p-7 lg:p-28' >
      <div className='w-[100%]    bg-white shadow-lg shadow-black/5 rounded-2xl '>
        <div className='px-7 py-6 border-b border-dotted'>
          <h3 className='text-theme2 font-medium text-xl'>Add New Admin Form</h3>
        </div>
        <div className='py-6 px-7'>
          <form onSubmit={SubmitNewAdmin}>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  lg:grid-rows-4 gap-x-7 gap-y-10'>
              <div className='h-full w-full  md:row-span-2 lg:row-span-2'>
                {registerUser.profileIMG ? (
                  <div className='relative flex justify-center'>
                    <img
                      src={previewSrc}
                      alt='Profile'
                      className='rounded-full h-full'
                    />
                    <button
                      className='absolute right-3 top-3 text-black text-lg bg-blue-50 rounded-full p-2'
                      onClick={deleteImage}
                    >
                      <MdClose />
                    </button>
                  </div>
                ) : (
                  <div className='h-60 lg:h-full flex items-center rounded-full justify-center w-full border border-gray-400 border-dashed  cursor-pointer'>
                    <label className='flex flex-col items-center justify-center'>
                      <div className='flex flex-col items-center justify-center'>
                        <span className='text-5xl lg:text-5xl text-gray-400 mb-5'>
                          <IoCloudUploadOutline />
                        </span>
                        <p className='text-base text-gray-600 text-center'>
                          <span className='font-semibold text-black'>Click to upload profile image</span> <br />
                          <span>or drag and drop</span>
                        </p>
                      </div>
                      <input
                        id='dropzone-file'
                        type='file'
                        name='profileIMG'
                        className='hidden'
                        onChange={inputHandler} // Attach the inputHandler to onChange
                      />
                    </label>
                  </div>
                )}
              </div>

              <TextInput
                type='text'
                placeholder='Name*'
                label='Name*'
                name='username'
                value={registerUser.username}
                inputHandler={inputHandler} />
              <TextInput
                type='email'
                label='Email*'
                placeholder='Email*'
                name="email"
                value={registerUser.email}
                inputHandler={inputHandler} />

              <TextInput
                type='number'
                placeholder='Number*'
                label='Number*'
                name='number'
                value={registerUser.number}
                inputHandler={inputHandler} />

              <div>
                <label className="text-theme5 font-medium">Password*</label>
                <div className='flex items-center justify-between mt-4 w-full bg-white py-[16px] px-6 rounded-sm border'>
                  <input
                    name='password'
                    type={passwordShow ? 'text' : 'password'}
                    placeholder='Password'
                    value={registerUser.password}
                    onChange={inputHandler}
                    className="placeholder:text-zinc-500 text-theme5 outline-none text-sm"
                  />
                  <div className='text-zinc-500 text-lg' onClick={passwordHandler}>
                    {passwordShow ? <BiHide /> : <BiShow />}
                  </div>
                </div>
              </div>

              <SelectInput
                label="Department*"
                name="department"
                value={registerUser.department}
                inputHandler={inputHandler}
                options={[
                  { value: 'IT', label: 'IT' },
                  { value: 'HR', label: 'HR' },
                  { value: 'CSR', label: 'CSR' },
                ]}
              />

              <SelectInput
                label="Job Position*"
                name="jobPosition"
                value={registerUser.jobPosition}
                inputHandler={inputHandler}

                options={[
                  { value: 'Employee', label: 'Employee' },
                  { value: 'Team Leader', label: 'Team Leader' },
                  { value: 'Manager', label: 'Manager' },
                  { value: 'Founder', label: 'Founder' }
                ]}
              />

              {registerUser.jobPosition === 'Employee' && (
                <>
                  <TextInput
                    type='text'
                    label='Job Role*'
                    placeholder='Ex:- Developer, HR, Intern'
                    name="jobRole"
                    value={registerUser.jobRole}
                    inputHandler={inputHandler} />
                </>
              )}


              <TextInput
                type='text'
                placeholder='City*'
                label='City*'
                name='city'
                value={registerUser.city}
                inputHandler={inputHandler} />
              <TextInput
                type='text'
                label='State*'
                placeholder='State*'
                name="state"
                value={registerUser.state}
                inputHandler={inputHandler} />

              <div>
                <label className='text-theme2 font-medium'>Gender:</label>
                <div className='flex gap-5 py-[16px] px-6 mt-4'>
                  <div className='flex items-center gap-2'>
                    <input
                      type="radio"
                      name="gender"
                      value="male"
                      checked={registerUser.gender === 'male'}
                      onChange={inputHandler}
                      className='text-theme5 placeholder:text-zinc-500 outline-none text-sm text-gray-900'
                    />
                    <label className="text-theme5 font-medium">Male</label>
                  </div>

                  <div className='flex items-center gap-2'>
                    <input
                      type="radio"
                      name="gender"
                      value="female"
                      checked={registerUser.gender === 'female'}
                      onChange={inputHandler}
                    />
                    <label className="text-theme5 font-medium">Female</label>
                  </div>
                </div>
              </div>

            </div>
            <div className='mt-12 flex justify-center'>
              <button onSubmit={SubmitNewAdmin}>
                <Button title='Submit' />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

