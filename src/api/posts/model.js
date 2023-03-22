import mongoose from "mongoose";

const { Schema, model } = mongoose;

const postsSchema = new Schema(
  {
    text: { type: String, required: true },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    image: {
      type: String,
      default:
        "https://images.unsplash.com/photo-1585288766827-c62e98d70191?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80",
    },
    comments: [{ type: Schema.Types.ObjectId, ref: "Comments" }],
    likes: [{ type: Schema.Types.ObjectId, ref: "Likes" }],
  },
  {
    timestamps: true,
  }
);

postsSchema.static("enablePostFilter", async function (query) {
  const posts = await this.find(query.criteria, query.options.fields)
    .limit(query.options.limit)
    .skip(query.options.skip)
    .sort(query.options.sort)
    .populate({ path: "user", select: "name surname image" });
  const total = await this.countDocuments(query.criteria);
  return { posts, total };
});

export default model("Post", postsSchema);
