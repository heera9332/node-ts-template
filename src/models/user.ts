
import { SaveOptions, Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import { CallbackWithoutResultAndOptionalError } from "mongoose";

export interface IUser {
  username: string;
  email: string;
  password: string;
  role: "admin" | "user";
  firstName?: string;
  lastName?: string;
  socialLinks?: {
    website?: string;
    facebook?: string;
    instagram?: string;
    x?: string;
    youtube?: string;
  };
}

// user schema

const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      maxlength: [20, "Username must be less than 20 characters"],
      unique: [true, "Username must be unique"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      maxlength: [50, "Email must be less than 50 characters"],
      unique: [true, "Email must be unique"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      select: false,
    },
    role: {
      type: String,
      required: [true, "Role is required"],
      enum: {
        values: ["admin", "user"],
        message: "{VALUE} is not supported",
      },
      default: "user",
    },
    firstName: {
      type: String,
      maxlength: [20, "First name must be less 20 characters"],
    },
    lastName: {
      type: String,
      maxlength: [20, "Last name must be less than 20 characters"],
    },
    socialLinks: {
      website: {
        type: String,
        maxlength: [100, "Website url must be less than 100 characters"],
      },
      instagram: {
        type: String,
        maxlength: [100, "Instagram url must be less than 100 characters"],
      },
      x: {
        type: String,
        maxlength: [100, "X url must be less than 100 characters"],
      },
      facebook: {
        type: String,
        maxlength: [100, "Facebook url must be less than 100 characters"],
      },
      youtube: {
        type: String,
        maxlength: [100, "Youtube url must be less than 100 characters"],
      },
    },
  },
  { timestamps: true },
);

userSchema.pre("save", async function () {
  // If password isn't modified, just return (this 'completes' the middleware)
  if (!this.isModified("password")) {
    return; 
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error) {
    // If you need to "pass an error" to next, just throw it
    throw error;
  }
});

const User =  model<IUser>('User', userSchema);
export default User;