import React, { useEffect, useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useStaffStore } from "../../store/useStaffStore";
import { useAdminStore } from "../../store/useAdminMngStore";
import { axiosInstance } from "../../lib/axios.js";
import { Loader2, Calendar, GripVertical, Save, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Saturday", "Sunday"];

// --- Styled Draggable Component ---
const DraggableTeacher = ({ name }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "teacher",
    item: { name },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`
        flex items-center gap-2 p-3 bg-white dark:bg-slate-700 rounded-xl shadow-sm border border-slate-200 dark:border-slate-600 
        cursor-grab active:cursor-grabbing hover:border-primary-500 hover:shadow-md transition-all
        ${isDragging ? "opacity-50 scale-95" : "opacity-100"}
      `}
    >
      <div className="p-1.5 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
        <GripVertical size={16} />
      </div>
      <span className="font-medium text-sm text-slate-700 dark:text-slate-200">{name}</span>
    </div>
  );
};

// --- Styled Drop Zone ---
const DroppableBox = ({ onDrop, assignedTeacher, onClear }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "teacher",
    drop: (item) => onDrop(item.name),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={drop}
      className={`
        relative h-20 rounded-xl border-2 border-dashed flex items-center justify-center transition-all duration-200
        ${isOver 
          ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 scale-105 shadow-lg z-10" 
          : assignedTeacher 
            ? "border-primary-200 dark:border-slate-600 bg-primary-50 dark:bg-slate-800" 
            : "border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30"}
      `}
    >
      {assignedTeacher ? (
        <div className="flex flex-col items-center group w-full h-full justify-center">
          <span className="text-xs font-bold text-primary-700 dark:text-primary-300 bg-white dark:bg-slate-700 px-3 py-1 rounded-full shadow-sm">
            {assignedTeacher}
          </span>
          <button 
            onClick={(e) => { e.stopPropagation(); onClear(); }}
            className="absolute top-1 right-1 p-1 text-rose-400 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ) : (
        <span className="text-xs text-slate-400 font-medium">Drop Here</span>
      )}
    </div>
  );
};

const TimetableAssignment = () => {
  const { getTeachers, teachers } = useStaffStore();
  const { getBatches, batches } = useAdminStore();
  const [day, setDay] = useState("Monday");
  const [grid, setGrid] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [periods] = useState(3); 

  useEffect(() => {
    const init = async () => {
      await Promise.all([getTeachers(), getBatches()]);
      await fetchTimetable();
    };
    init();
  }, []);

  useEffect(() => {
    if (batches.length > 0 && !grid[day]) {
      const defaultDayGrid = Array.from({ length: periods }, () =>
        Object.fromEntries(batches.map((b) => [b.name, null]))
      );
      setGrid((prev) => ({ ...prev, [day]: defaultDayGrid }));
    }
  }, [day, batches]);

  const fetchTimetable = async () => {
    try {
      const res = await axiosInstance.get("/mng/timetable");
      if (res.data.grid) setGrid(res.data.grid);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load timetable");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await axiosInstance.post("/mng/timetable", { grid });
      toast.success("Timetable saved successfully!");
    } catch (error) {
      toast.error("Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDrop = (targetDay, periodIndex, batchName, teacher) => {
    setGrid((prevGrid) => {
      const dayGrid = [...(prevGrid[targetDay] || [])];
      const periodRow = { ...dayGrid[periodIndex] };

      // Conflict Check: Is teacher already in this row?
      const isBusy = Object.values(periodRow).includes(teacher);
      if (isBusy) {
        toast.error(`${teacher} is already assigned in this period!`);
        return prevGrid;
      }

      periodRow[batchName] = teacher;
      dayGrid[periodIndex] = periodRow;
      return { ...prevGrid, [targetDay]: dayGrid };
    });
  };

  const handleClear = (targetDay, periodIndex, batchName) => {
    setGrid((prevGrid) => {
      const dayGrid = [...(prevGrid[targetDay] || [])];
      const periodRow = { ...dayGrid[periodIndex] };
      periodRow[batchName] = null;
      dayGrid[periodIndex] = periodRow;
      return { ...prevGrid, [targetDay]: dayGrid };
    });
  };

  if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin" /></div>;

  const currentGrid = grid[day] || [];

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="bg-slate-50 dark:bg-slate-900/50 rounded-3xl p-6 border border-slate-200 dark:border-slate-700">
        
        {/* Header Control */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="text-primary-500" /> Timetable Scheduler
            </h2>
            <p className="text-sm text-slate-500">Drag teachers to assign periods.</p>
          </div>

          <div className="flex bg-white dark:bg-slate-800 p-1 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-x-auto max-w-full">
            {weekdays.map((d) => (
              <button
                key={d}
                onClick={() => setDay(d)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap
                  ${day === d 
                    ? "bg-primary-600 text-white shadow-md" 
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700"}
                `}
              >
                {d}
              </button>
            ))}
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-70"
          >
            {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            Save Changes
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Teachers Sidebar */}
          <div className="lg:col-span-1 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 h-fit max-h-[600px] overflow-y-auto">
            <h3 className="font-bold text-slate-700 dark:text-slate-300 mb-4 px-2">Available Teachers</h3>
            <div className="space-y-2">
              {teachers.map((teacher) => (
                <DraggableTeacher key={teacher._id} name={teacher.name} />
              ))}
            </div>
          </div>

          {/* Grid Area */}
          <div className="lg:col-span-3 overflow-x-auto">
            <div className="min-w-[600px]">
              {/* Grid Header */}
              <div className="grid grid-flow-col auto-cols-fr gap-4 mb-4">
                <div className="w-16 flex items-center justify-center font-bold text-slate-400">#</div>
                {batches.map((batch) => (
                  <div key={batch.name} className="bg-slate-100 dark:bg-slate-800 p-3 rounded-xl text-center font-bold text-slate-700 dark:text-slate-200 shadow-sm border border-slate-200 dark:border-slate-700">
                    {batch.name}
                  </div>
                ))}
              </div>

              {/* Grid Rows */}
              <div className="space-y-4">
                {currentGrid.map((periodRow, periodIndex) => (
                  <div key={periodIndex} className="grid grid-flow-col auto-cols-fr gap-4 items-center">
                    {/* Period Label */}
                    <div className="w-16 h-12 flex items-center justify-center bg-white dark:bg-slate-800 rounded-full font-display font-bold text-lg text-primary-500 shadow-sm border border-slate-200 dark:border-slate-700">
                      {periodIndex + 1}
                    </div>

                    {/* Drop Slots */}
                    {batches.map((batch) => (
                      <DroppableBox
                        key={batch.name}
                        assignedTeacher={periodRow[batch.name]}
                        onDrop={(teacher) => handleDrop(day, periodIndex, batch.name, teacher)}
                        onClear={() => handleClear(day, periodIndex, batch.name)}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </DndProvider>
  );
};

export default TimetableAssignment;