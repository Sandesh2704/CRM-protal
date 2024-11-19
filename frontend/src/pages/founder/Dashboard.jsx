import React from 'react'
import CountingCard from '../../component/CountingCard'
import PageHeader from '../../component/PageHeader'
import { CiGrid41 } from 'react-icons/ci'

export default function Dashboard({ managers, employees, departmentData }) {
    return (
        <>
         <div>
                <PageHeader title='Dashboard' icon={<CiGrid41 />} />
            </div>

            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 lg:gap-6'>
                <CountingCard items={managers} lebal='Total Managers'/>
                <CountingCard items={employees} lebal='Total Employess'/>
                <CountingCard items={departmentData} lebal='Department Count'/>
            </div>

        </>
    )
}
