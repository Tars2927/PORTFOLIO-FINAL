import { type BlogPost } from '../data/blogPosts';

type BlogSource = 'local' | 'github' | 'api';

interface GithubBlogPostPayload extends Omit<BlogPost, 'content'> {
  content?: string[] | string;
  markdown?: string;
}

const blogSource = (import.meta.env.VITE_BLOG_SOURCE?.trim() || 'api') as BlogSource;
const githubOwner = import.meta.env.VITE_BLOG_GITHUB_OWNER?.trim();
const githubRepo = import.meta.env.VITE_BLOG_GITHUB_REPO?.trim();
const githubBranch = import.meta.env.VITE_BLOG_GITHUB_BRANCH?.trim() || 'main';
const githubPath = import.meta.env.VITE_BLOG_GITHUB_PATH?.trim() || 'content/blog-posts.json';

const isValidDate = (value: string) => !Number.isNaN(new Date(value).getTime());

const normalizeContent = (content: string[] | string): string[] => {
  if (Array.isArray(content)) {
    return content.map((line) => line.trim()).filter(Boolean);
  }

  return content
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
};

const validatePost = (post: GithubBlogPostPayload): BlogPost | null => {
  if (!post.slug?.trim() || !post.title?.trim() || !post.summary?.trim()) {
    return null;
  }

  if (!isValidDate(post.publishedAt)) {
    return null;
  }

  const markdown = post.markdown?.trim();
  const content =
    post.content === undefined ? undefined : normalizeContent(post.content);
  if (!markdown && (!content || content.length === 0)) {
    return null;
  }

  return {
    slug: post.slug.trim(),
    title: post.title.trim(),
    summary: post.summary.trim(),
    publishedAt: post.publishedAt,
    readTime: post.readTime?.trim() || '5 min read',
    tags: Array.isArray(post.tags) ? post.tags.filter(Boolean) : [],
    content,
    markdown,
  };
};

const getGithubRawUrl = () =>
  `https://raw.githubusercontent.com/${githubOwner}/${githubRepo}/${githubBranch}/${githubPath}`;

const fetchFromGithubRaw = async (): Promise<BlogPost[]> => {
  if (!githubOwner || !githubRepo || !githubPath) {
    throw new Error('GitHub raw blog source is not configured.');
  }

  const response = await fetch(getGithubRawUrl(), {
    headers: { Accept: 'application/json' },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`GitHub blog fetch failed with status ${response.status}.`);
  }

  const payload = (await response.json()) as GithubBlogPostPayload[];
  if (!Array.isArray(payload)) {
    throw new Error('GitHub blog payload is not an array.');
  }

  const normalized = payload
    .map(validatePost)
    .filter((post): post is BlogPost => Boolean(post));

  if (normalized.length === 0) {
    throw new Error('No valid posts found in GitHub blog payload.');
  }

  return normalized;
};

const fetchFromApi = async (): Promise<BlogPost[]> => {
  const response = await fetch('/api/blog', {
    headers: { Accept: 'application/json' },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Blog API request failed with status ${response.status}.`);
  }

  const payload = (await response.json()) as { posts?: GithubBlogPostPayload[] };
  if (!Array.isArray(payload.posts)) {
    throw new Error('Blog API response is invalid.');
  }

  const normalized = payload.posts
    .map(validatePost)
    .filter((post): post is BlogPost => Boolean(post));

  if (normalized.length === 0) {
    throw new Error('No valid posts found in Blog API response.');
  }

  return normalized;
};

export const shouldUseRemoteBlogSource = () => blogSource !== 'local';

export async function fetchRemoteBlogPosts(): Promise<BlogPost[]> {
  if (blogSource === 'api') {
    return fetchFromApi();
  }

  if (blogSource === 'github') {
    return fetchFromGithubRaw();
  }

  throw new Error('Remote blog source is disabled.');
}
