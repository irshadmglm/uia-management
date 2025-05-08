import React, { useState, useEffect } from "react";
import Button from "../../components/Button";
import Input from "../../components/AdminInput";
import { FiSearch, FiPlus, FiEdit2, FiSave, FiX } from "react-icons/fi";
import { Navigate, useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import { useAdminStore } from "../../store/useAdminMngStore";

const ManagementPage = () => {
  const {updateSelectedTab, getBatches, getSemesters, getTeachers, batches, semesters, teachers} = useAdminStore();
  const [selectedTab, setSelectedTab] = useState("batches");
  const [searchTerm, setSearchTerm] = useState("");
  const [items, setItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [newItemValue, setNewItemValue] = useState("");
  const [showAddCard, setShowAddCard] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (selectedTab === "batches") {
      setItems(batches);
    } else if (selectedTab === "curriculum") {
      setItems(semesters);
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
  
        setItems((prevItems) => [...prevItems, { name: newItemName }]);
  
        setNewItemName("");
        setShowAddCard(false);
      } catch (error) {
        console.error("Error adding item:", error);
      }
    }
  };

  const handleUpdateItem = async (index) => {
    if (newItemValue.trim()) {
      try {
        const updatedValue = newItemValue.trim();

        const updatedItems = [...items];
        updatedItems[index] = updatedValue;
        setItems(updatedItems);

        if (selectedTab === "batches") {
          const updatedbatches = [...batches];
          updatedbatches[index] = updatedValue;
        } else if (selectedTab === "curriculum") {
          const updatedSubjects = [...semesters];
          updatedSubjects[index] = updatedValue;
        } else if (selectedTab === "teachers") {
          const updatedTeachers = [...teachers];
          updatedTeachers[index] = updatedValue;
        }
        setEditingItem(null);
        setNewItemValue("");
      } catch (error) {
        console.error("Error updating item:", error);
      }
    }
  };

  return (
    <div className=" mx-auto  min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
     
      <Header page={"Management"} />
     <div className="p-5 mt-16" >
     <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 ">
        <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700 w-full sm:w-auto">
          {["batches", "curriculum", "teachers"].map((tab) => (
            <Button
              key={tab}
              onClick={() => {
                setSelectedTab(tab);
                setShowAddCard(false);
                setEditingItem(null);
              }}
              className={`px-6 py-3 rounded-t-lg transition-all duration-300 font-medium ${
                selectedTab === tab
                  ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20"
                  : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-200"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <FiSearch className="absolute left-3 top-3.5 text-gray-400 dark:text-gray-500" />
          <Input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2.5 rounded-lg border-gray-300 dark:border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:focus:border-blue-400 dark:focus:ring-blue-400 w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
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
            // If items are objects, assume they have a "name" property
            (typeof item === "string" ? item : item.name)
              .toLowerCase()
              .includes(searchTerm.toLowerCase())
          )
          .map((item, index) => (
            <div
              key={index}
              className="group bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-300"
            >
                <div 
                  className="flex justify-between items-center" 
                  onClick={() => {
                    if (selectedTab === "batches") {
                      navigate(`/dashboard/admin/attendance/${item.name}`);
                    }else if( selectedTab === "curriculum"){
                      navigate(`/dashboard/admin/semester/${item._id}`)
                    }
                  }}>
                <div className="flex items-center">
                      <div className="w-10 h-10 flex-shrink-0 rounded-full  bg-sky-800 dark:bg-sky-600 text-white flex items-center justify-center font-bold text-lg mr-4">
                        { index + 1}
                      </div>
                      <div className="text-gray-900 dark:text-gray-200 text-lg font-medium font-sans">
                        {item.name}
                      </div>
                    </div>
                  <Button
                    className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors duration-300"
                    onClick={() => {
                      setEditingItem(index);
                      setNewItemValue(typeof item === "string" ? item : item.name);
                    }}
                  >
                    <FiEdit2 className="w-5 h-5" />
                  </Button>
                </div>
              
            </div>
          ))}
      </div>
     </div>
    </div>
  );
};

export default ManagementPage;
