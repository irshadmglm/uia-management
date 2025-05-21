import React, { useEffect, useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useStaffStore } from "../../store/useStaffStore";
import { axiosInstance } from "../../lib/axios.js";
import InputField from "../../components/InputField.jsx";
import { SquareActivityIcon } from "lucide-react";
import { useAdminStore } from "../../store/useAdminMngStore.js";

const weekdays = [ "Saturday","Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"];;


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
      className={`p-2 bg-amber-400 text-white rounded-md shadow-md cursor-pointer ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      {name}
    </div>
  );
};

const DroppableBox = ({ onDrop, assignedTeacher }) => {
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
      className={`w-24 h-16 flex items-center justify-center border-2 rounded-md ${
        isOver ? "border-blue-500 bg-blue-100" : "border-gray-300"
      }`}
    >
      {assignedTeacher ? (
        <span className="text-sm font-semibold">{assignedTeacher}</span>
      ) : (
        ""
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
  const [error, setError] = useState(null);
  const [periods] = useState(3); // fixed to 3 as per the provided structure

  useEffect(() => {
    getTeachers();
    getBatches();
    fetchTimetable();
  }, []);

  useEffect(() => {
    if (!grid[day]) {
      const defaultDayGrid = Array.from({ length: periods }, () =>
        Object.fromEntries(batches.map((b) => [b.name, null]))
      );
      setGrid((prev) => ({ ...prev, [day]: defaultDayGrid }));
    }
  }, [day, batches]);

  const fetchTimetable = async () => {
    try {
      const res = await axiosInstance.get("/mng/timetable");
      if (res.data.grid) {
        setGrid(res.data.grid);
      }
    } catch (error) {
      console.error("Error fetching timetable:", error);
      setError("Failed to fetch timetable.");
    } finally {
      setIsLoading(false);
    }
  };

  const saveTimetable = async (updatedGrid) => {
    try {
      await axiosInstance.post("/mng/timetable", { grid: updatedGrid });
    } catch (error) {
      console.error("Error saving timetable:", error);
    }
  };

  const handleDrop = (targetDay, periodIndex, batchName, teacher) => {
    setGrid((prevGrid) => {
      const dayGrid = [...(prevGrid[targetDay] || [])];
      const periodRow = { ...dayGrid[periodIndex] };

      // Check if teacher already assigned in this period
      if (Object.values(periodRow).includes(teacher)) {
        alert(`${teacher} is already assigned in this period.`);
        return prevGrid;
      }

      periodRow[batchName] = teacher;
      dayGrid[periodIndex] = periodRow;

      const updatedGrid = { ...prevGrid, [targetDay]: dayGrid };
      saveTimetable(updatedGrid);
      return updatedGrid;
    });
  };

  if (isLoading) return <p>Loading timetable...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  const currentGrid = grid[day] || [];

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="p-6 ml-10 mx-auto">
        <h1 className="text-2xl font-bold mb-4">Period Assignment</h1>
        
        <div className="flex gap-4 ml-32 p-3">
          {weekdays.map((weekday) => (
            <button
              key={weekday}
              onClick={() => setDay(weekday)}
              className={`btn btn-outline btn-info ${
                day === weekday ? "bg-blue-500 text-black" : ""
              }`}
            >
              {weekday}
            </button>
          ))}
        </div>

        <div className="flex gap-6">
          {/* Teacher List */}
          <div className="flex flex-col gap-3 p-4 bg-gray-100 rounded-md shadow-md">
            <h2 className="font-semibold mb-2">Teachers</h2>
            {teachers.map((teacher) => (
              <DraggableTeacher key={teacher._id} name={teacher.name} />
            ))}
          </div>

          {/* Timetable Grid */}
          <div className="overflow-auto">
            <table className="border-collapse border border-gray-300">
              <thead>
                <tr>
                  <th className="border border-gray-300 p-2">Period</th>
                  {batches.map((batch) => (
                    <th key={batch.name} className="border border-gray-300 p-2">
                      {batch.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentGrid.map((periodRow, periodIndex) => (
                  <tr key={periodIndex}>
                    <td className="border border-gray-300 p-2 text-center font-bold">{periodIndex + 1}</td>
                    {batches.map((batch) => (
                      <td key={batch.name} className="border border-gray-300 p-2">
                        <DroppableBox
                          assignedTeacher={periodRow[batch.name]}
                          onDrop={(teacher) =>
                            handleDrop(day, periodIndex, batch.name, teacher)
                          }
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DndProvider>
  );
};


export default TimetableAssignment;
