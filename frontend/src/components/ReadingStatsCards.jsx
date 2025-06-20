const ReadingStatsCards = ({ readingProgress }) => {
    const totalBooks = readingProgress.length;
    const approvedBooks = readingProgress.filter((p) => p.approval).length;
    const pendingBooks = totalBooks - approvedBooks;
    const totalPages = readingProgress.reduce((sum, p) => sum + (p.numberOfPages || 0), 0);
  
    const stats = [
      {
        title: "Total Books",
        value: totalBooks,
        icon: "📚",
        color: "from-blue-500 to-cyan-500",
        bgColor: "bg-blue-50 dark:bg-blue-900/30",
      },
      {
        title: "Approved",
        value: approvedBooks,
        icon: "✅",
        color: "from-green-500 to-emerald-500",
        bgColor: "bg-green-50 dark:bg-green-900/30",
      },
      {
        title: "Pending Review",
        value: pendingBooks,
        icon: "⏳",
        color: "from-amber-500 to-orange-500",
        bgColor: "bg-amber-50 dark:bg-amber-900/30",
      },
      {
        title: "Total Pages",
        value: totalPages.toLocaleString(),
        icon: "📖",
        color: "from-purple-500 to-pink-500",
        bgColor: "bg-purple-50 dark:bg-purple-900/30",
      },
    ];
  
    return (
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`${stat.bgColor} rounded-2xl p-4 sm:p-5 md:p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-white/50 dark:border-gray-700/50`}
          >
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <div className="text-lg sm:text-xl md:text-2xl">{stat.icon}</div>
              <div
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center shadow-lg`}
              >
                <div className="w-4 h-4 sm:w-5 sm:h-5 bg-white/30 rounded-lg"></div>
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-bold mb-1 text-gray-800 dark:text-white">{stat.value}</div>
            <div className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300">{stat.title}</div>
          </div>
        ))}
      </div>
    );
  };
  
  export default ReadingStatsCards;  