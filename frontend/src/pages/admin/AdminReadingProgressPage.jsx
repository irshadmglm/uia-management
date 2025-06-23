"use client"

import { useState, useEffect } from "react"
import { useReadingProgress } from "../../store/readingProgressStore"
import LoadingSpinner from "../../components/LoadingSpinner"
import AdminReadingStatsCards from "../../components/AdminReadingStatsCards"
import AdminEmptyState from "../../components/AdminEmptyState"
import ReadingProgressDetailsModal from "../../components/ReadingProgressDetailsModal"
import Header from "../../components/Header"
import { useParams } from "react-router-dom"



const AdminReadingProgressPage = () => {
    const {studentId} = useParams()
  const { readingProgress, isLoading, getStdReadingProgress, updateReadingProgress, deleteReadingProgress } =
    useReadingProgress()
  const [selectedProgress, setSelectedProgress] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const [selectedItems, setSelectedItems] = useState([])

  useEffect(() => {
    getStdReadingProgress(studentId)
  }, [getStdReadingProgress])

  const handleApprove = async (progressId) => {
    try {
    //   await updateReadingProgress(progressId, { approval: true })
    } catch (error) {
      console.error("Error approving reading progress:", error)
    }
  }

  const handleReject = async (progressId) => {
    try {
      await updateReadingProgress(progressId, { approval: false })
    } catch (error) {
      console.error("Error rejecting reading progress:", error)
    }
  }

  const handleDelete = async (progressId) => {
    if (window.confirm("Are you sure you want to delete this reading progress?")) {
      try {
        await deleteReadingProgress(progressId)
      } catch (error) {
        console.error("Error deleting reading progress:", error)
      }
    }
  }

  const handleBulkApprove = async () => {
    if (selectedItems.length === 0) return
    try {
      await Promise.all(selectedItems.map((id) => updateReadingProgress(id, { approval: true })))
      setSelectedItems([])
    } catch (error) {
      console.error("Error bulk approving reading progress:", error)
    }
  }

  const handleBulkReject = async () => {
    if (selectedItems.length === 0) return
    try {
      await Promise.all(selectedItems.map((id) => updateReadingProgress(id, { approval: false })))
      setSelectedItems([])
    } catch (error) {
      console.error("Error bulk rejecting reading progress:", error)
    }
  }

  const toggleSelectItem = (id) => {
    setSelectedItems((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  const toggleSelectAll = () => {
    if (selectedItems.length === filteredAndSortedProgress.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(filteredAndSortedProgress.map((progress) => progress._id))
    }
  }

  const filteredAndSortedProgress =
    readingProgress
      ?.filter((progress) => {
        const matchesSearch =
          progress.bookName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          progress.authorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          progress.publisher?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          progress.studentId?.name?.toLowerCase().includes(searchTerm.toLowerCase())

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
          case "student":
            return (a.studentId?.name || "").localeCompare(b.studentId?.name || "")
          case "book":
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
      className={`min-h-screen transition-colors duration-300 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 `}
    >
        <Header />
      <div className="max-w-7xl mx-auto p-4 md:p-8 mt-10">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                Manage Reading Progress
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300">Review and approve student reading progress</p>
            </div>
            <div className="flex items-center gap-4">
              {selectedItems.length > 0 && (
                <div className="flex gap-2">
                  <button
                    onClick={handleBulkApprove}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors duration-200"
                  >
                    Approve ({selectedItems.length})
                  </button>
                  <button
                    onClick={handleBulkReject}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors duration-200"
                  >
                    Reject ({selectedItems.length})
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Stats Cards */}
          <AdminReadingStatsCards readingProgress={readingProgress || []} />
        </div>

        {/* Controls Section */}
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 mb-8 shadow-lg border border-white/20 dark:border-gray-700/50">
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  placeholder="Search books, authors, students, or publishers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-base text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-indigo-500 dark:focus:border-blue-500 focus:ring-4 focus:ring-indigo-100 dark:focus:ring-blue-500/20 transition-all duration-200"
                />
              </div>
            </div>

            {/* Filters */}
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
                <option value="student">By Student</option>
                <option value="book">By Book Name</option>
                <option value="pages">By Pages</option>
              </select>
            </div>
          </div>

          {/* Select All Checkbox */}
          {filteredAndSortedProgress.length > 0 && (
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="selectAll"
                checked={selectedItems.length === filteredAndSortedProgress.length}
                onChange={toggleSelectAll}
                className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 dark:focus:ring-indigo-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <label htmlFor="selectAll" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Select All ({filteredAndSortedProgress.length} items)
              </label>
            </div>
          )}
        </div>

        {/* Reading Progress Table */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 dark:border-gray-700/50 overflow-hidden">
          {filteredAndSortedProgress.length === 0 ? (
            <AdminEmptyState searchTerm={searchTerm} hasProgress={readingProgress?.length > 0} />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Select
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Book Details
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Author
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Pages
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredAndSortedProgress.map((progress) => (
                    <tr
                      key={progress._id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors duration-200"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(progress._id)}
                          onChange={() => toggleSelectItem(progress._id)}
                          className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 dark:focus:ring-indigo-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                            {progress.studentId?.name?.charAt(0) || "S"}
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {progress.studentId?.name || "Unknown Student"}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {progress.studentId?.email || "No email"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white max-w-xs">
                          {progress.bookName}
                        </div>
                        {progress.publisher && (
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            Publisher: {progress.publisher}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {progress.authorName || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {progress.numberOfPages ? progress.numberOfPages.toLocaleString() : "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {progress.approval ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300">
                            ✓ Approved
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300">
                            ⏳ Pending
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {progress.monthAndYear || new Date(progress.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedProgress(progress)}
                            className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 transition-colors duration-200"
                          >
                            View
                          </button>
                          {!progress.approval && (
                            <button
                              onClick={() => handleApprove(progress._id)}
                              className="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300 transition-colors duration-200"
                            >
                              Approve
                            </button>
                          )}
                          {progress.approval && (
                            <button
                              onClick={() => handleReject(progress._id)}
                              className="text-yellow-600 dark:text-yellow-400 hover:text-yellow-900 dark:hover:text-yellow-300 transition-colors duration-200"
                            >
                              Revoke
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(progress._id)}
                            className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 transition-colors duration-200"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Reading Progress Details Modal */}
        {selectedProgress && (
          <ReadingProgressDetailsModal
            progress={selectedProgress}
            onClose={() => setSelectedProgress(null)}
            onApprove={handleApprove}
            onReject={handleReject}
            onDelete={handleDelete}
          />
        )}
      </div>
    </div>
  )
}

export default AdminReadingProgressPage
