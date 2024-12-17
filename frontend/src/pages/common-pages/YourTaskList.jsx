import { Link } from 'react-router-dom';
import PageHeader from '../../component/PageHeader';
import { VscTasklist } from 'react-icons/vsc';
import { useAuth } from '../../authProvider/AuthProvider';
import { useFetchYourTasks } from '../../utils/useFetchYourTasks';

export default function YourTaskList() {
    const { userJobPosition } = useAuth();
    const {  yourTasks } = useFetchYourTasks();

    // Function to format assignment date for grouping
    const formatAssignmentDate = (date) => {
        const taskDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);

        if (taskDate.toDateString() === today.toDateString()) return 'Today';
        if (taskDate.toDateString() === yesterday.toDateString()) return 'Yesterday';
        return taskDate.toLocaleDateString();
    };

    // Group tasks by assignment date (createdAt)
    const groupedTasks = yourTasks.reduce((acc, task) => {
        const dateKey = formatAssignmentDate(task.createdAt);
        if (!acc[dateKey]) acc[dateKey] = [];
        acc[dateKey].push(task);
        return acc;
    }, {});


    return (
        <>
            <div>
                <PageHeader title='Your Task' icon={<VscTasklist />} />
            </div>

            {Object.keys(groupedTasks).length > 0 ? (
                Object.entries(groupedTasks).reverse().map(([date, tasks]) => (
                    <div key={date} className="mb-6">
                        <div className="flex justify-center items-center mb-7 gap-6">
                            <div className='h-[1px] w-full bg-gradient-to-r from-blue-400 to-purple-400 flex-1' />
                            <h2 className="text-gray-600 text-base">{date}</h2>
                            <div className='h-[1px] w-full bg-gradient-to-r from-blue-400 to-purple-400 flex-1' />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {tasks.map((task) => {
                                const { deadline, title, description, _id, status, assignerId } = task;
                                return (
                                    <div key={_id} className="bg-white shadow shadow-black/5 rounded-2xl px-4 py-6">
                                        <div className=" h-fit">
                                            <div className='flex items-center gap-2'>

                                                <div className={`rounded-full p-[3px] ${status === 'Pending' ? 'bg-red-500' :
                                                    status === 'Complete' ? 'bg-green-600' :
                                                        status === 'Delay' ? 'bg-blue-500' : ''}`} />

                                                <p className={`text-sm font-semibold ${status === 'Pending' ? 'text-red-500' :
                                                    status === 'Complete' ? 'text-green-600' :
                                                        status === 'Delay' ? 'text-blue-500' : ''}`}>
                                                    {status.charAt(0).toUpperCase() + status.slice(1)}
                                                </p>

                                            </div>
                                            <h3 className='font-semibold text-3xl mt-2 mb-4' >{title.split(' ').slice(0, 12).join(' ')}</h3>
                                            <p>{description.split(' ').slice(0, 50).join(' ') + '...'}</p>

                                            <p className='mt-4 text-sm  text-gray-700'>Deadline: {new Date(deadline).toLocaleDateString()}</p>


                                            <div className='text-sm flex gap-1  text-gray-700 '>
                                                <p>Assigned by: </p>
                                                <span className='font-semibold'>{assignerId?.username}</span>
                                                <div className='italic ' >
                                                    <span >({assignerId?.email})</span>
                                                </div>
                                            </div>

                                            <div className="text-center mt-3">
                                                <Link
                                                    to={
                                                        userJobPosition === 'Manager'
                                                            ? `/manager/yourTaskDetails/${_id}`
                                                            : userJobPosition === 'Team Leader'
                                                                ? `/team-leader/yourTaskDetails/${_id}`
                                                                : userJobPosition === 'Employee'
                                                                    ? `/employee/yourTaskDetails/${_id}`
                                                                    : '/not-found' // Fallback route
                                                    }
                                                    state={{ assignTaskDetails: task }}
                                                    className="text-xs text-indigo-500 italic hover:underline hover:text-indigo-600 font-medium"
                                                >
                                                    View Details
                                                </Link>


                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))
            ) : (
                <div className='text-center text-xl py-20 bg-white shadow shadow-black/5 my-7 text-blue-600'>
                    No tasks found
                </div>
            )}
        </>
    );
}


// import { Link } from 'react-router-dom';
// import PageHeader from '../../component/PageHeader';
// import { VscTasklist } from 'react-icons/vsc';
// import { useAuth } from '../../authProvider/AuthProvider';

// export default function YourTaskList({ yourTasks }) {
//     const { userJobPosition } = useAuth();

//     const formatAssignmentDate = (date) => {
//         const taskDate = new Date(date);
//         const today = new Date();
//         today.setHours(0, 0, 0, 0);
//         const yesterday = new Date(today);
//         yesterday.setDate(today.getDate() - 1);

//         if (taskDate.toDateString() === today.toDateString()) return 'Today';
//         if (taskDate.toDateString() === yesterday.toDateString()) return 'Yesterday';
//         return taskDate.toLocaleDateString();
//     };

//     const groupedTasks = yourTasks.reduce((acc, task) => {
//         const dateKey = formatAssignmentDate(task.createdAt);
//         if (!acc[dateKey]) acc[dateKey] = [];
//         acc[dateKey].push(task);
//         return acc;
//     }, {});

//     return (
//         <>
//             <div>
//                 <PageHeader title="Your Task" icon={<VscTasklist />} />
//             </div>

//             {Object.keys(groupedTasks).length > 0 ? (
//                 Object.entries(groupedTasks).reverse().map(([date, tasks]) => (
//                     <div key={date} className="mb-6">
//                         <div className="flex justify-center items-center mb-7 gap-6">
//                             <div className="h-[1px] w-full bg-gradient-to-r from-blue-400 to-purple-400 flex-1" />
//                             <h2 className="text-gray-600 text-base">{date}</h2>
//                             <div className="h-[1px] w-full bg-gradient-to-r from-blue-400 to-purple-400 flex-1" />
//                         </div>

//                         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-5">
//                             {tasks.map((task) => {
//                                 const { deadline, title, description, _id, status, assignerId } = task;
//                                 return (
//                                     <div key={_id} className="bg-white shadow shadow-black/5 rounded-2xl px-4 py-6">
//                                         <div>
//                                             <div className="flex items-center gap-2">
//                                                 <div
//                                                     className={`rounded-full p-[3px] ${
//                                                         status === 'Pending' ? 'bg-red-500' :
//                                                         status === 'Complete' ? 'bg-green-600' :
//                                                         status === 'Delay' ? 'bg-blue-500' : ''
//                                                     }`}
//                                                 />
//                                                 <p className={`text-sm font-semibold ${
//                                                     status === 'Pending' ? 'text-red-500' :
//                                                     status === 'Complete' ? 'text-green-600' :
//                                                     status === 'Delay' ? 'text-blue-500' : ''
//                                                 }`}>
//                                                     {status.charAt(0).toUpperCase() + status.slice(1)}
//                                                 </p>
//                                             </div>
//                                             <h3 className="font-semibold text-3xl mt-2 mb-4">
//                                                 {title.split(' ').slice(0, 12).join(' ')}
//                                             </h3>
//                                             <p>{description.split(' ').slice(0, 50).join(' ')}...</p>
//                                             <p className="mt-4 text-sm text-gray-700">
//                                                 Deadline: {new Date(deadline).toLocaleDateString()}
//                                             </p>
//                                             <div className="text-sm flex gap-1 text-gray-700">
//                                                 <p>Assigned by: </p>
//                                                 <span className="font-semibold">{assignerId?.username}</span>
//                                                 <div className="italic">
//                                                     <span>({assignerId?.email})</span>
//                                                 </div>
//                                             </div>
//                                             <div className="text-center mt-3">
//                                                 <Link
//                                                     to={
//                                                         userJobPosition === 'Manager'
//                                                             ? `/manager/yourTaskDetails/${_id}`
//                                                             : userJobPosition === 'Team Leader'
//                                                                 ? `/team-leader/yourTaskDetails/${_id}`
//                                                                 : userJobPosition === 'Employee'
//                                                                     ? `/employee/yourTaskDetails/${_id}`
//                                                                     : '/not-found'
//                                                     }
//                                                     className="text-xs text-indigo-500 italic hover:underline hover:text-indigo-600 font-medium"
//                                                 >
//                                                     View Details
//                                                 </Link>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 );
//                             })}
//                         </div>
//                     </div>
//                 ))
//             ) : (
//                 <div className="text-center text-xl py-20 bg-white shadow shadow-black/5 my-7 text-blue-600">
//                     No tasks found
//                 </div>
//             )}
//         </>
//     );
// }