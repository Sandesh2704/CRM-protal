import { CiGrid41 } from "react-icons/ci";
import PageHeader from "../../component/PageHeader";
import CountingCard from "../../component/CountingCard";

export default function Dashboard({staffData, yourPendingTasks, yourTasks}) {

  
  return (
    <>
   <div>
                <PageHeader title='Dashboard' icon={<CiGrid41 />} />
            </div>

            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 lg:gap-7'>
                <CountingCard items={staffData} lebal='Team Members'/>
                <CountingCard items={yourTasks} lebal='Total Task'/>
                <CountingCard items={yourPendingTasks} lebal='Pending Tasks'/>
            </div>
    </>
  )
}