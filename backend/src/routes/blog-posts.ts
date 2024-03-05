import express from "express";
import * as BlogPostsContraller from "../controllers/blog-posts";
import { featuredImageUpload } from "../middlewares/image-upload";

const router = express.Router();

router.get("/", BlogPostsContraller.getBlogPost);

router.get("/slugs", BlogPostsContraller.getAllBlogPostSlugs);

router.get("/post/:slug", BlogPostsContraller.getBlogPostBySlug);

router.post(
  "/",
  featuredImageUpload.single("featuredImage"),
  BlogPostsContraller.createBlogPost
);

export default router;
