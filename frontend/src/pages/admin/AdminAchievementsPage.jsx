"use client"

import { useState, useEffect } from "react"
import { useAchievement } from "../../store/achivemnetStore"
import AdminStatsCards from "../../components/AdminStatsCards"
import AdminEmptyState from "../../components/AdminEmptyState"
import AchievementDetailsModal from "../../components/AchievementDetailsModal"
import LoadingSpinner from "../../components/LoadingSpinner"
import Header from "../../components/Header"
import { useParams } from "react-router-dom"



const AdminAchievementsPage = () => {
    const {studentId} = useParams()
  const { achievements, isLoading, getAllAchievements, updateAchievement, deleteAchievement } = useAchievement()
  const [selectedAchievement, setSelectedAchievement] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterLevel, setFilterLevel] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const [selectedItems, setSelectedItems] = useState([])

  useEffect(() => {
    getAllAchievements()
  }, [getAllAchievements])

  const handleApprove = async (achievementId) => {
    try {
    //   await updateAchievement(achievementId, { approval: true })
    } catch (error) {
      console.error("Error approving achievement:", error)
    }
  }

  const handleReject = async (achievementId) => {
    try {
      await updateAchievement(achievementId, { approval: false })
    } catch (error) {
      console.error("Error rejecting achievement:", error)
    }
  }

  const handleDelete = async (achievementId) => {
    if (window.confirm("Are you sure you want to delete this achievement?")) {
      try {
        await deleteAchievement(achievementId)
      } catch (error) {
        console.error("Error deleting achievement:", error)
      }
    }
  }

  const handleBulkApprove = async () => {
    if (selectedItems.length === 0) return
    try {
      await Promise.all(selectedItems.map((id) => updateAchievement(id, { approval: true })))
      setSelectedItems([])
    } catch (error) {
      console.error("Error bulk approving achievements:", error)
    }
  }

  const handleBulkReject = async () => {
    if (selectedItems.length === 0) return
    try {
      await Promise.all(selectedItems.map((id) => updateAchievement(id, { approval: false })))
      setSelectedItems([])
    } catch (error) {
      console.error("Error bulk rejecting achievements:", error)
    }
  }

  const toggleSelectItem = (id) => {
    setSelectedItems((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  const toggleSelectAll = () => {
    if (selectedItems.length === filteredAndSortedAchievements.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(filteredAndSortedAchievements.map((achievement) => achievement._id))
    }
  }

  const filteredAndSortedAchievements =
    achievements
      ?.filter((achievement) => {
        const matchesSearch =
          achievement.achievedItem?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          achievement.agencyLevel?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          achievement.studentId?.name?.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesStatus =
          filterStatus === "all" ||
          (filterStatus === "approved" && achievement.approval) ||
          (filterStatus === "pending" && !achievement.approval)

        const matchesLevel = filterLevel === "all" || achievement.agencyLevel === filterLevel

        return matchesSearch && matchesStatus && matchesLevel
      })
      ?.sort((a, b) => {
        switch (sortBy) {
          case "newest":
            return new Date(b.createdAt) - new Date(a.createdAt)
          case "oldest":
            return new Date(a.createdAt) - new Date(b.createdAt)
          case "student":
            return (a.studentId?.name || "").localeCompare(b.studentId?.name || "")
          case "achievement":
            return a.achievedItem.localeCompare(b.achievedItem)
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
                Manage Achievements
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300">Review and approve student achievements</p>
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
          <AdminStatsCards achievements={achievements || []} />
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
                  placeholder="Search achievements, students, or levels..."
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
                value={filterLevel}
                onChange={(e) => setFilterLevel(e.target.value)}
                className="px-4 py-3 bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-base text-gray-900 dark:text-white focus:outline-none focus:border-indigo-500 dark:focus:border-blue-500 focus:ring-4 focus:ring-indigo-100 dark:focus:ring-blue-500/20 transition-all duration-200 min-w-32"
              >
                <option value="all">All Levels</option>
                <option value="School">School</option>
                <option value="District">District</option>
                <option value="State">State</option>
                <option value="National">National</option>
                <option value="International">International</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-base text-gray-900 dark:text-white focus:outline-none focus:border-indigo-500 dark:focus:border-blue-500 focus:ring-4 focus:ring-indigo-100 dark:focus:ring-blue-500/20 transition-all duration-200 min-w-32"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="student">By Student</option>
                <option value="achievement">By Achievement</option>
              </select>
            </div>
          </div>

          {/* Select All Checkbox */}
          {filteredAndSortedAchievements.length > 0 && (
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="selectAll"
                checked={selectedItems.length === filteredAndSortedAchievements.length}
                onChange={toggleSelectAll}
                className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 dark:focus:ring-indigo-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <label htmlFor="selectAll" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Select All ({filteredAndSortedAchievements.length} items)
              </label>
            </div>
          )}
        </div>

        {/* Achievements Table */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 dark:border-gray-700/50 overflow-hidden">
          {filteredAndSortedAchievements.length === 0 ? (
            <AdminEmptyState searchTerm={searchTerm} hasAchievements={achievements?.length > 0} />
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
                      Achievement
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Level
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Rank
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
                  {filteredAndSortedAchievements.map((achievement) => (
                    <tr
                      key={achievement._id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors duration-200"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(achievement._id)}
                          onChange={() => toggleSelectItem(achievement._id)}
                          className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 dark:focus:ring-indigo-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                            {achievement.studentId?.name?.charAt(0) || "S"}
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {achievement.studentId?.name || "Unknown Student"}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {achievement.studentId?.email || "No email"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white max-w-xs truncate">
                          {achievement.achievedItem}
                        </div>
                        {achievement.gradeOrPercentage && (
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            Grade: {achievement.gradeOrPercentage}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {achievement.agencyLevel && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
                            {achievement.agencyLevel}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {achievement.placeOrRank || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {achievement.approval ? (
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
                        {achievement.monthAndYear || new Date(achievement.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedAchievement(achievement)}
                            className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 transition-colors duration-200"
                          >
                            View
                          </button>
                          {!achievement.approval && (
                            <button
                              onClick={() => handleApprove(achievement._id)}
                              className="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300 transition-colors duration-200"
                            >
                              Approve
                            </button>
                          )}
                          {achievement.approval && (
                            <button
                              onClick={() => handleReject(achievement._id)}
                              className="text-yellow-600 dark:text-yellow-400 hover:text-yellow-900 dark:hover:text-yellow-300 transition-colors duration-200"
                            >
                              Revoke
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(achievement._id)}
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

        {/* Achievement Details Modal */}
        {selectedAchievement && (
          <AchievementDetailsModal
            achievement={selectedAchievement}
            onClose={() => setSelectedAchievement(null)}
            onApprove={handleApprove}
            onReject={handleReject}
            onDelete={handleDelete}
          />
        )}
      </div>
    </div>
  )
}

export default AdminAchievementsPage
