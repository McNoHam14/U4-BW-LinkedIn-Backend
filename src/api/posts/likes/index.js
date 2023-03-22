import express from "express";
import LikeModel from "./model.js";
import PostModel from "../model.js";
import mongoose from "mongoose";

const likesRouter = express.Router();

likesRouter.post("/:postId/like", async (req, res, next) => {
  try {
    const postBefore = await PostModel.findById(req.params.postId);
    const postAfter = await PostModel.findByIdAndUpdate(
      req.params.postId,
      { $addToSet: { likes: req.body.userId } },
      { new: true, upsert: true, runValidators: true }
    );

    if (postBefore.likes.toString() !== postAfter.likes.toString()) {
      const newLike = await LikeModel(req.body);
      newLike.postId = new mongoose.Types.ObjectId(req.params.postId);
      const { _id } = await newLike.save();
      res.status(201).send({ id: _id });
    } else {
      res.send(`Already Liked`);
    }
  } catch (error) {
    next(error);
  }
});

likesRouter.delete("/:likeId/like", async (req, res, next) => {
  try {
    const like = await LikeModel.findById(req.params.likeId);
    const userId = like.userId;

    await LikeModel.findByIdAndDelete(req.params.likeId);
    const post = await PostModel.findOne({ likes: userId });
    if (!post) {
      return res.status(404).send("Post not found");
    }
    await post.updateOne({ $pull: { likes: userId } });
    res.status(200).send(`Like deleted`);
  } catch (error) {
    next(error);
  }
});

export default likesRouter;
