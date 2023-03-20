import express from "express";
import PostsModel from "./model.js";
import createHttpError from "http-errors";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";
import q2m from "query-to-mongo";

const postsRouter = express.Router();

const cloudinaryUploader = multer({
  storage: new CloudinaryStorage({
    cloudinary,
    params: {
      folder: "linkedIn/postImg",
    },
  }),
}).single("postImg");

postsRouter.get("/", async (req, res, next) => {
  try {
    const mongoQuery = q2m(req.query);
    const { posts, total } = await PostsModel.enablePostFilter(mongoQuery);
    res.send({
      links: mongoQuery.links(`${process.env.FE_PROD_URL}/posts`, total),
      total,
      numberOfPages: Math.ceil(total / mongoQuery.options.limit),
      posts,
    });
  } catch (error) {
    next(error);
  }
});

postsRouter.get("/:id", async (req, res, next) => {
  try {
    const post = await PostsModel.findById(req.params.id).populate({
      path: "user",
      select: "name surname image",
    });
    if (post) {
      res.send(post);
    } else {
      next(createHttpError(404, `Post with id ${req.params.id} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

postsRouter.post("/", async (req, res, next) => {
  try {
    const newPost = new PostsModel(req.body);
    const savedPost = await newPost.save();
    res.status(201).send("Post successfully published");
  } catch (error) {
    next(error);
  }
});

postsRouter.put("/:id", async (req, res, next) => {
  try {
    const updatedPost = await PostsModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (updatedPost) {
      res.status(201).send(updatedPost);
    } else {
      next(createHttpError(404, `post with id ${req.params.id} not found`));
    }
  } catch (error) {
    next(error);
  }
});

postsRouter.delete("/:id", async (req, res, next) => {
  try {
    const deletedPost = await PostsModel.findByIdAndDelete(req.params.id);
    if (deletedPost) {
      res.send(`Post with ID ${req.params.id} has been deleted`);
    } else {
      next(
        createHttpError(404, `Post with ID ${req.params.id} has not been found`)
      );
    }
  } catch (error) {
    next(error);
  }
});

postsRouter.post("/:id/image", cloudinaryUploader, async (req, res, next) => {
  try {
    const updatedPost = await PostsModel.findById(req.params.id);
    if (updatedPost) {
      updatedPost.image = req.file.path;
      await updatedPost.save();
      res.status(201).send(updatedPost.image);
    } else {
      next(createHttpError(404, "Post with this ID not found"));
    }
  } catch (error) {
    next(error);
  }
});

export default postsRouter;
