import { Elysia } from "elysia";
import { postsRouter } from "./posts";
import { commentsRouter } from "./comments";
import { likesRouter } from "./likes";
import { forumRouter } from "./forum"; 

export const app = new Elysia({ prefix: "/api" })
    .use(postsRouter)
    .use(commentsRouter)
    .use(likesRouter)
    .use(forumRouter)

export type App = typeof app;