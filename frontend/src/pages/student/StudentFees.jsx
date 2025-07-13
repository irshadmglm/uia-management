import React, { useState, useEffect } from 'react';
import { useFeeStore } from '../../store/feesSrore';
import Header from '../../components/Header';
import { CheckCircle, XCircle } from 'lucide-react';

const months = [ "شوّال", "ذو القعدة", "ذو الحجة", "محرّم", "صفر", "ربيع الأوّل",
   "ربيع الآخر", "جمادى الأولى", "جمادى الأخرى", "رجب", "شعبان", "رمضان"];

const Spinner = () => (
  <div className="flex justify-center items-center py-10">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 dark:border-gray-100" />
  </div>
);

const FeesSummary = ({ fees }) => {
  if (!fees.length) return null; // 🛡️ Protect from empty array

  const paidCount = fees.filter(p => p.paid).length;
  const unpaidCount = fees.length - paidCount;

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md w-full flex flex-col md:flex-row justify-around items-center gap-6 transition-all duration-300">
      {paidCount > 0 && (
        <div className="flex items-center space-x-4">
          <div className="bg-sky-100 dark:bg-sky-800 p-4 rounded-full">
            <CheckCircle className="text-sky-600 dark:text-sky-300 w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-bold text-sky-700 dark:text-sky-300">{paidCount}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Months Paid</p>
          </div>
        </div>
      )}
      {unpaidCount > 0 && (
        <div className="flex items-center space-x-4">
          <div className="bg-slate-100 dark:bg-slate-700 p-4 rounded-full">
            <XCircle className="text-slate-600 dark:text-slate-300 w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-700 dark:text-slate-300">{unpaidCount}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Months Unpaid</p>
          </div>
        </div>
      )}
    </div>
  );
};

const ProgressBar = ({ progress }) => {
  const percentage = Math.round(progress * 100);
  return (
    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
      <div
        className="h-4 bg-sky-400 dark:bg-sky-500 rounded-full transition-all duration-500"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};

const FeesStatusList = ({ fees }) => {
  if (!fees.length) return (
    <div className="text-center text-gray-500 dark:text-gray-400 mt-8">
      No fee data available.
    </div>
  ); // 🛡️ Show message if fees is empty

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-8">
      {fees.map((p) => (
        <div
          key={p.month}
          className={`flex items-center justify-between p-3 rounded-xl shadow-sm transition-all duration-300
            ${p.paid
              ? 'bg-sky-100 dark:bg-sky-900 border border-sky-300 dark:border-sky-700 hover:bg-sky-100 dark:hover:bg-sky-800'
              : 'bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
        >
          <span className="text-gray-900 dark:text-gray-100 font-semibold">{p.month}</span>
          {p.paid ? (
            <CheckCircle className="text-sky-600 dark:text-sky-300 text-xl" />
          ) : (
            <XCircle className="text-slate-600 dark:text-slate-300 text-xl" />
          )}
        </div>
      ))}
    </div>
  );
};

const StudentFeesPage = () => {
  const { fees: rawFees, getStudentFeeStatus } = useFeeStore();
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getStudentFeeStatus();
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [getStudentFeeStatus]);

  useEffect(() => {
    if (rawFees && rawFees.length) {
      const feesMap = new Map();
      rawFees.forEach(fee => {
        feesMap.set(fee.month, fee);
      });

      const completeFees = months.map(month => ({
        month,
        paid: feesMap.get(month)?.paid || false,
      }));

      setFees(completeFees);
    } else {
      // 🛡️ Handle empty fees
      setFees(months.map(month => ({ month, paid: false })));
    }
  }, [rawFees]);

  if (loading) {
    return <Spinner />;
  }

  const paidCount = fees.filter(p => p.paid).length;
  const progress = paidCount / 12;
  const percentage = Math.round(progress * 100);

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-all duration-300">
      <Header page="Fee Status" />
      <div className="container mx-auto px-4 mt-20 mb-12 max-w-4xl">
        <FeesSummary fees={fees} />

        <div className="mt-10">
          <div className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            Overall Progress
          </div>
          <div className="flex items-center">
            <ProgressBar progress={progress} />
            <span className="ml-4 text-base font-semibold text-gray-700 dark:text-gray-300">
              {percentage}%
            </span>
          </div>
        </div>

        <FeesStatusList fees={fees} />
      </div>
    </div>
  );
};

export default StudentFeesPage;
