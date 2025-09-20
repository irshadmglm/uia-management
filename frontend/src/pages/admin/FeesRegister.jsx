import React, { useState, useMemo, useEffect } from 'react';
import { useFeeStore } from '../../store/feesSrore'; // Ensure this path is correct
import Header from '../../components/Header';

// --- Helper Functions ---
const formatCurrency = (value) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return '';
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(numValue);
};

// --- SVG Icons ---
const EditIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>);
const SaveIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>);
const CancelIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>);
const ChevronDownIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>);
const SpinnerIcon = () => (<svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>);


// --- Reusable Child Components ---

const StudentCard = ({ student, onUpdate, monthNames }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedData, setEditedData] = useState(student);

    const perYear = parseFloat(student.subscription.perYear) || 0;
    const balance = parseFloat(editedData.subscription.balance) || 0; // Use editedData for live balance
    const paid = perYear > 0 ? perYear - balance : 0;
    const progress = perYear > 0 ? (paid / perYear) * 100 : (balance === 0 ? 100 : 0);

    useEffect(() => { setEditedData(student); }, [student]);

    const handleEditToggle = () => { setIsEditing(!isEditing); setEditedData(student); };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const [field, subField] = name.split('.');
        setEditedData(prev => {
            let newEditedData = { ...prev };
            if (subField) {
                newEditedData = { ...prev, [field]: { ...prev[field], [subField]: value } };
            } else {
                newEditedData = { ...prev, [name]: value };
            }
            if (name === 'subscription.perYear') {
                const totalPaid = Object.values(newEditedData.payments).reduce((sum, amount) => !isNaN(parseFloat(amount)) ? sum + parseFloat(amount) : sum, 0);
                newEditedData.subscription.balance = String((parseFloat(value) || 0) - totalPaid);
            }
            return newEditedData;
        });
    };

    const handlePaymentChange = (month, value) => {
        setEditedData(prev => {
            const newPayments = { ...prev.payments, [month]: value };
            const totalPaid = Object.values(newPayments).reduce((sum, amount) => !isNaN(parseFloat(amount)) ? sum + parseFloat(amount) : sum, 0);
            const newBalance = (parseFloat(prev.subscription.perYear) || 0) - totalPaid;
            return { ...prev, payments: newPayments, subscription: { ...prev.subscription, balance: String(newBalance) } };
        });
    };

    const handleSave = () => {
        onUpdate(student.cicNumber, editedData);
        setIsEditing(false);
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out overflow-hidden flex flex-col">
            <div className="p-6 flex-grow">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{student.name}</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">CIC: {student.cicNumber}</p>
                    </div>
                    <div className="flex space-x-2">
                        {isEditing ? (
                            <>
                                <button onClick={handleSave} className="p-2 text-green-600 hover:bg-green-100 dark:hover:bg-green-900 rounded-full transition-colors"><SaveIcon /></button>
                                <button onClick={handleEditToggle} className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded-full transition-colors"><CancelIcon /></button>
                            </>
                        ) : (
                            <button onClick={handleEditToggle} className="p-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-gray-700 rounded-full transition-colors"><EditIcon /></button>
                        )}
                    </div>
                </div>
                <div className="mb-4">
                    {isEditing ? <input type="text" name="contact" value={editedData.contact || ''} onChange={handleInputChange} className="text-gray-700 dark:text-gray-300 dark:bg-gray-700 p-2 border dark:border-gray-600 rounded-md w-full" placeholder="Contact number" /> : <p className="text-gray-700 dark:text-gray-300">{student.contact || 'No contact info'}</p>}
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg mb-4">
                    <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">Fee Status</h3>
                    <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Total Fee</p>
                            {isEditing ? <input type="number" name="subscription.perYear" value={editedData.subscription.perYear} onChange={handleInputChange} className="font-bold text-indigo-600 dark:text-indigo-400 dark:bg-gray-600 text-lg p-1 border dark:border-gray-500 rounded-md w-full text-center" /> : <p className="font-bold text-indigo-600 dark:text-indigo-400 text-lg">{formatCurrency(student.subscription.perYear)}</p>}
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Balance Due</p>
                            <p className="font-bold text-red-500 dark:text-red-400 text-lg">{formatCurrency(editedData.subscription.balance)}</p>
                        </div>
                    </div>
                    <div className="mt-4">
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5"><div className="bg-gradient-to-r from-green-400 to-blue-500 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div></div>
                        <p className="text-right text-xs mt-1 text-gray-600 dark:text-gray-400">{formatCurrency(paid)} Paid</p>
                    </div>
                </div>
                <div>
                    <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">Monthly Payments</h3>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 text-sm">
                        {Object.keys(student.payments).map((month) => {
                            const paymentValue = editedData.payments[month];
                            return (
                                <div key={month} className="p-2 bg-gray-50 dark:bg-gray-700 rounded-md text-center">
                                    <p className="font-medium text-gray-500 dark:text-gray-400 text-xs truncate" title={monthNames[month]}>{month}</p>
                                    {isEditing ? (
                                        <input type="text" value={paymentValue || ''} onChange={(e) => handlePaymentChange(month, e.target.value)} className="font-semibold mt-1 p-1 border dark:border-gray-600 dark:bg-gray-600 dark:text-gray-100 rounded-md w-full text-center text-xs" />
                                    ) : (
                                        <>
                                            {paymentValue === 'FULL PAID' ? <span className="inline-block bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs font-semibold px-2.5 py-0.5 rounded-full mt-1">Paid</span> : paymentValue ? <p className="font-semibold text-gray-800 dark:text-gray-100 mt-1">{formatCurrency(paymentValue)}</p> : <p className="font-semibold text-gray-400 dark:text-gray-500 mt-1">-</p>}
                                        </>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

const StudentTableRow = ({ student, onUpdate, monthNames }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [editedData, setEditedData] = useState(student);

    const perYear = parseFloat(student.subscription.perYear) || 0;
    const balance = parseFloat(editedData.subscription.balance) || 0;
    const paid = perYear - balance;
    const progress = perYear > 0 ? (paid / perYear) * 100 : (balance === 0 ? 100 : 0);

    useEffect(() => { setEditedData(student); }, [student]);

    const handleEditToggle = () => { setIsEditing(!isEditing); setEditedData(student); };
    
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const [field, subField] = name.split('.');
        setEditedData(prev => {
            let newEditedData = { ...prev };
            if (subField) {
                newEditedData = { ...prev, [field]: { ...prev[field], [subField]: value } };
            } else {
                newEditedData = { ...prev, [name]: value };
            }
            if (name === 'subscription.perYear') {
                const totalPaid = Object.values(newEditedData.payments).reduce((sum, amount) => !isNaN(parseFloat(amount)) ? sum + parseFloat(amount) : sum, 0);
                newEditedData.subscription.balance = String((parseFloat(value) || 0) - totalPaid);
            }
            return newEditedData;
        });
    };
    
    const handlePaymentChange = (month, value) => {
        setEditedData(prev => {
            const newPayments = { ...prev.payments, [month]: value };
            const totalPaid = Object.values(newPayments).reduce((sum, amount) => !isNaN(parseFloat(amount)) ? sum + parseFloat(amount) : sum, 0);
            const newBalance = (parseFloat(prev.subscription.perYear) || 0) - totalPaid;
            return { ...prev, payments: newPayments, subscription: { ...prev.subscription, balance: String(newBalance) }};
        });
    };
    
    const handleSave = () => {
        onUpdate(student.cicNumber, editedData);
        setIsEditing(false);
    };

    return (
        <>
            <tr className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="px-5 py-4 text-sm">
                    <p className="text-gray-900 dark:text-gray-100 whitespace-no-wrap">{student.name}</p>
                    <p className="text-gray-600 dark:text-gray-400 whitespace-no-wrap text-xs">CIC: {student.cicNumber}</p>
                </td>
                <td className="px-5 py-4 text-sm text-gray-900 dark:text-gray-300">{isEditing ? <input type="text" name="contact" value={editedData.contact || ''} onChange={handleInputChange} className="p-2 border dark:border-gray-600 rounded-md w-full dark:bg-gray-700 dark:text-gray-100" /> : student.contact || '-'}</td>
                <td className="px-5 py-4 text-sm text-gray-900 dark:text-gray-300">{isEditing ? <input type="number" name="subscription.perYear" value={editedData.subscription.perYear} onChange={handleInputChange} className="p-2 border dark:border-gray-600 rounded-md w-24 text-right dark:bg-gray-700 dark:text-gray-100" /> : formatCurrency(student.subscription.perYear)}</td>
                <td className="px-5 py-4 text-sm font-semibold text-red-600 dark:text-red-400">{formatCurrency(editedData.subscription.balance)}</td>
                <td className="px-5 py-4 text-sm">
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5"><div className="bg-gradient-to-r from-green-400 to-blue-500 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div></div>
                    <p className="text-right text-xs mt-1 text-gray-600 dark:text-gray-400">{Math.round(progress)}% Paid</p>
                </td>
                <td className="px-5 py-4 text-sm text-center">
                    <div className="flex items-center justify-center space-x-2">
                        {isEditing ? (
                            <>
                                <button onClick={handleSave} className="p-2 text-green-600 hover:bg-green-100 dark:hover:bg-green-900 rounded-full"><SaveIcon /></button>
                                <button onClick={handleEditToggle} className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded-full"><CancelIcon /></button>
                            </>
                        ) : (
                            <button onClick={handleEditToggle} className="p-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-gray-700 rounded-full"><EditIcon /></button>
                        )}
                        <button onClick={() => setIsExpanded(!isExpanded)} className={`p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}><ChevronDownIcon /></button>
                    </div>
                </td>
            </tr>
            {isExpanded && (
                <tr className="bg-gray-50 dark:bg-gray-800/50">
                    <td colSpan="7" className="p-4 border-t border-gray-200 dark:border-gray-700">
                        <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-3 text-sm">Monthly Payments</h4>
                        <div className="grid grid-cols-4 lg:grid-cols-6 gap-2 text-sm">
                            {Object.keys(student.payments).map((month) => {
                                const paymentValue = editedData.payments[month];
                                return (
                                    <div key={month} className="p-2 bg-white dark:bg-gray-700 border dark:border-gray-600 rounded-md text-center">
                                        <p className="font-medium text-gray-500 dark:text-gray-400 text-xs truncate" title={monthNames[month]}>{month}</p>
                                        {isEditing ? (
                                            <input type="text" value={paymentValue || ''} onChange={(e) => handlePaymentChange(month, e.target.value)} className="font-semibold mt-1 p-1 border dark:border-gray-500 rounded-md w-full text-center text-xs dark:bg-gray-600 dark:text-gray-100" />
                                        ) : (
                                            <>
                                                {paymentValue === 'FULL PAID' ? <span className="inline-block bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs font-semibold px-2 py-0.5 rounded-full mt-1">Paid</span> : paymentValue ? <p className="font-semibold text-gray-800 dark:text-gray-100 mt-1">{formatCurrency(paymentValue)}</p> : <p className="font-semibold text-gray-400 dark:text-gray-500 mt-1">-</p>}
                                            </>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </td>
                </tr>
            )}
        </>
    );
};

const StudentTable = ({ students, onUpdate, monthNames }) => (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-x-auto">
        <table className="min-w-full leading-normal">
            <thead>
                <tr className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 uppercase text-sm">
                    <th className="px-5 py-3 border-b-2 border-gray-200 dark:border-gray-700 text-left">Student</th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 dark:border-gray-700 text-left">Contact</th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 dark:border-gray-700 text-left">Total Fee</th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 dark:border-gray-700 text-left">Balance</th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 dark:border-gray-700 text-left">Progress</th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 dark:border-gray-700 text-center">Actions</th>
                </tr>
            </thead>
            <tbody>{students.map(student => <StudentTableRow key={student.cicNumber} student={student} onUpdate={onUpdate} monthNames={monthNames}/>)}</tbody>
        </table>
    </div>
);

const AppLoader = () => (
    <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-lg shadow-md flex justify-center items-center">
        <SpinnerIcon />
        <p className="text-gray-500 dark:text-gray-400 text-lg ml-2">Loading Students...</p>
    </div>
);


export default function FeesRegister() {
    const { fees, selectedBatch, isLoading, error, monthNames, batchNames, setSelectedBatch, fetchFees, updateFee } = useFeeStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);

    useEffect(() => {
        if (selectedBatch) {
            fetchFees(selectedBatch);
        }
    }, [selectedBatch, fetchFees]);

    useEffect(() => {
        const handleResize = () => setIsMobileView(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const filteredStudents = useMemo(() => {
        const currentBatchStudents = fees[selectedBatch] || [];
        if (!searchTerm) return currentBatchStudents;
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        return currentBatchStudents.filter(student =>
            student.name.toLowerCase().includes(lowerCaseSearchTerm) ||
            student.cicNumber.includes(searchTerm)
        )
    }, [fees, selectedBatch, searchTerm]);

    const handleBatchChange = (e) => {
        setSelectedBatch(e.target.value);
    };
    
    const renderContent = () => {
        const currentData = fees[selectedBatch];
        if (isLoading && !currentData) return <AppLoader />;
        if (error) return <div className="text-center py-16 bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-300 rounded-lg shadow-md"><p>{error}</p></div>;
        if (filteredStudents.length === 0 && !isLoading) return <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-lg shadow-md"><p className="text-gray-500 dark:text-gray-400 text-lg">No students found.</p></div>;

        return isMobileView ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {filteredStudents.map(student => <StudentCard key={student.cicNumber} student={student} onUpdate={updateFee} monthNames={monthNames}/>)}
            </div>
        ) : (
            <StudentTable students={filteredStudents} onUpdate={updateFee} monthNames={monthNames}/>
        );
    }

    return (
        <div className="bg-gray-100 dark:bg-gray-900 min-h-screen font-sans">
            <Header />
            <main className="p-4 sm:p-6 lg:p-8 mt-10">
            <div className="max-w-7xl mx-auto">
                <header className="mb-8 text-center">
                    <p className="text-gray-600 dark:text-gray-400 mt-2">Manage and track student fee payments.</p>
                </header>

                <div className="mb-8 max-w-2xl mx-auto flex flex-col sm:flex-row gap-4">
                    <div className="flex-shrink-0">
                        <select
                            value={selectedBatch}
                            onChange={handleBatchChange}
                            className="w-full sm:w-auto px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                        >
                            {batchNames.map(batchName => <option key={batchName} value={batchName}>{batchName}</option>)}
                        </select>
                    </div>
                    <input
                        type="text"
                        placeholder="Search by name or CIC number..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                    />
                </div>
                
                {renderContent()}
                
            </div>
            </main>
        </div>
    );
}