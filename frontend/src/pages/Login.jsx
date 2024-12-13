import { useState } from 'react'
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Button from '../component/Button';
import TextInput from '../component/TextInput';
import Swal from 'sweetalert2';

import { BiHide, BiShow } from 'react-icons/bi';
import { useAuth } from '../authProvider/AuthProvider';


export default function Login() {

    const { storeTokenInLS } = useAuth()
    const navigate = useNavigate();
    const [passwordShow, setPasswordShow] = useState(false);
    const [loginUser, setLoginUser] = useState({
        identifier: '',
        password: '',
    });

    const inputHandler = (e) => {
        setLoginUser((prevLogin) => ({
            ...prevLogin,
            [e.target.name]: e.target.value,
        }));
    };

    const passwordHandler = () => {
        setPasswordShow(!passwordShow);
    };

    // const handleLogin = async (e) => {
    //     e.preventDefault();

    //     if (loginUser.identifier === 0) {
    //         toast.error('Email or Phone number is required!', {
    //             position: "top-right",
    //             autoClose: 3000,
    //             className: 'toast-container'
    //         });
    //         setLoginUser({ password: '' });
    //         return;
    //     }

    //     // Email validation
    //     if (!loginUser.password) {
    //         toast.error('Password is required!', {
    //             position: "top-right",
    //             autoClose: 3000,
    //             className: 'toast-container'
    //         });
    //         setLoginUser({password: '' });
    //         return;
    //     }

    //     try {
    //         const response = await axios.post('http://localhost:8000/auth/login', loginUser);
    //         const res_data = response.data; // Directly access response.data

    //         // Store token in localStorage
    //         storeTokenInLS(res_data.token)
    //         setLoginUser({ identifier: '', password: '' });
    //         Swal.fire({
    //             title: 'Welcome!',
    //             text: 'You have successfully logged in.',
    //             icon: 'success',
    //             confirmButtonText: 'Proceed',
    //         }).then(() => {
    //             navigate('/');
    //         });
            
    //     } catch (err) {
    //         if (err.response && err.response.status === 400) {
    //             // Show error message if user does not exist
    //             if (err.response.data.message === 'Invalid Credentials') {
    //                 toast.error('Email or Phone number not found!', {
    //                     position: "top-right",
    //                     autoClose: 3000,
    //                     className: 'toast-container'
    //                 });
    //             } else {
    //                 toast.error(err.response.data.message);
    //             }
    //         } else {
    //             toast.error(err);

    //         }
    //     }
    // };

    // const handleLogin = async (e) => {
    //     e.preventDefault();
    
    //     if (!loginUser.identifier) {
    //         toast.error('Email or Phone number is required!', {
    //             position: "top-right",
    //             autoClose: 3000,
    //             className: 'toast-container',
    //         });
    //         return;
    //     }
    
    //     if (!loginUser.password) {
    //         toast.error('Password is required!', {
    //             position: "top-right",
    //             autoClose: 3000,
    //             className: 'toast-container',
    //         });
    //         return;
    //     }
    
    //     try {
    //         const response = await axios.post('http://localhost:8000/auth/login', loginUser);
    
    //         // On successful login
    //         const res_data = response.data;
    //         storeTokenInLS(res_data.token);
    //         setLoginUser({ identifier: '', password: '' });
    //         Swal.fire({
    //             title: 'Welcome!',
    //             text: 'You have successfully logged in.',
    //             icon: 'success',
    //             confirmButtonText: 'Proceed',
    //         }).then(() => {
    //             navigate('/');
    //         });
    
    //     } catch (err) {
    //         if (err.response) {
    //             if (err.response.status === 404) {
    //                 toast.error('User not found!', {
    //                     position: "top-right",
    //                     autoClose: 3000,
    //                     className: 'toast-container',
    //                 });
    //             } else if (err.response.status === 401) {
    //                 toast.error('Password does not match!', {
    //                     position: "top-right",
    //                     autoClose: 3000,
    //                     className: 'toast-container',
    //                 });
    //             } else {
    //                 toast.error(err.response.data.message || 'Something went wrong!');
    //             }
    //         } else {
    //             toast.error('Network error. Please try again later.');
    //         }
    //     }
    // };

    

    const handleLogin = async (e) => {
        e.preventDefault();
    
        if (!loginUser.identifier) {
            toast.error('Email or Phone number is required!', {
                position: "top-right",
                autoClose: 3000,
                className: 'toast-container',
            });
            return;
        }
    
        if (!loginUser.password) {
            toast.error('Password is required!', {
                position: "top-right",
                autoClose: 3000,
                className: 'toast-container',
            });
            return;
        }
    
        try {
            const response = await axios.post('http://localhost:8000/auth/login', loginUser);
    
            // On successful login
            const res_data = response.data;
            storeTokenInLS(res_data.token);
            setLoginUser({ identifier: '', password: '' });
            Swal.fire({
                title: 'Welcome!',
                text: 'You have successfully logged in.',
                icon: 'success',
                confirmButtonText: 'Proceed',
            }).then(() => {
                navigate('/');
            });
    
        } catch (err) {
            if (err.response) {
                if (err.response.status === 404) {
                    toast.error('User not found!', {
                        position: "top-right",
                        autoClose: 3000,
                        className: 'toast-container',
                    });
                } else if (err.response.status === 401) {
                    toast.error('Password does not match!', {
                        position: "top-right",
                        autoClose: 3000,
                        className: 'toast-container',
                    });
                } else if (err.response.status === 403) { 
                    toast.error('Your account is blocked. Please contact the admin.', {
                        position: "top-right",
                        autoClose: 3000,
                        className: 'toast-container',
                    });
                } else {
                    toast.error(err.response.data.message || 'Something went wrong!', {
                        position: "top-right",
                        autoClose: 3000,
                        className: 'toast-container',
                    });
                }
            } else {
                toast.error('Network error. Please try again later.', {
                    position: "top-right",
                    autoClose: 3000,
                    className: 'toast-container',
                });
            }
        }
    };
    


    return (
        <>
            <div className= 'bg-gradiant flex justify-center items-center w-screen h-screen px-4 md:px-7 lg:px-20' >
                <div className='w-[100%] sm:w-[80%] md:w-[60%] lg:w-[55%] xl:w-[40%] shadow-lg rounded-lg bg-white'>
                    <form onSubmit={handleLogin} className='py-[50px] xl:py-[64px] px-5 lg:px-8 xl:px-[60px] flex flex-col gap-[30px] w-full'>
                        <TextInput
                            type='text'
                            placeholder='Login with Email or Phone*'
                            label='Your Email or Phone*'
                            name='identifier'
                            value={loginUser.identifier}
                            inputHandler={inputHandler}
                        />

                        <div>
                            <label className="text-theme5 font-medium">Password*</label>
                            <div className='flex items-center justify-between mt-4 w-full bg-white py-[16px] px-6 rounded-sm border'>
                                <input
                                    name='password'
                                    type={passwordShow ? 'text' : 'password'}
                                    placeholder='Password'
                                    value={loginUser.password}
                                    onChange={inputHandler}
                                    className="placeholder:text-zinc-500 text-theme5 outline-none text-sm"
                                />
                                <div className='text-zinc-500 text-lg' onClick={passwordHandler}>
                                    {passwordShow ? <BiHide /> : <BiShow />}
                                </div>
                            </div>
                        </div>

                        <button className='mt-3 w-full' onSubmit={handleLogin}>
                            <Button title='Login Now' />
                        </button>
                    </form>
                </div>
            </div>

          
        </>
    )
}
