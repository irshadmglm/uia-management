"use client"

const EmptyState = ({ onAddClick, hasAchievements, searchTerm }) => {
  if (searchTerm && hasAchievements) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-12 min-h-96">
        <div className="w-32 h-32 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mb-6">
          <div className="text-4xl">🔍</div>
        </div>
        <h3 className="text-2xl font-bold text-gray-700 mb-3">No achievements found</h3>
        <p className="text-gray-600 text-lg max-w-md">
          We couldn't find any achievements matching your search criteria. Try adjusting your filters or search terms.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center text-center p-12 min-h-96">
      <div className="w-32 h-32 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mb-6">
        <div className="text-4xl">🏆</div>
      </div>
      <h3 className="text-3xl font-bold text-gray-700 mb-3">Start Your Achievement Journey</h3>
      <p className="text-gray-600 text-lg mb-8 max-w-lg">
        Begin documenting your academic and extracurricular accomplishments. Every achievement, big or small, is worth
        celebrating!
      </p>
      <button
        onClick={onAddClick}
        className="group relative overflow-hidden bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="relative flex items-center gap-3">
          <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
            <span className="text-lg font-bold">+</span>
          </div>
          Add Your First Achievement
        </div>
      </button>
    </div>
  )
}

export default EmptyState
