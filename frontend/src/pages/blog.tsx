import Head from "next/head";
import React from "react";
import { Button } from "react-bootstrap";

const BlogPage = () => {
  return (
    <>
      <Head>
        <title>文章 -- 时光印记</title>
        <meta name="description" content="写下你的时光" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div>
        <div>Hello, blog</div>
        <div>
          <Button>I am a button</Button>
        </div>
      </div>
    </>
  );
};

export default BlogPage;
