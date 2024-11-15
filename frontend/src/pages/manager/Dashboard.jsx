import React from 'react'
import PageHeader from '../../component/PageHeader'
import { CiGrid41 } from 'react-icons/ci'
import CountingCard from '../../component/CountingCard'

export default function Dashboard({staffData, teamLeaders}) {
  return (
    <>
       <div>
                <PageHeader title='Dashboard' icon={<CiGrid41 />} />
            </div>

            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 lg:gap-7'>
                <CountingCard items={staffData} lebal='My Staff'/>
                <CountingCard items={teamLeaders} lebal='Total Team Leaders'/>
            </div>
    </>
  )
}
