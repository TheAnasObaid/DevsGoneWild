import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcrypt";

export type Role = "developer" | "client" | "admin";

export interface UserDocument extends Document {
  name: string;
  email: string;
  password: string;
  role: Role;
  avatar?: string;
  bio?: string;
  createdAt: Date;
  updatedAt: Date;
  profile: {
    firstName: string;
    lastName: string;
    avatar: string;
    bio: string;
    skills: Array<string>;
    experience: string;
    portfolio: Array<Object>;
    socialLinks: Object;
  };
  reputation: {
    rating: number;
    totalRatings: number;
    completedChallenges: number;
  };
  isVerified: boolean;
  lastLogin: Date;
  comparePassword: (candidate: string) => Promise<boolean>;
}

const UserSchema = new Schema<UserDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ["developer", "client", "admin"],
      default: "developer",
    },
    avatar: { type: String },
    profile: {
      firstName: { type: String },
      lastName: { type: String },
      avatar: { type: String },
      bio: { type: String },
      skills: { type: [String] },
      experience: { type: String },
      portfolio: { type: [Object] },
      socialLinks: { type: Object },
    },
    reputation: {
      rating: { type: Number },
      totalRatings: { type: Number },
      completedChallenges: { type: Number },
    },
    isVerified: { type: Boolean },
    lastLogin: { type: Date },
  },
  {
    timestamps: true,
  }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.comparePassword = async function (candidate: string) {
  return bcrypt.compare(candidate, this.password);
};

const User = mongoose.model<UserDocument>("User", UserSchema);

export default User;
