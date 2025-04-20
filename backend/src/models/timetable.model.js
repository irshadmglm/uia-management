import mongoose from "mongoose";

const timetableSchema = new mongoose.Schema({
  grid: {
    Monday: [[String]],
    Tuesday: [[String]],
    Wednesday: [[String]],
    Thursday: [[String]],
    Friday: [[String]],
    Saturday: [[String]],
  },
});

export default mongoose.model("Timetable", timetableSchema);
