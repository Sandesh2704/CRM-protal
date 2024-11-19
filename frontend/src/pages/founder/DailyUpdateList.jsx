import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PageHeader from '../../component/PageHeader';
import { FaAnglesLeft, FaAnglesRight, FaWpforms } from 'react-icons/fa6';
import { useAuth } from '../../authProvider/AuthProvider';
import { toast } from 'react-toastify';
import jsPDF from 'jspdf';
import { IoSearchOutline } from 'react-icons/io5';

export default function DailyUpdateList() {


    const [dailyUpdates, setDailyUpdates] = useState([]);
    const { token } = useAuth();

    useEffect(() => {
        const fetchUpdates = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_DOMAIN_URL}/dailyUpdateManage/gat-daily-update`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setDailyUpdates(response.data);
            } catch (error) {
                console.error('Error fetching updates:', error.response?.data?.message || error.message);
            }
        }
        fetchUpdates();
    }, []);

    const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);
    const [query, setQuery] = useState('');
    const [filteredUpdates, setFilteredUpdates] = useState([]);


    // Filter updates by date and search query
    const filterUpdates = () => {
        const filteredByDate = dailyUpdates.filter(
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
        filterUpdates();
    }, [dailyUpdates, currentDate, query]);



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

        const doc = new jsPDF('landscape'); // Set orientation to landscape
        const pageWidth = doc.internal.pageSize.getWidth();
        const currentDate = new Date().toLocaleDateString('en-CA');

        // Title
        doc.setFontSize(14);
        doc.text("Team Daily Updates", pageWidth / 2, 15, { align: 'center' });

        // Date
        doc.setFontSize(10);
        doc.text(`Date: ${currentDate}`, 20, 25);

        // Prepare table data
        const tableHeaders = ["Sn.", "Name", "Department", "Job Role", "Project Name", "Work Update"];
        const tableRows = filteredUpdates.map((item, index) => [
            index + 1,
            item.user.username,
            item.user.department,
            item.user.jobRole,
            item.projectName,
            item.description,
        ]);

        // Add table with custom column widths
        doc.autoTable({
            head: [tableHeaders],
            body: tableRows,
            startY: 30,
            theme: "grid",
            margin: { left: 10, right: 10 },
            styles: {
                fontSize: 10, // Reduce font size for better fit
                cellPadding: 2, // Reduce padding for compactness
                overflow: 'linebreak', // Ensure text wraps if necessary
            },
            columnStyles: {
                0: { cellWidth: 10 }, // Sr.No.
                1: { cellWidth: 40 }, // Name
                2: { cellWidth: 50 }, // Department
                3: { cellWidth: 40 }, // Job Role
                4: { cellWidth: 56 }, // Project Name
                5: { cellWidth: '100%' }, // Work Update
            },
        });

        // Download the PDF
        doc.save(`team_daily_updates_${currentDate}.pdf`);
    };

    const downloadAllPDF = () => {
        if (dailyUpdates.length === 0) {
            toast.error('No data available to download', { position: 'top-right', autoClose: 3000 });
            return;
        }

        const doc = new jsPDF('landscape'); // Set orientation to landscape
        const groupedUpdates = dailyUpdates.reduce((acc, item) => {
            const date = new Date(item.createdAt).toLocaleDateString('en-CA');
            if (!acc[date]) acc[date] = [];
            acc[date].push(item);
            return acc;
        }, {});

        // Add title to the PDF
        doc.setFontSize(16);
        doc.text("Team Daily Updates", doc.internal.pageSize.getWidth() / 2, 15, { align: "center" });

        let startY = 25; // Initial Y position

        Object.keys(groupedUpdates).forEach((date) => {
            // Add date heading
            doc.setFontSize(12);
            doc.text(`Date: ${date}`, 15, startY);

            // Prepare table data for the date
            const tableHeaders = ["Sn.", "Name", "Department", "Job Role", "Project Name", "Work Update"];
            const tableRows = groupedUpdates[date].map((item, index) => [
                index + 1,
                item.user.username,
                item.user.department,
                item.user.jobRole,
                item.projectName,
                item.description,
            ]);

            // Add table
            doc.autoTable({
                head: [tableHeaders],
                body: tableRows,
                startY: startY + 3, // Add margin above table
                theme: "grid",
                margin: { left: 10, right: 10 },
                styles: { fontSize: 10, cellPadding: 2 },
                columnStyles: {
                    0: { cellWidth: 10 }, // Sr.No.
                    1: { cellWidth: 40 }, // Name
                    2: { cellWidth: 50 }, // Department
                    3: { cellWidth: 40 }, // Job Role
                    4: { cellWidth: 56 }, // Project Name
                    5: { cellWidth: '100%' }, // Work Update
                },
                bodyStyles: { valign: "top" }, // Align text to the top
                willDrawCell: (data) => {
                    if (data.column.dataKey === 5 && data.cell.raw) {
                        // Ensure text wraps properly in "Work Update"
                        data.cell.styles.overflow = 'linebreak';
                    }
                },
            });

            // Adjust startY for the next section and add margin after the table
            startY = doc.autoTable.previous.finalY + 10; // Add 10px margin below table
            if (startY > doc.internal.pageSize.height - 30) {
                doc.addPage();
                startY = 25;
            }
        });

        // Save the PDF
        doc.save(`team_All_daily_updates.pdf`);
    };

    const sharePDF = async () => {
        if (filteredUpdates.length === 0) {
            toast.error('No data available to share!', { position: 'top-right', autoClose: 3000 });
            return;
        }

        const doc = new jsPDF('landscape'); // Set orientation to landscape
        const pageWidth = doc.internal.pageSize.getWidth();
        const currentDate = new Date().toLocaleDateString('en-CA');

        // Title
        doc.setFontSize(14);
        doc.text("Team Daily Updates", pageWidth / 2, 15, { align: 'center' });

        // Date
        doc.setFontSize(10);
        doc.text(`Date: ${currentDate}`, 20, 25);

        // Prepare table data
        const tableHeaders = ["Sn.", "Profile Name", "Department", "Job Role", "Project Name", "Work Update"];
        const tableRows = filteredUpdates.map((item, index) => [
            index + 1,
            item.user.username,
            item.user.department,
            item.user.jobRole,
            item.projectName,
            item.description,
        ]);

        // Add table with custom column widths
        doc.autoTable({
            head: [tableHeaders],
            body: tableRows,
            startY: 30,
            styles: {
                fontSize: 10,
                cellPadding: 2,
            },
            theme: "grid",
            margin: { left: 10, right: 10 },
            columnStyles: {
                0: { cellWidth: 10 }, // Sr.No.
                1: { cellWidth: 40 }, // Name
                2: { cellWidth: 50 }, // Department
                3: { cellWidth: 40 }, // Job Role
                4: { cellWidth: 56 }, // Project Name
                5: { cellWidth: '100%' }, // Work Update
            },
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
                <PageHeader title='Daily Update' icon={<FaWpforms />} />
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
                <table className="table-auto text-sm text-left border-collapse">
                    <thead className="text-sm font-medium border-b">
                        <tr>
                            <th scope="col" className="py-3 min-w-10">Sn.</th>
                            <th scope="col" className="py-3 min-w-48">Profile Name</th>
                            <th scope="col" className="py-3 min-w-44">Job Role</th>
                            <th scope="col" className="py-3 min-w-56">Project Name</th>
                            <th scope="col" className="py-3 min-w-[300px]">Work Update</th>
                            <th scope="col" className="py-3 min-w-24">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUpdates.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="pt-5">
                                    <div className="bg-white text-center border border-dashed border-purple-600 text-base py-20 rounded-lg">
                                        {query ? (
                                            <div>
                                                No Updates found matching with
                                                <span className="text-red-600 text-lg font-semibold"> " {query} "</span>
                                                on <span className="text-red-600 text-lg font-semibold"> " {currentDate} "</span>
                                            </div>
                                        ) : (
                                            <div>
                                                No Updates on <span className="text-red-600 text-lg font-semibold"> " {currentDate} "</span>
                                            </div>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            filteredUpdates.map((item, index) => {
                                const { projectName, user, _id, description, createdAt } = item;
                                return (
                                    <tr className={`align-top ${index === filteredUpdates.length - 1 ? "border-none" : "border-b"}`} key={_id}>
                                        <td className="py-4 font-medium text-gray-900 ">{index + 1}</td>

                                        <td className="py-4 pr-4">
                                            <div className='flex flex-col'>
                                                <h1 className='font-medium text-sm text-gray-900' dangerouslySetInnerHTML={{ __html: highlightMatch(user.username) }} />
                                                <span className='text-xs italic text-gray-700'>({user.department})</span>
                                            </div>
                                        </td>
                                        <td className="py-4 pr-4">{user.jobRole}</td>
                                        <td className="py-4 pr-5 text-justify">{projectName}</td>
                                        <td className="py-4 pr-6 text-justify">{description}</td>
                                        <td className="py-4 ">{new Date(createdAt).toLocaleDateString('en-CA')}</td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>


            <div className="flex flex-col  md:flex-row justify-between gap-4">


                <div className="flex justify-between items-center gap-2 ">
                    <button
                        className="flex items-center bg-white py-2 px-4 rounded-lg shadow shadow-black/5 gap-1"
                        onClick={handlePreviousDate}>
                        <FaAnglesLeft className='text-[10px]' />
                        <h1 className='text-sm font-semibold'>Previous</h1>
                    </button>


                    <button
                        className="flex items-center bg-white py-2 px-4 rounded-lg shadow shadow-black/5 gap-1"
                        onClick={handleNextDate}>
                        <h1 className='text-sm font-semibold'>Next</h1>
                        <FaAnglesRight className='text-[10px]' />
                    </button>
                </div>

                <div className='flex gap-2 items-center'>
                    <button
                        className="flex items-center bg-purple-700 h-fit  bg-blue-700 text-white py-2 px-4 rounded-lg shadow shadow-black/5 gap-1"
                        onClick={downloadPDF}
                    >
                        <div className='flex gap-2'>
                            <h1 className='text-sm font-semibold'>Download </h1>
                            <span className='text-sm italic '> "{currentDate}"</span>
                        </div>
                    </button>
                    <button
                        className="flex items-center bg-pink-600 h-fit  text-white py-2 px-4 rounded-lg shadow shadow-black/5 gap-1"
                        onClick={downloadAllPDF}
                    >
                        <h1 className='text-sm font-semibold'>Download All Data </h1>
                    </button>
                    <button
                        className="flex items-center bg-blue-700 h-fit text-white py-2 px-4 rounded-lg shadow shadow-black/5 gap-1"
                        onClick={sharePDF}
                    >
                        <h1 className='text-sm font-semibold'>Share PDF</h1>
                    </button>
                </div>
            </div>
        </>
    )
}