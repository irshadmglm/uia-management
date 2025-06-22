import { useEffect, useState } from "react"
import { 
  FiBook, 
  FiUsers, 
  FiUser, 
  FiPlus, 
  FiX, 
  FiCheck, 
  FiInfo, 
  FiEdit2, 
  FiSearch,
  FiBookOpen,
  FiCalendar,
  FiUserCheck,
  FiAlertCircle,
  FiLoader,
  FiList
} from "react-icons/fi"
import { axiosInstance } from "../../lib/axios"
import { useAdminStore } from "../../store/useAdminMngStore"
import { useStudentStore } from "../../store/studentStore"
import Header from "../../components/Header"
import { ListChecks } from "lucide-react"
import TimetableAssignment from "./TimetableAsigment"

const StatusBadge = ({ isAssigned, label }) => (
  <span
    className={`ml-2 px-2 py-0.5 text-xs font-medium rounded-full transition-colors duration-300 ${
      isAssigned
        ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300"
        : "bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300"
    }`}
  >
    {isAssigned ? "Assigned" : "Pending"}
  </span>
)

const AssignmentCard = ({ 
  id, 
  name, 
  isAssigned, 
  assignedName,
  assignedName2, 
  isEditing, 
  toggleEdit, 
  children,
  icon: Icon = FiUser
}) => (
  <div
    className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 
    overflow-hidden transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1"
  >
    <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 border-b border-gray-200 dark:border-gray-600 flex justify-between items-center">
      <h3 className="font-semibold text-gray-800 dark:text-white flex items-center gap-2">
        {name}
        <StatusBadge isAssigned={isAssigned} />
      </h3>
      <button
        onClick={() => toggleEdit(id)}
        className="text-gray-700 hover:text-sky-600 dark:text-gray-400 dark:hover:text-sky-400 
        transition-colors duration-200 p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600"
        aria-label={isEditing ? "Cancel editing" : "Edit assignment"}
      >
        {isEditing ? <FiX className="w-5 h-5" /> : <FiEdit2 className="w-5 h-5" />}
      </button>
    </div>

    <div className="p-6">
      {isEditing ? (
        children
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center text-sky-600 dark:text-sky-300">
              <Icon className="w-7 h-7" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Assigned</p>
              <p className="font-medium text-gray-800 dark:text-white text-lg">
                {assignedName || "Not assigned yet"}
              </p>
              {
                assignedName2 && 
                <p className="font-medium text-gray-800 dark:text-white text-lg">
                {assignedName2 || "Not assigned yet"}
              </p>
              }
            </div>
          </div>

          {!isAssigned && (
            <button
              onClick={() => toggleEdit(id)}
              className="w-full mt-3 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg 
              transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow
              focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            >
              <FiPlus className="w-4 h-4" />
              Assign Now
            </button>
          )}
        </div>
      )}
    </div>
  </div>
)

const EmptyState = ({ searchTerm }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-10 text-center max-w-md mx-auto">
    <div className="bg-gray-100 dark:bg-gray-700 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
      <FiAlertCircle className="w-10 h-10 text-gray-500 dark:text-gray-400" />
    </div>
    <h3 className="text-xl font-medium text-gray-800 dark:text-white mb-3">No items found</h3>
    <p className="text-gray-600 dark:text-gray-400 mb-6">
      {searchTerm ? "Try a different search term" : "Add items to start making assignments"}
    </p>
  
  </div>
)

const NotificationMessage = ({ message, onDismiss }) => {
  if (!message) return null;
  
  return (
    <div
      className={`p-4 rounded-lg flex items-center gap-3 shadow-md animate-fadeIn transition-all duration-300 ${
        message.type === "error"
          ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-l-4 border-red-700"
          : "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-l-4 border-emerald-700"
      }`}
    >
      {message.type === "error" ? <FiX className="w-5 h-5 flex-shrink-0" /> : <FiCheck className="w-5 h-5 flex-shrink-0" />}
      <span className="flex-grow">{message.text}</span>
      <button 
        onClick={onDismiss} 
        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        aria-label="Dismiss notification"
      >
        <FiX className="w-4 h-4" />
      </button>
    </div>
  )
}

const SearchBar = ({ value, onChange, placeholder }) => (
  <div className="relative w-full max-w-sm">
    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="pl-10 pr-4 py-2.5 w-full rounded-lg border border-gray-300 dark:border-gray-600 
      bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-sky-500 
      focus:border-sky-500 transition-all duration-200"
    />
    {value && (
      <button 
        onClick={() => onChange("")}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
        aria-label="Clear search"
      >
        <FiX className="w-4 h-4" />
      </button>
    )}
  </div>
)

function SubjectAssignment({ batches, teachers }) {
  const { getSubjects, subjects } = useAdminStore()
  const [selectedBatch, setSelectedBatch] = useState(batches[0])
  const [subjectAssignments, setsubjectAssignments] = useState({})
  const [message, setMessage] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [editMode, setEditMode] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (selectedBatch) {
      setIsLoading(true)
      getSubjects(selectedBatch.currentSemester)
        .finally(() => setIsLoading(false))
    }
  }, [selectedBatch, getSubjects])
  
  useEffect(() => {
    if (subjects.length > 0) {
      const modified = {};
      for (const cl of subjects) {
        modified[cl._id] = {
          subTeacher: cl.subTeacher || "",
          subTeacher2: cl.subTeacher2 || ""
        };
      }
      setsubjectAssignments(modified);
    }
  }, [subjects]);
  

  const handleTeacherSelect = async (subjectId, teacherId, second = false) => {
    try {
      setsubjectAssignments((prev) => ({
        ...prev,
        [subjectId]: {
          ...prev[subjectId],
          [second ? "subTeacher2" : "subTeacher"]: teacherId,
        },
      }));
      
      await axiosInstance.post("/mng/asign-subteacher", {
        subjectId,
        teacherId ,
        second,
      });
  
      setMessage({ type: "success", text: "Subject teacher updated successfully!" });
      setEditMode((prev) => ({ ...prev, [subjectId]: false }));
  
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({ type: "error", text: "Failed to update subject teacher. Please try again." });
    }
  };
  

  const toggleEditMode = (subjectId) => {
    setEditMode((prev) => ({
      ...prev,
      [subjectId]: !prev[subjectId],
    }))
  }
  let filteredSubjects = [];
  if(subjects){
    console.log(subjects);
    
     filteredSubjects =  subjects.filter((subject) => 
      subject.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="mb-3 sm:mb-0 w-full md:w-auto">
          <label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1 block">Select Batch</label>
          <select
            value={selectedBatch?._id || ""}
            onChange={(e) => setSelectedBatch(batches.find((b) => b._id === e.target.value))}             
            className="w-full md:w-64 border-0 bg-gray-100 dark:bg-gray-700 rounded-lg py-2.5 px-3 
            text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-sky-500 appearance-none"
          >
            <option value="" disabled>Select batch</option>
            {batches.map(b => (
              <option key={b._id} value={b._id}>{b.name}</option>
            ))}
          </select>
        </div>

        <SearchBar 
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search subjects..."
        />
      </div>

      <NotificationMessage 
        message={message} 
        onDismiss={() => setMessage(null)} 
      />

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-600"></div>
        </div>
      ) : filteredSubjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSubjects.map((subject) => {
            const teacherId = subjectAssignments[subject._id]?.subTeacher
            const teacher2Id = subjectAssignments[subject._id]?.subTeacher2
            const teacher = teachers.find((t) => t._id === teacherId)
            const teacher2 = teachers.find((t) => t._id === teacher2Id)
            const isEditing = editMode[subject._id]

            return (
              <AssignmentCard
                key={subject._id}
                id={subject._id}
                name={subject.name}
                isAssigned={!!teacher}
                assignedName={teacher?.name}
                assignedName2={teacher2?.name} 
                isEditing={isEditing}
                toggleEdit={toggleEditMode}
                icon={FiBookOpen}
              >
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Select Teacher 1
                  </label>
                  <select
                    value={subjectAssignments[subject._id]?.subTeacher || ""}
                    onChange={(e) => handleTeacherSelect(subject._id, e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 
                    bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 
                    focus:ring-sky-500 focus:border-sky-500 transition-all duration-200"
                  >
                    <option value="">Select teacher...</option>
                    <option value="No">Not Assigned</option>
                    {teachers.map((t) => (
                      <option key={t._id} value={t._id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Select Teacher 2
                  </label>
                  <select
                    value={subjectAssignments[subject._id]?.subTeacher2 || ""}
                    onChange={(e) => handleTeacherSelect(subject._id, e.target.value, true)}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 
                    bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 
                    focus:ring-sky-500 focus:border-sky-500 transition-all duration-200"
                  >
                    <option value="">Select teacher...</option>
                    <option value="No">Not Assigned</option>
                    {teachers.map((t) => (
                      <option key={t._id} value={t._id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>
              </AssignmentCard>
            )
          })}
        </div>
      ) : (
        <EmptyState searchTerm={searchTerm} />
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

  const filteredBatches = batches.filter((batch) => 
    batch.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-end mb-6">
        <SearchBar 
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search batches..."
        />
      </div>

      <NotificationMessage 
        message={message} 
        onDismiss={() => setMessage(null)} 
      />

      {filteredBatches.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBatches.map((batch) => {
            const teacherId = batchAssignments[batch._id]
            const teacher = teachers.find((t) => t._id === teacherId)
            const isEditing = editMode[batch._id]

            return (
              <AssignmentCard
                key={batch._id}
                id={batch._id}
                name={batch.name}
                isAssigned={!!teacher}
                assignedName={teacher?.name}
                isEditing={isEditing}
                toggleEdit={toggleEditMode}
                icon={FiUsers}
              >
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Select Teacher
                  </label>
                  <select
                    value={batchAssignments[batch._id] || ""}
                    onChange={(e) => handleTeacherSelect(batch._id, e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 
                    bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 
                    focus:ring-sky-500 focus:border-sky-500 transition-all duration-200"
                  >
                    <option value="">Select teacher...</option>
                    {teachers.map((t) => (
                      <option key={t._id} value={t._id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>
              </AssignmentCard>
            )
          })}
        </div>
      ) : (
        <EmptyState searchTerm={searchTerm} />
      )}
    </div>
  )
}

function SemesterAssignment({batches, semesters}) {
  const [batchAssignments, setBatchAssignments] = useState({})
  const [message, setMessage] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [editMode, setEditMode] = useState({})

  useEffect(() => {
    const modified = {}
    for (const cl of batches) {
      modified[cl._id] = cl.currentSemester || ""
    }
    setBatchAssignments(modified)
  }, [batches])

  const handleSemesterSelect = async (classId, semesterId) => {
    try {
      setBatchAssignments((prev) => ({
        ...prev,
        [classId]: semesterId,
      }))

      await axiosInstance.post("/mng/asign-semester", {
        classId,
        semesterId,
      })

      setMessage({ type: "success", text: "Semester assigned successfully!" })
      setEditMode((prev) => ({ ...prev, [classId]: false }))

      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      setMessage({ type: "error", text: "Failed to update semester. Please try again." })
    }
  }

  const toggleEditMode = (batchId) => {
    setEditMode((prev) => ({
      ...prev,
      [batchId]: !prev[batchId],
    }))
  }

  const filteredBatches = batches.filter((batch) => 
    batch.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-end mb-6">
        <SearchBar 
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search batches..."
        />
      </div>

      <NotificationMessage 
        message={message} 
        onDismiss={() => setMessage(null)} 
      />

      {filteredBatches.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBatches.map((batch) => {
            const semesterId = batchAssignments[batch._id]
            const semester = semesters.find((s) => s._id === semesterId)
            const isEditing = editMode[batch._id]

            return (
              <AssignmentCard
                key={batch._id}
                id={batch._id}
                name={batch.name}
                isAssigned={!!semester}
                assignedName={semester?.name}
                isEditing={isEditing}
                toggleEdit={toggleEditMode}
                icon={FiCalendar}
              >
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Select Semester
                  </label>
                  <select
                    value={batchAssignments[batch._id] || ""}
                    onChange={(e) => handleSemesterSelect(batch._id, e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 
                    bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 
                    focus:ring-sky-500 focus:border-sky-500 transition-all duration-200"
                  >
                    <option value="">Select Semester...</option>
                    {semesters.map((s) => (
                      <option key={s._id} value={s._id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              </AssignmentCard>
            )
          })}
        </div>
      ) : (
        <EmptyState searchTerm={searchTerm} />
      )}
    </div>
  )
}

const ClassLeaderAssignment = ({ batches, students }) => {
  const [batchAssignments, setBatchAssignments] = useState({})
  const [message, setMessage] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [editMode, setEditMode] = useState({})

  useEffect(() => {
    const modified = {}
    for (const batch of batches) {
      modified[batch._id] = {
        classLeader: batch.classLeader || "",
        classLeader2: batch.classLeader2 || ""
      }
    }
    setBatchAssignments(modified)
  }, [batches])

  const handleLeaderSelect = async (batchId, studentId, second = false) => {
    try {
      setBatchAssignments(prev => ({
        ...prev,
        [batchId]: {
          ...prev[batchId],
          [second ? "classLeader2" : "classLeader"]: studentId
        }
      }))

      await axiosInstance.post("/mng/asign-class-leader", {
        classId: batchId,
        studentId,
        second
      })

      setMessage({ type: "success", text: "Class leader assigned successfully!" })
      setEditMode(prev => ({ ...prev, [batchId]: false }))

      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      setMessage({ type: "error", text: "Failed to update class leader. Please try again." })
    }
  }

  const toggleEditMode = (batchId) => {
    setEditMode(prev => ({
      ...prev,
      [batchId]: !prev[batchId]
    }))
  }

  const filteredBatches = batches.filter(batch =>
    batch.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-end mb-6">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search batches..."
        />
      </div>

      <NotificationMessage message={message} onDismiss={() => setMessage(null)} />

      {filteredBatches.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBatches.map((batch) => {
            const assignment = batchAssignments[batch._id] || {}
            const leader1 = students.find((s) => s._id === assignment.classLeader)
            const leader2 = students.find((s) => s._id === assignment.classLeader2)
            const batchStudents = students.filter((s) => s.batchId === batch._id)
            const isEditing = editMode[batch._id]

            return (
              <AssignmentCard
                key={batch._id}
                id={batch._id}
                name={batch.name}
                isAssigned={!!(leader1 || leader2)}
                assignedName={leader1?.name}
                assignedName2={leader2?.name}
                isEditing={isEditing}
                toggleEdit={toggleEditMode}
                icon={FiUserCheck}
              >
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Select Class Leader 1
                  </label>
                  <select
                    value={assignment.classLeader}
                    onChange={(e) => handleLeaderSelect(batch._id, e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200"
                  >
                    <option value="">Select student...</option>
                    {batchStudents.map((student) => (
                      <option key={student._id} value={student._id}>
                        {student.name}
                      </option>
                    ))}
                  </select>

                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Select Class Leader 2
                  </label>
                  <select
                    value={assignment.classLeader2}
                    onChange={(e) => handleLeaderSelect(batch._id, e.target.value, true)}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200"
                  >
                    <option value="">Select student...</option>
                    {batchStudents.map((student) => (
                      <option key={student._id} value={student._id}>
                        {student.name}
                      </option>
                    ))}
                  </select>
                </div>
              </AssignmentCard>
            )
          })}
        </div>
      ) : (
        <EmptyState searchTerm={searchTerm} />
      )}
    </div>
  )
}

function AssignDutiesPage() {
  const [activeTab, setActiveTab] = useState("subjects")
  const { getBatches, getTeachers, getSemesters, batches, teachers, semesters } = useAdminStore()
  const { students, getStudents } = useStudentStore()
  const props = { batches, teachers, semesters, students }
  const [loading, setLoading] = useState(true)

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        await Promise.all([getBatches(), getSemesters(), getTeachers(), getStudents()])
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [getBatches, getSemesters, getTeachers, getStudents])

  const tabs = [
    { id: "subjects", label: "Assign Subject", icon: FiBook },
    { id: "classTeacher", label: "Class Mentors", icon: FiUsers },
    { id: "classLeader", label: "Class Leaders", icon: FiUserCheck },
    { id: "timeTable", label: "Time Table", icon: FiList }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 transition-colors duration-300">
      <Header />
      <div className="max-w-7xl mx-auto px-4 mt-14 sm:px-6 lg:px-8">
      
      <header className="mb-10">
        <div className="relative overflow-x-auto scrollbar-hide">
          <div className="flex space-x-2 p-1 bg-white dark:bg-gray-800 rounded-xl shadow-md w-max md:max-w-3xl mx-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-shrink-0 px-4 py-2 rounded-full font-medium text-sm flex items-center gap-2 transition-all duration-300
                  ${
                    activeTab === tab.id
                      ? "bg-sky-600 text-white shadow-md"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                  }`}
              >
                <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? "text-white" : "text-sky-600 dark:text-sky-400"}`} />
                <span className="text-sm">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </header>



        {loading ? (
          <div className="flex flex-col justify-center items-center py-20">
            <FiLoader className="w-10 h-10 text-sky-600 animate-spin mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Loading data...</p>
          </div>
        ) : activeTab === "subjects" ? (
          <SubjectAssignment {...props} />
        ) : activeTab === "classTeacher" ? (
          <BatchTeacherAssignment {...props} />
        ) : activeTab === "currentSemester" ? (
          <SemesterAssignment {...props} />
        ) : activeTab === "classLeader" ? (
          <ClassLeaderAssignment {...props}  />
        ) : <TimetableAssignment /> }
      </div>
    </div>
  )
}

export default AssignDutiesPage