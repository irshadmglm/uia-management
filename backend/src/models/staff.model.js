import mongoose from "mongoose";

const staffSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        userName: {
            type: String,
            required: true,
            trim: true,
        },
        phoneNumber: {
            type: String,
            trim: true,
        },
        password: {
            type: String,
            required: true,
        },  
        role: {
            type: String,
            enum: ["teacher", "admin"],
        },
        profileImage: {
            type: String,
            default: '',
          },
        subjects: [
            {
              type: mongoose.Schema.Types.ObjectId,
              ref: "Subject",
            },
          ],
    },
    { timestamps: true } 
);

export default mongoose.model("Staff", staffSchema);
