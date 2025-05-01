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
import { useStudentStore } from "../../store/studentStore"
import { useAdminStore } from "../../store/useAdminMngStore"
import { useFeeStore } from "../../store/feesSrore"
import toast from "react-hot-toast" 

import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

export default function FeesDashboard() {
  const { getStudents, students } = useStudentStore()
  const { batches, getBatches } = useAdminStore()
  const {
    fees,
    isLoading: feesLoading,
    fetchFees,
    updateFee,
    getStudentStatus,
    getStudentProgress,
    getBatchStats
  } = useFeeStore()

  const [selectedBatch, setSelectedBatch] = useState(
    batches.length > 0 ? batches[0]._id : ""
  );
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [selectedMonths, setSelectedMonths] = useState([])
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [sortBy, setSortBy] = useState("name")
  const [sortDirection, setSortDirection] = useState("asc")

  useEffect(() => {
    if (batches.length > 0 && !selectedBatch) {
      const defaultBatch = batches.find(b => b.isActive) || batches[0];
      setSelectedBatch(defaultBatch?._id || "");
    }
  }, [batches]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        await getBatches()
        getStudents()
        if (batches.length > 0 && !selectedBatch) {
          setSelectedBatch(batches[0]?._id || "")
        }
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
    if (selectedBatch) {
      fetchFees(selectedBatch)
    }
  }, [selectedBatch, fetchFees])

  const current = batches.find((b) => b._id === selectedBatch) || { name: "", students: [] }

  const toggle = async (studentId, month) => {
    const currentStatus = getStudentStatus(studentId)[month];
    try {
      await updateFee({
        studentId,
        batchId: selectedBatch,
        month,
        paid: !currentStatus
      });
    } catch (error) {
      toast.error("Update failed", { id: "feeUpdate" });
    }
  };
  const filteredStudents = useMemo(() => {
    if (!current.students) return [];
  
    return current.students
      .map((stdId) => {
        const student = students.find((s) => s._id === stdId);
        return {
          id: stdId,
          name: student?.name || "Unknown",
          progress: getStudentProgress(stdId),
          status: getStudentStatus(stdId)
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
    current.students, students, searchTerm, selectedStatus, 
    selectedMonths, sortBy, sortDirection, fees 
  ]);

  const stats = useMemo(() => {
    if (!selectedBatch) {
      return {
        totalPaid: 0,
        totalPending: 0,
        totalAmount: "₹0"
      }
    }
    
    return getBatchStats(
      selectedBatch, 
      current.students?.length || 0
    )
  }, [selectedBatch, getBatchStats, fees, current.students?.length]);

 

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

  
  const handleDownloadPdf = () => {
    const doc = new jsPDF("landscape");
    
    // Main Header
    doc.setFontSize(20);
    doc.setTextColor(33, 37, 41); // Dark gray
    doc.setFont("helvetica", "bold");
    doc.text(`${current.name} Fee Report`, 14, 20);
  
    // Decorative line under header
    doc.setDrawColor(79, 70, 229); // Indigo color
    doc.setLineWidth(0.5);
    doc.line(14, 23, 280, 23);
  
    // Subheader with date and institution info
    doc.setFontSize(12);
    doc.setTextColor(108, 117, 125); // Gray
    doc.setFont("helvetica", "normal");
    const dateString = new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
    doc.text(`Generated on ${dateString}`, 14, 30);
    doc.text("UIA Management System", 240, 30, { align: "right" });
  
    // Add small institution logo (optional)
    // If you have a logo image:
    // doc.addImage(logo, 'PNG', 260, 12, 30, 10);
  
    // Table styling
    autoTable(doc, {
      startY: 35, // Start below header section
      head: [['Student Name', ...months, 'Progress']],
      body: filteredStudents.map(student => [
        student.name,
        ...months.map(m => student.status[m] ? "YES" : "__"),
        `${student.progress}%`
      ]),
      styles: {
        fontSize: 10,
        cellPadding: 4,
        textColor: [33, 37, 41],
        font: 'helvetica'
      },
      headStyles: {
        fillColor: [79, 70, 229], // Indigo
        textColor: 255,
        fontSize: 10,
        cellPadding: 5
      },
      columnStyles: {
        0: { cellWidth: 40 }, // Name column
        ...Object.fromEntries(
          months.map((_, i) => [i + 1, { cellWidth: 18 }]) // Month columns
        ),
        [months.length + 1]: { cellWidth: 25 } // Progress column
      }
    });
  
    // Footer
    const pageCount = doc.internal.getNumberOfPages();
    for(let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setTextColor(108, 117, 125);
      doc.text(
        `Page ${i} of ${pageCount}`,
        doc.internal.pageSize.width - 25,
        doc.internal.pageSize.height - 10
      );
    }
  
    doc.save(`${current.name}_fee_report.pdf`);
  };
  
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-gray-100 bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
            Fees Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Track and manage student fee payments</p>
        </div>

        <div className="flex items-center gap-3">
        <button
          className="p-2.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
          title="Download report"
          onClick={handleDownloadPdf}
        >
          <Download size={18} />
        </button>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2.5 rounded-lg border transition-colors shadow-sm flex items-center gap-2 ${
              showFilters
                ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
            }`}
            title="Show filters"
          >
            <Filter size={18} />
            <span className="hidden sm:inline">Filters</span>
            {showFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 animate-fadeIn">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Payment Status</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedStatus("all")}
                  className={`px-3 py-1.5 rounded-full text-sm ${
                    selectedStatus === "all"
                      ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setSelectedStatus("paid")}
                  className={`px-3 py-1.5 rounded-full text-sm ${
                    selectedStatus === "paid"
                      ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                  }`}
                >
                  Paid
                </button>
                <button
                  onClick={() => setSelectedStatus("pending")}
                  className={`px-3 py-1.5 rounded-full text-sm ${
                    selectedStatus === "pending"
                      ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                  }`}
                >
                  Pending
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Sort By</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => toggleSort("name")}
                  className={`px-3 py-1.5 rounded-full text-sm flex items-center gap-1 ${
                    sortBy === "name"
                      ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                  }`}
                >
                  Name
                  {sortBy === "name" && (sortDirection === "asc" ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                </button>
                <button
                  onClick={() => toggleSort("progress")}
                  className={`px-3 py-1.5 rounded-full text-sm flex items-center gap-1 ${
                    sortBy === "progress"
                      ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                  }`}
                >
                  Progress
                  {sortBy === "progress" &&
                    (sortDirection === "asc" ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Filter by Month</h3>
              <div className="flex flex-wrap gap-1.5">
                {months.map((month) => (
                  <button
                    key={month}
                    onClick={() => toggleMonthFilter(month)}
                    className={`px-2 py-1 rounded text-xs ${
                      selectedMonths.includes(month)
                        ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {month}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card
          title="Total Collected"
          value={stats.totalAmount}
          icon={<DollarSign className="w-5 h-5" />}
          color="indigo"
        />
        <Card title="Paid Months" value={stats.totalPaid} icon={<CheckCircle className="w-5 h-5" />} color="green" />
        <Card
          title="Pending Payments"
          value={stats.totalPending}
          icon={<AlertCircle className="w-5 h-5" />}
          color="amber"
        />

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between">
          <div className="w-full mb-3 sm:mb-0">
            <label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1 block">Select Batch</label>
            
            <select
              value={selectedBatch || ""}
              onChange={(e) => setSelectedBatch(e.target.value)}
              className="w-full border-0 bg-gray-100 dark:bg-gray-700 rounded-lg py-2 px-3 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500"
            >
              <option value="" disabled>Select batch</option>
              {batches.map(b => (
                <option key={b._id} value={b._id}>{b.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search students..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="block w-full pl-10 pr-3 py-2.5 border-0 bg-white dark:bg-gray-800 rounded-xl shadow-md text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* TABLE (visible on md+) */}
      <div className="hidden md:block bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden" id="pdf-content">
        <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-500" />
              {current.name || "Select a Batch"} — Monthly Fees
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

        {current.students?.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-500 dark:bg-gray-900">
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
                  <tr key={student.id} className="hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
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
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">No students found</h3>
            <p className="text-gray-600 dark:text-gray-400">
              {selectedBatch
                ? "Try selecting a different batch or adjusting your filters"
                : "Please select a batch to view students"}
            </p>
          </div>
        )}
      </div>

      {/* CARDS (visible below md) */}
      <div className="md:hidden space-y-4">
        {current.students?.length > 0 ? (
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
                  <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                    <ArrowUpRight className="h-4 w-4" />
                  </button>
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
                      <StyledCheckbox checked={student.status[m]} onChange={() => toggle(student.id, m)} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 text-center">
            <Users className="h-12 w-12 mx-auto text-gray-400 mb-3" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">No students found</h3>
            <p className="text-gray-600 dark:text-gray-400">
              {selectedBatch
                ? "Try selecting a different batch or adjusting your filters"
                : "Please select a batch to view students"}
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
        <span>+12% from last month</span>
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
        onChange={handleChange}
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
        {checked && !isLoading && (
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
        {isLoading && (
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        )}
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
