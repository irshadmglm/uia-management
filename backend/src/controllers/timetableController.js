import Timetable from "../models/timetable.model.js";
import Batch from "../models/batch.model.js";

export const getTimetable = async (req, res) => {
  try {
    let timetable = await Timetable.findOne();
    let batch = await Batch.find();

    if (!timetable) {
      const weekdays = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"];
      const periodCount = 3;

      const createEmptySlot = () =>
        Object.fromEntries(batch.map((b) => [b.name, null]));

      const grid = {};

      weekdays.forEach((day) => {
        grid[day] = Array.from({ length: periodCount }, createEmptySlot);
      });

      timetable = new Timetable({ grid });
    }

    res.json(timetable);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const postTimetable = async (req, res) => {
  try {
    const { grid } = req.body;

    let timetable = await Timetable.findOne();

    if (timetable) {
      timetable.grid = grid;
      await timetable.save();
    } else {
      timetable = new Timetable({ grid });
      await timetable.save();
    }
    res.json({ message: "Timetable updated", timetable });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
