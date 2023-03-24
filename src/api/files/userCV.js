import express from "express";
import { getPDFReadableStream } from "../../lib/pdf-tools.js";
import { pipeline } from "stream";
import UserModel from "../user/model.js";

const pdfDownloadRouter = express.Router();

pdfDownloadRouter.get("/users/:userId/CV", async (req, res, next) => {
  console.log("Request", req);
  try {
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=user_CV.pdf");

    const user = await UserModel.findById(req.params.userId);
    const source = await getPDFReadableStream(user);
    const destination = res;

    pipeline(source, destination, (err) => {
      if (err) console.log(err);
    });
  } catch (error) {
    next(error);
  }
});

export default pdfDownloadRouter;
