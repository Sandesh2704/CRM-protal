import React, {  useState } from 'react'
import PageHeader from '../../component/PageHeader'
import { RiFileList2Line } from "react-icons/ri";
import Swal from 'sweetalert2';
import axios from 'axios';
import { toast } from 'react-toastify';
import TextInput from '../../component/TextInput';
import Button from '../../component/Button';

export default function Department({departmentData, getDepartments}) {

  const [newDepartmentDeta, setNewDepartmentDeta] = useState({
    title: '',
  });

  const inputHandler = (e) => {
    const { name, value } = e.target;
    setNewDepartmentDeta((prev) => ({
      ...prev, [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting data:", newDepartmentDeta);

    try {
      await axios.post(`${process.env.REACT_APP_DOMAIN_URL}/departementManage/add-new-department`, newDepartmentDeta, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      setNewDepartmentDeta({
        title: '',
      });

      Swal.fire({
        title: 'Department created successfully',
        icon: 'success',
        confirmButtonText: 'OK',
        customClass: {
          popup: 'custom-popup'
        }
      });

      getDepartments();

    } catch (error) {
      toast.error('Server error', { position: 'top-right', autoClose: 3000 });
    }
  };

  const deleteDepartement = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_DOMAIN_URL}/departementManage/delete-department/${id}`);
      toast.success('Department deleted successfully', { position: 'top-right', autoClose: 3000 });
      getDepartments(); // Refresh department list after deletion
    } catch (error) {
      toast.error('Server error', { position: 'top-right', autoClose: 3000 });
    }
};

  return (
    <>
      <div>
        <PageHeader title='Department' icon={<RiFileList2Line />} />
      </div>

      <div className='grid grid-cols-12 gap-7'>
        <div className='bg-white rounded-lg relative shadow shadow-black/5 col-span-12 md:col-span-7 lg:col-span-8 h-fit'>
          <div className='px-5 py-6 border-b border-dotted'>
            <h3 className='font-medium text-xl'>Department List</h3>
          </div>

          <div className="overflow-x-auto w-full p-5">
            {departmentData.length === 0 ? (
              <div className='text-center text-red-600'>
                <div className='rounded-lg py-16 mt-3 bg-blue-200/20 border text-xl border-blue-900 border-dashed'>
                  No Department found
                </div>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead className="text-base font-medium border-b">
                  <tr>
                    <th scope="col" className="py-3">No.</th>
                    <th scope="col" className="py-3 ">Department Name</th>
                    <th scope="col" className="py-3 ">Start Date</th>
                    <th scope="col" className="py-3 ">Action</th>
                  </tr>
                </thead>
                <tbody className=''>
                  {departmentData.map((item, index) => (
                    <tr key={item._id} className={`${index === departmentData.length -1 ? 'border-none' : 'border-b'} text-gray-900`}>
                      <td className="py-4  min-w-7">{index + 1}</td>
                      <td className="py-4  min-w-[400px]">{item.title}</td>
                      <td className="py-4 min-w-32">{new Date(item.createdAt).toLocaleDateString('en-CA')}</td>
                      <td className="py-4"><button onClick={() => deleteDepartement(item._id)}  className='bg-red-600 text-white text-sm font-semibold py-2 px-5'>Delete</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className='bg-white shadow shadow-black/5 rounded-lg h-fit col-span-12 md:col-span-5 lg:col-span-4'>
          <div className='px-7 py-6 border-b border-dotted'>
            <h3 className='font-medium text-xl'>Add New Department</h3>
          </div>
          <div className='py-6 px-7'>
            <form onSubmit={handleSubmit}>
              <div className='items-end flex flex-col sm:flex-row md:flex-col gap-7'>
                <TextInput
                  type='text'
                  placeholder='Department Title*'
                  label='Department Title*'
                  name='title'
                  value={newDepartmentDeta.title}
                  inputHandler={inputHandler} />
              </div>

              <div className='mt-12 flex justify-center'>
                <button type="submit">
                  <Button title='Submit' />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}