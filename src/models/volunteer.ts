import mongoose, { Schema, Document, Model } from "mongoose";

export interface IVolunteer extends Document {
  fullName: string;
  idNumber?: string;
  dateOfBirth?: string;
  phoneNumber: string;
  constituency?: string;
  ward: string;
  pollingStation: string;
  isOtherStation: boolean;
  volunteerRole?: string;
  isCommitted?: boolean;
  occupation?: string;
  educationLevel?: string;
  comment?: string;
  status: "verified" | "active" | "flagged";
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const VolunteerSchema = new Schema<IVolunteer>(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    idNumber: {
      type: String,
      trim: true,
      default: "",
      index: true,
    },
    dateOfBirth: {
      type: String,
      trim: true,
      default: "",
    },
    phoneNumber: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
      index: true,
    },
    constituency: {
      type: String,
      trim: true,
      default: "",
      index: true,
    },
    ward: {
      type: String,
      required: [true, "Ward is required"],
      enum: ["Port Reitz", "Kipevu", "Airport", "Changamwe", "Chaani", "Jomvu Kuu", "Mikindani", "Miritini", "Mjambere", "Junda", "Bamburi", "Mwakirunge", "Mtopanga", "Magogoni", "Shanzu", "Mtongwe", "Shika Adabu", "Bofu", "Likoni", "Timbwani", "Mji wa Kale/Makadara", "Tudor", "Tononoka", "Shimanzi/Ganjoni", "Majengo", "Frere Town", "Ziwa La Ng'ombe", "Mkomani", "Kongowea", "Kadzandani"],
      index: true,
    },
    pollingStation: {
      type: String,
      required: [true, "Polling station is required"],
      trim: true,
      index: true,
    },
    isOtherStation: {
      type: Boolean,
      default: false,
    },
    volunteerRole: {
      type: String,
      trim: true,
      default: "Mobilizer",
      maxlength: 100,
    },
    isCommitted: {
      type: Boolean,
      default: true,
    },
    occupation: {
      type: String,
      trim: true,
      maxlength: 120,
      default: "",
    },
    educationLevel: {
      type: String,
      trim: true,
      maxlength: 100,
      default: "",
    },
    comment: {
      type: String,
      maxlength: 1000,
      default: "",
    },
    status: {
      type: String,
      enum: ["verified", "active", "flagged"],
      default: "active",
      index: true,
    },
    notes: {
      type: String,
      maxlength: 500,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for unique volunteer phone prevention and fast query lookups
VolunteerSchema.index({ phoneNumber: 1 }, { unique: true });
VolunteerSchema.index({ phoneNumber: 1, ward: 1 });
VolunteerSchema.index({ constituency: 1, ward: 1 });
VolunteerSchema.index({ createdAt: -1 });

export const VolunteerModel: Model<IVolunteer> =
  mongoose.models.Volunteer ||
  mongoose.model<IVolunteer>("Volunteer", VolunteerSchema);
