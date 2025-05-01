import React, { useState, useEffect } from "react";
import Button from "../../components/Button";
import Input from "../../components/AdminInput";
import { FiPlus, FiSave, FiX, FiLoader } from "react-icons/fi";
import Header from "../../components/Header";
import { axiosInstance } from "../../lib/axios";
import { useParams } from "react-router-dom";

const SemesterPage = () => {
  let { semesterId } = useParams();
  const [subjects, setSubjects] = useState([]);
  const [newSubject, setNewSubject] = useState({});
  const [showAddCard, setShowAddCard] = useState(false);
  const [loading, setLoading] = useState(true); // Added loading state

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await axiosInstance.get(`mng/subjects/${semesterId}`);
        setSubjects(response.data);
      } catch (error) {
        console.error("Error fetching subjects:", error);
      } finally {
        setLoading(false); // Stop loading once the request completes
      }
    };
    fetchSubjects();
  }, [semesterId]);

  const handleAddSubject = async () => {
    if (newSubject.name && newSubject.mark) {
      try {
        const response = await axiosInstance.post(`mng/subjects/${semesterId}`, {
          name: newSubject.name.trim(), mark: newSubject.mark, CEmark: newSubject.CEmark
        });
        setSubjects((prevSubjects) => [...prevSubjects, response.data.newSubject]);
        setNewSubject({});
        setShowAddCard(false);
      } catch (error) {
        console.error("Error adding subject:", error);
      }
    }
  };

  // Display a loading spinner while data is being fetched
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-white dark:bg-gray-900">
        <FiLoader className="animate-spin text-blue-600 w-16 h-16" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
      <Header page="Subjects" />
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Subjects</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Add New Subject Card */}
          <div
            className={`flex items-center justify-center border-2 border-dashed rounded-xl p-6 transition-colors duration-300 cursor-pointer ${
              showAddCard
                ? "border-blue-500 dark:border-blue-400"
                : "border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400"
            }`}
            onClick={() => setShowAddCard(true)}
          >
            {showAddCard ? (
            <div className="w-full flex flex-col gap-4">
            {/* Input fields in one line */}
            <div className="flex flex-col gap-4">
              <Input
                autoFocus
                placeholder="Subject name"
                value={newSubject.name || ""} 
                onChange={(e) => setNewSubject((prev) => ({ 
                  ...prev, 
                  name: e.target.value 
                }))}
                className="w-1/2 p-3 rounded-lg border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Input
                placeholder="Subject mark"
                value={newSubject.mark || ""}  
                type="number"
                onChange={(e) => setNewSubject((prev) => ({ 
                  ...prev, 
                  mark: e.target.value 
                }))}
                className="w-1/2 p-3 rounded-lg border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
             <select
              value={newSubject.CEmark}
               className="input input-bordered w-full pl-10 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
               onChange={(e) =>
              setNewSubject((prev) => ({
               ...prev,
             CEmark: e.target.value === "true"
              }))
            }
              >
              <option value="">CE Mark</option>
              <option value="true">Yes</option>
             <option value="false">No</option>
              </select>

            </div>
          
            {/* Buttons aligned to the right */}
            <div className="flex justify-end gap-2">
              <Button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent the event from bubbling up
                  setShowAddCard(false);
                }}
                className="px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <FiX className="w-4 h-4" />
              </Button>
          
              <Button
                onClick={handleAddSubject}
                className="px-3 py-1.5  bg-sky-800 dark:bg-sky-600 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800"
              >
                <FiSave className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
            ) : (
              <div className="flex flex-col items-center text-gray-600 dark:text-gray-300">
                <FiPlus className="w-8 h-8 mb-2" />
                <span className="font-medium">Add New Subject</span>
              </div>
            )}
          </div>

          {/* Existing Subject Cards */}
          {subjects.length > 0 && subjects.length > 0 && subjects.map((subject, index) => (
            <div
              key={subject._id || index}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <h3 className=" font-semibold mb-2">Name:{subject.name}</h3>
              <p className=" font-semibold mb-2">Mark:{subject.mark}</p>
              <p className=" font-semibold mb-2">CE Mark:{subject.CEmark ? "Yes" : "No"}</p>
              {/* You can add more subject details or actions here */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SemesterPage;
