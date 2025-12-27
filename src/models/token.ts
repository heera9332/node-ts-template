import mongoose, { Schema, Model, Types } from "mongoose";

export interface IToken {
  token: string;
  userId: Types.ObjectId;
}

const tokenSchema = new Schema<IToken>(
  {
    token: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true },
);

const Token: Model<IToken> = mongoose.model<IToken>("Token", tokenSchema);
export default Token;