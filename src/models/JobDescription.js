import mongoose from "mongoose";

const JobDescriptionSchema = new mongoose.Schema({
  title: String,
  description: String,
  requiredSkills: [String],
  embedding: [Number],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.JobDescription ||
  mongoose.model("JobDescription", JobDescriptionSchema);
