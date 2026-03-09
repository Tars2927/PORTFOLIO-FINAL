import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import Navigation from '../sections/Navigation';
import Footer from '../sections/Footer';
import { useBlogPosts } from '../hooks/useBlogPosts';
import MarkdownRenderer from '../components/MarkdownRenderer';
import { extractMarkdownHeadings } from '../lib/markdownHeadings';

interface BlogPostPageProps {
  slug: string;
  scrollY: number;
}

const formatDate = (date: string) =>
  new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));

export default function BlogPostPage({ slug, scrollY }: BlogPostPageProps) {
  const { posts, isLoading, error } = useBlogPosts();
  const post = posts.find((item) => item.slug === slug);
  const articleRef = useRef<HTMLDivElement>(null);
  const [readingProgress, setReadingProgress] = useState(0);

  const headings = useMemo(
    () => (post?.markdown ? extractMarkdownHeadings(post.markdown).filter((item) => item.level >= 2) : []),
    [post]
  );

  const relatedPosts = useMemo(
    () => posts.filter((item) => item.slug !== slug).slice(0, 3),
    [posts, slug]
  );

  useEffect(() => {
    const updateProgress = () => {
      const article = articleRef.current;
      if (!article) {
        setReadingProgress(0);
        return;
      }

      const rect = article.getBoundingClientRect();
      const totalDistance = rect.height + window.innerHeight;
      const covered = window.innerHeight - rect.top;
      const ratio = Math.max(0, Math.min(1, covered / totalDistance));
      setReadingProgress(Math.round(ratio * 100));
    };

    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);

    return () => {
      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', updateProgress);
    };
  }, [slug, post?.markdown, post?.content]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation scrollY={scrollY} mode="blog" />
        <main className="pt-32 pb-20">
          <article className="section-container">
            <div className="max-w-3xl mx-auto">
              <div className="h-4 w-44 rounded bg-black/10 mb-8" />
              <div className="h-4 w-36 rounded bg-black/10 mb-4" />
              <div className="h-10 w-4/5 rounded bg-black/10 mb-5" />
              <div className="h-4 w-full rounded bg-black/10 mb-2" />
              <div className="h-4 w-full rounded bg-black/10 mb-2" />
              <div className="h-4 w-5/6 rounded bg-black/10 mb-2" />
            </div>
          </article>
        </main>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation scrollY={scrollY} mode="blog" />
        <main className="pt-32 pb-20 section-container">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl font-semibold text-[var(--apple-dark)] mb-4">
              Post not found
            </h1>
            <p className="text-[var(--apple-text)] mb-8">
              {error
                ? 'GitHub posts could not be loaded and this post is unavailable.'
                : 'The article you requested does not exist or may have been removed.'}
            </p>
            <a href="/blog" className="btn-apple-secondary">
              Back to Blog
            </a>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="fixed top-0 left-0 h-1 bg-[var(--apple-blue)] z-[80] transition-[width] duration-150" style={{ width: `${readingProgress}%` }} />
      <Navigation scrollY={scrollY} mode="blog" />
      <main className="pt-32 pb-20">
        <article className="section-container">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-[minmax(0,1fr)_260px] gap-10 items-start">
            <div ref={articleRef} className="min-w-0">
            <a
              href="/blog"
              className="inline-flex items-center gap-2 text-sm font-medium text-[var(--apple-blue)] hover:underline mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to all posts
            </a>

            <p className="text-sm text-[var(--apple-text)] mb-3">
              {formatDate(post.publishedAt)} · {post.readTime}
            </p>
            <h1 className="text-4xl sm:text-5xl font-semibold text-[var(--apple-dark)] mb-5">
              {post.title}
            </h1>

            <div className="flex flex-wrap gap-2 mb-10">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-3 py-1 rounded-full bg-[var(--apple-gray)] border border-black/10 text-[var(--apple-dark)]"
                >
                  {tag}
                </span>
              ))}
            </div>

            {post.markdown ? (
              <MarkdownRenderer markdown={post.markdown} />
            ) : (
              <div className="space-y-6">
                {(post.content || []).map((paragraph, index) => (
                  <p key={index} className="text-lg leading-relaxed text-[var(--apple-text)]">
                    {paragraph}
                  </p>
                ))}
              </div>
            )}

            {relatedPosts.length > 0 && (
              <section className="mt-16 pt-10 border-t border-black/10">
                <h2 className="text-2xl font-semibold text-[var(--apple-dark)] mb-5">
                  Related posts
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {relatedPosts.map((item) => (
                    <a
                      key={item.slug}
                      href={`/blog/${encodeURIComponent(item.slug)}`}
                      className="rounded-xl border border-black/10 bg-[var(--apple-gray)]/50 p-4 hover:border-[var(--apple-blue)]/30 hover:shadow-sm transition-all"
                    >
                      <p className="text-xs text-[var(--apple-text)] mb-1">
                        {formatDate(item.publishedAt)} · {item.readTime}
                      </p>
                      <h3 className="font-semibold text-[var(--apple-dark)] mb-2 leading-snug">
                        {item.title}
                      </h3>
                      <p className="text-sm text-[var(--apple-text)] line-clamp-3">
                        {item.summary}
                      </p>
                    </a>
                  ))}
                </div>
              </section>
            )}
            </div>

            {headings.length > 0 && (
              <aside className="hidden lg:block sticky top-28">
                <div className="rounded-2xl border border-black/10 bg-[var(--apple-gray)]/50 p-4">
                  <p className="text-xs uppercase tracking-[0.12em] text-[var(--apple-text)] mb-3">
                    On this page
                  </p>
                  <nav className="space-y-2">
                    {headings.map((heading) => (
                      <a
                        key={heading.id}
                        href={`#${heading.id}`}
                        className={`block text-sm text-[var(--apple-text)] hover:text-[var(--apple-blue)] transition-colors ${
                          heading.level === 3 ? 'pl-3' : ''
                        }`}
                      >
                        {heading.text}
                      </a>
                    ))}
                  </nav>
                </div>
              </aside>
            )}
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
