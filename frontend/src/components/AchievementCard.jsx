"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, Calendar, FileText, Medal, Percent } from "lucide-react"

const AchievementCard = ({ achievement, onEdit }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const toggleExpand = () => setIsExpanded(!isExpanded)

  const getStatusBadge = () => {
    return achievement.approval ? (
      <div className="flex items-center gap-2 px-3 py-1 bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-200 rounded-full text-xs font-semibold">
        <div className="w-2 h-2 bg-green-500 rounded-full" />
        Approved
      </div>
    ) : (
      <div className="flex items-center gap-2 px-3 py-1 bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-200 rounded-full text-xs font-semibold">
        <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
        Pending
      </div>
    )
  }

  const getRankIcon = (rank) => {
    if (!rank) return "🏅"
    const r = rank.toLowerCase()
    if (r.includes("1st") || r.includes("first") || r.includes("winner")) return "🥇"
    if (r.includes("2nd") || r.includes("second")) return "🥈"
    if (r.includes("3rd") || r.includes("third")) return "🥉"
    return "🏅"
  }

  const getLevelColor = (level) => {
    const colors = {
      School: "bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200",
      District: "bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-200",
      State: "bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-200",
      National: "bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-200",
      International: "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-800 dark:text-indigo-200",
      University: "bg-cyan-100 dark:bg-cyan-900/40 text-cyan-800 dark:text-cyan-200",
      College: "bg-pink-100 dark:bg-pink-900/40 text-pink-800 dark:text-pink-200",
    }
    return colors[level] || "bg-gray-100 dark:bg-gray-900/40 text-gray-800 dark:text-gray-200"
  }

  return (
    <div className="group bg-white dark:bg-gray-800/60 rounded-3xl p-6 shadow-lg border border-white/30 dark:border-gray-700 transition-all duration-300 overflow-hidden">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="text-3xl">{getRankIcon(achievement.placeOrRank)}</div>
          {getStatusBadge()}
        </div>
        {achievement.approval === false &&
         <button
          onClick={onEdit}
          className="p-2 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 rounded-xl text-indigo-600 dark:text-indigo-300"
          title="Edit"
        >
          ✏️
        </button> }
       
      </div>

      <h3 className="text-xl font-bold text-gray-800 dark:text-white leading-tight mb-1">{achievement.achievedItem}</h3>
      {achievement.agencyLevel && (
        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-2 ${getLevelColor(achievement.agencyLevel)}`}>
          {achievement.agencyLevel} Level
        </span>
      )}

      <div className="text-end">
        <button
          onClick={toggleExpand}
          className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-1 ml-auto hover:underline"
        >
          {isExpanded ? <>Hide Details <ChevronUp size={16} /></> : <>View Details <ChevronDown size={16} /></>}
        </button>
      </div>

      {/* Expanded Section */}
      {isExpanded && (
        <div className="mt-4 space-y-3 text-sm text-gray-700 dark:text-gray-300 transition-all duration-300">
          {achievement.placeOrRank && (
            <div className="flex items-center gap-2">
              <Medal size={16} className="text-yellow-500 dark:text-yellow-300" />
              <span className="font-medium">Position:</span>
              <span>{achievement.placeOrRank}</span>
            </div>
          )}

          {achievement.gradeOrPercentage && (
            <div className="flex items-center gap-2">
              <Percent size={16} className="text-green-500 dark:text-green-300" />
              <span className="font-medium">Grade/Score:</span>
              <span>{achievement.gradeOrPercentage}</span>
            </div>
          )}

          {achievement.monthAndYear && (
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-blue-500 dark:text-blue-300" />
              <span className="font-medium">Date:</span>
              <span>{achievement.monthAndYear}</span>
            </div>
          )}

          {achievement.remarks && (
            <div className="flex items-start gap-2">
              <FileText size={16} className="mt-1 text-gray-500 dark:text-gray-400" />
              <div>
                <span className="font-medium block mb-1">Remarks:</span>
                <p className="text-sm">{achievement.remarks}</p>
              </div>
            </div>
          )}

          <div className="flex justify-between pt-3 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
            <span>Added: {new Date(achievement.createdAt).toLocaleDateString()}</span>
            {achievement.updatedAt !== achievement.createdAt && (
              <span>Updated: {new Date(achievement.updatedAt).toLocaleDateString()}</span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default AchievementCard
