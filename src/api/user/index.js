import Express from "express";
import q2m from "query-to-mongo";
import UserModel from "./model.js";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";

const userRouter = Express.Router();

userRouter.post("/", async (req, res, next) => {
  try {
    const newUser = await UserModel(req.body);
    const { _id } = await newUser.save();
    res.status(201).send({ id: _id });
  } catch (error) {
    next(error);
  }
});

userRouter.get("/", async (req, res, next) => {
  try {
    const mongoQuery = q2m(req.query);
    const { users, total } = await UserModel.enableUserFilter(mongoQuery);
    res.send({
      links: mongoQuery.links(`${process.env.FE_PROD_URL}/users`, total),
      total,
      numberOfPages: Math.ceil(total / mongoQuery.options.limit),
      users,
    });
  } catch (error) {
    next(error);
  }
});

userRouter.get("/:userId", async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.params.userId);
    if (user) {
      res.status(200).send(user);
    } else {
      res.status(404).send("User with that id doesn't exist");
    }
  } catch (error) {
    next(error);
  }
});

userRouter.put("/:userId", async (req, res, next) => {
  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      req.params.userId,
      req.body,
      { new: true, runValidators: true }
    );
    if (updatedUser) {
      res.status(200).send(updatedUser);
    } else {
      res.status(404).send("User with that id doesn't exist");
    }
  } catch (error) {
    next(error);
  }
});

userRouter.delete("/:userId", async (req, res, next) => {
  try {
    const userToDelete = await UserModel.findByIdAndDelete(req.params.userId);
    if (userToDelete) {
      res.status(200).send("user deleted");
    } else {
      res.status(404).send("User with that id doesn't exist");
    }
  } catch (error) {
    next(error);
  }
});

//--------------------------------------------- Image Upload ------------------------------------------------

const cloudinaryUploader = multer({
  storage: new CloudinaryStorage({
    cloudinary,
    params: {
      folder: "linkedIn/userImg",
    },
  }),
}).single("userImg");

userRouter.put(
  "/upload/:userId",
  cloudinaryUploader,
  async (req, res, next) => {
    try {
      const updatedUser = await UserModel.findByIdAndUpdate(
        req.params.userId,
        { image: req.file.path },
        { new: true, runValidators: true }
      );
      if (updatedUser) {
        res.send(updatedUser);
      } else {
        res.status(404).send("User with that id doesn't exist");
      }
    } catch (error) {
      next(error);
    }
  }
);

export default userRouter;
