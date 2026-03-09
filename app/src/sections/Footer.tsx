import { useEffect, useRef, useState } from 'react';
import { Heart } from 'lucide-react';

export default function Footer() {
  const [isVisible, setIsVisible] = useState(false);
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (footerRef.current) {
      observer.observe(footerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <footer
      ref={footerRef}
      className="py-12 bg-[var(--apple-gray)] border-t border-black/5"
    >
      <div className="section-container">
        <div className="max-w-4xl mx-auto text-center">
          {/* Logo */}
          <div
            className={`mb-6 transition-all duration-700 ${
              isVisible
                ? 'opacity-100 scale-100'
                : 'opacity-0 scale-90'
            }`}
            style={{ transitionTimingFunction: 'var(--ease-expo-out)' }}
          >
            <span className="text-2xl font-semibold text-[var(--apple-dark)]">
              Portfolio
            </span>
          </div>

          {/* Tagline */}
          <p
            className={`text-[var(--apple-text)] mb-8 transition-all duration-700 ${
              isVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-4'
            }`}
            style={{
              transitionTimingFunction: 'var(--ease-expo-out)',
              transitionDelay: '200ms',
            }}
          >
            Building intelligent solutions with code and creativity.
          </p>

          {/* Links */}
          <div
            className={`flex items-center justify-center gap-6 mb-8 transition-all duration-700 ${
              isVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-4'
            }`}
            style={{
              transitionTimingFunction: 'var(--ease-expo-out)',
              transitionDelay: '400ms',
            }}
          >
            <a
              href="/#about"
              className="text-sm text-[var(--apple-text)] hover:text-[var(--apple-dark)] transition-colors"
            >
              About
            </a>
            <span className="text-[var(--apple-text)]/30">|</span>
            <a
              href="/#projects"
              className="text-sm text-[var(--apple-text)] hover:text-[var(--apple-dark)] transition-colors"
            >
              Projects
            </a>
            <span className="text-[var(--apple-text)]/30">|</span>
            <a
              href="/blog"
              className="text-sm text-[var(--apple-text)] hover:text-[var(--apple-dark)] transition-colors"
            >
              Blog
            </a>
            <span className="text-[var(--apple-text)]/30">|</span>
            <a
              href="/#contact"
              className="text-sm text-[var(--apple-text)] hover:text-[var(--apple-dark)] transition-colors"
            >
              Contact
            </a>
          </div>

          {/* Copyright */}
          <div
            className={`transition-all duration-700 ${
              isVisible ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              transitionTimingFunction: 'var(--ease-expo-out)',
              transitionDelay: '600ms',
            }}
          >
            <p className="text-sm text-[var(--apple-text)] flex items-center justify-center gap-1">
              © {new Date().getFullYear()} Made with
              <Heart className="w-3 h-3 text-red-500 fill-red-500 inline" />
              All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
