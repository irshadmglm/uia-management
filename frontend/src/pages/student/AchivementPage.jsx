"use client"

import { useState, useEffect } from "react"
import { useAchievement } from "../../store/achivemnetStore"
import LoadingSpinner from "../../components/LoadingSpinner"
import StatsCards from "../../components/StatsCards"
import AchievementForm from "../../components/AchievementForm"
import EmptyState from "../../components/EmptyState"
import AchievementCard from "../../components/AchievementCard"
import Header from "../../components/Header"


const AchievementPage = () => {
  const { achievements, isLoading, getStdAchievements, addAchievement, updateAchievement } = useAchievement()
  const [showForm, setShowForm] = useState(false)
  const [editingAchievement, setEditingAchievement] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [sortBy, setSortBy] = useState("newest")

  useEffect(() => {
    getStdAchievements()
  }, [getStdAchievements])

  const handleAddAchievement = async (achievementData) => {
    try {
      await addAchievement(achievementData)
      setShowForm(false)
    } catch (error) {
      console.error("Error adding achievement:", error)
    }
  }

  const handleUpdateAchievement = async (achievementData) => {
    try {
      await updateAchievement(editingAchievement._id, achievementData)
      setEditingAchievement(null)
    } catch (error) {
      console.error("Error updating achievement:", error)
    }
  }

  const handleEditClick = (achievement) => {
    setEditingAchievement(achievement)
    setShowForm(true)
  }

  const handleCancelEdit = () => {
    setEditingAchievement(null)
    setShowForm(false)
  }

  const filteredAndSortedAchievements =
    achievements
      ?.filter((achievement) => {
        const matchesSearch =
          achievement.achievedItem?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          achievement.agencyLevel?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          achievement.placeOrRank?.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesStatus =
          filterStatus === "all" ||
          (filterStatus === "approved" && achievement.approval) ||
          (filterStatus === "pending" && !achievement.approval)

        return matchesSearch && matchesStatus
      })
      ?.sort((a, b) => {
        switch (sortBy) {
          case "newest":
            return new Date(b.createdAt) - new Date(a.createdAt)
          case "oldest":
            return new Date(a.createdAt) - new Date(b.createdAt)
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-sky-100 dark:from-gray-900 dark:to-gray-800">
        <Header />
      <div className="max-w-7xl mx-auto p-4 md:p-8 mt-16">
        {/* Header Section */}
        <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-6 mb-6">
  <div className="w-full sm:w-auto">
    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-sky-700 via-sky-600 to-sky-500 bg-clip-text text-transparent mb-1 sm:mb-2">
      My Achievements
    </h1>
    <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
      Track your academic and extracurricular accomplishments
    </p>
  </div>

  <button
    onClick={() => setShowForm(true)}
    className="w-full sm:w-auto group relative overflow-hidden bg-gradient-to-r from-sky-700 to-sky-600 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
  >
    <div className="absolute inset-0 bg-gradient-to-r from-sky-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    <div className="relative flex items-center justify-center gap-2">
      <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
        <span className="text-lg font-bold">+</span>
      </div>
      <span className="text-sm sm:text-base">Add Achievement</span>
    </div>
  </button>
</div>


          {/* Stats Cards */}
          <StatsCards achievements={achievements || []} />
        </div>

        {/* Controls Section */}
        {/* <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 mb-8 shadow-lg border border-white/20">
          <div className="flex flex-col lg:flex-row gap-4"> */}
            {/* Search */}
            {/* <div className="flex-1">
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
                  placeholder="Search achievements, agency, or rank..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-base focus:outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-100 transition-all duration-200"
                />
              </div>
            </div> */}

            {/* Filters */}
            {/* <div className="flex gap-4">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-base focus:outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-100 transition-all duration-200 min-w-32"
              >
                <option value="all">All Status</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-base focus:outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-100 transition-all duration-200 min-w-32"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="achievement">By Achievement</option>
              </select>
            </div>
          </div>
        </div> */}

        {/* Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              <AchievementForm
                onSubmit={editingAchievement ? handleUpdateAchievement : handleAddAchievement}
                onCancel={handleCancelEdit}
                initialData={editingAchievement}
                isEditing={!!editingAchievement}
              />
            </div>
          </div>
        )}

        {/* Achievements Grid */}
        <div className="min-h-96">
          {filteredAndSortedAchievements.length === 0 ? (
            <EmptyState
              onAddClick={() => setShowForm(true)}
              hasAchievements={achievements?.length > 0}
              searchTerm={searchTerm}
            />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredAndSortedAchievements.map((achievement) => (
                <AchievementCard
                  key={achievement._id}
                  achievement={achievement}
                  onEdit={() => handleEditClick(achievement)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AchievementPage
