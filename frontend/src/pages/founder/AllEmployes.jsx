import { LuUsers2 } from "react-icons/lu";
import PageHeader from '../../component/PageHeader';
import UserCard from '../../component/UserCard';
import { useState } from "react";

export default function AllEmployes({ employees }) {

    const [filter, setFilter] = useState("All");

    const filteredEmployees = employees.filter(employee => {
        if (filter === "All") return true;
        return employee.jobPosition === filter;
    });

    return (
        <>
         <div>
                <PageHeader title='Company Staff' icon={<LuUsers2/>} />
            </div>


{/* Filter Buttons */}
<div className="flex space-x-4 mb-6">
                <button 
                    onClick={() => setFilter("All")} 
                    className={`px-4 py-2 rounded text-sm font-semibold shadow shadow-black/5 ${filter === "All" ? "bg-gradiant text-white" : "bg-white text-black"}`}
                >
                    All
                </button>
                <button 
                    onClick={() => setFilter("Employee")} 
                    className={`px-4 py-2 rounded text-sm font-semibold shadow shadow-black/5 ${filter === "Employee" ? "bg-gradiant text-white" : "bg-white text-black"}`}
                    >
                    Employee
                </button>
                <button 
                    onClick={() => setFilter("Manager")} 
                    className={`px-4 py-2 rounded text-sm font-semibold shadow shadow-black/5 ${filter === "Manager" ? "bg-gradiant text-white" : "bg-white text-black"}`}
                    >
                    Manager
                </button>
                <button 
                    onClick={() => setFilter("Team Leader")} 
                    className={`px-4 py-2 rounded text-sm font-semibold shadow shadow-black/5 ${filter === "Team Leader" ? "bg-gradiant text-white" : "bg-white text-black"}`}
                    >
                    Team Leader
                </button>
            </div>

            {filteredEmployees.length > 0 ? (
                <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
                    {
                        filteredEmployees.map((item, index) => {
                            const { _id } = item;
                            return (
                                <div key={index}>
                                    <UserCard item={item} urlPath={`/founder/staffDeatils/${_id}`} />
                                </div>
                            );
                        })
                    }
                </div>
            ) : (
                <div className="bg-white text-center py-16 rounded-lg shadow shadow-black/5">
                    <p className="text-gray-600 text-lg">No employees found for this category.</p>
                </div>
            )}
        </>
    )
}
