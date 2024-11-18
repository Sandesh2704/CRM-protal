import { FaAnglesLeft, FaAnglesRight, FaWpforms } from 'react-icons/fa6';
import { useAuth } from '../../authProvider/AuthProvider';
import PageHeader from '../../component/PageHeader';
import { IoSearchOutline } from 'react-icons/io5';
import { useEffect, useState } from 'react';
import axios from 'axios';
import jsPDF from "jspdf";
import "jspdf-autotable";
import { toast } from 'react-toastify';

export default function TeamDailyUpdate() {
    const [teamDailyUpdates, setTeamDailyUpdates] = useState([]);
    const [filteredUpdates, setFilteredUpdates] = useState([]);
    const { token } = useAuth();

    const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);
    const [query, setQuery] = useState('');

    // Fetch Team Updates
    const fetchTeamDailyUpdates = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_DOMAIN_URL}/dailyUpdateManage/team-updates`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setTeamDailyUpdates(response.data.updates);
        } catch (error) {
            console.error("Error fetching team updates:", error.response || error);
        }
    };

    // Filter updates by date and search query
    const filterUpdates = () => {
        const filteredByDate = teamDailyUpdates.filter(
            (item) => new Date(item.createdAt).toISOString().split('T')[0] === currentDate
        );

        const filteredByQuery = filteredByDate.filter((item) =>
            item.user.username.toLowerCase().includes(query.toLowerCase()) ||
            item.user.jobRole.toLowerCase().includes(query.toLowerCase()) ||
            item.projectName.toLowerCase().includes(query.toLowerCase()) ||
            item.description.toLowerCase().includes(query.toLowerCase())
        );

        setFilteredUpdates(filteredByQuery);
    };

    useEffect(() => {
        fetchTeamDailyUpdates();
    }, []);

    useEffect(() => {
        filterUpdates();
    }, [teamDailyUpdates, currentDate, query]);

    const handleSearchChange = (e) => {
        setQuery(e.target.value);
    };

    const handlePreviousDate = () => {
        const prevDate = new Date(currentDate);
        prevDate.setDate(prevDate.getDate() - 1);
        setCurrentDate(prevDate.toISOString().split('T')[0]);
    };

    const handleNextDate = () => {
        const nextDate = new Date(currentDate);
        nextDate.setDate(nextDate.getDate() + 1);
        setCurrentDate(nextDate.toISOString().split('T')[0]);
    };

    const handleDateChange = (e) => {
        setCurrentDate(e.target.value);
    };

    const highlightMatch = (text) => {
        if (!query) return text;
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, (match) => `<span class="text-red-600 text-base font-semibold">${match}</span>`);
    };

    const downloadPDF = () => {

        if (filteredUpdates.length === 0) {
            toast.error('No data available to download', { position: 'top-right', autoClose: 3000 });
            return;
        }
        const doc = new jsPDF();

        // Title
        doc.setFontSize(14);
        doc.text("Team Daily Updates", 20, 20);

        // Prepare table data
        const tableHeaders = ["Sr.No.", "Name", "Job Role", "Project Name", "Work Update", "Date"];
        const tableRows = filteredUpdates.map((item, index) => [
            index + 1,
            item.user.username,
            item.user.jobRole,
            item.projectName,
            item.description,
            new Date(item.createdAt).toLocaleDateString('en-CA'),
        ]);

        // Add table
        doc.autoTable({
            head: [tableHeaders],
            body: tableRows,
            startY: 20,
        });

        // Download the PDF
        doc.save(`team_daily_updates_${currentDate}.pdf`);
    };

    const sharePDF = async () => {
        if (filteredUpdates.length === 0) {
            toast.error('No data available to share!', { position: 'top-right', autoClose: 3000 });
            return;
        }

        const doc = new jsPDF();

        // Title
        doc.setFontSize(14);
        doc.text("Team Daily Updates", 20, 20);

        // Prepare table data
        const tableHeaders = ["Sr.No.", "Name", "Job Role", "Project Name", "Work Update", "Date"];
        const tableRows = filteredUpdates.map((item, index) => [
            index + 1,
            item.user.username,
            item.user.jobRole,
            item.projectName,
            item.description,
            new Date(item.createdAt).toLocaleDateString('en-CA'),
        ]);

        // Add table
        doc.autoTable({
            head: [tableHeaders],
            body: tableRows,
            startY: 20,
        });

        // Generate the PDF as Blob
        const pdfBlob = doc.output("blob");

        // Check if the browser supports the Share API with file sharing
        if (navigator.canShare && navigator.canShare({ files: [new File([pdfBlob], `team_daily_updates_${currentDate}.pdf`)] })) {
            const file = new File([pdfBlob], `team_daily_updates_${currentDate}.pdf`, {
                type: "application/pdf",
            });

            try {
                await navigator.share({
                    title: "Team Daily Updates",
                    text: "Please find the daily updates attached.",
                    files: [file],
                });
            } catch (error) {
                console.error("Error sharing PDF:", error);
            }
        } else {
            alert("Sharing PDF is not supported on your browser. The file will be downloaded instead.");
            // Fallback to downloading the PDF
            doc.save(`team_daily_updates_${currentDate}.pdf`);
        }
    };

    return (
        <>
            <div>
                <PageHeader title='Daily Update History' icon={<FaWpforms />} />
            </div>

            <div className='flex justify-between flex-wrap gap-4 bg-white py-4 px-4 rounded-lg shadow shadow-black/5'>
                {/* Date Picker */}
                <div className='flex items-center bg-white w-full sm:w-fit py-2 px-3 rounded-sm border'>
                    <input
                        type="date"
                        value={currentDate}
                        onChange={handleDateChange}
                        className="outline-none text-sm placeholder:text-zinc-500"
                    />
                </div>

                {/* Search Box */}
                <div className='flex gap-2 text-theme1 justify-between items-center bg-white w-full sm:w-fit py-2 px-3 rounded-sm border'>
                    <input
                        type="text"
                        value={query}
                        onChange={handleSearchChange}
                        className="placeholder:text-zinc-500 outline-none"
                        placeholder="Search by Name."
                    />
                    <IoSearchOutline />
                </div>


            </div>


            <div className='bg-white my-6 py-4 px-4 rounded-lg shadow shadow-black/5 overflow-x-auto'>
                <table className="w-full min-w-full text-sm text-left border-collapse table-auto">
                    <thead className="text-sm font-medium border-b">
                        <tr>
                            <th scope="col" className="py-3  w-12">Sr.No.</th>
                            <th scope="col" className="py-3   w-40">Name</th>
                            <th scope="col" className="py-3 w-48">Job Role</th>
                            <th scope="col" className="py-3  w-60">Project Name</th>
                            <th scope="col" className="py-3">Work Update</th>
                            <th scope="col" className="py-3  w-24">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUpdates.length === 0 ? (
                            <tr>
                                <td colSpan="6" className='pt-5'>
                                    <div className='bg-white text-center border border-dashed border-purple-600 text-base py-20 rounded-lg'>
                                        {query ? (
                                            <div>
                                                No Updates found matching with
                                                <span className='text-red-600 text-lg font-semibold'> " {query} "</span>
                                                on <span className='text-red-600 text-lg font-semibold'> " {currentDate} "</span>
                                            </div>
                                        ) : (
                                            <div>
                                                No Updates on <span className='text-red-600 text-lg font-semibold'> " {currentDate} "</span>
                                            </div>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            filteredUpdates.map((item, index) => {
                                const { projectName, user, _id, description, createdAt } = item;
                                return (
                                    <tr className="border-b " key={_id}>
                                        <td className="py-4 font-medium text-gray-900  ">{index + 1}</td>
                                        <td
                                            className="py-4 font-medium text-gray-900 "
                                            dangerouslySetInnerHTML={{ __html: highlightMatch(user.username) }}
                                        />
                                        <td className="py-4   ">{user.jobRole}</td>
                                        <td className="py-4 pr-10 ">{projectName}</td>
                                        <td className="py-4  pr-6">{description}</td>
                                        <td className="py-4 ">{new Date(createdAt).toLocaleDateString('en-CA')}</td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>



            <div className="flex justify-between mt-2">
                <button
                    className="flex items-center bg-white py-2 px-4 rounded-lg shadow shadow-black/5 gap-1"
                    onClick={handlePreviousDate}
                >
                    <FaAnglesLeft className='text-[10px]' />
                    <h1 className='text-sm font-semibold'>Previous</h1>
                </button>


                <button
                    className="flex items-center bg-white py-2 px-4 rounded-lg shadow shadow-black/5 gap-1"
                    onClick={handleNextDate}
                >
                    <h1 className='text-sm font-semibold'>Next</h1>
                    <FaAnglesRight className='text-[10px]' />
                </button>
            </div>

            <div className='flex justify-center mt-1  gap-4'>
                <button
                    className="flex items-center bg-blue-700 text-white py-2 px-4 rounded-lg shadow shadow-black/5 gap-1"
                    onClick={downloadPDF}
                >
                    <h1 className='text-sm font-semibold'>Download PDF</h1>
                </button>
                <button
                    className="flex items-center bg-purple-700 text-white py-2 px-4 rounded-lg shadow shadow-black/5 gap-1"
                    onClick={sharePDF}
                >
                    <h1 className='text-sm font-semibold'>Share PDF</h1>
                </button>
            </div>
        </>
    );
}

