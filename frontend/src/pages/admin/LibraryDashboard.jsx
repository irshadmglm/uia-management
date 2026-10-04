import React, { useEffect, useState } from 'react';
import { BookOpen, Users, BookMarked, CheckCircle2, TrendingUp, Clock, AlertTriangle } from "lucide-react";
import { useBooksStore } from '../../store/useBooksStore';
import { useStudentStore } from '../../store/studentStore';

const LibraryDashboard = () => {
  const { totalLibraryBooks, totalAvailableBooks, totalBorrowedBooks, books, getBooks } = useBooksStore();
  const { students, getStudents } = useStudentStore();
  
  useEffect(() => {
    getBooks({ limit: 10 }); // Just to ensure store has latest stats
    getStudents();
  }, []);

  const stats = [
    { label: "Total Books", value: totalLibraryBooks || 0, icon: BookOpen, color: "from-blue-500 to-blue-600", light: "bg-blue-50 text-blue-600" },
    { label: "Available Now", value: totalAvailableBooks || 0, icon: CheckCircle2, color: "from-emerald-400 to-emerald-500", light: "bg-emerald-50 text-emerald-600" },
    { label: "Currently Borrowed", value: totalBorrowedBooks || 0, icon: BookMarked, color: "from-orange-400 to-orange-500", light: "bg-orange-50 text-orange-600" },
    { label: "Total Students", value: students?.length || 0, icon: Users, color: "from-purple-500 to-purple-600", light: "bg-purple-50 text-purple-600" }
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#0d2522] via-[#11322f] to-[#1a4a46] rounded-3xl p-6 sm:p-10 shadow-xl border border-white/5">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-brand-mint/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-sky-400/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10">
          <h1 className="text-2xl sm:text-4xl font-black text-white mb-2">Welcome to Library Overview</h1>
          <p className="text-sm sm:text-base text-brand-mint/80 max-w-lg leading-relaxed">
            Monitor your book inventory, track student borrowings, and get real-time insights into your library's daily operations.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white dark:bg-[#11322f] rounded-3xl p-5 border border-gray-100 dark:border-[#0d2522] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
              <div className="flex justify-between items-start mb-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${stat.light} dark:bg-opacity-20 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon size={24} />
                </div>
                <div className="p-1.5 bg-gray-50 dark:bg-[#0a1f1d] rounded-lg">
                  <TrendingUp size={14} className="text-gray-400" />
                </div>
              </div>
              <div>
                <p className="text-3xl font-black text-gray-900 dark:text-white mb-1">{stat.value}</p>
                <p className="text-sm font-bold text-gray-500 dark:text-gray-400">{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions & Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* System Status */}
        <div className="bg-white dark:bg-[#11322f] rounded-3xl border border-gray-100 dark:border-[#0d2522] p-6 shadow-sm lg:col-span-2">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <AlertTriangle className="text-brand-teal" size={20} />
            Library Highlights
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-gray-50 dark:bg-[#0a1f1d] p-4 rounded-2xl border border-gray-100 dark:border-[#0d2522]">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 size={16} />
                </div>
                <h3 className="font-bold text-sm text-gray-700 dark:text-gray-300">Healthy Inventory</h3>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                {(totalAvailableBooks / (totalLibraryBooks || 1) * 100).toFixed(1)}% of your total book catalog is currently available for students to borrow.
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-[#0a1f1d] p-4 rounded-2xl border border-gray-100 dark:border-[#0d2522]">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center">
                  <Clock size={16} />
                </div>
                <h3 className="font-bold text-sm text-gray-700 dark:text-gray-300">Active Circulations</h3>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                You currently have {totalBorrowedBooks} books in circulation among {students?.length} registered students.
              </p>
            </div>
          </div>
        </div>

        {/* Info Card */}
        <div className="bg-brand-teal/5 dark:bg-brand-mint/5 rounded-3xl border border-brand-teal/20 p-6 shadow-sm flex flex-col justify-center text-center">
          <div className="w-16 h-16 bg-white dark:bg-[#11322f] rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-brand-teal/10">
            <BookOpen size={28} className="text-brand-teal" />
          </div>
          <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-2">Manage Efficiently</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Use the sidebar to navigate through your Book Catalog, manage Student Borrowings, and view the All Borrowed Books list.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LibraryDashboard;
