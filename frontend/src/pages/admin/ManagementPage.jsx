import React, { useState, useEffect } from "react";
import Button from "../../components/Button";
import Input from "../../components/AdminInput";
import { FiSearch, FiPlus, FiEdit2, FiSave, FiX } from "react-icons/fi";
import { Navigate, useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import { useAdminStore } from "../../store/useAdminMngStore";

import { 
  FiBook, 
  FiUsers, 
  FiUser, 
  FiCheck, 
  FiInfo, 
  FiBookOpen,
  FiCalendar,
  FiUserCheck,
  FiAlertCircle,
  FiLoader,
  FiList
} from "react-icons/fi"
import { useStaffStore } from "../../store/useStaffStore";
import ConfirmPopup from "../../components/ConfirmPopup";
import { axiosInstance } from "../../lib/axios";
import { Trash } from "lucide-react";

const ManagementPage = () => {
  const {updateSelectedTab, getBatches, getSemesters, getTeachers, batches, semesters, teachers, deleteSemester, updateSemester, deleteBatch, updateBatch } = useAdminStore();
  const {deleteTeacher} = useStaffStore();
  const [selectedTab, setSelectedTab] = useState("current Semester");
  const [searchTerm, setSearchTerm] = useState("");
  const [items, setItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [newItemValue, setNewItemValue] = useState("");
  const [showAddCard, setShowAddCard] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
const [deleteAction, setDeleteAction] = useState(() => () => {});
  const navigate = useNavigate();

  useEffect(() => {
    if (selectedTab === "current Semester") {
      setItems(batches);
    } else if (selectedTab === "semester Subjects") {
      setItems(semesters);
    } else if (selectedTab === "batches") {
      setItems(batches);
    } else if (selectedTab === "teachers") {
      setItems(teachers);
    }
  }, [selectedTab, batches, semesters, teachers]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        getBatches();
        getSemesters();
        getTeachers();
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleAddItem = async () => {
    if (newItemName.trim()) {
      try {
        await updateSelectedTab(selectedTab, newItemName);
  
  
        setNewItemName("");
        setShowAddCard(false);
      } catch (error) {
        console.error("Error adding item:", error);
      }
    }
  };

  const handleDeleteItem = async (itemId, index) => {
    try {
      setDeleteAction(() => async () => {
        if (selectedTab === "batches") {
          await deleteBatch(itemId);
        } else if (selectedTab === "semester Subjects") {
          await deleteSemester(itemId);
        } else if (selectedTab === "teachers") {
          await deleteTeacher(itemId);
        }
      });
      setShowConfirm(true);
      setItems(prevItems => prevItems.filter((_, i) => i !== index));
  
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };
  
  const handleUpdateItem = async (itemId, index) => {
    const updatedValue = newItemValue.trim();
    if (!updatedValue) return;
  
    try {
      setItems(prevItems => {
        const newItems = [...prevItems];
        newItems[index] = updatedValue;
        return newItems;
      });
  
      if (selectedTab === "batches") {
        await updateBatch(itemId, updatedValue);
      } else if (selectedTab === "semester Subjects") {
        await updateSemester(itemId, updatedValue);
      } else if (selectedTab === "teachers") {
        // Assuming teachers are stored externally, do necessary update here if needed
      }
  
      setEditingItem(null);
      setNewItemValue("");
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };
  

  
  return (
    <div className=" mx-auto  min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
     
      <Header page={"Management"} />
     <div className="p-5 mt-16" >
     <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 ">
     <div className="w-full overflow-x-auto">
      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700 w-max sm:w-auto whitespace-nowrap">
        {["current Semester", "semester Subjects", "batches", "teachers"].map((tab) => (
          <Button
            key={tab}
            onClick={() => {
              setSelectedTab(tab);
              setShowAddCard(false);
              setEditingItem(null);
            }}
            className={`px-3 py-3 rounded-t-lg transition-all duration-300 font-medium ${
              selectedTab === tab
                ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20"
                : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-200"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </Button>
        ))}
      </div>
    </div>


    { selectedTab !== "current Semester" && ( <div className="relative w-full sm:w-72">
      <FiSearch className="absolute left-3 top-3.5 text-gray-400 dark:text-gray-500" />
      <Input
        type="text"
        placeholder="Search..."
        className="pl-10 pr-4 py-2.5 rounded-lg border-gray-300 dark:border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:focus:border-blue-400 dark:focus:ring-blue-400 w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>)}
      </div>
        {selectedTab === "current Semester" ? ( <SemesterAssignment batches={batches} semesters={semesters} />)
        : (<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {/* Add New Card */}
          <div
            className={`group bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border-2 border-dashed ${
              showAddCard
                ? "border-blue-500 dark:border-blue-400"
                : "border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 cursor-pointer transition-colors duration-300"
            }`}
          >
                        {showAddCard ? (
                selectedTab === "teachers" ? (
                  <Navigate to="/dashboard/admin/signup" />
                ) : (
                  <div className="flex flex-col gap-3">
                    <Input
                      autoFocus
                      placeholder={`New ${selectedTab.slice(0, -1)} name`}
                      value={newItemName}
                      onChange={(e) => setNewItemName(e.target.value)}
                      className="w-full p-2 rounded-lg border-gray-300 dark:border-gray-600 "
                    />
                    <div className="flex justify-end gap-2">
                      <Button
                        onClick={() => setShowAddCard(false)}
                        className="px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <FiX className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={handleAddItem}
                        className="px-3 py-1.5 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600"
                      >
                        <FiSave className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )
              ) : (
                <div
                  className="h-full flex flex-col items-center justify-center gap-2 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                  onClick={() => setShowAddCard(true)}
                >
                  <FiPlus className="w-6 h-6" />
                  <span className="font-medium">Add New</span>
                </div>
              )}
  
          </div>
  
          {/* Existing Items */}
          {items
  .filter((item) =>
    (typeof item === "string" ? item : item.name)
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  )
  .map((item, index) => {
    const isEditing = editingItem === index;
    const itemName = typeof item === "string" ? item : item.name;

    return (
      <div
        key={index}
        className="group bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-300"
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 flex-shrink-0 rounded-full bg-sky-800 dark:bg-sky-600 text-white flex items-center justify-center font-bold text-lg">
              {index + 1}
            </div>

            {isEditing ? (
              <input
                type="text"
                value={newItemValue}
                onChange={(e) => setNewItemValue(e.target.value)}
                className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <div
                className="text-gray-900 dark:text-gray-200 text-lg font-medium font-sans cursor-pointer"
                onClick={() => {
                  if (selectedTab === "batches") {
                    navigate(`/dashboard/admin/attendance/${itemName}`);
                  } else if (selectedTab === "semester Subjects") {
                    navigate(`/dashboard/admin/semester/${item._id}`);
                  }
                }}
              >
                {itemName}
              </div>
            )}
          </div>

          <div className="flex">
            {isEditing ? (
              <Button
                onClick={() => handleUpdateItem(item._id, index)}
                className="text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30  rounded"
              >
                <FiSave />
              </Button>
            ) : (
              <Button
              onClick={() => {
                if (selectedTab === "teachers") {
                  navigate(`/dashboard/admin/staff-edit/${item._id}`);
                } else {
                  setEditingItem(index);
                  setNewItemValue(itemName);
                }
              }}
              
                className="text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded"
              >
                <FiEdit2 />
              </Button>
            )}

            <Button
              onClick={() => handleDeleteItem(item._id, index)}
              className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30  rounded"
            >
              <Trash size={18} />
            </Button>
            <ConfirmPopup
                isOpen={showConfirm}
                onClose={() => setShowConfirm(false)}
                onConfirm={deleteAction}
                message={`Are you sure you want to delete this ${selectedTab}?`}
              />
          </div>
        </div>
      </div>
    );
  })}

        </div>)
        }
      
     </div>
    </div>
  );
};
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
    console.log(classId, semesterId);
    
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

export default ManagementPage;
