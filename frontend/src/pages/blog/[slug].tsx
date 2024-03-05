import { BlogPost } from "@/models/blog-post";
import { GetStaticPaths, GetStaticProps } from "next";
import * as BlogApi from "@/network/api/blog";
import Head from "next/head";
import styles from "@/styles/BlogPostPage.module.css";
import Link from "next/link";
import { formatDate } from "@/utils/utils";
import Image from "next/image";

export const getStaticPaths: GetStaticPaths = async () => {
  const slugs = await BlogApi.getAllBlogPostSlugs();
  const paths = slugs.map((slug) => ({ params: { slug } }));

  return {
    paths,
    fallback: "blocking", // auto generate slugs
  };
};

export const getStaticProps: GetStaticProps<BlogPostPageProps> = async ({
  params,
}) => {
  const slug = params?.slug?.toString()!;
  if (!slug) throw Error("slug missing");

  const post = await BlogApi.getBlogPostBySlug(slug);
  return {
    props: {
      post,
    },
  };
};

interface BlogPostPageProps {
  post: BlogPost;
}
const BlogPostPage = ({
  post: {
    _id,
    slug,
    title,
    summary,
    body,
    featuredImageUrl,
    createdAt,
    updatedAt,
  },
}: BlogPostPageProps) => {
  const createdUpdatedText =
    updatedAt > createdAt ? (
      <>
        updated <time dateTime={updatedAt}>{formatDate(updatedAt)}</time>
      </>
    ) : (
      <time dateTime={createdAt}>{formatDate(createdAt)}</time>
    );

  return (
    <>
      <Head>
        <title>{`${title} - Time mark`}</title>
        <meta name="description" content={summary} />
      </Head>

      <div className={styles.container}>
        <div className="mb-4 text-center">
          <Link href="/blog">← Blog Home</Link>
        </div>

        <article>
          <div className="d-flex flex-column align-items-center">
            <h1 className="mb-3 text-center">{title}</h1>
            <p className="h5 mb-3 text-center">{summary}</p>
            <span className="text-muted">{createdUpdatedText}</span>
            <div className={styles.featuredImageWrapper}>
              <Image
                src={featuredImageUrl}
                alt="Blog post featured image"
                fill
                sizes="(max-width: 768px) 100vw, 700px "
                priority
                className="rounded"
              />
            </div>
          </div>
          <div>{body}</div>
        </article>
      </div>
    </>
  );
};

export default BlogPostPage;