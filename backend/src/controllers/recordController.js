import Record from "../models/records.model.js";

export const addRecord = async (req, res) => {
  try {
    const { name, description, folder, link } = req.body;
    
    const newRecord = new Record({ name, description, folder, link });
    const savedRecord = await newRecord.save();
    res.status(201).json(savedRecord);
  } catch (error) {
    res.status(500).json({ error: "Failed to add record", details: error.message });
  }
};

export const getRecords = async (req, res) => {
  try {
    const records = await Record.find().sort({ createdAt: -1 });
    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch records", details: error.message });
  }
};

export const editRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, folder, link } = req.body;

    const updatedRecord = await Record.findByIdAndUpdate(
      id,
      { name, description, folder, link },
      { new: true, runValidators: true }
    );

    if (!updatedRecord) {
      return res.status(404).json({ error: "Record not found" });
    }

    res.status(200).json(updatedRecord);
  } catch (error) {
    res.status(500).json({ error: "Failed to update record", details: error.message });
  }
};

export const deleteRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedRecord = await Record.findByIdAndDelete(id);

    if (!deletedRecord) {
      return res.status(404).json({ error: "Record not found" });
    }

    res.status(200).json({ message: "Record deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete record", details: error.message });
  }
};
