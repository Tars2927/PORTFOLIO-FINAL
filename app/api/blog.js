import { z } from "zod";

const blogGithubOwner = process.env.BLOG_GITHUB_OWNER;
const blogGithubRepo = process.env.BLOG_GITHUB_REPO;
const blogGithubBranch = process.env.BLOG_GITHUB_BRANCH || "main";
const blogGithubPath = process.env.BLOG_GITHUB_PATH || "content/blog-posts.json";
const blogGithubToken = process.env.BLOG_GITHUB_TOKEN;
const blogCacheTtlMs = Number(process.env.BLOG_CACHE_TTL_MS || 300000);

let blogCache = {
  data: null,
  expiresAt: 0,
};

const blogPostSchema = z
  .object({
    slug: z.string().trim().min(1),
    title: z.string().trim().min(1),
    summary: z.string().trim().min(1),
    publishedAt: z.string().trim().min(1),
    readTime: z.string().trim().min(1).default("5 min read"),
    tags: z.array(z.string().trim()).default([]),
    content: z.union([z.array(z.string()), z.string()]).optional(),
    markdown: z.string().trim().optional(),
  })
  .refine(
    (post) =>
      (typeof post.markdown === "string" && post.markdown.length > 0) ||
      post.content !== undefined,
    { message: "Each blog post must include markdown or content" }
  );

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ ok: false, message: "Method not allowed" });
  }

  if (!blogGithubOwner || !blogGithubRepo || !blogGithubToken) {
    return res.status(503).json({
      ok: false,
      message: "Blog service temporarily unavailable.",
    });
  }

  const now = Date.now();
  if (blogCache.data && now < blogCache.expiresAt) {
    return res.status(200).json({
      ok: true,
      source: "cache",
      count: blogCache.data.length,
      posts: blogCache.data,
    });
  }

  try {
    const githubUrl = new URL(
      `https://api.github.com/repos/${blogGithubOwner}/${blogGithubRepo}/contents/${blogGithubPath}`
    );
    githubUrl.searchParams.set("ref", blogGithubBranch);

    const githubResponse = await fetch(githubUrl, {
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${blogGithubToken}`,
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });

    if (!githubResponse.ok) {
      console.error("Blog GitHub fetch failed:", githubResponse.status);
      return res.status(503).json({
        ok: false,
        message: "Blog service temporarily unavailable.",
      });
    }

    const githubPayload = await githubResponse.json();
    if (!githubPayload?.content) {
      return res.status(503).json({
        ok: false,
        message: "Blog service temporarily unavailable.",
      });
    }

    const fileContent = Buffer.from(githubPayload.content, "base64").toString("utf8");
    const parsedJson = JSON.parse(fileContent);
    const validated = z.array(blogPostSchema).safeParse(parsedJson);

    if (!validated.success) {
      console.error("Blog JSON validation failed");
      return res.status(503).json({
        ok: false,
        message: "Blog service temporarily unavailable.",
      });
    }

    const posts = validated.data.map((post) => ({
      ...post,
      content:
        post.content === undefined
          ? undefined
          : Array.isArray(post.content)
            ? post.content.map((line) => line.trim()).filter(Boolean)
            : post.content
                .split("\n")
                .map((line) => line.trim())
                .filter(Boolean),
      markdown: post.markdown?.trim() || undefined,
    }));

    blogCache = {
      data: posts,
      expiresAt: Date.now() + blogCacheTtlMs,
    };

    return res.status(200).json({
      ok: true,
      source: "github",
      count: posts.length,
      posts,
    });
  } catch (error) {
    console.error("Blog API failed:", error?.message || error);
    return res.status(503).json({
      ok: false,
      message: "Blog service temporarily unavailable.",
    });
  }
}
