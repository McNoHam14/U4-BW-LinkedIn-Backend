import mongoose from "mongoose";
const { Schema, model } = mongoose;

const experiencesSchema = new Schema(
  {
    // "_id": "5d925e677360c41e0046d1f5",  //server generated
    role: { type: String, required: true },
    company: { type: String, required: true },
    startDate: { type: String, required: true },
    endDate: { type: String }, //could be null
    description: { type: String, required: true },
    area: { type: String, required: true },
    // "createdAt": "2019-09-30T19:58:31.019Z",  //server generated
    // "updatedAt": "2019-09-30T19:58:31.019Z",  //server generated
    // "image": "https://picsum.photos/200/300"... //server generated on upload, set a default here
  },
  {
    timestamps: true,
  }
);

export default model("Experience", experiencesSchema);
