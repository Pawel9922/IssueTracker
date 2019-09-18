import mongoose from "mongoose";

export type IssueType = mongoose.Document & {
    title: string;
    description: string;
    status: number
    createdAt: Date,
    updatedAt: Date
}

const issueSchema = new mongoose.Schema({
    title: String,
    description: String,
    status: Number,
}, { timestamps: true });

export const Issue = mongoose.model<IssueType>("Issue", issueSchema);
