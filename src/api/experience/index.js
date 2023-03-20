import Express from "express";
import ExperienceModel from "./model.js";

const experienceRouter = Express.Router();

experienceRouter.post("/:userId/experiences", async (req, res, next) => {
  try {
    const newExperience = new ExperienceModel(req.body);
    const { _id } = await newExperience.save();
    res.status(201).send({ _id });
  } catch (error) {
    next(error);
  }
});

experienceRouter.get("/:userId/experiences", async (req, res, next) => {});

experienceRouter.get(
  "/:userId/experiences/:expId",
  async (req, res, next) => {}
);

experienceRouter.put(
  "/:userId/experiences/:expId",
  async (req, res, next) => {}
);

experienceRouter.delete(
  "/:userId/experiences/:expId",
  async (req, res, next) => {}
);

experienceRouter.post(
  "/:userId/experiences/:expId/im",
  async (req, res, next) => {}
);

export default experienceRouter;
