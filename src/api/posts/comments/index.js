import express from "express";
import CommentsModel from "./model.js";
import PostModel from "../model.js";
import UserModel from "../../user/model.js";
import mongoose from "mongoose";

const commentsRouter = express.Router();

commentsRouter.post("/:postId/comments", async (req, res, next) => {
  try {
    const newComment = await CommentsModel(req.body);
    newComment.postId = new mongoose.Types.ObjectId(req.params.postId);
    const { _id } = await newComment.save();
    await PostModel.findByIdAndUpdate(
      req.params.postId,
      { $push: { comments: _id } },
      { new: true, upsert: true, runValidators: true }
    );
    await UserModel.findByIdAndUpdate(
      req.body.userId,
      { $push: { comments: _id } },
      { new: true, upsert: true, runValidators: true }
    );
    res.status(201).send({ id: _id });
  } catch (error) {
    next(error);
  }
});

commentsRouter.get("/:postId/comments", async (req, res, next) => {
  try {
    const allComments = await CommentsModel.find({ postId: req.params.postId });
    res.status(200).send(allComments);
  } catch (error) {
    next(error);
  }
});

commentsRouter.put("/:postId/comments/:commentId", async (req, res, next) => {
  try {
    const updatedComment = await CommentsModel.findByIdAndUpdate(
      req.params.commentId,
      req.body,
      { new: true, runValidators: true }
    );
    if (updatedComment) {
      res.status(200).send(updatedComment);
    } else {
      res.status(404).send(`Comment with that id doesn't exist`);
    }
  } catch (error) {
    next(error);
  }
});

commentsRouter.delete(
  "/:postId/comments/:commentId",
  async (req, res, next) => {
    const comment = await CommentsModel.findById(req.params.commentId);
    const userId = comment.userId;
    console.log(userId);
    try {
      const commentToDelete = await CommentsModel.findByIdAndDelete(
        req.params.commentId
      );
      await PostModel.findByIdAndUpdate(
        req.params.postId,
        { $pull: { comments: req.params.commentId } },
        { new: true, runValidators: true }
      );
      await UserModel.findByIdAndUpdate(
        userId,
        { $pull: { comments: req.params.commentId } },
        { new: true, runValidators: true }
      );
      if (commentToDelete) {
        res.status(200).send(`Comment deleted`);
      } else {
        res.status(404).send(`Comment with that id doesn't exist`);
      }
    } catch (error) {
      next(error);
    }
  }
);

export default commentsRouter;
