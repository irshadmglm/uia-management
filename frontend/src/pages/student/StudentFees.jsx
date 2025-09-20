import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView, animate } from 'framer-motion';

// --- YOUR ZUSTAND STORE IMPORTS ---
import { useFeeStore } from '../../store/feesSrore';
import { useAuthStore } from '../../store/useAuthStore';
import Header from '../../components/Header';
// import Header from '../../components/Header'; // You can re-add your header if needed

// --- HELPER FUNCTION ---
const formatCurrency = (value) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return '₹0';
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(numValue);
};

// --- SVG ICONS ---
const CheckCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const HourglassIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const ChevronDownIcon = ({ isOpen }) => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>;
const SpinnerIcon = () => <svg className="animate-spin h-8 w-8 text-sky-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>;

// --- ANIMATED & REUSABLE COMPONENTS ---

function AnimatedNumber({ value }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    useEffect(() => {
        if (isInView && ref.current) {
            // Corrected function call - removed "motion."
            const controls = animate(0, value, {
                duration: 1.5,
                ease: "easeOut",
                onUpdate(latest) {
                    if (ref.current) {
                       ref.current.textContent = formatCurrency(latest);
                    }
                }
            });
            return () => controls.stop();
        }
    }, [isInView, value]);

    return <span ref={ref}>{formatCurrency(0)}</span>;
}

const StatCard = ({ title, value, colorClass }) => (
    <div className="bg-white dark:bg-gray-800/50 p-4 rounded-xl shadow-sm">
        <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
        <p className={`text-2xl font-bold ${colorClass}`}>
            <AnimatedNumber value={value} />
        </p>
    </div>
);

const FeeStatusRing = ({ total, paid, balance }) => {
    const progress = total > 0 ? (paid / total) * 100 : 0;
    const circumference = 2 * Math.PI * 45;

    return (
        <div className="relative flex items-center justify-center w-40 h-40 sm:w-48 sm:h-48">
            <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle className="text-gray-200 dark:text-gray-700" strokeWidth="10" stroke="currentColor" fill="transparent" r="45" cx="50" cy="50" />
                <motion.circle
                    className="text-sky-500 drop-shadow-[0_4px_4px_rgba(99,102,241,0.5)]"
                    strokeWidth="10"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="45"
                    cx="50"
                    cy="50"
                    transform="rotate(-90 50 50)"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: circumference - (progress / 100) * circumference }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                />
            </svg>
            <div className="absolute text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400">Balance Due</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-500 dark:text-gray-400 drop-shadow-[0_2px_2px_rgba(239,68,68,0.3)]">
                    {formatCurrency(balance)}
                </p>
            </div>
        </div>
    );
};

const PaymentHistory = ({ payments }) => {
    const [isOpen, setIsOpen] = useState(false);

    const listContainerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
    };

    const listItemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center p-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded-2xl"
            >
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Payment History</h3>
                <ChevronDownIcon isOpen={isOpen} />
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                        className="overflow-hidden"
                    >
                        <motion.ul
                            variants={listContainerVariants}
                            initial="hidden"
                            animate="visible"
                            className="space-y-3 px-4 pb-4 pt-2"
                        >
                            {Object.entries(payments).map(([month, amount]) => (
                                <motion.li
                                    key={month}
                                    variants={listItemVariants}
                                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                                >
                                    <div className="flex items-center">
                                        {amount ? <CheckCircleIcon /> : <HourglassIcon />}
                                        <span className="ml-3 font-medium text-gray-700 dark:text-gray-300 capitalize">{month.replace(/_/g, ' ').toLowerCase()}</span>
                                    </div>
                                    <span className={`font-semibold ${amount ? 'text-gray-800 dark:text-gray-200' : 'text-gray-400 dark:text-gray-500'}`}>
                                        {amount ? formatCurrency(amount) : 'Pending'}
                                    </span>
                                </motion.li>
                            ))}
                        </motion.ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};


// --- MAIN STUDENT PORTAL COMPONENT ---

export default function StudentFeePortal() {
    const { authUser } = useAuthStore();
    const { fetchFeesByStd } = useFeeStore();

    const [studentData, setStudentData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!authUser?.batchName || !authUser?.cicNumber) {
                setError("Authentication details not found.");
                setIsLoading(false);
                return;
            }
            try {
                const data = await fetchFeesByStd(authUser.batchName, authUser.cicNumber);
                setStudentData(data);
            } catch (err) {
                setError(err.message || "Could not load fee details.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [authUser, fetchFeesByStd]);

    const mainContainerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, staggerChildren: 0.15 } }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
                <SpinnerIcon />
                <p className="mt-4 text-gray-600 dark:text-gray-400">Loading your fee details...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
                <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold text-gray-600 dark:text-gray-400">Oops! Something went wrong.</h2>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">{error}</p>
                </div>
            </div>
        );
    }

    if (!studentData) {
        return (
             <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
                <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300">No Data Available</h2>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">Could not find any fee information for your account.</p>
                </div>
            </div>
        );
    }

    const { name, subscription, payments } = studentData;
    const total = parseFloat(subscription.perYear) || 0;
    const balance = parseFloat(subscription.balance) || 0;
    const paid = total - balance;

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen font-sans text-gray-800 dark:text-gray-200">
            <Header />
            <div className="container mx-auto max-w-2xl p-4 md:p-6 mt-10">
                <motion.header
                    className="my-6 text-center"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Fee Summary</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">Welcome, {name}!</p>
                </motion.header>

                <motion.main
                    variants={mainContainerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-6"
                >
                    <motion.div variants={mainContainerVariants} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                        <div className="flex flex-col md:flex-row items-center justify-around gap-6">
                            <FeeStatusRing total={total} paid={paid} balance={balance} />
                            <div className="w-full md:w-auto flex-grow grid grid-cols-2 sm:grid-cols-2 gap-4">
                                <StatCard title="Total Fee" value={total} colorClass="text-sky-600 dark:text-sky-400" />
                                <StatCard title="Total Paid" value={paid} colorClass="text-green-600 dark:text-green-400" />
                            </div>
                        </div>
                    </motion.div>

                    <motion.div variants={mainContainerVariants}>
                        <PaymentHistory payments={payments} />
                    </motion.div>
                </motion.main>
            </div>
        </div>
    );
}