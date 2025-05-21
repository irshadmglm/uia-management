import mongoose from "mongoose";

const slotSchema = new mongoose.Schema(
  {},
  { strict: false, _id: false } // Allow dynamic keys like batch names
);

const timetableSchema = new mongoose.Schema({
  grid: {
    Monday: [slotSchema],
    Tuesday: [slotSchema],
    Wednesday: [slotSchema],
    Thursday: [slotSchema],
    Friday: [slotSchema],
    Saturday: [slotSchema],
  },
});

export default mongoose.model("Timetable", timetableSchema);
