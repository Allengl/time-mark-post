import Head from "next/head";
import React from "react";
import { Button } from "react-bootstrap";

const BlogPage = () => {
  return (
    <>
      <Head>
        <title>Article -- Time mark</title>
        <meta name="description" content="write your time" />
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
