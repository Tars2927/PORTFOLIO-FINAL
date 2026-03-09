import { useEffect, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { useBlogPosts } from '../hooks/useBlogPosts';

const formatDate = (date: string) =>
  new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));

export default function BlogPreview() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const { latestPosts, isLoading } = useBlogPosts();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="blog"
      ref={sectionRef}
      className="pt-24 pb-14 sm:pt-28 sm:pb-16 bg-white relative"
    >
      <div className="section-container">
        <div className="max-w-2xl mx-auto text-center mb-14">
          <h2
            className={`text-4xl sm:text-5xl font-semibold text-[var(--apple-dark)] mb-4 transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
            style={{ transitionTimingFunction: 'var(--ease-expo-out)' }}
          >
            Latest Writing
          </h2>
          <p
            className={`text-[var(--apple-text)] text-lg transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{
              transitionTimingFunction: 'var(--ease-expo-out)',
              transitionDelay: '180ms',
            }}
          >
            Short notes on secure engineering, AI projects, and practical lessons from building.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {isLoading
            ? Array.from({ length: 3 }).map((_, index) => (
                <article
                  key={`blog-skeleton-${index}`}
                  className={`rounded-2xl border border-black/10 bg-[var(--apple-gray)] p-6 transition-all duration-700 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                  }`}
                  style={{
                    transitionTimingFunction: 'var(--ease-expo-out)',
                    transitionDelay: `${260 + index * 120}ms`,
                  }}
                >
                  <div className="h-3 w-32 rounded bg-black/10 mb-4" />
                  <div className="h-6 w-4/5 rounded bg-black/10 mb-3" />
                  <div className="h-4 w-full rounded bg-black/10 mb-2" />
                  <div className="h-4 w-5/6 rounded bg-black/10 mb-5" />
                  <div className="h-4 w-24 rounded bg-black/10" />
                </article>
              ))
            : latestPosts.map((post, index) => (
            <article
              key={post.slug}
              className={`rounded-2xl border border-black/10 bg-[var(--apple-gray)] p-6 card-hover transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{
                transitionTimingFunction: 'var(--ease-expo-out)',
                transitionDelay: `${260 + index * 120}ms`,
              }}
            >
              <p className="text-xs text-[var(--apple-text)] mb-2">
                {formatDate(post.publishedAt)} · {post.readTime}
              </p>
              <h3 className="text-xl font-semibold text-[var(--apple-dark)] mb-3">
                {post.title}
              </h3>
              <p className="text-sm text-[var(--apple-text)] leading-relaxed mb-4">
                {post.summary}
              </p>
              <div className="flex flex-wrap gap-2 mb-5">
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

        <div
          className={`text-center mt-12 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
          style={{
            transitionTimingFunction: 'var(--ease-expo-out)',
            transitionDelay: '620ms',
          }}
        >
          <a href="/blog" className="btn-apple-secondary">
            View All Posts
          </a>
        </div>
      </div>
    </section>
  );
}
