import React, { useEffect, useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useStaffStore } from "../../store/useStaffStore";
import { axiosInstance } from "../../lib/axios.js";

const periods = 3;
const batches = 5;
const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// Utility: create a default grid for one day.
const createDefaultDayGrid = () =>
  Array.from({ length: periods }, () => Array(batches).fill(null));

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
  const [day, setDay] = useState("Monday");
  // grid holds an object with keys for each weekday.
  const [grid, setGrid] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch teachers and timetable once on mount.
  useEffect(() => {
    getTeachers();
    fetchTimetable();
  }, []);

  // When switching days, initialize the grid for the day if it doesn't exist.
  useEffect(() => {
    setGrid((prevGrid) => {
      console.log("Current grid for", day, ":", prevGrid[day]);
      if (!prevGrid[day]) {
        return { ...prevGrid, [day]: createDefaultDayGrid() };
      }
      return prevGrid;
    });
  }, [day]);

  const fetchTimetable = async () => {
    try {
      const res = await axiosInstance.get("/mng/timetable");
      if (res.data.grid) {
        setGrid(res.data.grid);
      }
    } catch (error) {
      console.error("Error fetching timetable:", error);
      setError("Failed to fetch timetable. Please try again later.");
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

  // Modified handleDrop to accept the day as an argument.
  const handleDrop = (targetDay, row, col, teacher) => {
    setGrid((prevGrid) => {
      const dayTable = prevGrid[targetDay] || createDefaultDayGrid();
      
      // Check if the teacher is already assigned in this period (row)
      const isAlreadyAssigned = dayTable[row].includes(teacher);
      if (isAlreadyAssigned) {
        alert(`${teacher} is already assigned in this period!`);
        return prevGrid; // Don't change the grid
      }
  
      // Create a deep copy of the day's grid
      const newGrid = dayTable.map((r) => [...r]);
  
      // Assign the teacher to the selected cell
      newGrid[row][col] = teacher;
  
      const updatedGrid = { ...prevGrid, [targetDay]: newGrid };
      saveTimetable(updatedGrid);
      return updatedGrid;
    });
  };
  

  if (isLoading) return <p>Loading timetable...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  // Use the grid for the current day; if not available, create a default grid.
  const currentGrid = grid[day] || createDefaultDayGrid();

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="p-6 ml-10 mx-auto">
        <h1 className="text-2xl font-bold mb-4">Teacher Period Assignment</h1>
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
          <div className="flex flex-col gap-3 p-4 bg-gray-100 rounded-md shadow-md">
            <h2 className="font-semibold mb-2">Teachers</h2>
            {teachers.length > 0 ? (
              teachers.map((teacher) => (
                <DraggableTeacher key={teacher._id} name={teacher.name} />
              ))
            ) : (
              <p>No teachers available.</p>
            )}
          </div>
          <div className="overflow-auto">
            <table className="border-collapse border border-gray-300">
              <thead>
                <tr>
                  <th className="border border-gray-300 p-2">Period</th>
                  {Array.from({ length: batches }).map((_, i) => (
                    <th key={i} className="border border-gray-300 p-2">
                      Batch {i + 1}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentGrid.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    <td className="border border-gray-300 p-2 font-semibold">
                      Period {rowIndex + 1}
                    </td>
                    {row.map((teacher, colIndex) => (
                      <td key={colIndex} className="border border-gray-300 p-2">
                        <DroppableBox
                          // Force remount on day change by using a key that includes the day.
                          key={`${day}-${rowIndex}-${colIndex}`}
                          assignedTeacher={teacher}
                          onDrop={(name) =>
                            handleDrop(day, rowIndex, colIndex, name)
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
