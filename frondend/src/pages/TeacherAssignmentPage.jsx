"use client"

import { useEffect, useState } from "react"
import { FiBook, FiUsers, FiUser, FiPlus, FiX, FiCheck, FiInfo, FiEdit2, FiSave, FiSearch } from "react-icons/fi"
import { axiosInstance } from "../lib/axios"
import { useAdminStore } from "../store/useAdminMngStore"

function SubjectAssignment({ subjects, teachers }) {
  const [assignments, setAssignments] = useState({})
  const [message, setMessage] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [editingTeacher, setEditingTeacher] = useState(null)
  const [selectedSubjects, setSelectedSubjects] = useState([])
  const [showAddCard, setShowAddCard] = useState(false)
  const [newAssignment, setNewAssignment] = useState({
    teacherId: "",
    subjects: [],
  })

  useEffect(() => {
    const modified = {}
    for (const teacher of teachers) {
      modified[teacher._id] = teacher.subjects || []
    }
    setAssignments(modified)
  }, [teachers])

  const handleNewTeacherChange = (e) => {
    setNewAssignment({
      ...newAssignment,
      teacherId: e.target.value,
    })
  }

  const handleNewSubjectToggle = (subjectId) => {
    setNewAssignment((prev) => {
      const subjects = prev.subjects.includes(subjectId)
        ? prev.subjects.filter((id) => id !== subjectId)
        : [...prev.subjects, subjectId]

      return { ...prev, subjects }
    })
  }

  const handleEditSubjectToggle = (subjectId) => {
    setSelectedSubjects((prev) =>
      prev.includes(subjectId) ? prev.filter((id) => id !== subjectId) : [...prev, subjectId],
    )
  }

  const startEditing = (teacherId) => {
    setEditingTeacher(teacherId)
    setSelectedSubjects(assignments[teacherId] || [])
  }

  const cancelEditing = () => {
    setEditingTeacher(null)
    setSelectedSubjects([])
  }

  const saveEditing = async () => {
    try {
      await axiosInstance.post("/mng/asign-subject", {
        teacherId: editingTeacher,
        subjects: selectedSubjects,
      })

      setAssignments((prev) => ({
        ...prev,
        [editingTeacher]: selectedSubjects,
      }))

      setMessage({ type: "success", text: "Subjects updated successfully!" })
      setEditingTeacher(null)
      setSelectedSubjects([])

      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      setMessage({ type: "error", text: "Failed to update subjects. Please try again." })
    }
  }

  const handleAddAssignment = async () => {
    if (!newAssignment.teacherId) {
      setMessage({ type: "error", text: "Please select a teacher." })
      return
    }
    if (newAssignment.subjects.length === 0) {
      setMessage({ type: "error", text: "Please select at least one subject." })
      return
    }

    try {
      await axiosInstance.post("/mng/asign-subject", {
        teacherId: newAssignment.teacherId,
        subjects: newAssignment.subjects,
      })

      setAssignments((prev) => ({
        ...prev,
        [newAssignment.teacherId]: newAssignment.subjects,
      }))

      setMessage({ type: "success", text: "Subjects assigned successfully!" })
      setNewAssignment({ teacherId: "", subjects: [] })
      setShowAddCard(false)

      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      setMessage({ type: "error", text: "Failed to assign subjects. Please try again." })
    }
  }

  const filteredTeachers = teachers.filter((teacher) => teacher.name.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <FiBook className="text-sky-700" />
            Subject Assignments
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage which subjects are taught by each teacher</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative flex-grow">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search teachers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-sky-700 focus:border-sky-700"
            />
          </div>
          <button
            onClick={() => setShowAddCard(true)}
            className="flex items-center justify-center gap-2 bg-sky-700 hover:bg-sky-600 text-white py-2 px-4 rounded-lg transition-colors duration-200"
          >
            <FiPlus />
            New Assignment
          </button>
        </div>
      </div>

      {message && (
        <div
          className={`p-4 rounded-lg flex items-center gap-3 shadow-md ${
            message.type === "error"
              ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-l-4 border-red-700"
              : "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-l-4 border-green-700"
          }`}
        >
          {message.type === "error" ? <FiX className="w-5 h-5" /> : <FiCheck className="w-5 h-5" />}
          {message.text}
        </div>
      )}

      {showAddCard && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden mb-6 animate-fadeIn">
          <div className="bg-sky-50 dark:bg-sky-900/20 px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h3 className="font-semibold text-sky-700 dark:text-sky-300 flex items-center gap-2">
              <FiPlus className="w-4 h-4" />
              New Subject Assignment
            </h3>
            <button
              onClick={() => setShowAddCard(false)}
              className="text-gray-700 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>
          <div className="p-6">
            <div className="mb-6">
              <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">Select Teacher</label>
              <select
                value={newAssignment.teacherId}
                onChange={handleNewTeacherChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-sky-700 focus:border-sky-700"
              >
                <option value="">Select a teacher</option>
                {teachers.map((t) => (
                  <option key={t._id} value={t._id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-6">
              <p className="mb-3 font-medium text-gray-700 dark:text-gray-300">Select Subjects</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-[300px] overflow-y-auto pr-2">
                {subjects.map((sub) => (
                  <label
                    key={sub._id}
                    className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                      newAssignment.subjects.includes(sub._id)
                        ? "border-sky-700 bg-sky-50 dark:bg-sky-900/20"
                        : "border-gray-200 dark:border-gray-600 hover:border-sky-300 dark:hover:border-sky-700"
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="form-checkbox h-5 w-5 text-sky-600 border-gray-300 rounded focus:ring-sky-700"
                      checked={newAssignment.subjects.includes(sub._id)}
                      onChange={() => handleNewSubjectToggle(sub._id)}
                    />
                    <span className="ml-3 text-gray-700 dark:text-gray-300">{sub.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowAddCard(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleAddAssignment}
                className="px-4 py-2 bg-sky-700 hover:bg-sky-600 text-white rounded-lg transition-colors duration-200 flex items-center gap-2"
              >
                <FiSave className="w-4 h-4" />
                Save Assignment
              </button>
            </div>
          </div>
        </div>
      )}

      {filteredTeachers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeachers.map((teacher) => (
            <div
              key={teacher._id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 overflow-hidden transition-all duration-200 hover:shadow-lg"
            >
              <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 border-b border-gray-200 dark:border-gray-600 flex justify-between items-center">
                <h3 className="font-semibold text-gray-800 dark:text-white truncate">{teacher.name}</h3>
                {editingTeacher === teacher._id ? (
                  <div className="flex gap-2">
                    <button
                      onClick={saveEditing}
                      className="text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300"
                      title="Save changes"
                    >
                      <FiSave className="w-5 h-5" />
                    </button>
                    <button
                      onClick={cancelEditing}
                      className="text-gray-700 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                      title="Cancel"
                    >
                      <FiX className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => startEditing(teacher._id)}
                    className="text-gray-700 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    title="Edit subjects"
                  >
                    <FiEdit2 className="w-5 h-5" />
                  </button>
                )}
              </div>

              <div className="p-6">
                {editingTeacher === teacher._id ? (
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select subjects:</p>
                    <div className="max-h-[200px] overflow-y-auto pr-2 space-y-2">
                      {subjects.map((sub) => (
                        <label
                          key={sub._id}
                          className={`flex items-center p-2 rounded-lg border cursor-pointer transition-all duration-200 ${
                            selectedSubjects.includes(sub._id)
                              ? "border-sky-700 bg-sky-50 dark:bg-sky-900/20"
                              : "border-gray-200 dark:border-gray-600 hover:border-sky-300 dark:hover:border-sky-700"
                          }`}
                        >
                          <input
                            type="checkbox"
                            className="form-checkbox h-4 w-4 text-sky-600 border-gray-300 rounded focus:ring-sky-700"
                            checked={selectedSubjects.includes(sub._id)}
                            onChange={() => handleEditSubjectToggle(sub._id)}
                          />
                          <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">{sub.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-center mb-3">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Assigned Subjects</p>
                      <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded-full">
                        {(assignments[teacher._id] || []).length} subject
                        {(assignments[teacher._id] || []).length !== 1 ? "s" : ""}
                      </span>
                    </div>

                    {(assignments[teacher._id] || []).length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {(assignments[teacher._id] || []).map((subId) => {
                          const sub = subjects.find((s) => s._id === subId)
                          return sub ? (
                            <span
                              key={subId}
                              className="px-3 py-1 text-xs rounded-full bg-sky-100 dark:bg-sky-900/30 text-sky-800 dark:text-sky-300"
                            >
                              {sub.name}
                            </span>
                          ) : null
                        })}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center py-4 text-gray-700 dark:text-gray-400 text-sm">
                        <FiInfo className="mr-2" />
                        No subjects assigned
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 text-center">
          <FiInfo className="w-12 h-12 mx-auto mb-4 text-gray-400 dark:text-gray-700" />
          <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">No teachers found</h3>
          <p className="text-gray-600 dark:text-gray-400">
            {searchTerm ? "Try a different search term" : "Add teachers to start making assignments"}
          </p>
        </div>
      )}
    </div>
  )
}

function BatchTeacherAssignment({ batches, teachers }) {
  const [batchAssignments, setBatchAssignments] = useState({})
  const [message, setMessage] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [editMode, setEditMode] = useState({})

  useEffect(() => {
    const modified = {}
    for (const cl of batches) {
      modified[cl._id] = cl.classTeacher || ""
    }
    setBatchAssignments(modified)
  }, [batches])

  const handleTeacherSelect = async (classId, teacherId) => {
    try {
      setBatchAssignments((prev) => ({
        ...prev,
        [classId]: teacherId,
      }))

      await axiosInstance.post("/mng/asign-teacher", {
        classId,
        teacherId,
      })

      setMessage({ type: "success", text: "Batch teacher updated successfully!" })
      setEditMode((prev) => ({ ...prev, [classId]: false }))

      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      setMessage({ type: "error", text: "Failed to update batch teacher. Please try again." })
    }
  }

  const toggleEditMode = (batchId) => {
    setEditMode((prev) => ({
      ...prev,
      [batchId]: !prev[batchId],
    }))
  }

  const filteredBatches = batches.filter((batch) => batch.name.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <FiUsers className="text-sky-700" />
            Batch Teacher Assignments
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Assign teachers to manage each batch</p>
        </div>

        <div className="relative flex-grow md:max-w-xs w-full">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search batches..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-sky-700 focus:border-sky-700"
          />
        </div>
      </div>

      {message && (
        <div
          className={`p-4 rounded-lg flex items-center gap-3 shadow-md ${
            message.type === "error"
              ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-l-4 border-red-700"
              : "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-l-4 border-green-700"
          }`}
        >
          {message.type === "error" ? <FiX className="w-5 h-5" /> : <FiCheck className="w-5 h-5" />}
          {message.text}
        </div>
      )}

      {filteredBatches.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBatches.map((batch) => {
            const teacherId = batchAssignments[batch._id]
            const teacher = teachers.find((t) => t._id === teacherId)
            const isEditing = editMode[batch._id]

            return (
              <div
                key={batch._id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 overflow-hidden transition-all duration-200 hover:shadow-lg"
              >
                <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 border-b border-gray-200 dark:border-gray-600 flex justify-between items-center">
                  <h3 className="font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                    {batch.name}
                    <span
                      className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                        teacher
                          ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                          : "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300"
                      }`}
                    >
                      {teacher ? "Assigned" : "Pending"}
                    </span>
                  </h3>
                  <button
                    onClick={() => toggleEditMode(batch._id)}
                    className="text-gray-700 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    {isEditing ? <FiX className="w-5 h-5" /> : <FiEdit2 className="w-5 h-5" />}
                  </button>
                </div>

                <div className="p-6">
                  {isEditing ? (
                    <div className="space-y-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Select Teacher
                      </label>
                      <select
                        value={batchAssignments[batch._id] || ""}
                        onChange={(e) => handleTeacherSelect(batch._id, e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-sky-700 focus:border-sky-700"
                      >
                        <option value="">Select teacher...</option>
                        {teachers.map((t) => (
                          <option key={t._id} value={t._id}>
                            {t.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center text-sky-600 dark:text-sky-300">
                          <FiUser className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-700 dark:text-gray-400">Assigned Teacher</p>
                          <p className="font-medium text-gray-800 dark:text-white">
                            {teacher?.name || "No teacher assigned"}
                          </p>
                        </div>
                      </div>

                      {!teacher && (
                        <button
                          onClick={() => toggleEditMode(batch._id)}
                          className="w-full mt-2 py-2 bg-sky-700 hover:bg-sky-600 text-white rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                        >
                          <FiPlus className="w-4 h-4" />
                          Assign Teacher
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 text-center">
          <FiInfo className="w-12 h-12 mx-auto mb-4 text-gray-400 dark:text-gray-700" />
          <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">No batches found</h3>
          <p className="text-gray-600 dark:text-gray-400">
            {searchTerm ? "Try a different search term" : "Add batches to start making assignments"}
          </p>
        </div>
      )}
    </div>
  )
}

function TeacherAssignmentPage() {
  const [activeTab, setActiveTab] = useState("subjects")
  const { getBatches, getSubjects, getTeachers, batches, subjects, teachers } = useAdminStore()
  const props = { batches, subjects, teachers }
  const [loading, setLoading] = useState(true)

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        await Promise.all([getBatches(), getSubjects(), getTeachers()])
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-10">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-3 bg-gradient-to-r from-sky-700 to-teal-700 bg-clip-text text-transparent">
              Teacher Management Portal
            </h1>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Efficiently manage subject allocations and batch assignments for your educational institution
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-full shadow-md p-1.5 flex justify-between max-w-md mx-auto">
            <button
              onClick={() => setActiveTab("subjects")}
              className={`flex-1 px-6 py-2.5 rounded-full font-medium text-sm flex items-center justify-center gap-2 transition-all duration-300 ${
                activeTab === "subjects"
                  ? "bg-sky-700 text-white shadow"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              <FiBook className={activeTab === "subjects" ? "text-white" : "text-sky-700"} />
              Subject Assignment
            </button>
            <button
              onClick={() => setActiveTab("classTeacher")}
              className={`flex-1 px-6 py-2.5 rounded-full font-medium text-sm flex items-center justify-center gap-2 transition-all duration-300 ${
                activeTab === "classTeacher"
                  ? "bg-sky-700 text-white shadow"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              <FiUsers className={activeTab === "classTeacher" ? "text-white" : "text-sky-700"} />
              Batch Teachers
            </button>
          </div>
        </header>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-700"></div>
          </div>
        ) : activeTab === "subjects" ? (
          <SubjectAssignment {...props} />
        ) : (
          <BatchTeacherAssignment {...props} />
        )}
      </div>
    </div>
  )
}

export default TeacherAssignmentPage
