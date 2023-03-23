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
      res.status(201).send(_id);
    } else {
      res.send(`Already Liked`);
    }
  } catch (error) {
    next(error);
  }
});

likesRouter.get("/:postId/like", async (req, res, next) => {
  try {
    let post = await PostModel.findById(req.params.postId);
    if (post) {
      res.status(200).send(post.likes);
    } else {
      res.send(`Post doesn't exist`);
    }
  } catch (error) {
    next(error);
  }
});

likesRouter.delete("/:postId/like/:userId", async (req, res, next) => {
  try {
    const like = await LikeModel.findOne({
      userId: req.params.userId,
      postId: req.params.postId,
    });
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
