"use client"

const AchievementDetailsModal = ({ achievement, onClose, onApprove, onReject, onDelete }) => {
  const getRankIcon = (rank) => {
    if (!rank) return "🏅"
    const lowerRank = rank.toLowerCase()
    if (lowerRank.includes("1st") || lowerRank.includes("first") || lowerRank.includes("winner")) return "🥇"
    if (lowerRank.includes("2nd") || lowerRank.includes("second")) return "🥈"
    if (lowerRank.includes("3rd") || lowerRank.includes("third")) return "🥉"
    return "🏅"
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="p-8">
          {/* Header */}
          <div className="flex justify-between items-start mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-4">
              <div className="text-4xl">{getRankIcon(achievement.placeOrRank)}</div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Achievement Details</h2>
                <p className="text-gray-600 dark:text-gray-300">Review and manage this achievement</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center text-2xl text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-all duration-200"
            >
              ×
            </button>
          </div>

     

          {/* Achievement Details */}
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Achievement Item
              </label>
              <div className="text-lg font-semibold text-gray-900 dark:text-white">{achievement.achievedItem}</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {achievement.agencyLevel && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Agency Level
                  </label>
                  <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 rounded-full text-sm font-medium">
                    {achievement.agencyLevel}
                  </span>
                </div>
              )}

              {achievement.placeOrRank && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Place/Rank</label>
                  <div className="text-gray-900 dark:text-white font-medium">{achievement.placeOrRank}</div>
                </div>
              )}

              {achievement.gradeOrPercentage && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Grade/Percentage
                  </label>
                  <div className="text-gray-900 dark:text-white font-medium">{achievement.gradeOrPercentage}</div>
                </div>
              )}

              {achievement.monthAndYear && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Month & Year
                  </label>
                  <div className="text-gray-900 dark:text-white font-medium">{achievement.monthAndYear}</div>
                </div>
              )}
            </div>

            {achievement.remarks && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Remarks</label>
                <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-gray-900 dark:text-white">
                  {achievement.remarks}
                </div>
              </div>
            )}

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
              {achievement.approval ? (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300">
                  ✓ Approved
                </span>
              ) : (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300">
                  ⏳ Pending Review
                </span>
              )}
            </div>

          
          </div>

          {/* Actions */}
          <div className="flex flex-col md:flex-row gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={onClose}
              className="px-6 py-3 border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-200"
            >
              Close
            </button>
            {!achievement.approval ? (
              <button
                onClick={() => {
                  onApprove(achievement._id)
                  onClose()
                }}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-colors duration-200"
              >
                Approve Achievement
              </button>
            ) : (
              <button
                onClick={() => {
                  onReject(achievement._id)
                  onClose()
                }}
                className="px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded-xl font-medium transition-colors duration-200"
              >
                Revoke Approval
              </button>
            )}
            <button
              onClick={() => {
                onDelete(achievement._id)
                onClose()
              }}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-colors duration-200"
            >
              Delete Achievement
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AchievementDetailsModal
