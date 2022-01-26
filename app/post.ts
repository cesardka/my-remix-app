import fs from "fs/promises";
import path from "path";
import parseFrontMatter from "front-matter";
import invariant from "tiny-invariant";
import { marked } from "marked";

export type PostData = {
  slug: string;
  title: string;
};

type PostMarkdownAttributes = {
  title: string;
};

type PostFileProps = {
  attributes: any;
  body: string;
};

const POSTS_PATH = path.join(__dirname, "..", "posts");

const isValidPostAttributes = (
  attributes: any
): attributes is PostMarkdownAttributes => {
  return attributes?.title;
};

const getAttributesFromPath = async (
  filepath: string
): Promise<PostFileProps> => {
  const postFilePath = path.join(POSTS_PATH, filepath);
  const postFile = await fs.readFile(postFilePath);
  const { attributes, body } = parseFrontMatter(postFile.toString());

  return { attributes, body };
};

export const getPost = async (slug: string) => {
  const filepath = slug + ".md";
  const { attributes, body } = await getAttributesFromPath(filepath);

  invariant(
    isValidPostAttributes(attributes),
    `Post ${filepath} is missing attributes!`
  );

  const bodyHtml = marked(body);

  return {
    slug,
    html: bodyHtml,
    title: attributes.title,
  };
};

export const getPosts = async (): Promise<PostData[]> => {
  const dir = await fs.readdir(POSTS_PATH);

  return Promise.all(
    dir.map(async (filename) => {
      const { attributes } = await getAttributesFromPath(filename);

      invariant(
        isValidPostAttributes(attributes),
        `${filename} has bad meta data!`
      );

      return {
        slug: filename.replace(/\.md$/, ""),
        title: attributes.title,
      };
    })
  );
};
