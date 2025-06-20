const StatsCards = ({ achievements }) => {
    const totalAchievements = achievements.length;
    const approvedAchievements = achievements.filter((a) => a.approval).length;
    const pendingAchievements = totalAchievements - approvedAchievements;
    const approvalRate = totalAchievements > 0 ? Math.round((approvedAchievements / totalAchievements) * 100) : 0;
  
    const stats = [
      {
        title: "Total Achievements",
        value: totalAchievements,
        icon: "🏆",
        color: "from-blue-500 to-cyan-500",
        bgColor: "bg-blue-100",
        darkBgColor: "dark:bg-blue-900/40",
      },
      {
        title: "Approved",
        value: approvedAchievements,
        icon: "✅",
        color: "from-green-500 to-emerald-500",
        bgColor: "bg-green-100",
        darkBgColor: "dark:bg-green-900/40",
      },
      {
        title: "Pending Review",
        value: pendingAchievements,
        icon: "⏳",
        color: "from-amber-500 to-orange-500",
        bgColor: "bg-amber-100",
        darkBgColor: "dark:bg-amber-900/40",
      },
      {
        title: "Approval Rate",
        value: `${approvalRate}%`,
        icon: "📊",
        color: "from-purple-500 to-pink-500",
        bgColor: "bg-purple-100",
        darkBgColor: "dark:bg-purple-900/40",
      },
    ];
  
    return (
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`${stat.bgColor} ${stat.darkBgColor} rounded-xl p-3 sm:p-4 border border-white/30 dark:border-white/10 shadow-sm hover:shadow-md transition-all duration-300 text-xs sm:text-sm`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="text-lg sm:text-xl">{stat.icon}</div>
              <div
                className={`w-8 h-8 rounded-lg bg-gradient-to-r ${stat.color} flex items-center justify-center shadow-md`}
              >
                <div className="w-3 h-3 bg-white/30 rounded"></div>
              </div>
            </div>
            <div className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white mb-1">{stat.value}</div>
            <div className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-300 font-medium leading-tight">
              {stat.title}
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  export default StatsCards;
  