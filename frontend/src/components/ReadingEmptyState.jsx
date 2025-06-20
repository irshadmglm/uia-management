"use client"

const ReadingEmptyState = ({ onAddClick, hasProgress, searchTerm }) => {
  if (searchTerm && hasProgress) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-12 min-h-96">
        <div className="w-32 h-32 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-blue-900/50 dark:to-purple-900/50 rounded-full flex items-center justify-center mb-6">
          <div className="text-4xl">🔍</div>
        </div>
        <h3 className="text-2xl font-bold mb-3 text-gray-700 dark:text-white">No books found</h3>
        <p className="text-lg max-w-md text-gray-600 dark:text-gray-300">
          We couldn't find any books matching your search criteria. Try adjusting your filters or search terms.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center text-center p-12 min-h-96">
      <div className="w-32 h-32 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-blue-900/50 dark:to-purple-900/50 rounded-full flex items-center justify-center mb-6">
        <div className="text-4xl">📚</div>
      </div>
      <h3 className="text-3xl font-bold mb-3 text-gray-700 dark:text-white">Start Your Reading Journey</h3>
      <p className="text-lg mb-8 max-w-lg text-gray-600 dark:text-gray-300">
        Begin tracking your reading progress and build your personal library. Every book you read is a step towards
        knowledge and growth!
      </p>
      <button
        onClick={onAddClick}
        className="group relative overflow-hidden px-8 py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-blue-600 dark:to-purple-700 text-white hover:from-purple-600 hover:to-pink-600 dark:hover:from-purple-600 dark:hover:to-pink-700"
      >
        <div className="relative flex items-center gap-3">
          <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
            <span className="text-lg font-bold">+</span>
          </div>
          Add Your First Book
        </div>
      </button>
    </div>
  )
}

export default ReadingEmptyState
