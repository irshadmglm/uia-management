"use client"

import { useState, useEffect } from "react"
import { useReadingProgress } from "../../store/readingProgressStore"
import LoadingSpinner from "../../components/LoadingSpinner"
import ReadingStatsCards from "../../components/ReadingStatsCards"
import ReadingProgressForm from "../../components/ReadingProgressForm"
import ReadingEmptyState from "../../components/ReadingEmptyState"
import ReadingProgressCard from "../../components/ReadingProgressCard"
import Header from "../../components/Header"


const ReadingProgressPage = () => {
  const { readingProgress, isLoading, getStdReadingProgress, addReadingProgress, updateReadingProgress } =
    useReadingProgress()
  const [showForm, setShowForm] = useState(false)
  const [editingProgress, setEditingProgress] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [sortBy, setSortBy] = useState("newest")

  useEffect(() => {
    getStdReadingProgress()
  }, [getStdReadingProgress])

  const handleAddProgress = async (progressData) => {
    try {
      await addReadingProgress(progressData)
      setShowForm(false)
    } catch (error) {
      console.error("Error adding reading progress:", error)
    }
  }

  const handleUpdateProgress = async (progressData) => {
    try {
      await updateReadingProgress(editingProgress._id, progressData)
      setEditingProgress(null)
    } catch (error) {
      console.error("Error updating reading progress:", error)
    }
  }

  const handleEditClick = (progress) => {
    setEditingProgress(progress)
    setShowForm(true)
  }

  const handleCancelEdit = () => {
    setEditingProgress(null)
    setShowForm(false)
  }

  const filteredAndSortedProgress =
    readingProgress
      ?.filter((progress) => {
        const matchesSearch =
          progress.bookName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          progress.authorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          progress.publisher?.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesStatus =
          filterStatus === "all" ||
          (filterStatus === "approved" && progress.approval) ||
          (filterStatus === "pending" && !progress.approval)

        return matchesSearch && matchesStatus
      })
      ?.sort((a, b) => {
        switch (sortBy) {
          case "newest":
            return new Date(b.createdAt) - new Date(a.createdAt)
          case "oldest":
            return new Date(a.createdAt) - new Date(b.createdAt)
          case "bookName":
            return a.bookName.localeCompare(b.bookName)
          case "pages":
            return (b.numberOfPages || 0) - (a.numberOfPages || 0)
          default:
            return 0
        }
      }) || []

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-300 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:bg-gradient-to-br  dark:from-gray-900 dark:to-gray-800 `}
    >
        <Header />
      <div className="max-w-7xl mx-auto p-4 md:p-8 mt-16">
        {/* Header Section */}
        <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-4 sm:gap-6 mb-6">
        <div className="w-full sm:w-auto">
            <h1 className="text-2xl sm:text-2xl md:text-4xl lg:text-4xl font-bold mb-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
            Reading Progress
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-300">
            Track your reading journey and literary achievements
            </p>
        </div>

        <div className="w-full sm:w-auto flex justify-end sm:justify-center items-center gap-3 flex-wrap">
            <button
            onClick={() => setShowForm(true)}
            className="group relative w-full sm:w-auto px-5 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-blue-600 dark:to-purple-700 text-white hover:from-purple-600 hover:to-pink-600 dark:hover:from-purple-600 dark:hover:to-pink-700"
            >
            <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                <span className="text-base font-bold">+</span>
                </div>
                <span className="text-sm sm:text-base">Add Book</span>
            </div>
            </button>
        </div>
        </div>


          {/* Stats Cards */}
          <ReadingStatsCards readingProgress={readingProgress || []} />
        </div>

        {/* Controls Section */}
        {/* <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 mb-8 shadow-lg border border-white/20 dark:border-gray-700/50 transition-colors duration-300">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400 dark:text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search books, authors, or publishers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-base text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-indigo-500 dark:focus:border-blue-500 focus:ring-4 focus:ring-indigo-100 dark:focus:ring-blue-500/20 transition-all duration-200"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-3 bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-base text-gray-900 dark:text-white focus:outline-none focus:border-indigo-500 dark:focus:border-blue-500 focus:ring-4 focus:ring-indigo-100 dark:focus:ring-blue-500/20 transition-all duration-200 min-w-32"
              >
                <option value="all">All Status</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-base text-gray-900 dark:text-white focus:outline-none focus:border-indigo-500 dark:focus:border-blue-500 focus:ring-4 focus:ring-indigo-100 dark:focus:ring-blue-500/20 transition-all duration-200 min-w-32"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="bookName">By Book Name</option>
                <option value="pages">By Pages</option>
              </select>
            </div>
          </div>
        </div> */}

        {/* Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              <ReadingProgressForm
                onSubmit={editingProgress ? handleUpdateProgress : handleAddProgress}
                onCancel={handleCancelEdit}
                initialData={editingProgress}
                isEditing={!!editingProgress}
              />
            </div>
          </div>
        )}

        {/* Reading Progress Grid */}
        <div className="min-h-96">
          {filteredAndSortedProgress.length === 0 ? (
            <ReadingEmptyState
              onAddClick={() => setShowForm(true)}
              hasProgress={readingProgress?.length > 0}
              searchTerm={searchTerm}
            />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredAndSortedProgress.map((progress) => (
                <ReadingProgressCard key={progress._id} progress={progress} onEdit={() => handleEditClick(progress)} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ReadingProgressPage
