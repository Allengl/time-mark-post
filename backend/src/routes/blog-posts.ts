import express from "express";
import * as BlogPostsContraller from "../controllers/blog-posts";
import { featuredImageUpload } from "../middlewares/image-upload";

const router = express.Router();

router.get("/", BlogPostsContraller.getBlogPost);

router.post(
  "/",
  featuredImageUpload.single("featuredImage"),
  BlogPostsContraller.createBlogPost
);

export default router;
