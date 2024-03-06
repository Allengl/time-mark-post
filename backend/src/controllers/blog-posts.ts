import { RequestHandler } from "express";
import BlogPostModel from "../models/blog-post";
import assertIsDefined from "../utils/assertIsDefined";
import mongoose from "mongoose";
import sharp from "sharp";
import env from "../env";
import createHttpError from "http-errors";
import fs from "fs";

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
  console.log(req.body);

  const featuredImage = req.file;

  try {
    assertIsDefined(featuredImage);

    const existingSlug = await BlogPostModel.findOne({ slug }).exec();

    if (existingSlug) {
      throw createHttpError(409, "标签名重复.");
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

interface UpdateBlogPostParams {
  blogPostId: string;
}

export const updateBlogPost: RequestHandler<
  UpdateBlogPostParams,
  unknown,
  BlogPostBody,
  unknown
> = async (req, res, next) => {
  console.log(req.body);

  const { blogPostId } = req.params;

  const { slug, title, summary, body } = req.body;

  const featuredImage = req.file;
  try {
    const existingSlug = await BlogPostModel.findOne({ slug }).exec();

    if (existingSlug && !existingSlug._id.equals(blogPostId)) {
      throw createHttpError(409, "标签名重复.");
    }

    const postToEdit = await BlogPostModel.findById(blogPostId).exec();

    if (!postToEdit) {
      throw createHttpError(404);
    }

    postToEdit.slug = slug;
    postToEdit.title = title;
    postToEdit.summary = summary;
    postToEdit.body = body;

    if (featuredImage) {
      const featuredImageDestinationPath =
        "/uploads/featured-images/" + blogPostId + ".png";

      await sharp(featuredImage.buffer)
        .resize(700, 450)
        .toFile("./" + featuredImageDestinationPath);

      postToEdit.featuredImageUrl =
        env.SERVER_URL +
        featuredImageDestinationPath +
        "?lastupdated=" +
        Date.now();
    }

    await postToEdit.save();

    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
};

export const deleteBlogPost: RequestHandler = async (req, res, next) => {
  const { blogPostId } = req.params;

  try {
    const postToDelete = await BlogPostModel.findById(blogPostId).exec();

    if (!postToDelete) {
      throw createHttpError(404, "找不到博客 ");
    }

    if (postToDelete.featuredImageUrl.startsWith(env.SERVER_URL)) {
      const iamgePath = postToDelete.featuredImageUrl
        .split(env.SERVER_URL)[1]
        .split("?")[0];
      fs.unlinkSync("." + iamgePath);
    }

    await postToDelete.deleteOne();

    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};
