import Express from "Express";
import listEndpoints from "express-list-endpoints";
import cors from "cors";
import mongoose from "mongoose";
import userRouter from "./api/user/index.js";

const server = Express();

const port = process.env.PORT || 3001;

// MIDDLEWARES

server.use(cors());

server.use(Express.json());

// ENDPOINTS
server.use("/user", userRouter);

// ERROR HANDLERS

mongoose.connect(process.env.MONGO_URL);

mongoose.connection.on("connected", () => {
  console.log("Successful MongoDB connection!!");
  server.listen(port, () => {
    console.table(listEndpoints(server));
    console.log(`Server is running on ${port}`);
  });
});
