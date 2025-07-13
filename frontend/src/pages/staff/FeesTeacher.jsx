import { useState, useEffect, useMemo } from "react"
import {
  Download,
  Calendar,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  ArrowUpRight,
  Users,
  BarChart3,
} from "lucide-react"
import { useAdminStore } from "../../store/useAdminMngStore"
import { useFeeStore } from "../../store/feesSrore"
import toast from "react-hot-toast" 

import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { useParams } from "react-router-dom"
import { useStaffStore } from "../../store/useStaffStore"
import { useStudentStore } from "../../store/studentStore"
import Header from "../../components/Header"

const months = [ "شوّال", "ذو القعدة", "ذو الحجة", "محرّم", "صفر", "ربيع الأوّل",
   "ربيع الآخر", "جمادى الأولى", "جمادى الأخرى", "رجب", "شعبان", "رمضان"];

export default function FeesTeacher() {
  const { batchId } = useParams();
  const {batch, getBatchById, isLoading } = useStaffStore()
  const { getBatchStudents, batchStudents} = useStudentStore()
  const {
    fees,
    isLoading: feesLoading,
    fetchFees,
    getStudentStatus,
    getStudentProgress,
    getBatchStats
  } = useFeeStore()

  
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [selectedMonths, setSelectedMonths] = useState([])
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [sortBy, setSortBy] = useState("name")
  const [sortDirection, setSortDirection] = useState("asc")

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        await getBatchById(batchId)
        getBatchStudents(batchId)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Fetch fees when batch changes
  useEffect(() => {
    if (batch) {
      fetchFees(batchId)
    }
  }, [batch, fetchFees])


 
  const filteredStudents = useMemo(() => {
  
    return batchStudents
      .map((student) => {
        return {
          id: student._id,
          name: student?.name || "Unknown",
          progress: getStudentProgress(student._id),
          status: getStudentStatus(student._id)
        };
      })
      .filter(student => {
        const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase());
        const paidMonths = Object.values(student.status).filter(v => v).length;
        const totalMonths = Object.values(student.status).length || 1;
        
        // Status filtering
        if (selectedStatus === "paid" && paidMonths === 0) return false;
        if (selectedStatus === "pending" && paidMonths === totalMonths) return false;
        
        // Month filtering
        if (selectedMonths.length > 0) {
          return selectedMonths.some(m => student.status[m] !== undefined);
        }
        
        return true;
      })
      .sort((a, b) => {
        const modifier = sortDirection === "asc" ? 1 : -1;
        if (sortBy === "name") return a.name.localeCompare(b.name) * modifier;
        if (sortBy === "progress") return (a.progress - b.progress) * modifier;
        return 0;
      });
  }, [
     batchStudents, searchTerm, selectedStatus, 
    selectedMonths, sortBy, sortDirection, fees 
  ]);

  const stats = useMemo(() => {
    if (!batch) {
      return {
        totalPaid: 0,
        totalPending: 0,
        totalAmount: "₹0"
      }
    }
    
    return getBatchStats(
      batchId, 
      batchStudents?.length || 0
    )
  }, [batchId, getBatchStats, fees, batchStudents?.length]);

 

  // Toggle sort direction
  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortBy(field)
      setSortDirection("asc")
    }
  }

  // Toggle month selection for filtering
  const toggleMonthFilter = (month) => {
    setSelectedMonths((prev) => (prev.includes(month) ? prev.filter((m) => m !== month) : [...prev, month]))
  }

  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 bg-gray-50 dark:bg-gray-900 min-h-screen space-y-6 transition-colors">
      {/* Header */}
      <Header />
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pt-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-gray-100 bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
            Monthly Fees
          </h1>
        </div>

        <div className="flex items-center gap-3">
       
        </div>
      </div>

     

   

      {/* TABLE (visible on md+) */}
      <div className="hidden md:block bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden" id="pdf-content">
        <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-500" />
              {batch.name || "Select a Batch"} 
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {filteredStudents.length} student{filteredStudents.length !== 1 ? "s" : ""} •{" "}
              {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-green-500"></span>
              Paid
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-600"></span>
              Pending
            </span>
          </div>
        </div>

        {batchStudents?.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-750">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                    onClick={() => toggleSort("name")}
                  >
                    <div className="flex items-center gap-1">
                      Student
                      {sortBy === "name" &&
                        (sortDirection === "asc" ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                    </div>
                  </th>
                  {months.map((m) => (
                    <th
                      key={m}
                      className="px-1 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      {m}
                    </th>
                  ))}
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                    onClick={() => toggleSort("progress")}
                  >
                    <div className="flex items-center gap-1">
                      Progress
                      {sortBy === "progress" &&
                        (sortDirection === "asc" ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-500 dark:hover:bg-gray-750 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                          <Users className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{student.name}</div>
                        </div>
                      </div>
                    </td>
                    {months.map((m) => (
                      <td key={m} className="px-1 py-4 whitespace-nowrap text-center">
                        <StyledCheckbox checked={student.status[m]} onChange={() => toggle(student.id, m)} />
                      </td>
                    ))}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <ProgressBar value={student.progress} />
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                          {student.progress}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center">
            <Users className="h-12 w-12 mx-auto text-gray-400 mb-3" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">No batchStudents found</h3>
            <p className="text-gray-600 dark:text-gray-400">
              {batch
                ? "Try selecting a different batch or adjusting your filters"
                : "Please select a batch to view batchStudents"}
            </p>
          </div>
        )}
      </div>

      {/* CARDS (visible below md) */}
      <div className="md:hidden space-y-4">
        {batchStudents?.length > 0 ? (
          filteredStudents.map((student) => (
            <div
              key={student.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-colors"
            >
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                    <Users className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div className="ml-3">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{student.name}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                    {student.progress}%
                  </span>
                
                </div>
              </div>

              <div className="p-4">
                <div className="mb-3">
                  <ProgressBar value={student.progress} />
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {months.map((m) => (
                    <div key={m} className="flex flex-col items-center">
                      <span className="text-xs text-gray-600 dark:text-gray-400 mb-1">{m}</span>
                      <StyledCheckbox checked={student.status[m]}  />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 text-center">
            <Users className="h-12 w-12 mx-auto text-gray-400 mb-3" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">No batchStudents found</h3>
            <p className="text-gray-600 dark:text-gray-400">
              {batch
                ? "Try selecting a different batch or adjusting your filters"
                : "Please select a batch to view batchStudents"}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

// Card Component
function Card({ title, value, icon, color }) {
  const getColorClasses = () => {
    switch (color) {
      case "green":
        return "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400"
      case "amber":
        return "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400"
      case "red":
        return "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400"
      case "indigo":
      default:
        return "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400"
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 transition-colors">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</h3>
        <div className={`p-2 rounded-lg ${getColorClasses()}`}>{icon}</div>
      </div>
      <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{value}</p>
      <div className="mt-2 flex items-center text-xs text-green-600 dark:text-green-400">
        <BarChart3 className="h-3 w-3 mr-1" />
      </div>
    </div>
  )
}

// Styled Checkbox Component
function StyledCheckbox({ checked, onChange }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = async () => {
    setIsLoading(true);
    await onChange();
    setIsLoading(false);
  };

  return (
    <label className="inline-flex items-center justify-center cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        className="sr-only"
        disabled={isLoading}
      />
      <span
        className={`
          h-6 w-6 flex items-center justify-center rounded-md transition-all duration-200
          ${isLoading ? "opacity-70 animate-pulse" : ""}
          ${
            checked
              ? "bg-indigo-600 dark:bg-indigo-500 shadow-md"
              : "bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:border-indigo-300 dark:hover:border-indigo-500"
          }
        `}
      >
       
        
      </span>
    </label>
  );
}

// Progress Bar Component
function ProgressBar({ value }) {
  // Determine color based on value
  const getBarColor = () => {
    if (value < 30) return "bg-red-500 dark:bg-red-400"
    if (value < 70) return "bg-amber-500 dark:bg-amber-400"
    return "bg-green-500 dark:bg-green-400"
  }

  return (
    <div className="w-full">
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
        <div
          className={`${getBarColor()} h-full transition-all duration-500 rounded-full`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  )
}
