import { ArrowRight } from 'lucide-react';
import Navigation from '../sections/Navigation';
import Footer from '../sections/Footer';
import { useBlogPosts } from '../hooks/useBlogPosts';

interface BlogPageProps {
  scrollY: number;
}

const formatDate = (date: string) =>
  new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
}).format(new Date(date));

export default function BlogPage({ scrollY }: BlogPageProps) {
  const { posts, isLoading, error } = useBlogPosts();

  return (
    <div className="min-h-screen bg-white">
      <Navigation scrollY={scrollY} mode="blog" />
      <main className="pt-32 pb-20">
        <section className="section-container">
          <div className="max-w-3xl mx-auto text-center mb-14">
            <h1 className="text-4xl sm:text-5xl font-semibold text-[var(--apple-dark)] mb-4">
              Blog
            </h1>
            <p className="text-lg text-[var(--apple-text)]">
              Insights and build notes from my work across full-stack development,
              AI/ML, and secure engineering.
            </p>
          </div>

          {error ? (
            <p className="max-w-5xl mx-auto text-sm text-amber-700 mb-5">
              GitHub posts could not be loaded. Showing local fallback posts.
            </p>
          ) : null}

          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">
            {isLoading
              ? Array.from({ length: 4 }).map((_, index) => (
                  <article
                    key={`blog-page-skeleton-${index}`}
                    className="rounded-2xl bg-[var(--apple-gray)] border border-black/10 p-7"
                  >
                    <div className="h-3 w-28 rounded bg-black/10 mb-4" />
                    <div className="h-7 w-4/5 rounded bg-black/10 mb-3" />
                    <div className="h-4 w-full rounded bg-black/10 mb-2" />
                    <div className="h-4 w-5/6 rounded bg-black/10 mb-6" />
                    <div className="h-4 w-24 rounded bg-black/10" />
                  </article>
                ))
              : posts.map((post) => (
                  <article
                    key={post.slug}
                    className="rounded-2xl bg-[var(--apple-gray)] border border-black/10 p-7 card-hover"
                  >
                    <p className="text-xs text-[var(--apple-text)] mb-2">
                      {formatDate(post.publishedAt)} · {post.readTime}
                    </p>
                    <h2 className="text-2xl font-semibold text-[var(--apple-dark)] mb-3">
                      {post.title}
                    </h2>
                    <p className="text-[var(--apple-text)] mb-5 leading-relaxed">
                      {post.summary}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-3 py-1 rounded-full bg-white border border-black/10 text-[var(--apple-dark)]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <a
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-2 text-sm font-medium text-[var(--apple-blue)] hover:underline"
                    >
                      Read article
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </article>
                ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
