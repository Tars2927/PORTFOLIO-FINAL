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

const isValidDate = (value) => !Number.isNaN(new Date(value).getTime());

const headers = {
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",
  ...(blogGithubToken ? { Authorization: `Bearer ${blogGithubToken}` } : {}),
};

const toPostOrNull = (post) => {
  if (!post?.slug || !post?.title || !post?.summary || !post?.publishedAt) {
    return null;
  }
  if (!isValidDate(post.publishedAt)) {
    return null;
  }

  const validated = blogPostSchema.safeParse({
    ...post,
    readTime: post.readTime || "5 min read",
    tags: Array.isArray(post.tags) ? post.tags : [],
    markdown: post.markdown?.trim() || undefined,
    content: post.content,
  });

  if (!validated.success) {
    return null;
  }

  const parsed = validated.data;
  return {
    ...parsed,
    content:
      parsed.content === undefined
        ? undefined
        : Array.isArray(parsed.content)
          ? parsed.content.map((line) => line.trim()).filter(Boolean)
          : parsed.content
              .split("\n")
              .map((line) => line.trim())
              .filter(Boolean),
    markdown: parsed.markdown?.trim() || undefined,
  };
};

const parseFrontmatter = (rawMarkdown, fallbackSlug) => {
  const normalized = rawMarkdown.replace(/\r\n/g, "\n");
  const startsWithFrontmatter = normalized.startsWith("---\n");

  if (!startsWithFrontmatter) {
    return {
      meta: {
        slug: fallbackSlug,
        title: fallbackSlug.replace(/[-_]/g, " "),
        summary: "No summary provided.",
        publishedAt: new Date().toISOString().slice(0, 10),
        readTime: "5 min read",
        tags: [],
      },
      markdown: normalized.trim(),
    };
  }

  const endIndex = normalized.indexOf("\n---\n", 4);
  if (endIndex === -1) {
    return null;
  }

  const frontmatter = normalized.slice(4, endIndex);
  const markdownBody = normalized.slice(endIndex + 5).trim();
  const meta = {};

  for (const line of frontmatter.split("\n")) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    const rawValue = line.slice(idx + 1).trim();
    meta[key] = rawValue;
  }

  const tagsRaw = meta.tags || "";
  let tags = [];
  if (tagsRaw.startsWith("[") && tagsRaw.endsWith("]")) {
    tags = tagsRaw
      .slice(1, -1)
      .split(",")
      .map((item) => item.trim().replace(/^["']|["']$/g, ""))
      .filter(Boolean);
  } else if (tagsRaw) {
    tags = tagsRaw
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return {
    meta: {
      slug: meta.slug || fallbackSlug,
      title: meta.title || fallbackSlug.replace(/[-_]/g, " "),
      summary: meta.summary || "No summary provided.",
      publishedAt: meta.publishedAt || new Date().toISOString().slice(0, 10),
      readTime: meta.readTime || "5 min read",
      tags,
    },
    markdown: markdownBody,
  };
};

const fetchJsonPosts = async () => {
  const githubUrl = new URL(
    `https://api.github.com/repos/${blogGithubOwner}/${blogGithubRepo}/contents/${blogGithubPath}`
  );
  githubUrl.searchParams.set("ref", blogGithubBranch);

  const githubResponse = await fetch(githubUrl, { headers });
  if (!githubResponse.ok) {
    throw new Error(`Blog GitHub JSON fetch failed: ${githubResponse.status}`);
  }

  const githubPayload = await githubResponse.json();
  if (!githubPayload?.content) {
    throw new Error("Blog JSON payload missing content");
  }

  const fileContent = Buffer.from(githubPayload.content, "base64").toString("utf8");
  const parsedJson = JSON.parse(fileContent);
  if (!Array.isArray(parsedJson)) {
    throw new Error("Blog JSON payload must be an array");
  }

  const posts = parsedJson.map(toPostOrNull).filter(Boolean);
  if (posts.length === 0) {
    throw new Error("No valid posts found in JSON source");
  }

  return posts;
};

const fetchMarkdownPosts = async () => {
  const directoryUrl = new URL(
    `https://api.github.com/repos/${blogGithubOwner}/${blogGithubRepo}/contents/${blogGithubPath}`
  );
  directoryUrl.searchParams.set("ref", blogGithubBranch);

  const directoryResponse = await fetch(directoryUrl, { headers });
  if (!directoryResponse.ok) {
    throw new Error(`Blog markdown directory fetch failed: ${directoryResponse.status}`);
  }

  const directoryPayload = await directoryResponse.json();
  if (!Array.isArray(directoryPayload)) {
    throw new Error("Blog markdown path is not a directory");
  }

  const markdownFiles = directoryPayload.filter(
    (item) => item?.type === "file" && typeof item.name === "string" && item.name.endsWith(".md")
  );

  const parsedPosts = await Promise.all(
    markdownFiles.map(async (file) => {
      const rawResponse = await fetch(file.download_url, { cache: "no-store" });
      if (!rawResponse.ok) {
        return null;
      }
      const rawMarkdown = await rawResponse.text();
      const fallbackSlug = file.name.replace(/\.md$/, "");
      const parsed = parseFrontmatter(rawMarkdown, fallbackSlug);
      if (!parsed) return null;

      return toPostOrNull({
        ...parsed.meta,
        markdown: parsed.markdown,
      });
    })
  );

  const posts = parsedPosts.filter(Boolean);
  if (posts.length === 0) {
    throw new Error("No valid posts found in markdown directory");
  }

  return posts;
};

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ ok: false, message: "Method not allowed" });
  }

  if (!blogGithubOwner || !blogGithubRepo) {
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
    const posts = blogGithubPath.endsWith(".json")
      ? await fetchJsonPosts()
      : await fetchMarkdownPosts();

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
