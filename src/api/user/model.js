import mongoose from "mongoose";

const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    surname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    bio: { type: String },
    title: { type: String },
    area: { type: String },
    image: { type: String, default: "default-image-url-here" },
    comments: [{ type: Schema.Types.ObjectId, ref: "Comments" }],
  },
  {
    timestamps: true,
  }
);

userSchema.static("enableUserFilter", async function (query) {
  const users = await this.find(query.criteria, query.options.fields)
    .limit(query.options.limit)
    .skip(query.options.skip)
    .sort(query.options.sort);
  const total = await this.countDocuments(query.criteria);
  return { users, total };
});

export default model("User", userSchema);
