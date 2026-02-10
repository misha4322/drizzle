import Link from "next/link";
import { headers } from "next/headers";

type PostCard = {
  id: string;
  slug: string;
  title: string;
  content: string;
  createdAt: string;
  author: { username: string; avatarUrl?: string | null };
  category: { title: string } | null;
  tags: { id: string; name: string }[];
};

async function getBaseUrl() {
  const h = await headers(); // ✅ важно
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
  return data.posts ?? [];
}

export default async function PostsPage() {
  const posts = await getPosts();

  return (
    <div style={{ minHeight: "100vh", background: "#050510", color: "white" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800 }}>Все посты</h1>

          <div style={{ display: "flex", gap: 10 }}>
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

            <Link
              href="/posts/new"
              style={{
                padding: "10px 14px",
                borderRadius: 12,
                background: "#7c3aed",
                color: "white",
                textDecoration: "none",
              }}
            >
              + Создать
            </Link>
          </div>
        </div>

        {posts.length === 0 ? (
          <div
            style={{
              padding: 18,
              borderRadius: 16,
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "rgba(255,255,255,0.85)",
            }}
          >
            Пока нет постов. <Link href="/posts/new">Создать первый</Link>
          </div>
        ) : (
          <div style={{ display: "grid", gap: 12 }}>
            {posts.map((p) => (
              <Link
                key={p.id}
                href={`/posts/${p.slug}`}
                style={{
                  display: "block",
                  padding: 16,
                  borderRadius: 16,
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  textDecoration: "none",
                  color: "white",
                }}
              >
                <div style={{ fontWeight: 900, fontSize: 16 }}>{p.title}</div>

                <div style={{ fontSize: 12, opacity: 0.75, marginTop: 6 }}>
                  {p.author.username}
                  {p.category ? ` • ${p.category.title}` : ""}
                </div>

                <div style={{ marginTop: 10, opacity: 0.9, lineHeight: 1.5 }}>
                  {p.content.length > 200 ? p.content.slice(0, 200) + "…" : p.content}
                </div>

                {p.tags?.length ? (
                  <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {p.tags.slice(0, 6).map((t) => (
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
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
