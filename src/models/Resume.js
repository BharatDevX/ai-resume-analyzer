import mongoose from 'mongoose';

const ResumeSchema = new mongoose.Schema({
    filename: { type: String, required: true},
    rawText: { type: String, required: true},
    extractedSkills: [String],
    experienceYears: { type: Number, default: 0},
    embedding: { type: [Number], required: true},
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.models.Resume || mongoose.model('Resume', ResumeSchema);
