import "dotenv/config";
import express from "express";
import usersRoutes from "./routes/users";
import blogPostRoutes from "./routes/blog-posts";
import cors from "cors";
import env from "./env";
import morgan from "morgan";
import errorHandler from "./middlewares/errorHandler";
import createHttpError from "http-errors";
import session from "express-session";
import sessionConfig from "./config/session";
import passport from "passport";
import "./config/passport";

const app = express();

app.use(express.json());

app.use(morgan("dev"));

app.use("/uploads/featured-images", express.static("uploads/featured-images"));

app.use(session(sessionConfig));

app.use(passport.authenticate("session"));

app.use(
  cors({
    origin: env.WEBSITE_URL,
    credentials: true,
  })
);

app.use("/users", usersRoutes);
app.use("/posts", blogPostRoutes);

app.use((req, res, next) => next(createHttpError(404, "EndPoint not found")));

app.use(errorHandler);

export default app;
