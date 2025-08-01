import React, { useState, useEffect } from "react";
import { Plus, Save, X, Eye, Pencil, Trash2 } from "lucide-react";
import { useRecordStore } from "../../store/useRecordStore";
import Header from "../../components/Header";

const RecordPage = () => {
  const {
    records,
    fetchRecords,
    addRecord,
    updateRecord,
    deleteRecord,
    isLoading,
  } = useRecordStore();

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", description: "", folder: "", link: "" });
  const [editingId, setEditingId] = useState(null);
  const [activeTab, setActiveTab] = useState("all");


  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleEditClick = (record) => {
    setFormData({
      name: record.name || "",
      description: record.description || "",
      folder: record.folder || "",
      link: record.link || "",
    });
    setEditingId(record._id);
    setShowForm(true);
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      await deleteRecord(id);
      // fetchRecords();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (editingId) {
      await updateRecord(editingId, formData);
    } else {
      await addRecord(formData);
    }
    setFormData({ name: "", description: "", folder: "", link: "" });
    setEditingId(null);
    setShowForm(false);
    // fetchRecords();
  };

  const handleCancel = () => {
    setFormData({ name: "", description: "", folder: "", link: "" });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 dark:from-gray-900 dark:to-gray-800 p-3 pt-20">
        <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-4 ml-8 font-oswald">
          Academic Records
        </h2>

        <div className="p-2">
          {/* Add / Edit Card */}
          <div
            className={`group bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border-2 border-dashed mb-4 ${
              showForm
                ? "border-blue-500 dark:border-blue-400"
                : "border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 cursor-pointer"
            } max-w-md mx-auto`}
          >
            {showForm ? (
              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <input
                  autoFocus
                  placeholder="Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <textarea
                  placeholder="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <input
                  placeholder="Link"
                  name="link"
                  value={formData.link}
                  onChange={handleChange}
                  className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              <input
                  list="folder"
                  name="folder"
                  placeholder="Folder"
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <datalist id="folder">
                  {[...new Set(records.map((record) => record.folder))].map((folder, index) => (
                    <option key={index} value={folder} />
                  ))}
                </datalist>



                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                  >
                    <X size={16} /> Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 disabled:opacity-50"
                  >
                    <Save size={16} />
                    {editingId ? "Update" : "Add"}
                  </button>
                </div>
              </form>
            ) : (
              <div
                className="h-full flex flex-col items-center justify-center gap-2 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                onClick={() => {
                  setShowForm(true);
                  setEditingId(null);
                  setFormData({ name: "", description: "", link: "" });
                }}
              >
                <Plus className="w-6 h-6" />
                <span className="font-medium">Add New Record</span>
              </div>
            )}
          </div>

          {records.length > 0 && <FilterTab records={records} activeTab={activeTab} setActiveTab={setActiveTab} /> }
          
          {/* Records Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {records.length === 0 && (
              <p className="text-center text-gray-500 dark:text-gray-400 col-span-full">
                No records found.
              </p>
            )}
            {records.filter((record)=> activeTab === "all" || record?.folder === activeTab ).map((record, index) => (
              <div
                key={record._id || index}
                className="group bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col justify-between"
              >
                <div className="flex justify-between items-start mb-1">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 flex-shrink-0 rounded-full bg-sky-800 dark:bg-sky-600 text-white flex items-center justify-center font-bold text-lg">
                      {index + 1}
                    </div>
                    <div>
                      <h2 className="text-gray-900 dark:text-white text-lg font-medium">
                        {record.name}
                      </h2>
                      <p className="text-gray-900 dark:text-white text-xs font-medium">
                        {record?.folder}
                      </p>
                      {record.description && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {record.description}
                        </p>
                      )}
                      {record.link && (
                        <a
                          href={record.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 dark:text-blue-400 text-sm underline inline-flex items-center gap-1"
                        >
                          <Eye size={16} /> View
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEditClick(record)}
                      className="text-yellow-500 hover:text-yellow-600"
                      title="Edit Record"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(record._id)}
                      className="text-red-500 hover:text-red-600"
                      title="Delete Record"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default RecordPage;


const FilterTab = ({ records, activeTab, setActiveTab }) => {

  const folderCounts = records.reduce((acc, record) => {
    const folder = record.folder || "Unknown";
    acc[folder] = (acc[folder] || 0) + 1;
    return acc;
  }, {});

  const uniqueFolders = Object.entries(folderCounts); 

  return (
    <div className="w-full overflow-x-auto">
      <div className="flex w-max gap-2 px-4 py-2">
        {/* All Folder */}
        <button
          onClick={() => setActiveTab("all")}
          className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
            activeTab === "all"
              ? "bg-yellow-500 text-gray-900 shadow-md"
              : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-sky-100 dark:hover:bg-gray-700"
          }`}
        >
          All Folder
          <span className="px-2 py-1 rounded-full text-xs bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-200">
            {records.length}
          </span>
        </button>

        {/* Unique Folders */}
        {uniqueFolders.map(([folder, count]) => (
          <button
            key={folder}
            onClick={() => setActiveTab(folder)}
            className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
              activeTab === folder
                ? "bg-yellow-500 text-gray-900 shadow-md"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-gray-700"
            }`}
          >
            {folder}
            <span
              className={`px-2 py-1 rounded-full text-xs ${
                activeTab === folder
                  ? "bg-white/20 text-white"
                  : "bg-blue-100 text-blue-800 dark:bg-sky-900 dark:text-blue-200"
              }`}
            >
              {count}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};


