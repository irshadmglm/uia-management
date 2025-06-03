const ConfirmPopup = ({ isOpen, onClose, onConfirm, title = "Confirm", message }) => {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 w-[90%] max-w-sm">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{title}</h3>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{message}</p>
          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  export default ConfirmPopup;
  