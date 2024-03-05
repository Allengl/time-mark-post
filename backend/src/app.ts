import "dotenv/config";
import express from "express";
import blogPostRoutes from "./routes/blog-posts";
import cors from "cors";
import env from "./env";
import morgan from "morgan";
import errorHandler from "./middlewares/errorHandler";
import createHttpError from "http-errors";

const app = express();

app.use(express.json());

app.use(morgan("dev"));

app.use("/uploads/featured-images", express.static("uploads/featured-images"));

app.use(
  cors({
    origin: env.WEBSITE_URL,
  })
);

app.use("/posts", blogPostRoutes);

app.use((req, res, next) => next(createHttpError(404, "EndPoint not found")));

app.use(errorHandler);

export default app;
