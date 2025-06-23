"use client"

const AdminEmptyState = ({ searchTerm, hasAchievements, hasProgress }) => {
  if (searchTerm && (hasAchievements || hasProgress)) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-12 min-h-96">
        <div className="w-32 h-32 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-blue-900/50 dark:to-purple-900/50 rounded-full flex items-center justify-center mb-6">
          <div className="text-4xl">🔍</div>
        </div>
        <h3 className="text-2xl font-bold mb-3 text-gray-700 dark:text-white">No results found</h3>
        <p className="text-lg max-w-md text-gray-600 dark:text-gray-300">
          We couldn't find any items matching your search criteria. Try adjusting your filters or search terms.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center text-center p-12 min-h-96">
      <div className="w-32 h-32 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-blue-900/50 dark:to-purple-900/50 rounded-full flex items-center justify-center mb-6">
        <div className="text-4xl">📋</div>
      </div>
      <h3 className="text-3xl font-bold mb-3 text-gray-700 dark:text-white">No Data Available</h3>
      <p className="text-lg mb-8 max-w-lg text-gray-600 dark:text-gray-300">
        There are no items to display at the moment. Students need to submit their data for review.
      </p>
    </div>
  )
}

export default AdminEmptyState
