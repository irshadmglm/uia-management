"use client"

import { useState, useEffect } from "react"

const AchievementForm = ({ onSubmit, onCancel, initialData, isEditing }) => {
  const [formData, setFormData] = useState({
    achievedItem: "",
    agencyLevel: "",
    placeOrRank: "",
    gradeOrPercentage: "",
    monthAndYear: "",
    remarks: "",
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (initialData) {
      setFormData({
        achievedItem: initialData.achievedItem || "",
        agencyLevel: initialData.agencyLevel || "",
        placeOrRank: initialData.placeOrRank || "",
        gradeOrPercentage: initialData.gradeOrPercentage || "",
        monthAndYear: initialData.monthAndYear || "",
        remarks: initialData.remarks || "",
      })
    }
  }, [initialData])

  const validateForm = () => {
    const newErrors = {}

    if (!formData.achievedItem.trim()) {
      newErrors.achievedItem = "Achievement item is required"
    }

    if (!formData.monthAndYear.trim()) {
      newErrors.monthAndYear = "Month and year is required"
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
      await onSubmit(formData)
    } catch (error) {
      console.error("Error submitting form:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 pb-6 border-b border-gray-200">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            {isEditing ? "Edit Achievement" : "Add New Achievement"}
          </h2>
          <p className="text-gray-600 mt-2">Fill in the details of your achievement</p>
        </div>
        <button
          onClick={onCancel}
          className="w-10 h-10 flex items-center justify-center text-2xl text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-200"
        >
          ×
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Achievement Item */}
        <div className="space-y-2">
          <label htmlFor="achievedItem" className="block text-sm font-semibold text-gray-700">
            Achievement Item *
          </label>
          <input
            type="text"
            id="achievedItem"
            name="achievedItem"
            value={formData.achievedItem}
            onChange={handleChange}
            className={`w-full px-4 py-4 border-2 rounded-xl text-base transition-all duration-200 ${
              errors.achievedItem
                ? "border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                : "border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            } focus:outline-none`}
            placeholder="e.g., First Prize in Speach"
          />
          {errors.achievedItem && <span className="text-red-500 text-sm font-medium">{errors.achievedItem}</span>}
        </div>

        {/* Agency Level and Place/Rank Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="agencyLevel" className="block text-sm font-semibold text-gray-700">
              Agency/Level
            </label>
            <select
              id="agencyLevel"
              name="agencyLevel"
              value={formData.agencyLevel}
              onChange={handleChange}
              className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl text-base bg-white focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-200"
            >
              <option value="">Select Level</option>
              <option value="School">School Level</option>
              <option value="District">District Level</option>
              <option value="State">State Level</option>
              <option value="National">National Level</option>
              <option value="International">International Level</option>
              <option value="University">University Level</option>
              <option value="College">College Level</option>
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="placeOrRank" className="block text-sm font-semibold text-gray-700">
              Place/Rank
            </label>
            <input
              type="text"
              id="placeOrRank"
              name="placeOrRank"
              value={formData.placeOrRank}
              onChange={handleChange}
              className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl text-base focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-200"
              placeholder="e.g., 1st Place, 2nd Position, Winner"
            />
          </div>
        </div>

        {/* Grade/Percentage and Month/Year Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="gradeOrPercentage" className="block text-sm font-semibold text-gray-700">
              Grade/Percentage
            </label>
            <input
              type="text"
              id="gradeOrPercentage"
              name="gradeOrPercentage"
              value={formData.gradeOrPercentage}
              onChange={handleChange}
              className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl text-base focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-200"
              placeholder="e.g., A+, 95%, 9.5 CGPA"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="monthAndYear" className="block text-sm font-semibold text-gray-700">
              Month & Year *
            </label>
            <input
              type="text"
              id="monthAndYear"
              name="monthAndYear"
              value={formData.monthAndYear}
              onChange={handleChange}
              className={`w-full px-4 py-4 border-2 rounded-xl text-base transition-all duration-200 ${
                errors.monthAndYear
                  ? "border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                  : "border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
              } focus:outline-none`}
              placeholder="e.g., March 2024, Dec 2023"
            />
            {errors.monthAndYear && <span className="text-red-500 text-sm font-medium">{errors.monthAndYear}</span>}
          </div>
        </div>

        {/* Remarks */}
        <div className="space-y-2">
          <label htmlFor="remarks" className="block text-sm font-semibold text-gray-700">
            Remarks/Additional Details
          </label>
          <textarea
            id="remarks"
            name="remarks"
            value={formData.remarks}
            onChange={handleChange}
            rows="4"
            className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl text-base resize-y min-h-24 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-200"
            placeholder="Any additional information about your achievement..."
          />
        </div>

        {/* Form Actions */}
        <div className="flex flex-col md:flex-row gap-4 justify-end pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-8 py-4 border-2 border-gray-300 bg-white text-gray-700 rounded-xl font-semibold hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Saving...
              </div>
            ) : isEditing ? (
              "Update Achievement"
            ) : (
              "Add Achievement"
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AchievementForm
