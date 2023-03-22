import express from "express";
import listEndpoints from "express-list-endpoints";
import cors from "cors";
import mongoose from "mongoose";
import experienceRouter from "./api/experience/index.js";
import userRouter from "./api/user/index.js";
import pdfDownloadRouter from "./api/files/userCV.js";
import postsRouter from "./api/posts/index.js";
import commetnsRouter from "./api/posts/comments/index.js";
import likesRouter from "./api/posts/likes/index.js";
import {
  badRequestHandler,
  notFoundHandler,
  genericErrorHandler,
} from "./errorHandlers.js";

const server = express();

const port = process.env.PORT || 3001;

// MIDDLEWARES

server.use(cors());

server.use(express.json());

// ENDPOINTS

server.use("/users", experienceRouter);
server.use("/profile", pdfDownloadRouter);
server.use("/users", userRouter);
server.use("/posts", postsRouter);
server.use("/posts", commetnsRouter);
server.use("/posts", likesRouter);

// ERROR HANDLERS
server.use(badRequestHandler);
server.use(notFoundHandler);
server.use(genericErrorHandler);

mongoose.connect(process.env.MONGO_URL);

mongoose.connection.on("connected", () => {
  console.log("Successful MongoDB connection!!");
  server.listen(port, () => {
    console.table(listEndpoints(server));
    console.log(`Server is running on ${port}`);
  });
});
