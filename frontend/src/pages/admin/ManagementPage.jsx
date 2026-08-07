import React, { useState, useEffect } from "react";
import Button from "../../components/Button";
import Input from "../../components/AdminInput";
import { FiSearch, FiPlus, FiEdit2, FiSave, FiX } from "react-icons/fi";
import { Navigate, useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import { useAdminStore } from "../../store/useAdminMngStore";
import CustomSelect from '../../components/CustomSelect';
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
  const { getBatches, getSemesters, getTeachers, getArtSems,
          batches, semesters, teachers, artSems, 
          updateSemester,  updateBatch, updateSelectedTab, updateArtSem,
          deleteBatch, deleteSemester,  deleteArtSems,} = useAdminStore();
  const {deleteTeacher} = useStaffStore();
    const [selectedTab, setSelectedTab] = useState(() => {
    return localStorage.getItem("selectedTab") || "current Semester";
  });
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
    localStorage.setItem("selectedTab", selectedTab);
  }, [selectedTab]);

  useEffect(() => {
    if (selectedTab === "current Semester") {
      setItems(batches);
    } else if (selectedTab === "semester Subjects") {
      setItems(semesters);
    } else if (selectedTab === "arts Subjects") {
      setItems(artSems);
    } else if (selectedTab === "batches") {
      setItems(batches);
    } else if (selectedTab === "teachers") {
      setItems(teachers);
    }
  }, [selectedTab, batches, semesters, teachers, artSems]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        getBatches();
        getSemesters();
        getArtSems();
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
        }  else if (selectedTab === "arts Subjects") {
          await deleteArtSems(itemId);
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
      } else if (selectedTab === "arts Subjects") {
        await updateArtSem(itemId, updatedValue);
      } 
  
      setEditingItem(null);
      setNewItemValue("");
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };
  

  
  return (
    <div className="mx-auto transition-colors duration-300">
     
      <header className="sticky top-0 z-30 bg-[#f3f7f6]/95 dark:bg-[#0d2522]/95 backdrop-blur-md py-3 -mx-3 px-3 sm:-mx-5 sm:px-5 lg:-mx-10 lg:px-10 mb-6 border-b border-gray-200/50 dark:border-[#0d2522] shadow-sm dark:shadow-none">
        <div className="relative overflow-x-auto scrollbar-hide">
          <div className="flex w-max min-w-full p-1.5 bg-white dark:bg-[#11322f] rounded-xl shadow-sm border border-gray-100 dark:border-transparent gap-1">
            {["current Semester", "current Art Sems", "semester Subjects", "arts Subjects", "batches", "teachers"].map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setSelectedTab(tab);
                  setShowAddCard(false);
                  setEditingItem(null);
                }}
                className={`flex-shrink-0 px-3 py-2.5 rounded-lg font-medium text-xs sm:text-sm flex justify-center items-center gap-2 transition-all duration-300 group whitespace-nowrap
                  ${
                    selectedTab === tab
                      ? "bg-brand-teal text-white shadow-md"
                      : "text-gray-600 dark:text-gray-400 hover:text-brand-teal dark:hover:text-brand-mint hover:bg-gray-50 dark:hover:bg-[#153e3a]"
                  }`}
              >
                <span>{tab.charAt(0).toUpperCase() + tab.slice(1)}</span>
              </button>
            ))}
          </div>
        </div>
      </header>

     <div className="pt-2">
      {selectedTab !== "current Semester" && selectedTab !== "current Art Sems" && (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 w-full">
          <div className="w-full md:w-1/4 max-w-xs">
            <CustomSelect
              className="w-full border-0 bg-white dark:bg-[#11322f] shadow-sm rounded-xl py-3 px-4 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-brand-teal"
            >
              <option value="all">All Items</option>
              <option value="recent">Recently Added</option>
            </CustomSelect>
          </div>
          <div className="relative w-full md:flex-1">
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search..."
            />
          </div>
        </div>
      )}
        {selectedTab === "current Semester" ? ( <SemesterAssignment batches={batches} semesters={semesters} tab={selectedTab} />)
        : selectedTab === "current Art Sems" ? ( <SemesterAssignment batches={batches} semesters={artSems} tab={selectedTab}  art={true} />) 
        : (<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {/* Add New Card */}
          <div
            className={`group bg-white dark:bg-[#11322f] p-4 rounded-2xl shadow-sm border-2 border-dashed ${
              showAddCard
                ? "border-brand-teal dark:border-brand-mint"
                : "border-gray-200 dark:border-gray-700 hover:border-brand-teal dark:hover:border-brand-mint cursor-pointer transition-colors duration-300"
            }`}
          >
                        {showAddCard ? (
                selectedTab === "teachers" ? (
                  <Navigate to="/dashboard/admin/signup" />
                ) : (
                  <div className="flex flex-col gap-3 h-full justify-center">
                    <Input
                      autoFocus
                      placeholder={`New ${selectedTab.slice(0, -1)} name`}
                      value={newItemName}
                      onChange={(e) => setNewItemName(e.target.value)}
                      className="w-full p-2.5 rounded-xl border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-[#0d2522] focus:ring-2 focus:ring-brand-teal"
                    />
                    <div className="flex justify-end gap-2 mt-2">
                      <Button
                        onClick={(e) => { e.stopPropagation(); setShowAddCard(false); }}
                        className="px-3 py-1.5 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-[#0d2522] dark:hover:text-gray-300"
                      >
                        <FiX className="w-5 h-5" />
                      </Button>
                      <Button
                        onClick={(e) => { e.stopPropagation(); handleAddItem(); }}
                        className="px-3 py-1.5 bg-brand-teal text-white rounded-lg hover:bg-brand-teal/90 shadow-sm"
                      >
                        <FiSave className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                )
              ) : (
                <div
                  className="h-full min-h-[100px] flex flex-col items-center justify-center gap-2 text-gray-500 dark:text-gray-400 group-hover:text-brand-teal dark:group-hover:text-brand-mint transition-colors duration-300"
                  onClick={() => setShowAddCard(true)}
                >
                  <FiPlus className="w-8 h-8 opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300" />
                  <span className="font-medium text-sm tracking-wide">Add New</span>
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
        className="group bg-white dark:bg-[#11322f] p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-[#0d2522] hover:shadow-md hover:border-brand-teal/30 transition-all duration-300"
      >
        <div className="flex justify-between items-center h-full">
          <div className="flex items-center gap-4 flex-1">
            <div className="w-12 h-12 flex-shrink-0 rounded-xl bg-brand-mint/10 dark:bg-[#0d2522] text-brand-teal dark:text-brand-mint flex items-center justify-center font-bold text-lg group-hover:scale-105 transition-transform duration-300">
              {index + 1}
            </div>

            {isEditing ? (
              <input
                type="text"
                value={newItemValue}
                onChange={(e) => setNewItemValue(e.target.value)}
                className="bg-gray-50 dark:bg-[#0d2522] text-gray-900 dark:text-white rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-brand-teal border border-transparent focus:border-brand-teal"
              />
            ) : (
              <div
                className="text-gray-800 dark:text-gray-100 text-lg font-semibold cursor-pointer hover:text-brand-teal dark:hover:text-brand-mint transition-colors"
                onClick={() => {
                  if (selectedTab === "batches") {
                    navigate(`/dashboard/admin/attendance/${item._id}`);
                  } else if (selectedTab === "semester Subjects") {
                    navigate(`/dashboard/admin/semester/${item._id}`);
                  } else if (selectedTab === "arts Subjects") {
                    navigate(`/dashboard/admin/arts/${item._id}`);
                  } else if (selectedTab === "teachers") {
                    navigate(`/dashboard/admin/teacher-subjects/${item._id}`);
                  }
                }}
              >
                {itemName}
              </div>
            )}
          </div>

          <div className="flex items-center gap-1 ml-4">
            {isEditing ? (
              <Button
                onClick={() => handleUpdateItem(item._id, index)}
                className="text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 p-2 rounded-lg transition-colors"
              >
                <FiSave className="w-5 h-5" />
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
              
                className="text-sky-600 hover:bg-sky-50 dark:hover:bg-sky-900/20 p-2 rounded-lg transition-colors"
              >
                <FiEdit2 className="w-5 h-5" />
              </Button>
            )}

            <Button
              onClick={() => handleDeleteItem(item._id, index)}
              className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-lg transition-colors"
            >
              <Trash className="w-5 h-5" />
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
  <div className="bg-white dark:bg-[#11322f] rounded-2xl shadow-sm border border-gray-100 dark:border-[#0d2522] p-12 text-center max-w-md mx-auto my-8">
    <div className="bg-brand-mint/10 dark:bg-[#0d2522] w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
      <FiAlertCircle className="w-12 h-12 text-brand-teal/50 dark:text-brand-mint/50" />
    </div>
    <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">No items found</h3>
    <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">
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
      className="pl-12 pr-10 py-3 w-full rounded-xl border-0 shadow-sm bg-white dark:bg-[#11322f] text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-teal transition-all duration-200"
    />
    {value && (
      <button 
        onClick={() => onChange("")}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-brand-teal transition-colors"
      >
        <FiX className="w-4 h-4" />
      </button>
    )}
  </div>
)
function SemesterAssignment({batches, semesters, tab, art = false}) {
  const [batchAssignments, setBatchAssignments] = useState({})
  const [message, setMessage] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [editMode, setEditMode] = useState({})

  useEffect(() => {
    const modified = {}
    for (const cl of batches) {
      if(art){
      modified[cl._id] = cl.currentArtSemester || ""
      }else{
      modified[cl._id] = cl.currentSemester || ""
      }
    }
    setBatchAssignments(modified)
  }, [batches, tab])

  const handleSemesterSelect = async (classId, semesterId) => {
    
    try {
      setBatchAssignments((prev) => ({
        ...prev,
        [classId]: semesterId,
      }))

      await axiosInstance.post("/mng/asign-semester", {
        classId,
        semesterId,
        art
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 w-full">
        <div className="w-full md:w-1/4 max-w-xs">
          <CustomSelect
            className="w-full border-0 bg-white dark:bg-[#11322f] shadow-sm rounded-xl py-3 px-4 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-brand-teal"
          >
            <option value="all">All Items</option>
            <option value="recent">Recently Added</option>
          </CustomSelect>
        </div>
        <div className="relative w-full md:flex-1">
          <SearchBar 
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search batches..."
          />
        </div>
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
                    className="w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md px-3 py-2 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="" disabled>Select Semester...</option>
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

export default ManagementPage;
