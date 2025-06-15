import React, { useEffect, useState } from "react";
import { Eye, Pencil, Plus, Trash2 } from "lucide-react"; // or use Heroicons if preferred
import Header from "../../components/Header";
import { useNavigate } from "react-router-dom";
import { useAdminStore } from "../../store/useAdminMngStore";

const BatchAcademicStatus = ({item}) => {
  const { batches, getBatches, addAcademicStatuslink, deleteAcademicStatuslink } = useAdminStore();
  const [academicStatusLink, setAcademicStatusLink] = useState("");
  const [editingBatchId, setEditingBatchId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    getBatches();
  }, [getBatches]);

  const handleSubmit = async (batchId) => {
    const isValidLink = academicStatusLink.includes("https://docs.google.com/spreadsheets");
    if (!isValidLink) return alert("Please enter a valid Google Sheets link.");

    try {
      await addAcademicStatuslink(academicStatusLink, batchId, item);
      await getBatches();
      setEditingBatchId(null);
      setAcademicStatusLink("");
    } catch (err) {
      console.error("Failed to update CE link", err);
    }
  };
  function onDelete(id){
    deleteAcademicStatuslink(id, item);
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 dark:from-gray-900 dark:to-gray-800 p-6 pt-24">
        <h2 className="text-xl font-extrabold text-gray-900 dark:text-white mb-4 ml-8 font-oswald">
          {item}
        </h2>

        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 px-2">
          {batches.map((batch, index) => (
            <div
              key={batch._id || index}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-3 transition hover:shadow-xl"
            >
           <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-sky-700 text-white flex items-center justify-center font-semibold">
                {index + 1}
                </div>
                <div className="text-lg font-semibold text-gray-800 dark:text-white">
                {batch.name}
                </div>
            </div>

            <div className="flex items-center gap-3">
                {!batch[item] ? (
                <button
                    onClick={() => {
                    setEditingBatchId(batch._id);
                    setAcademicStatusLink("");
                    }}
                    className="text-blue-600 hover:text-blue-800"
                    title="Add Link"
                >
                    <Plus size={20} />
                </button>
                ) : (
                <>
                    <button
                    onClick={() => {
                        onDelete(batch._id);
                    }}
                    className="text-red-500 hover:text-red-600"
                    title="Edit Link"
                    >
                    <Trash2 size={18} />
                    </button>
                    <button
                    onClick={() => {
                        setEditingBatchId(batch._id);
                        setAcademicStatusLink(batch[item] || "");
                    }}
                    className="text-yellow-500 hover:text-yellow-600"
                    title="Edit Link"
                    >
                    <Pencil size={18} />
                    </button>
                    <a
                    href={batch[item]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 hover:text-green-700"
                    title="View Link"
                    >
                    <Eye size={18} />
                    </a>
                </>
                )}
            </div>
            </div>


           

              {/* Input Field */}
              {editingBatchId === batch._id && (
                <div className="mt-4">
                  <input
                    type="text"
                    value={academicStatusLink}
                    onChange={(e) => setAcademicStatusLink(e.target.value)}
                    placeholder="Paste Google Sheet link"
                    className="w-full border rounded-lg px-3 py-2 text-sm dark:bg-gray-700 dark:text-white"
                  />
                  <div className="flex justify-end mt-2 gap-2">
                    <button
                      onClick={() => handleSubmit(batch._id)}
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditingBatchId(null);
                        setAcademicStatusLink("");
                      }}
                      className="text-sm text-gray-500 hover:text-gray-800"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};


export default BatchAcademicStatus