import { FaAnglesLeft, FaAnglesRight, FaWpforms } from 'react-icons/fa6';
import PageHeader from '../component/PageHeader';
import { IoSearchOutline } from 'react-icons/io5';
import { useEffect, useState } from 'react';
import axios from 'axios';
import jsPDF from "jspdf";
import "jspdf-autotable";
import { toast } from 'react-toastify';
import { useAuth } from '../authProvider/AuthProvider';

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
        const pageWidth = doc.internal.pageSize.getWidth();
        const currentDate = new Date().toLocaleDateString('en-CA');

        // Title
        doc.setFontSize(14);
        doc.text("Team Daily Updates", pageWidth / 2, 15, { align: 'center' });

        // Date
        doc.setFontSize(10);
        doc.text(`Date: ${currentDate}`, 20, 25);

        // Prepare table data
        const tableHeaders = ["Sn.", "Name", "Job Role", "Project Name", "Work Update"];
        const tableRows = filteredUpdates.map((item, index) => [
            index + 1,
            item.user?.username || "N/A", // Use "N/A" if username is null or undefined
            item.user?.department || "N/A", // Use "N/A" if department is null or undefined
            item.user?.jobRole || "N/A", // Use "N/A" if jobRole is null or undefined
            item.projectName || "N/A", // Use "N/A" if projectName is null or undefined
            item.description || "N/A", // Use "N/A" if description is null or undefined
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
            },
            columnStyles: {
                0: { cellWidth: 10 }, // Sr.No.
                1: { cellWidth: 30 }, // Name
                2: { cellWidth: 35 }, // Job Role
                3: { cellWidth: 40 }, // Project Name
                4: { cellWidth: `100%` }, // Work Update
            },
        });

        // Download the PDF
        doc.save(`team_daily_updates_${currentDate}.pdf`);
    };
    const downloadAllPDF = () => {
        if (teamDailyUpdates.length === 0) {
            toast.error('No data available to download', { position: 'top-right', autoClose: 3000 });
            return;
        }

        const doc = new jsPDF();
        const groupedUpdates = teamDailyUpdates.reduce((acc, item) => {
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
            const tableHeaders = ["Sn.", "Name", "Job Role", "Project Name", "Work Update"];
              const tableRows = filteredUpdates.map((item, index) => [
                index + 1,
                item.user?.username || "N/A", // Use "N/A" if username is null or undefined
                item.user?.department || "N/A", // Use "N/A" if department is null or undefined
                item.user?.jobRole || "N/A", // Use "N/A" if jobRole is null or undefined
                item.projectName || "N/A", // Use "N/A" if projectName is null or undefined
                item.description || "N/A", // Use "N/A" if description is null or undefined
            ]);

            // Add table
            doc.autoTable({
                head: [tableHeaders],
                body: tableRows,
                startY: startY + 3, // Add margin above table
                theme: "grid",
                margin: { left: 10, right: 10 }, // Reduced X-axis margins
                styles: { fontSize: 10, cellPadding: 2 }, // Reduce font size and padding
                columnStyles: {
                    0: { cellWidth: 10 }, // Sr.No.
                    1: { cellWidth: 30 }, // Name
                    2: { cellWidth: 40 }, // Job Role
                    3: { cellWidth: 40 }, // Project Name
                    4: { cellWidth: `100%` }, // Work Update
                },
                bodyStyles: { valign: "top" }, // Align text to the top
                willDrawCell: (data) => {
                    if (data.column.dataKey === 4 && data.cell.raw) {
                        // Ensure text wraps properly in "Work Update"
                        data.cell.styles.overflow = 'linebreak';
                    }
                },
            });

            // Adjust startY for the next section and add margin after the table
            startY = doc.autoTable.previous.finalY + 10; // Add 15px margin below table
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

        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const currentDate = new Date().toLocaleDateString('en-CA');

        // Title
        doc.setFontSize(14);
        doc.text("Team Daily Updates", pageWidth / 2, 15, { align: 'center' });

        // Date
        doc.setFontSize(10);
        doc.text(`Date: ${currentDate}`, 20, 25);

        // Prepare table data
        const tableHeaders = ["Sn.", "Name", "Job Role", "Project Name", "Work Update"];
        const tableRows = filteredUpdates.map((item, index) => [
            index + 1,
            item.user?.username || "N/A", // Use "N/A" if username is null or undefined
            item.user?.department || "N/A", // Use "N/A" if department is null or undefined
            item.user?.jobRole || "N/A", // Use "N/A" if jobRole is null or undefined
            item.projectName || "N/A", // Use "N/A" if projectName is null or undefined
            item.description || "N/A", // Use "N/A" if description is null or undefined
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
            margin: { left: 10, right: 10 }, // Reduced X-axis margins
            columnStyles: {
                0: { cellWidth: 10 }, // Sr.No.
                1: { cellWidth: 30 }, // Name
                2: { cellWidth: 30 }, // Job Role
                3: { cellWidth: 35 }, // Project Name
                4: { cellWidth: `100%` }, // Work Update
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
                <table className="w-full table-auto text-sm text-left border-collapse">
                    <thead className="text-sm font-medium border-b">
                        <tr>
                            <th scope="col" className="py-3 min-w-12">Sn.</th>
                            <th scope="col" className="py-3 min-w-44">Profile Name</th>
                            <th scope="col" className="py-3 min-w-44">Job Role</th>
                            <th scope="col" className="py-3 min-w-52">Project Name</th>
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
                                    <tr className={`  align-top ${index === filteredUpdates.length - 1 ? "border-none" : "border-b"}`} key={_id}>
                                        <td className="py-4 font-medium text-gray-900 ">{index + 1}</td>
                                        <td
                                            className="py-4 font-medium text-gray-900"
                                            dangerouslySetInnerHTML={{ __html: highlightMatch(user.username) }}
                                        />


                                        <td className="py-4">{user.jobRole}</td>
                                        <td className="py-4">{projectName}</td>
                                        <td className="py-4 pr-6">{description}</td>
                                        <td className="py-4">{new Date(createdAt).toLocaleDateString('en-CA')}</td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>


            <div className="flex flex-col  md:flex-row justify-between gap-4">


                <div className="flex justify-between items-center gap-2 mt-2">
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
    );
}

