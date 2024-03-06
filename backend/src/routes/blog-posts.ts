import express from "express";
import * as BlogPostsContraller from "../controllers/blog-posts";
import { featuredImageUpload } from "../middlewares/image-upload";

const router = express.Router();

router.get("/", BlogPostsContraller.getBlogPosts);

router.get("/slugs", BlogPostsContraller.getAllBlogPostSlugs);

router.get("/post/:slug", BlogPostsContraller.getBlogPostBySlug);

router.patch("/:blogPostId", BlogPostsContraller.updateBlogPost);

router.post(
  "/",
  featuredImageUpload.single("featuredImage"),
  BlogPostsContraller.createBlogPost
);

router.delete("/:blogPostId", BlogPostsContraller.deleteBlogPost);

export default router;
