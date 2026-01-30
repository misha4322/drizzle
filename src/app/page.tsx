import { api } from "../server/api/index";

export default async function Home() {
  const posts = (await api.posts.get()).data;

  return (
    <div>
      <h1>Posts</h1>
      {posts?.map((post) => (
        <div key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.content}</p>
          <p>Author: {post.author.username}</p>
        </div>
      ))}
    </div>
  );
}
