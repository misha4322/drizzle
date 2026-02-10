import Link from "next/link";
import { headers } from "next/headers";

type Post = {
  id: string;
  slug: string;
  title: string;
  content: string;
  createdAt: string;
  author: { id: string; username: string; avatarUrl: string | null };
  category: { id: string; title: string } | null;
  tags: { id: string; name: string }[];
};

async function getBaseUrl() {
  const h = await headers();
  const host = h.get("host") ?? "localhost:3000";
  const proto =
    h.get("x-forwarded-proto") ??
    (process.env.NODE_ENV === "development" ? "http" : "https");
  return `${proto}://${host}`;
}

async function getPost(slug: string): Promise<Post> {
  const base = await getBaseUrl();
  const res = await fetch(`${base}/api/posts/${encodeURIComponent(slug)}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to load post");
  }

  const data = await res.json();
  return data.post as Post;
}

export default async function PostPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params; // ✅ Next 16: params Promise
  const post = await getPost(slug);

  return (
    <div style={{ minHeight: "100vh", background: "#050510", color: "white" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
        <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
          <Link
            href="/posts"
            style={{
              padding: "10px 14px",
              borderRadius: 12,
              background: "rgba(255,255,255,0.08)",
              color: "white",
              textDecoration: "none",
              border: "1px solid rgba(255,255,255,0.12)",
            }}
          >
            ← К постам
          </Link>

          <Link
            href="/"
            style={{
              padding: "10px 14px",
              borderRadius: 12,
              background: "rgba(255,255,255,0.08)",
              color: "white",
              textDecoration: "none",
              border: "1px solid rgba(255,255,255,0.12)",
            }}
          >
            Главная
          </Link>
        </div>

        <h1 style={{ fontSize: 28, fontWeight: 900 }}>{post.title}</h1>

        <div style={{ marginTop: 10, fontSize: 13, opacity: 0.75 }}>
          Автор: {post.author.username}
          {post.category ? ` • Игра: ${post.category.title}` : ""}
        </div>

        {post.tags?.length ? (
          <div style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: 8 }}>
            {post.tags.map((t) => (
              <span
                key={t.id}
                style={{
                  fontSize: 11,
                  padding: "6px 10px",
                  borderRadius: 999,
                  background: "rgba(255,255,255,0.10)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "rgba(255,255,255,0.85)",
                }}
              >
                #{t.name}
              </span>
            ))}
          </div>
        ) : null}

        <div
          style={{
            marginTop: 18,
            padding: 16,
            borderRadius: 16,
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.12)",
            lineHeight: 1.7,
            whiteSpace: "pre-wrap",
          }}
        >
          {post.content}
        </div>

        {/* Комменты/лайки подключим следующим шагом */}
      </div>
    </div>
  );
}
