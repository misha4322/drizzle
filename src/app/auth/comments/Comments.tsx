"use client";

import { useEffect, useMemo, useState } from "react";
import "./Comments.css";

type CommentNode = {
  id: string;
  parentId: string | null;
  content: string;
  createdAt: string;
  author: { id: string; username: string; avatarUrl: string | null };
  likeCount: number;
  likedByMe: boolean;
  replies: CommentNode[];
};

export default function Comments({ postId }: { postId: string }) {
  const [items, setItems] = useState<CommentNode[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  async function load() {
    setLoading(true);
    const res = await fetch(`/api/posts/${postId}/comments`, { cache: "no-store" });
    const data = await res.json();
    setItems(data.comments ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId]);

  async function addComment(parentId: string | null) {
    const content = text.trim();
    if (!content) return;

    setSending(true);
    const res = await fetch(`/api/posts/${postId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, parentId }),
    });

    setSending(false);

    if (res.ok) {
      setText("");
      await load();
    } else {
      // если не авторизован — сервер вернёт 401
      alert("Не удалось отправить комментарий (возможно, нужно войти).");
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Комментарии</h2>

      <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
        <textarea
          className="w-full min-h-[90px] rounded-xl bg-black/30 border border-white/10 px-3 py-2 outline-none"
          placeholder="Написать комментарий..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button
          disabled={sending}
          onClick={() => addComment(null)}
          className="mt-3 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 disabled:opacity-50"
        >
          {sending ? "Отправляю..." : "Отправить"}
        </button>
      </div>

      {loading ? (
        <div className="text-gray-400">Загрузка...</div>
      ) : items.length === 0 ? (
        <div className="text-gray-400">Пока нет комментариев</div>
      ) : (
        <div className="space-y-3">
          {items.map((c) => (
            <CommentItem key={c.id} node={c} postId={postId} onChanged={load} />
          ))}
        </div>
      )}
    </div>
  );
}

function CommentItem({
  node,
  postId,
  onChanged,
  depth = 0,
}: {
  node: CommentNode;
  postId: string;
  onChanged: () => Promise<void>;
  depth?: number;
}) {
  const [replyOpen, setReplyOpen] = useState(false);
  const [reply, setReply] = useState("");
  const [liking, setLiking] = useState(false);
  const [localLiked, setLocalLiked] = useState(node.likedByMe);
  const [localCount, setLocalCount] = useState(node.likeCount);

  async function toggleLike() {
    setLiking(true);
    const res = await fetch(`/api/comments/${node.id}/like`, { method: "POST" });
    setLiking(false);

    if (!res.ok) {
      alert("Не удалось поставить лайк (возможно, нужно войти).");
      return;
    }

    const data = await res.json();
    const liked = Boolean(data.liked);

    setLocalLiked(liked);
    setLocalCount((x) => (liked ? x + 1 : Math.max(0, x - 1)));
  }

  async function sendReply() {
    const content = reply.trim();
    if (!content) return;

    const res = await fetch(`/api/posts/${postId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, parentId: node.id }),
    });

    if (res.ok) {
      setReply("");
      setReplyOpen(false);
      await onChanged();
    } else {
      alert("Не удалось отправить ответ (возможно, нужно войти).");
    }
  }

  return (
    <div
      className="p-4 rounded-2xl bg-white/5 border border-white/10"
      style={{ marginLeft: depth ? depth * 18 : 0 }}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="text-sm text-gray-300">
          <span className="font-semibold text-white">{node.author.username}</span>{" "}
          <span className="text-gray-500">• {new Date(node.createdAt).toLocaleString()}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            disabled={liking}
            onClick={toggleLike}
            className={[
              "text-xs px-3 py-1 rounded-lg border",
              localLiked ? "bg-pink-600/30 border-pink-500" : "bg-white/5 border-white/10 hover:bg-white/10",
            ].join(" ")}
          >
            ❤️ {localCount}
          </button>

          <button
            onClick={() => setReplyOpen((v) => !v)}
            className="text-xs px-3 py-1 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10"
          >
            ↩ Ответить
          </button>
        </div>
      </div>

      <div className="mt-3 whitespace-pre-wrap">{node.content}</div>

      {replyOpen ? (
        <div className="mt-3">
          <textarea
            className="w-full min-h-[70px] rounded-xl bg-black/30 border border-white/10 px-3 py-2 outline-none"
            placeholder="Ответ..."
            value={reply}
            onChange={(e) => setReply(e.target.value)}
          />
          <button
            onClick={sendReply}
            className="mt-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700"
          >
            Отправить ответ
          </button>
        </div>
      ) : null}

      {node.replies?.length ? (
        <div className="mt-4 space-y-3">
          {node.replies.map((r) => (
            <CommentItem key={r.id} node={r} postId={postId} onChanged={onChanged} depth={depth + 1} />
          ))}
        </div>
      ) : null}
    </div>
  );
}
