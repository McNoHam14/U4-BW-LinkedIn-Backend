import Express from "express";
import createHttpError from "http-errors";
import ExperienceModel from "./model.js";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";
import { Parser } from "json2csv";

const cloudStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "linkedin",
  },
});

const upload = multer({ storage: cloudStorage });

const experienceRouter = Express.Router();

experienceRouter.post("/:userId/experiences", async (req, res, next) => {
  try {
    req.body.user = req.params.userId;
    const newExperience = new ExperienceModel(req.body);
    const { _id } = await newExperience.save();
    res.status(201).send({ _id });
  } catch (error) {
    next(error);
  }
});

experienceRouter.get("/:userId/experiences", async (req, res, next) => {
  try {
    const experiences = await ExperienceModel.find({ user: req.params.userId });
    res.send(experiences);
  } catch (error) {
    next(error);
  }
});

experienceRouter.get("/:userId/experiences/CSV", async (req, res, next) => {
  const experiences = await ExperienceModel.find({ user: req.params.userId });
  const fields = [
    {
      label: "Role",
      value: "role",
    },
    {
      label: "Company",
      value: "company",
    },
    {
      label: "Start Date",
      value: "startDate",
    },
    {
      label: "End Date",
      value: "endDate",
    },
    {
      label: "Description",
      value: "description",
    },
    {
      label: "Area",
      value: "area",
    },
    {
      label: "image",
      value: "image",
    },
    {
      label: "User",
      value: "user",
    },
  ];
  const json2csv = new Parser({ fields });
  const csv = json2csv.parse(experiences);
  res.header("Content-Type", "text/csv");
  res.attachment("experiences.csv");
  return res.send(csv);
});

experienceRouter.get("/:userId/experiences/:expId", async (req, res, next) => {
  try {
    const experience = await ExperienceModel.findById(req.params.expId);
    if (experience) {
      res.send(experience);
    } else {
      next(
        createHttpError(404, `Experience with id ${req.params.expId} not found`)
      );
    }
  } catch (error) {
    next(error);
  }
});

experienceRouter.put("/:userId/experiences/:expId", async (req, res, next) => {
  const result = await ExperienceModel.findByIdAndUpdate(
    req.params.expId,
    req.body
  );
  console.log(result);
  const experience = await ExperienceModel.findById(req.params.expId);
  res.send(experience);
});

experienceRouter.delete(
  "/:userId/experiences/:expId",
  async (req, res, next) => {
    await ExperienceModel.findByIdAndDelete(req.params.expId);
    res.send("Experience deleted!");
  }
);

experienceRouter.post(
  "/:userId/experiences/:expId/image",
  upload.single("expImage"),
  async (req, res, next) => {
    const experience = await ExperienceModel.findById(req.params.expId);
    experience.image = req.file.path;
    await experience.save();
    res.send(experience);
  }
);

export default experienceRouter;
