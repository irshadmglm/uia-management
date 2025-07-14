import React, { useState, useEffect } from "react";
import Button from "../../components/Button";
import Input from "../../components/AdminInput";
import { FiPlus, FiSave, FiX, FiLoader, FiEdit, FiTrash2 } from "react-icons/fi";
import Header from "../../components/Header";
import { useParams } from "react-router-dom";
import { useAdminStore } from "../../store/useAdminMngStore";

const SemesterPage = () => {
  const { semesterId } = useParams();
  const [newSubject, setNewSubject] = useState({ name: "", mark: "", CEmark: "" });
  const [showAddCard, setShowAddCard] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [editedSubject, setEditedSubject] = useState(null);
  const [loading, setLoading] = useState(true);

  const { subjects, getSubjects, addSubject, deleteSubject, updateSubject, getSemesters, semesters } = useAdminStore();

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        await getSubjects(semesterId);
        await getSemesters();
      } catch (error) {
        console.error("Error fetching subjects:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSubjects();
  }, [semesterId, getSubjects, getSemesters]);



  const handleAddSubject = async () => {
    if (!newSubject.name || !newSubject.mark) return;
    try {
      await addSubject(semesterId, {
        name: newSubject.name.trim(),
        mark: newSubject.mark,
        CEmark: newSubject.CEmark === "true",
      });
      setNewSubject({ name: "", mark: "", CEmark: "" });
      setShowAddCard(false);
    } catch (error) {
      console.error("Error adding subject:", error);
    }
  };

  const handleDeleteSubject = async (id) => {
    try {
      await deleteSubject(id);
    } catch (error) {
      console.error("Error deleting subject:", error);
    }
  };

  const handleEditSubject = async (id) => {
    try {
      await updateSubject(id, editedSubject);
      setEditIndex(null);
      setEditedSubject(null);
    } catch (error) {
      console.error("Error updating subject:", error);
    }
  };

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
        <h1 className="text-xl font-bold mb-6 mt-12">
          Semester: {semesters?.find((s) => s._id === semesterId)?.name || "Unknown"}
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Add New Subject Card */}
          <div
            className={`flex flex-col justify-between border-2 border-dashed rounded-xl p-6 transition-colors duration-300 cursor-pointer ${
              showAddCard
                ? "border-blue-500 dark:border-blue-400"
                : "border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400"
            }`}
            onClick={() => setShowAddCard(true)}
          >
            {showAddCard ? (
              <div className="flex flex-col gap-4">
                <Input
                  placeholder="Subject name"
                  value={newSubject.name}
                  onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
                />
                <Input
                  placeholder="Subject mark"
                  type="number"
                  value={newSubject.mark}
                  onChange={(e) => setNewSubject({ ...newSubject, mark: e.target.value })}
                />
                <select
                  value={newSubject.CEmark}
                  onChange={(e) => setNewSubject({ ...newSubject, CEmark: e.target.value })}
                  className="input input-bordered p-2 rounded-md"
                >
                  <option value="">CE Mark</option>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
                <div className="flex justify-end gap-2">
                  <Button onClick={() => setShowAddCard(false)} className="hover:bg-gray-200 dark:hover:bg-gray-700">
                    <FiX />
                  </Button>
                  <Button onClick={handleAddSubject} className="bg-sky-700 text-white hover:bg-sky-800">
                    <FiSave />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center text-gray-500 dark:text-gray-300">
                <FiPlus className="w-8 h-8 mb-2" />
                <span className="font-medium">Add New Subject</span>
              </div>
            )}
          </div>

          {/* Subject Cards */}
          {subjects.map((subject, index) => (
            <div
              key={subject._id}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              {editIndex === index ? (
                <div className="flex flex-col gap-3">
                  <Input
                    value={editedSubject?.name || ""}
                    onChange={(e) =>
                      setEditedSubject((prev) => ({ ...prev, name: e.target.value }))
                    }
                  />
                  <Input
                    type="number"
                    value={editedSubject?.mark || ""}
                    onChange={(e) =>
                      setEditedSubject((prev) => ({ ...prev, mark: e.target.value }))
                    }
                  />
                  <select
                    value={editedSubject?.CEmark ? "true" : "false"}
                    onChange={(e) =>
                      setEditedSubject((prev) => ({
                        ...prev,
                        CEmark: e.target.value === "true",
                      }))
                    }
                    className="input input-bordered p-2 rounded-md"
                  >
                    <option value="true">CE: Yes</option>
                    <option value="false">CE: No</option>
                  </select>
                  <div className="flex justify-end gap-2">
                    <Button onClick={() => setEditIndex(null)} className="hover:bg-gray-200 dark:hover:bg-gray-700">
                      <FiX />
                    </Button>
                    <Button
                      onClick={() => handleEditSubject(subject._id)}
                      className="bg-green-600 text-white hover:bg-green-700"
                    >
                      <FiSave />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Name: {subject.name}</h3>
                  <p>Mark: {subject.mark}</p>
                  <p>CE Mark: {subject.CEmark ? "Yes" : "No"}</p>
                  <div className="flex justify-end gap-2 pt-2">
                    <Button
                      onClick={() => {
                        setEditIndex(index);
                        setEditedSubject(subject);
                      }}
                      className="hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <FiEdit />
                    </Button>
                    <Button
                      onClick={() => handleDeleteSubject(subject._id)}
                      className="bg-red-600 text-white hover:bg-red-700"
                    >
                      <FiTrash2 />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SemesterPage;
