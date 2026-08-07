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

import { ListChecks } from "lucide-react"
import TimetableAssignment from "./TimetableAsigment"
import CustomSelect from '../../components/CustomSelect';


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
  periodTeacher1,
  periodTeacher2,
  isEditing, 
  toggleEdit, 
  children,
  icon: Icon = FiUser
}) => (
  <div
    className="bg-white dark:bg-[#11322f] rounded-2xl shadow-sm border border-gray-100 dark:border-[#0d2522] 
    overflow-hidden transition-all duration-300 hover:shadow-md hover:border-brand-teal/30 group"
  >
    <div className="bg-brand-mint/5 dark:bg-[#0d2522] px-5 py-4 flex justify-between items-center border-b border-gray-100 dark:border-transparent">
      <h3 className="font-semibold text-gray-800 dark:text-white flex items-center gap-3">
        {name}
        <StatusBadge isAssigned={isAssigned} />
      </h3>
      <button
        onClick={() => toggleEdit(id)}
        className="text-gray-400 hover:text-brand-teal dark:text-gray-500 dark:hover:text-brand-mint transition-colors duration-200 p-2 rounded-full hover:bg-white dark:hover:bg-[#11322f]"
        aria-label={isEditing ? "Cancel editing" : "Edit assignment"}
      >
        {isEditing ? <FiX className="w-4 h-4" /> : <FiEdit2 className="w-4 h-4" />}
      </button>
    </div>

    <div className="p-5">
      {isEditing ? (
        children
      ) : (
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-brand-mint/10 dark:bg-[#0d2522] flex items-center justify-center text-brand-teal dark:text-brand-mint flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
              <Icon className="w-6 h-6" />
            </div>
            <div className="pt-1 w-full">
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-medium mb-1">Assigned To</p>
              <div className="space-y-2">
                <div className="flex flex-col">
                  <span className="font-medium text-gray-900 dark:text-white text-sm">
                    {assignedName || "Not assigned yet"}
                  </span>
                  {periodTeacher1 > 0 && <span className="text-xs text-gray-500 font-normal">Period {periodTeacher1}</span>}
                </div>
                {assignedName2 && (
                  <div className="flex flex-col border-t border-gray-100 dark:border-gray-700/50 pt-2">
                    <span className="font-medium text-gray-900 dark:text-white text-sm">
                      {assignedName2}
                    </span>
                    {periodTeacher2 > 0 && <span className="text-xs text-gray-500 font-normal">Period {periodTeacher2}</span>}
                  </div>
                )}
              </div>
            </div>
          </div>

          {!isAssigned && (
            <button
              onClick={() => toggleEdit(id)}
              className="w-full mt-2 py-2.5 bg-brand-teal hover:bg-brand-teal/90 text-white rounded-xl 
              transition-all duration-200 flex items-center justify-center gap-2 shadow-sm font-medium"
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
  <div className="relative w-full">
    <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="pl-12 pr-10 py-3 w-full rounded-xl border-0 shadow-sm
      bg-white dark:bg-[#11322f] text-gray-900 dark:text-white 
      focus:ring-2 focus:ring-brand-teal transition-all duration-200"
    />
    {value && (
      <button 
        onClick={() => onChange("")}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-brand-teal dark:hover:text-brand-mint bg-gray-50 dark:bg-[#0d2522] rounded-full p-1"
        aria-label="Clear search"
      >
        <FiX className="w-4 h-4" />
      </button>
    )}
  </div>
)

function SubjectAssignment({ batches, teachers, art = false }) {
  const { getSubjects, subjects, getArtSubjects, artSubjects } = useAdminStore();
  const [selectedBatch, setSelectedBatch] = useState(batches[0]);
  const [subjectAssignments, setSubjectAssignments] = useState({});
  const [allSubjects, setAllSubjects] = useState([])
  const [message, setMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [editMode, setEditMode] = useState({});
  const [isLoading, setIsLoading] = useState(false);

 useEffect(() => {
  if (selectedBatch) {
    setIsLoading(true);
    setAllSubjects([])
    if(art) {
    getArtSubjects(selectedBatch.currentArtSemester);
    } else {
    getSubjects(selectedBatch.currentSemester);
    }
  setIsLoading(false);
  }
}, [selectedBatch, getSubjects, getArtSubjects]);

useEffect(() => {
  if (art) {
    setAllSubjects(artSubjects);
  } else {
    setAllSubjects(subjects);
  }
}, [subjects, artSubjects, art]);


  useEffect(() => {
    const modified = {};
    for (const sub of allSubjects) {
      modified[sub._id] = {
        subTeacher: sub.subTeacher || "",
        subTeacher2: sub.subTeacher2 || "",
        periodTeacher2: sub.periodTeacher2 || "",
        periodTeacher1: sub.periodTeacher1 || "",
      };
    }
    setSubjectAssignments(modified);
  }, [subjects, artSubjects, allSubjects]);

  const handleTeacherSelect = async (subjectId, teacherId, second = false) => {
    try {
      setSubjectAssignments((prev) => ({
        ...prev,
        [subjectId]: {
          ...prev[subjectId],
          [second ? "subTeacher2" : "subTeacher"]: teacherId,
        },
      }));

      await axiosInstance.post("/mng/asign-subteacher", {
        subjectId,
        teacherId,
        second,
        art
      });

      setMessage({
        type: "success",
        text: "Subject teacher updated successfully!",
      });
      setEditMode((prev) => ({ ...prev, [subjectId]: false }));

      setTimeout(() => setMessage(null), 3000);
    } catch {
      setMessage({
        type: "error",
        text: "Failed to update subject teacher. Please try again.",
      });
    }
  };

  const handlePeriodSelect = async (subjectId, period, second = false) => {
    try {
      setSubjectAssignments((prev) => ({
        ...prev,
        [subjectId]: {
          ...prev[subjectId],
          [second ? "periodTeacher2" : "periodTeacher1"]: period,
        },
      }));

      await axiosInstance.post("/mng/asign-subteacher-period", {
        subjectId,
        period,
        second,
        art
      });

      setMessage({
        type: "success",
        text: "Period count updated successfully!",
      });

      setTimeout(() => setMessage(null), 3000);
    } catch {
      setMessage({
        type: "error",
        text: "Failed to update period count. Please try again.",
      });
    }
  };

  const toggleEditMode = (subjectId) => {
    setEditMode((prev) => ({
      ...prev,
      [subjectId]: !prev[subjectId],
    }));
  };

  const filteredSubjects = allSubjects.filter((subject) =>
    subject.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-6 w-full">
        <div className="w-full md:w-1/3 max-w-xs">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 ml-1">Select Batch</label>
          <CustomSelect
            value={selectedBatch?._id || ""}
            onChange={(e) =>
              setSelectedBatch(batches.find((b) => b._id === e.target.value))
            }
            className="w-full border-0 bg-white dark:bg-[#11322f] shadow-sm rounded-xl py-3 px-4 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-brand-teal appearance-none transition-shadow"
          >
            <option value="" disabled>Select batch</option>
            {batches.map((b) => (
              <option key={b._id} value={b._id}>{b.name}</option>
            ))}
          </CustomSelect>
        </div>
        <div className="w-full md:flex-1">
          <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="Search subjects..." />
        </div>
      </div>

      <NotificationMessage message={message} onDismiss={() => setMessage(null)} />

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-600"></div>
        </div>
      ) : filteredSubjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSubjects.map((subject) => {
            const sub = subjectAssignments[subject._id] || {};
            const teacher = teachers.find((t) => t._id === sub.subTeacher);
            const teacher2 = teachers.find((t) => t._id === sub.subTeacher2);
            const isEditing = editMode[subject._id];

            return (
              <AssignmentCard
                key={subject._id}
                id={subject._id}
                name={subject.name}
                isAssigned={!!teacher}
                assignedName={teacher?.name}
                assignedName2={teacher2?.name}
                periodTeacher1={subject?.periodTeacher1}
                periodTeacher2={subject?.periodTeacher2}
                isEditing={isEditing}
                toggleEdit={toggleEditMode}
                icon={FiBookOpen}
              >
                <div className="grid grid-cols-2 gap-4">
                  {/* Teacher 1 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Select Teacher 1</label>
                    <CustomSelect
                      value={sub.subTeacher}
                      onChange={(e) => handleTeacherSelect(subject._id, e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg border bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white"
                    >
                      <option value="">Select teacher...</option>
                      {teachers.map((t) => (
                        <option key={t._id} value={t._id}>{t.name}</option>
                      ))}
                    </CustomSelect>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Period</label>
                    <CustomSelect
                      value={sub.periodTeacher1}
                      onChange={(e) => handlePeriodSelect(subject._id, e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg border bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white"
                    >
                      <option value="">Select...</option>
                      {[0,1,2,3,4,5,6,7,8,9,10].map(p => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </CustomSelect>
                  </div>

                  {/* Teacher 2 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Select Teacher 2</label>
                    <CustomSelect
                      value={sub.subTeacher2}
                      onChange={(e) => handleTeacherSelect(subject._id, e.target.value, true)}
                      className="w-full px-4 py-2.5 rounded-lg border bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white"
                    >
                      <option value="">Select teacher...</option>
                      {teachers.map((t) => (
                        <option key={t._id} value={t._id}>{t.name}</option>
                      ))}
                    </CustomSelect>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Period</label>
                    <CustomSelect
                      value={sub.periodTeacher2}
                      onChange={(e) => handlePeriodSelect(subject._id, e.target.value, true)}
                      className="w-full px-4 py-2.5 rounded-lg border bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white"
                    >
                      <option value="">Select...</option>
                      {[0,1,2,3,4,5,6,7,8,9,10].map(p => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </CustomSelect>
                  </div>
                </div>
              </AssignmentCard>
            );
          })}
        </div>
      ) : (
        <EmptyState searchTerm={searchTerm} />
      )}
    </div>
  );
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
                  <CustomSelect
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
                  </CustomSelect>
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
                  <CustomSelect
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
                  </CustomSelect>
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
                  <CustomSelect
                    value={assignment.classLeader}
                    onChange={(e) => handleLeaderSelect(batch._id, e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200"
                  >
                    <option value="">Select student...</option>
                    <option value="No">Not Assigned</option>
                    {batchStudents.map((student) => (
                      <option key={student._id} value={student._id}>
                        {student.name}
                      </option>
                    ))}
                  </CustomSelect>

                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Select Class Leader 2
                  </label>
                  <CustomSelect
                    value={assignment.classLeader2}
                    onChange={(e) => handleLeaderSelect(batch._id, e.target.value, true)}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200"
                  >
                    <option value="">Select student...</option>
                    <option value="No">Not Assigned</option>
                    {batchStudents.map((student) => (
                      <option key={student._id} value={student._id}>
                        {student.name}
                      </option>
                    ))}
                  </CustomSelect>
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
  const { getBatches, getTeachers, getSemesters, getArtSems, batches, teachers, semesters, artSems } = useAdminStore()
  const { students, getStudents } = useStudentStore()
  const props = { batches, teachers, semesters, students, artSems }
  const [loading, setLoading] = useState(true)

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        await Promise.all([getBatches(), getSemesters(), getTeachers(), getStudents(), getArtSems()])
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
    { id: "artSubjects", label: "Assign Art Subject", icon: FiBookOpen },
    { id: "classTeacher", label: "Class Mentors", icon: FiUsers },
    { id: "classLeader", label: "Class Leaders", icon: FiUserCheck },
    // { id: "timeTable", label: "Time Table", icon: FiList }
  ]

  return (
    <div className="py-2 transition-colors duration-300">
      
      <div className="w-full">
      
      <header className="sticky top-0 z-30 bg-[#f3f7f6]/95 dark:bg-[#0d2522]/95 backdrop-blur-md py-4 mb-8 border-b border-gray-200/50 dark:border-transparent shadow-sm dark:shadow-none">
        <div className="relative overflow-x-auto scrollbar-hide">
          <div className="flex w-full p-1.5 bg-white dark:bg-[#11322f] rounded-xl shadow-sm border border-gray-100 dark:border-transparent">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 min-w-[140px] px-4 py-3 rounded-lg font-medium text-sm flex justify-center items-center gap-2 transition-all duration-300 group
                  ${
                    activeTab === tab.id
                      ? "bg-brand-teal text-white shadow-md"
                      : "text-gray-600 dark:text-gray-400 hover:text-brand-teal dark:hover:text-brand-mint hover:bg-gray-50 dark:hover:bg-[#153e3a]"
                  }`}
              >
                <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? "text-white" : "text-gray-400 group-hover:text-brand-teal dark:group-hover:text-brand-mint transition-colors"}`} />
                <span className="truncate">{tab.label}</span>
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
        ) : activeTab === "artSubjects" ? (
          <SubjectAssignment batches={batches} teachers={teachers} art={true} />
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