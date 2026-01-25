import {
pgTable,
uuid,
varchar,
text,
timestamp,
boolean,
integer,
} from "drizzle-orm/pg-core";


// юзер 
export const users = pgTable("users", {
id: uuid("id").defaultRandom().primaryKey(),
username: varchar("username", { length: 32 }).notNull().unique(),
email: varchar("email", { length: 255 }).notNull().unique(),
passwordHash: varchar("password_hash", { length: 255 }).notNull(),
role: varchar("role", { length: 20 }).default("user"),
avatarUrl: text("avatar_url"),
isBanned: boolean("is_banned").default(false),
createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});


// категории
export const categories = pgTable("categories", {
id: uuid("id").defaultRandom().primaryKey(),
title: varchar("title", { length: 100 }).notNull(),
slug: varchar("slug", { length: 120 }).notNull().unique(),
description: text("description"),
createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});


// посты
export const posts = pgTable("posts", {
id: uuid("id").defaultRandom().primaryKey(),
authorId: uuid("author_id")
.references(() => users.id)
.notNull(),
categoryId: uuid("category_id").references(() => categories.id),
title: varchar("title", { length: 200 }).notNull(),
slug: varchar("slug", { length: 220 }).notNull().unique(),
content: text("content").notNull(),
coverImage: text("cover_image"),
views: integer("views").default(0),
isPublished: boolean("is_published").default(false),
createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});


// комент
export const comments = pgTable("comments", {
id: uuid("id").defaultRandom().primaryKey(),
postId: uuid("post_id")
.references(() => posts.id, { onDelete: "cascade" })
.notNull(),
authorId: uuid("author_id")
.references(() => users.id)
.notNull(),
parentId: uuid("parent_id"), 
content: text("content").notNull(),
createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});


// лайки
export const postLikes = pgTable("post_likes", {
id: uuid("id").defaultRandom().primaryKey(),
postId: uuid("post_id")
.references(() => posts.id, { onDelete: "cascade" })
.notNull(),
userId: uuid("user_id")
.references(() => users.id, { onDelete: "cascade" })
.notNull(),
createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});


// тагс 
export const tags = pgTable("tags", {
id: uuid("id").defaultRandom().primaryKey(),
name: varchar("name", { length: 50 }).notNull().unique(),
});


export const postTags = pgTable("post_tags", {
});