const AdminStatsCards = ({ achievements }) => {
    const totalAchievements = achievements.length
    const approvedAchievements = achievements.filter((a) => a.approval).length
    const pendingAchievements = totalAchievements - approvedAchievements
    const uniqueStudents = new Set(achievements.map((a) => a.studentId?._id || a.studentId)).size
  
    const stats = [
      {
        title: "Total Achievements",
        value: totalAchievements,
        icon: "🏆",
        color: "from-blue-500 to-cyan-500",
        bgColor: "bg-blue-50 dark:bg-blue-900/30",
      },
      {
        title: "Approved",
        value: approvedAchievements,
        icon: "✅",
        color: "from-green-500 to-emerald-500",
        bgColor: "bg-green-50 dark:bg-green-900/30",
      },
      {
        title: "Pending Review",
        value: pendingAchievements,
        icon: "⏳",
        color: "from-amber-500 to-orange-500",
        bgColor: "bg-amber-50 dark:bg-amber-900/30",
      },
      {
        title: "Active Students",
        value: uniqueStudents,
        icon: "👥",
        color: "from-purple-500 to-pink-500",
        bgColor: "bg-purple-50 dark:bg-purple-900/30",
      },
    ]
  
    return (
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`${stat.bgColor} rounded-xl p-3 shadow-sm hover:shadow-md transition-all duration-300 border border-white/50 dark:border-gray-700/50`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="text-2xl">{stat.icon}</div>
              <div
                className={`w-10 h-10 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center shadow-lg`}
              >
                <div className="w-4 h-4 bg-white/30 rounded-sm"></div>
              </div>
            </div>
            <div className="text-2xl font-bold mb-1 text-gray-800 dark:text-white">{stat.value}</div>
            <div className="text-sm font-medium text-gray-600 dark:text-gray-300">{stat.title}</div>
          </div>
        ))}
      </div>
    )
  }
  
  export default AdminStatsCards
  