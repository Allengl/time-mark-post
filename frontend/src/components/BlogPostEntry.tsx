import { BlogPost } from "@/models/blog-post";
import { formatDate } from "@/utils/utils";
import Image from "next/image";
import Link from "next/link";
import { Card } from "react-bootstrap";

interface BlogPostEntryProps {
  post: BlogPost;
  className?: string;
}
const BlogPostEntry = ({
  post: { slug, title, summary, createdAt, featuredImageUrl },
  className,
}: BlogPostEntryProps) => {
  const postLink = "/blog/" + slug;

  return (
    <Card className={className}>
      <Link href={postLink}>
        <Image
          src={featuredImageUrl}
          alt="Blog post featured image"
          width={200}
          height={550}
          className="card-img-top object-fit-cover"
        />
      </Link>
      <article>
        <Card.Body>
          <Card.Title>
            <Link href={postLink}>{title}</Link>
          </Card.Title>
          <Card.Text>{summary}</Card.Text>
          <Card.Text className="text-muted small">
            <time dateTime={createdAt}>{formatDate(createdAt)}</time>
          </Card.Text>
        </Card.Body>
      </article>
    </Card>
  );
};

export default BlogPostEntry;
