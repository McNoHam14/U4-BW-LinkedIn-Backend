import mongoose from "mongoose";

const { Schema, model } = mongoose;

const postsSchema = new Schema(
  {
    text: { type: String, required: true },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    image: { type: String },
  },
  {
    timestamps: true,
  }
);

export default model("Post", postsSchema);
