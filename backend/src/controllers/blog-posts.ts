import { RequestHandler } from "express";
import BlogPostModel from "../models/blog-post";
import assertIsDefined from "../utils/assertIsDefined";
import mongoose from "mongoose";
import sharp from "sharp";
import env from "../env";
import createHttpError from "http-errors";

interface BlogPostQuery {
  page: string;
}
export const getBlogPosts: RequestHandler<
  unknown,
  unknown,
  unknown,
  BlogPostQuery
> = async (req, res, next) => {
  const page = parseInt(req.query.page || "1");
  const pageSize = 6;

  try {
    const getBlogPostQuery = await BlogPostModel.find()
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .sort({ _id: -1 })
      .exec();

    const countDocumentsQuery = await BlogPostModel.countDocuments().exec();

    const [blogPosts, totalResults] = await Promise.all([
      getBlogPostQuery,
      countDocumentsQuery,
    ]);

    const totalPages = Math.ceil(totalResults / pageSize);

    res.status(200).json({
      blogPosts,
      page,
      totalPages,
    });
  } catch (error) {
    next(error);
  }
};

export const getBlogPostBySlug: RequestHandler = async (req, res, next) => {
  try {
    const blogPost = await BlogPostModel.findOne({
      slug: req.params.slug,
    }).exec();

    if (!blogPost) {
      throw createHttpError(404, "No blog post found for this slug");
    }

    res.status(200).json(blogPost);
  } catch (error) {
    next(error);
  }
};

export const getAllBlogPostSlugs: RequestHandler = async (req, res, next) => {
  try {
    const results = await BlogPostModel.find().select("slug").exec();
    const slugs = results.map((post) => post.slug);
    res.status(200).json(slugs);
  } catch (error) {
    next(error);
  }
};
interface BlogPostBody {
  slug: string;
  title: string;
  summary: string;
  body: string;
}

export const createBlogPost: RequestHandler<
  unknown,
  unknown,
  BlogPostBody,
  unknown
> = async (req, res, next) => {
  const { slug, title, summary, body } = req.body;
  const featuredImage = req.file;

  try {
    assertIsDefined(featuredImage);

    const existingSlug = await BlogPostModel.findOne({ slug }).exec();

    if (existingSlug) {
      throw createHttpError(
        409,
        "slug already taken. Please chose a different one."
      );
    }

    const blogPostId = new mongoose.Types.ObjectId();

    const featuredImageDestinationPath =
      "/uploads/featured-images/" + blogPostId + ".png";

    await sharp(featuredImage.buffer)
      .resize(700, 450)
      .toFile("./" + featuredImageDestinationPath);

    const newPost = await BlogPostModel.create({
      _id: blogPostId,
      slug,
      title,
      summary,
      body,
      featuredImageUrl: env.SERVER_URL + featuredImageDestinationPath,
    });

    res.status(201).json(newPost);
  } catch (error) {
    next(error);
  }
};
