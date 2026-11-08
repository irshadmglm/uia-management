import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

const getTodayString = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const useTeacherAttendanceStore = create((set, get) => ({
  currentDate: getTodayString(),
  attendance: null,
  dayName: "",
  monthlySummary: null,
  isLoading: false,
  isSaving: false,
  filterStatus: "all", // "all" | "present" | "absent" | "substituted" | "unmarked"
  filterPeriod: "all",
  searchQuery: "",

  setCurrentDate: (date) => {
    set({ currentDate: date });
    get().fetchAttendance(date);
  },

  setFilterStatus: (status) => set({ filterStatus: status }),
  setFilterPeriod: (period) => set({ filterPeriod: period }),
  setSearchQuery: (query) => set({ searchQuery: query }),

  fetchAttendance: async (date) => {
    const targetDate = date || get().currentDate || getTodayString();
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get(`/management/teacher-attendance?date=${targetDate}`);
      if (res.data.success) {
        set({
          attendance: res.data.attendance,
          dayName: res.data.dayName,
          currentDate: targetDate,
        });
      }
    } catch (error) {
      console.error("Error fetching teacher attendance:", error);
      toast.error(error.response?.data?.message || "Failed to load teacher attendance.");
    } finally {
      set({ isLoading: false });
    }
  },

  updateSlot: async ({ recordId, status, attendedTeacherId, attendedTeacherName, remarks }) => {
    const { currentDate, attendance } = get();
    if (!currentDate || !recordId) return;

    // Optimistic local update
    if (attendance?.records) {
      const updatedRecords = attendance.records.map((r) => {
        if (r._id === recordId) {
          const nextSchedId = r.scheduledTeacherId?._id || r.scheduledTeacherId;
          const isDiff = attendedTeacherName !== undefined
            ? Boolean(attendedTeacherName.trim().toLowerCase() !== (r.scheduledTeacherName || "").trim().toLowerCase())
            : r.isSubstituted;

          return {
            ...r,
            status: status !== undefined ? status : r.status,
            attendedTeacherId: attendedTeacherId !== undefined ? attendedTeacherId : r.attendedTeacherId,
            attendedTeacherName: attendedTeacherName !== undefined ? attendedTeacherName : r.attendedTeacherName,
            isSubstituted: isDiff,
            remarks: remarks !== undefined ? remarks : r.remarks,
          };
        }
        return r;
      });

      set({ attendance: { ...attendance, records: updatedRecords } });
    }

    try {
      const res = await axiosInstance.patch("/management/teacher-attendance/slot", {
        dateString: currentDate,
        recordId,
        status,
        attendedTeacherId,
        attendedTeacherName,
        remarks,
      });

      if (res.data.success) {
        set({ attendance: res.data.attendance });
        toast.success("Attendance updated");
      }
    } catch (error) {
      console.error("Error updating attendance slot:", error);
      toast.error(error.response?.data?.message || "Failed to update attendance.");
      // Rollback by re-fetching
      get().fetchAttendance(currentDate);
    }
  },

  bulkMark: async (action, period = null) => {
    const { currentDate } = get();
    if (!currentDate) return;

    set({ isSaving: true });
    try {
      const res = await axiosInstance.post("/management/teacher-attendance/bulk-mark", {
        dateString: currentDate,
        action,
        period,
      });

      if (res.data.success) {
        set({ attendance: res.data.attendance });
        if (action === "mark_all_present") {
          toast.success("Marked all scheduled periods as Attended!");
        } else if (action === "mark_all_absent") {
          toast.success("Marked all scheduled periods as Absent.");
        } else if (action === "reset_defaults") {
          toast.success("Reset all attendance back to timetable defaults.");
        } else {
          toast.success("Bulk action completed.");
        }
      }
    } catch (error) {
      console.error("Error performing bulk mark:", error);
      toast.error(error.response?.data?.message || "Bulk action failed.");
    } finally {
      set({ isSaving: false });
    }
  },

  saveDay: async (records, notes = "") => {
    const { currentDate } = get();
    if (!currentDate) return;

    set({ isSaving: true });
    try {
      const res = await axiosInstance.post("/management/teacher-attendance/save-day", {
        dateString: currentDate,
        records,
        notes,
      });

      if (res.data.success) {
        set({ attendance: res.data.attendance });
        toast.success("Saved full day's attendance!");
      }
    } catch (error) {
      console.error("Error saving daily attendance:", error);
      toast.error(error.response?.data?.message || "Failed to save attendance.");
    } finally {
      set({ isSaving: false });
    }
  },

  fetchMonthlySummary: async (year, month) => {
    try {
      const res = await axiosInstance.get(
        `/management/teacher-attendance/monthly-summary?year=${year}&month=${month}`
      );
      if (res.data.success) {
        set({ monthlySummary: res.data });
      }
    } catch (error) {
      console.error("Error fetching monthly summary:", error);
    }
  },
}));

