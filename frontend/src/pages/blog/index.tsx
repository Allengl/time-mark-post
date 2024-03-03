import { BlogPost } from "@/models/blog-post";
import type { GetServerSideProps } from "next";
import Head from "next/head";
import * as BlogApi from "@/network/api/blog";
import BlogPostsGrid from "@/components/BlogPostsGrid";

export const getServerSideProps: GetServerSideProps<
  BlogPageProps
> = async () => {
  const posts = await BlogApi.getBlogPosts();
  return { props: { posts } };
};

interface BlogPageProps {
  posts: BlogPost[];
}

export default function BlogPage({ posts }: BlogPageProps) {
  return (
    <>
      <Head>
        <title>Article -- Time mark</title>
        <meta name="description" content="write your time" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <h1>Blog</h1>
        <BlogPostsGrid posts={posts} />
      </div>
    </>
  );
}
