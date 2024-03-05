import { Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import * as BlogApi from "@/network/api/blog";
import FormInputField from "@/components/form/FormInputField";
import MarkdownEditor from "@/components/form/MarkdownEditor";
import { generateSlug } from "@/utils/utils";
import LoadingButton from "@/components/LoadingButton";
import { useRouter } from "next/router";

interface CreatePostFormData {
  slug: string;
  title: string;
  summary: string;
  body: string;
  featuredImage: FileList;
}

const CreateBlogPostPage = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CreatePostFormData>();

  const onSubmit = async ({
    title,
    slug,
    summary,
    featuredImage,
    body,
  }: CreatePostFormData) => {
    try {
      await BlogApi.createBlogPost({
        slug,
        title,
        summary,
        featuredImage: featuredImage[0],
        body,
      });
      await router.push("/blog/" + slug);
    } catch (error) {
      console.error(error);

      alert(error);
    }
  };

  const generateSlugFromTitle = () => {
    if (getValues("slug")) return;
    const slug = generateSlug(getValues("title"));
    setValue("slug", slug, { shouldValidate: true });
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
          onBlur={generateSlugFromTitle}
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
          label="Post image"
          register={register("featuredImage", { required: "required" })}
          type="file"
          accept="image/png, image/jpeg"
          error={errors.featuredImage}
        />
        <MarkdownEditor
          label="Post body"
          register={register("body", { required: "required" })}
          watch={watch}
          setValue={setValue}
          error={errors.body}
        />
        <LoadingButton type="submit" isLoading={isSubmitting}>
          Create post
        </LoadingButton>
      </Form>
    </div>
  );
};

export default CreateBlogPostPage;
