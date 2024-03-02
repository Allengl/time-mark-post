import express from "express";
import * as BlogPostsContraller from "../controllers/blog-posts";

const router = express.Router();

router.get("/", BlogPostsContraller.getBlogPost);

router.post("/", BlogPostsContraller.createBlogPost);

export default router;
