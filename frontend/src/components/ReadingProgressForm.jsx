"use client"

import { useState, useEffect } from "react"

const ReadingProgressForm = ({ onSubmit, onCancel, initialData, isEditing }) => {
  const [formData, setFormData] = useState({
    bookName: "",
    authorName: "",
    publisher: "",
    numberOfPages: "",
    monthAndYear: "",
    remarks: "",
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (initialData) {
      setFormData({
        bookName: initialData.bookName || "",
        authorName: initialData.authorName || "",
        publisher: initialData.publisher || "",
        numberOfPages: initialData.numberOfPages || "",
        monthAndYear: initialData.monthAndYear || "",
        remarks: initialData.remarks || "",
      })
    }
  }, [initialData])

  const validateForm = () => {
    const newErrors = {}

    if (!formData.bookName.trim()) {
      newErrors.bookName = "Book name is required"
    }

    if (formData.numberOfPages && (isNaN(formData.numberOfPages) || formData.numberOfPages <= 0)) {
      newErrors.numberOfPages = "Please enter a valid number of pages"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    try {
      const submitData = {
        ...formData,
        numberOfPages: formData.numberOfPages ? Number.parseInt(formData.numberOfPages) : null,
      }
      await onSubmit(submitData)
    } catch (error) {
      console.error("Error submitting form:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
        <div>
          <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
            {isEditing ? "Edit Reading Progress" : "Add New Book"}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mt-2">Record your reading journey and track your progress</p>
        </div>
        <button
          onClick={onCancel}
          className="w-10 h-10 flex items-center justify-center text-2xl text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-all duration-200"
        >
          ×
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Book Name */}
        <div className="space-y-2">
          <label htmlFor="bookName" className="block text-sm font-semibold text-gray-700 dark:text-gray-200">
            Book Name *
          </label>
          <input
            type="text"
            id="bookName"
            name="bookName"
            value={formData.bookName}
            onChange={handleChange}
            className={`w-full px-4 py-4 border-2 rounded-xl text-base transition-all duration-200 focus:outline-none focus:ring-4 ${
              errors.bookName
                ? "border-red-500 focus:border-red-500 focus:ring-red-100 dark:focus:ring-red-500/20"
                : "border-gray-200 dark:border-gray-600 focus:border-indigo-500 dark:focus:border-blue-500 focus:ring-indigo-100 dark:focus:ring-blue-500/20"
            } bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400`}
            placeholder="e.g., ആടു ജീവിതം"
          />
          {errors.bookName && <span className="text-red-500 text-sm font-medium">{errors.bookName}</span>}
        </div>

        {/* Author and Publisher Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="authorName" className="block text-sm font-semibold text-gray-700 dark:text-gray-200">
              Author Name
            </label>
            <input
              type="text"
              id="authorName"
              name="authorName"
              value={formData.authorName}
              onChange={handleChange}
              className="w-full px-4 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-base bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-indigo-500 dark:focus:border-blue-500 focus:ring-4 focus:ring-indigo-100 dark:focus:ring-blue-500/20 transition-all duration-200"
              placeholder=""
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="publisher" className="block text-sm font-semibold text-gray-700 dark:text-gray-200">
              Publisher
            </label>
            <input
              type="text"
              id="publisher"
              name="publisher"
              value={formData.publisher}
              onChange={handleChange}
              className="w-full px-4 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-base bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-indigo-500 dark:focus:border-blue-500 focus:ring-4 focus:ring-indigo-100 dark:focus:ring-blue-500/20 transition-all duration-200"
              placeholder=""
            />
          </div>
        </div>

        {/* Pages and Date Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="numberOfPages" className="block text-sm font-semibold text-gray-700 dark:text-gray-200">
              Number of Pages
            </label>
            <input
              type="number"
              id="numberOfPages"
              name="numberOfPages"
              value={formData.numberOfPages}
              onChange={handleChange}
              className={`w-full px-4 py-4 border-2 rounded-xl text-base transition-all duration-200 focus:outline-none focus:ring-4 ${
                errors.numberOfPages
                  ? "border-red-500 focus:border-red-500 focus:ring-red-100 dark:focus:ring-red-500/20"
                  : "border-gray-200 dark:border-gray-600 focus:border-indigo-500 dark:focus:border-blue-500 focus:ring-indigo-100 dark:focus:ring-blue-500/20"
              } bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400`}
              placeholder=""
              min="1"
            />
            {errors.numberOfPages && <span className="text-red-500 text-sm font-medium">{errors.numberOfPages}</span>}
          </div>

          <div className="space-y-2">
            <label htmlFor="monthAndYear" className="block text-sm font-semibold text-gray-700 dark:text-gray-200">
              Month & Year
            </label>
            <input
              type="date"
              id="monthAndYear"
              name="monthAndYear"
              value={formData.monthAndYear}
              onChange={handleChange}
              className="w-full px-4 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-base bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-indigo-500 dark:focus:border-blue-500 focus:ring-4 focus:ring-indigo-100 dark:focus:ring-blue-500/20 transition-all duration-200"
            />
          </div>
        </div>

        {/* Remarks */}
        <div className="space-y-2">
          <label htmlFor="remarks" className="block text-sm font-semibold text-gray-700 dark:text-gray-200">
            Remarks/Review
          </label>
          <textarea
            id="remarks"
            name="remarks"
            value={formData.remarks}
            onChange={handleChange}
            rows="4"
            className="w-full px-4 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-base resize-y min-h-24 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-indigo-500 dark:focus:border-blue-500 focus:ring-4 focus:ring-indigo-100 dark:focus:ring-blue-500/20 transition-all duration-200"
            placeholder="Share your thoughts about the book, key learnings, or personal review..."
          />
        </div>

        {/* Form Actions */}
        <div className="flex flex-col md:flex-row gap-4 justify-end pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={onCancel}
            className="px-8 py-4 border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-blue-600 dark:to-purple-700 text-white rounded-xl font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Saving...
              </div>
            ) : isEditing ? (
              "Update Progress"
            ) : (
              "Add Book"
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default ReadingProgressForm
