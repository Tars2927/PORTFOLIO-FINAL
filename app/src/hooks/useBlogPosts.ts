import { useEffect, useMemo, useState } from 'react';
import { blogPosts as localBlogPosts, type BlogPost } from '../data/blogPosts';
import { fetchRemoteBlogPosts, shouldUseRemoteBlogSource } from '../services/blogService';

const sortByLatest = (posts: BlogPost[]) =>
  [...posts].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

export function useBlogPosts() {
  const [posts, setPosts] = useState<BlogPost[]>(sortByLatest(localBlogPosts));
  const [isLoading, setIsLoading] = useState<boolean>(shouldUseRemoteBlogSource());
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadPosts = async () => {
      if (!shouldUseRemoteBlogSource()) {
        setPosts(sortByLatest(localBlogPosts));
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const githubPosts = await fetchRemoteBlogPosts();
        if (!isMounted) {
          return;
        }

        setPosts(sortByLatest(githubPosts));
      } catch (err) {
        if (!isMounted) {
          return;
        }

        const message =
          err instanceof Error
            ? err.message
            : 'Unable to load blog posts from GitHub.';
        setError(message);
        setPosts(sortByLatest(localBlogPosts));
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadPosts();

    return () => {
      isMounted = false;
    };
  }, []);

  const latestPosts = useMemo(() => posts.slice(0, 3), [posts]);

  return { posts, latestPosts, isLoading, error };
}
