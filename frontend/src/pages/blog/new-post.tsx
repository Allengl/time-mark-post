import { Button, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import * as BlogApi from "@/network/api/blog";
import FormInputField from "@/components/FormInputField";

interface CreatePostFormData {
  slug: string;
  title: string;
  summary: string;
  body: string;
}

const CreateBlogPostPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreatePostFormData>();

  const onSubmit = async (input: CreatePostFormData) => {
    try {
      await BlogApi.createBlogPost(input);
      alert("Post created successfully");
    } catch (error) {
      console.error(error);

      alert(error);
    }
  };

  return (
    <div>
      <h1>Create a post</h1>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <FormInputField
          label="Post title"
          register={register("title", { required: "Required" })}
          placeholder="Post title"
          maxLength={100}
          error={errors.title}
        />
        <FormInputField
          label="Post slug"
          register={register("slug", { required: "required" })}
          placeholder="Post slug"
          maxLength={100}
          error={errors.slug}
        />
        <FormInputField
          label="Post summary"
          register={register("summary", { required: "required" })}
          placeholder="Post summary"
          maxLength={300}
          as="textarea"
          error={errors.summary}
        />
        <FormInputField
          label="Post body"
          register={register("body", { required: "required" })}
          placeholder="Post body"
          as="textarea"
        />
        <Button type="submit">Create post</Button>
      </Form>
    </div>
  );
};

export default CreateBlogPostPage;
