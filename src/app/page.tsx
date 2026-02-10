import Link from "next/link";
import Image from "next/image";
import { headers } from "next/headers";
import "./Home.css";

type PostCard = {
  id: string;
  slug: string;
  title: string;
  content: string;
  createdAt: string;
  author: { username: string; avatarUrl: string | null };
  category: { title: string } | null;
  tags: { id: string; name: string }[];
};

async function getBaseUrl() {
  const h = await headers(); // ✅ ВАЖНО: await
  const host = h.get("host") ?? "localhost:3000";
  const proto =
    h.get("x-forwarded-proto") ??
    (process.env.NODE_ENV === "development" ? "http" : "https");

  return `${proto}://${host}`;
}

async function getPosts(): Promise<PostCard[]> {
  const base = await getBaseUrl();
  const res = await fetch(`${base}/api/posts`, { cache: "no-store" });
  if (!res.ok) return [];
  const data = await res.json();
  return (data.posts ?? []) as PostCard[];
}

export default async function Home() {
  const posts = await getPosts();
  const latest = posts.slice(0, 6);

  return (
    <div className="main-container">
      {/* …твой текущий JSX… */}

      {/* Пример: секция последних постов */}
      <section className="latest-posts-section">
        <div className="latest-posts-header">
          <h2 className="features-title">Последние посты</h2>
          <Link className="latest-posts-link" href="/posts">
            Все посты →
          </Link>
        </div>

        {latest.length === 0 ? (
          <div className="latest-posts-empty">
            Пока нет постов. <Link href="/posts/new">Создать первый</Link>
          </div>
        ) : (
          <div className="latest-posts-grid">
            {latest.map((p) => (
              <Link key={p.id} href={`/posts/${p.slug}`} className="post-card">
                <div className="post-title">{p.title}</div>
                <div className="post-meta">
                  {p.author.username}
                  {p.category ? ` • ${p.category.title}` : ""}
                </div>
                <div className="post-excerpt">
                  {p.content.length > 160 ? p.content.slice(0, 160) + "…" : p.content}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
