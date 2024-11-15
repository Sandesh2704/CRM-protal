
import { LuUsers2 } from 'react-icons/lu';
import PageHeader from '../../component/PageHeader';
import UserCard from '../../component/UserCard';

export default function TeamMember({ staffData }) {


    return (
        <div>
            <div>
                <PageHeader title='Team Members' icon={<LuUsers2 />} />
            </div>
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
                {
                    staffData.map((item, index) => {
                        const { _id } = item;
                        return (
                            <div key={index}>
                                <UserCard item={item} urlPath={`/team-leader/staffDeatils/${_id}`} />
                            </div>
                        );
                    })
                }
            </div>
        </div>
    )
}