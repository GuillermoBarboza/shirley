import mongoose, { Schema, Document, Types } from "mongoose";

export type Accent = "olive" | "gold";

export interface IExperience {
    _id?: Types.ObjectId;
    kicker: string;
    title: string;
    quote: string;
    place: string;
    description: string;
    steps: string[];
    note: string;
    accent: Accent;
    visible: boolean;
    photoUrl?: string | null;
    photoWebUrl?: string | null;
}

export interface IExperiencesIntro {
    eyebrow: string;
    title: string;
    lede: string;
}

export interface IExperiencesPage extends Document {
    intro: IExperiencesIntro;
    experiences: IExperience[];
}

const ExperienceSchema = new Schema<IExperience>({
    kicker: { type: String, default: "" },
    title: { type: String, required: true },
    quote: { type: String, default: "" },
    place: { type: String, default: "" },
    description: { type: String, default: "" },
    steps: { type: [String], default: [] },
    note: { type: String, default: "" },
    accent: { type: String, enum: ["olive", "gold"], default: "olive" },
    visible: { type: Boolean, default: true },
    photoUrl: { type: String, required: false },
    photoWebUrl: { type: String, required: false },
});

// Singleton, like ContactInfo: the whole /experiencias page in one document,
// so experience order is simply array order.
const ExperiencesPageSchema = new Schema<IExperiencesPage>({
    intro: {
        eyebrow: { type: String, default: "" },
        title: { type: String, default: "" },
        lede: { type: String, default: "" },
    },
    experiences: { type: [ExperienceSchema], default: [] },
});

const ExperiencesPage = mongoose.model<IExperiencesPage>(
    "ExperiencesPage",
    ExperiencesPageSchema
);

export default ExperiencesPage;
