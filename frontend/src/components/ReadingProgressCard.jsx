"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, Calendar, BookOpen, FileText, Building2, Pencil } from "lucide-react"

const ReadingProgressCard = ({ progress, onEdit }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const toggleExpand = () => setIsExpanded(!isExpanded)

  const getStatusBadge = () => {
    return progress.approval ? (
      <div className="flex items-center gap-2 px-2 py-1 bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300 rounded-full text-xs font-semibold">
        <div className="w-2 h-2 bg-green-500 rounded-full" />
        Approved
      </div>
    ) : (
      <div className="flex items-center gap-2 px-2 py-1 bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 rounded-full text-xs font-semibold">
        <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
        Pending
      </div>
    )
  }

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 rounded-2xl p-4 shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all">
      {/* Header */}
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white">{progress.bookName}</h3>
          {progress.authorName && (
            <p className="text-sm text-gray-600 dark:text-gray-300">by {progress.authorName}</p>
          )}
        </div>
        <div className="flex flex-col items-end gap-1">
          {getStatusBadge()}
          <button
            onClick={toggleExpand}
            className="text-gray-500 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400 transition"
          >
            {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        </div>
      </div>

      {/* Expandable Section */}
      {isExpanded && (
        <div className="mt-4 space-y-3 text-sm text-gray-700 dark:text-gray-300">
          {progress.publisher && (
            <div className="flex items-center gap-2">
              <Building2 size={16} className="text-purple-500 dark:text-purple-300" />
              <span className="font-medium">Publisher:</span>
              <span>{progress.publisher}</span>
            </div>
          )}
          {progress.numberOfPages && (
            <div className="flex items-center gap-2">
              <BookOpen size={16} className="text-green-500 dark:text-green-300" />
              <span className="font-medium">Pages:</span>
              <span>{progress.numberOfPages}</span>
            </div>
          )}
          {progress.monthAndYear && (
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-blue-500 dark:text-blue-300" />
              <span className="font-medium">Read on:</span>
              <span>{progress.monthAndYear}</span>
            </div>
          )}
          {progress.remarks && (
            <div className="flex items-start gap-2">
              <FileText size={16} className="mt-0.5 text-gray-500 dark:text-gray-300" />
              <div>
                <span className="font-medium block mb-1">Remarks:</span>
                <p className="text-sm">{progress.remarks}</p>
              </div>
            </div>
          )}
          <div className="flex justify-between pt-3 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
            <span>Added: {new Date(progress.createdAt).toLocaleDateString()}</span>
            {progress.updatedAt !== progress.createdAt && (
              <span>Updated: {new Date(progress.updatedAt).toLocaleDateString()}</span>
            )}
          </div>
          <div className="pt-2">
            <button
              onClick={onEdit}
              className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 text-sm hover:underline"
            >
              <Pencil size={14} />
              Edit
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ReadingProgressCard
