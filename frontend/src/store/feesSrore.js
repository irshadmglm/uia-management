import { create } from 'zustand';
// Note: Ensure you have an 'axiosInstance' configured elsewhere in your project.
// For example, in 'src/lib/axios.js'
import { axiosInstance } from '../lib/axios'; 
// import toast from "react-hot-toast"; // Uncomment if you use react-hot-toast

export const useFeeStore = create((set, get) => ({
    fees: {}, // Cache for fetched data, e.g., { 'BATCH 09': [...] }
    isLoading: false,
    error: null,
    selectedBatch: 'BATCH 09', // Default selected batch

    // --- Constants ---
    monthNames: {
        'SHAW': 'Shawwal', 'DUL Q': "Dhu al-Qi'dah", 'DUL H': 'Dhu al-Hijjah', 
        'MUH': 'Muharram', 'SAF': 'Safar', 'RA A': "Rabi' al-Awwal", 
        'RA AK': "Rabi' al-Akhir", 'JUM U': 'Jumada al-Ula', 'JUM A': 'Jumada al-Akhirah', 
        'RAJ': 'Rajab', 'SHAH': "Sha'ban", 'RAML': 'Ramadan'
    },
    batchNames: ['BATCH 09', 'BATCH 10', 'BATCH 11', 'BATCH 12', 'BATCH 13', 'BATCH 14'],

    // --- Actions ---
    setSelectedBatch: (batchName) => {
        set({ selectedBatch: batchName });
    },

    /**
     * Fetches fee data for a specific batch from the API.
     */
    fetchFees: async (batchName) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axiosInstance.get(`/fees?batch_name=${batchName}`);
            const data = response.data;

            set(state => ({
                fees: { ...state.fees, [batchName]: data },
                isLoading: false
            }));
        } catch (error) {
            console.error("Failed to fetch fees:", error);
            const errorMessage = error.response?.data?.message || 'Failed to fetch student data.';
            set({ error: errorMessage, isLoading: false });
            // toast.error(errorMessage); // Uncomment for user notifications
        }
    },

    /**
     * Updates a student's entire fee record.
     * Uses an optimistic update approach for a better user experience.
     */
    updateFee: async (cicNumber, updatedStudentData) => {
      console.log('updated', updatedStudentData);
      
        const batchName = get().selectedBatch;
        const originalData = [...(get().fees[batchName] || [])];

        // 1. Optimistic UI Update: Update the state immediately.
        set(state => {
            const updatedBatchData = (state.fees[batchName] || []).map(student =>
                student.cicNumber === cicNumber ? updatedStudentData : student
            );
            return {
                fees: { ...state.fees, [batchName]: updatedBatchData }
            };
        });

        // 2. API Call: Persist the changes to the backend.
        try {
            await axiosInstance.put(`/fees/${cicNumber}?batch_name=${batchName}`, updatedStudentData);
            // toast.success('Student updated successfully!'); // Uncomment for user notifications
        } catch (error) {
            console.error("Failed to update student:", error);
            const errorMessage = error.response?.data?.message || 'Failed to save changes.';
            
            // 3. Revert on Failure: If the API call fails, revert the UI to its original state.
            set(state => ({
                error: errorMessage,
                fees: { ...state.fees, [batchName]: originalData }
            }));
            // toast.error(errorMessage); // Uncomment for user notifications
        }
    },
}));