import mongoose from "mongoose";

const configSchema = new mongoose.Schema(
    {
        period: {
            type: Number,
        },
    },
    { timestamps: true } 
);

export default mongoose.model("Config", configSchema);
