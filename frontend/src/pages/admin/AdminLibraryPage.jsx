import React, { useState } from 'react';
import { BookOpen, Users2, Library, BarChart3 } from "lucide-react";
import LibraryBooksTab from './LibraryBooksTab';
import LibraryUsersTab from './LibraryUsersTab';
import { useBooksStore } from '../../store/useBooksStore';

const AdminLibraryPage = () => {
  const [activeTab, setActiveTab] = useState('books');
  const { books } = useBooksStore();

  const totalBooks = books.length;
  const availableBooks = books.filter(b => b.status === 'available').length;
  const borrowedBooks = books.filter(b => b.status !== 'available').length;

  const tabs = [
    { id: 'books', label: 'Book Catalog', icon: BookOpen },
    { id: 'users', label: 'Users & History', icon: Users2 },
  ];

  return (
    <div className="space-y-6">

      {/* Page Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#0d2522] via-[#11322f] to-[#1a4a46] rounded-2xl p-5 sm:p-8 shadow-xl">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand-mint/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-1/3 w-32 h-32 bg-sky-400/10 rounded-full blur-2xl"></div>

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-brand-mint/20 border border-brand-mint/30 rounded-2xl">
              <Library size={28} className="text-brand-mint" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white">Library Management</h1>
              <p className="text-xs sm:text-sm text-white/60 mt-0.5">Manage books, track borrowings & view student histories</p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex items-center gap-3 sm:gap-5">
            <div className="text-center">
              <p className="text-2xl font-black text-white">{totalBooks}</p>
              <p className="text-[10px] text-white/50 uppercase tracking-wider">Total</p>
            </div>
            <div className="w-px h-10 bg-white/10"></div>
            <div className="text-center">
              <p className="text-2xl font-black text-brand-mint">{availableBooks}</p>
              <p className="text-[10px] text-white/50 uppercase tracking-wider">Available</p>
            </div>
            <div className="w-px h-10 bg-white/10"></div>
            <div className="text-center">
              <p className="text-2xl font-black text-orange-400">{borrowedBooks}</p>
              <p className="text-[10px] text-white/50 uppercase tracking-wider">Borrowed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-white dark:bg-[#11322f] p-1.5 rounded-2xl shadow-sm border border-gray-100 dark:border-[#0d2522]">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-semibold text-sm transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-[#0d2522] text-brand-mint shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-[#0d2522]/50'
              }`}
            >
              <Icon size={17} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'books' && <LibraryBooksTab />}
        {activeTab === 'users' && <LibraryUsersTab />}
      </div>
    </div>
  );
};

export default AdminLibraryPage;
