import React from 'react'
import PageHeader from '../../component/PageHeader'
import { CiGrid41 } from 'react-icons/ci'

export default function Dashboard() {
  return (
    <>
          <div>
                <PageHeader title='Dashboard' icon={<CiGrid41 />} />
            </div>
    </>
  )
}
