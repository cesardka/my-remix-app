import { Link, useLoaderData } from "remix";
import { getPosts, PostData } from "~/post";

const Posts = () => {
  const postsData = useLoaderData<PostData[]>();

  return (
    <div>
      <h1>Posts</h1>
      {postsData.map((post: PostData) => (
        <li key={post.slug}>
          <Link to={post.slug}>{post.title}</Link>
        </li>
      ))}
    </div>
  );
};

export const loader = () => {
  return getPosts();
};

export default Posts;
