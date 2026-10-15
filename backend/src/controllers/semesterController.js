import Semester from "../models/semester.model.js";
import ArtSemester from "../models/artsemester.model.js";

// ── Academic Semesters ────────────────────────────────────────────────────────

export const getSemesters = async (req, res) => {
  try {
    const semesters = await Semester.find();
    res.status(200).json(semesters);
  } catch (error) {
    console.error("Error fetching semesters:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const postSemester = async (req, res) => {
  try {
    const { name } = req.body;

    const isSemester = await Semester.findOne({ name });
    if (isSemester) {
      return res.status(400).json({ message: "This Semester already exists" });
    }

    const newSemester = new Semester({ name });
    await newSemester.save();

    res.status(201).json({ message: "Semester created successfully", newSemester });
  } catch (error) {
    console.error("Error creating Semester:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteSemester = async (req, res) => {
  try {
    const { semesterId } = req.params;

    const deletedSemester = await Semester.findByIdAndDelete(semesterId);
    if (!deletedSemester) {
      return res.status(404).json({ message: "Semester not found" });
    }

    res.status(200).json({ message: "Semester deleted successfully" });
  } catch (error) {
    console.error("Error deleting Semester:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateSemester = async (req, res) => {
  try {
    const { semesterId } = req.params;
    const { name } = req.body;

    const updatedSemester = await Semester.findByIdAndUpdate(
      semesterId,
      { name },
      { new: true }
    );

    if (!updatedSemester) {
      return res.status(404).json({ message: "Semester not found" });
    }

    res.status(200).json({ message: "Semester updated successfully", updatedSemester });
  } catch (error) {
    console.error("Error updating Semester:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ── Art Semesters (Unified with fallback & dual-write) ────────────────────────

export const getArtSems = async (req, res) => {
  try {
    // Primary: fetch from unified Semester collection (type: 'art')
    let artSems = await Semester.find({ type: "art" });
    if (!artSems || artSems.length === 0) {
      artSems = await ArtSemester.find();
    }
    res.status(200).json(artSems);
  } catch (error) {
    console.error("Error fetching art semesters:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const postArtSem = async (req, res) => {
  try {
    const { name } = req.body;

    const isartSemester = await Semester.findOne({ name, type: "art" });
    if (isartSemester) {
      return res.status(400).json({ message: "This Semester already exists" });
    }

    const newArtSem = new Semester({ name, type: "art" });
    await newArtSem.save();

    try {
      await ArtSemester.findByIdAndUpdate(
        newArtSem._id,
        { name: newArtSem.name },
        { upsert: true }
      );
    } catch (_) {}

    res.status(201).json({ message: "Semester created successfully", newArtSem });
  } catch (error) {
    console.error("Error creating Semester:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteArtSem = async (req, res) => {
  try {
    const { semesterId } = req.params;

    const deletedSemester = await Semester.findByIdAndDelete(semesterId);
    await ArtSemester.findByIdAndDelete(semesterId).catch(() => {});

    if (!deletedSemester) {
      return res.status(404).json({ message: "Semester not found" });
    }

    res.status(200).json({ message: "Semester deleted successfully" });
  } catch (error) {
    console.error("Error deleting Semester:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateArtSem = async (req, res) => {
  try {
    const { semesterId } = req.params;
    const { name } = req.body;

    const updatedSemester = await Semester.findByIdAndUpdate(
      semesterId,
      { name },
      { new: true }
    );
    await ArtSemester.findByIdAndUpdate(semesterId, { name }, { new: true }).catch(() => {});

    if (!updatedSemester) {
      return res.status(404).json({ message: "Semester not found" });
    }

    res.status(200).json({ message: "Semester updated successfully", updatedSemester });
  } catch (error) {
    console.error("Error updating Semester:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
