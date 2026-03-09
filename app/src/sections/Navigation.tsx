import { useState, useEffect } from 'react';
import { Menu, Moon, Sun, X } from 'lucide-react';

interface NavigationProps {
  scrollY: number;
  mode?: 'home' | 'blog';
}

interface NavLink {
  name: string;
  href: string;
  type: 'section' | 'route';
}

const homeNavLinks: NavLink[] = [
  { name: 'About', href: '#about', type: 'section' },
  { name: 'Projects', href: '#projects', type: 'section' },
  { name: 'Blog', href: '/blog', type: 'route' },
  { name: 'Ongoing', href: '#ongoing', type: 'section' },
  { name: 'Skills', href: '#skills', type: 'section' },
  { name: 'Education', href: '#education', type: 'section' },
  { name: 'Contact', href: '#contact', type: 'section' },
];

const blogNavLinks: NavLink[] = [
  { name: 'Home', href: '/', type: 'route' },
  { name: 'Blog', href: '/blog', type: 'route' },
  { name: 'Contact', href: '/#contact', type: 'route' },
];

export default function Navigation({ scrollY, mode = 'home' }: NavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const navLinks = mode === 'home' ? homeNavLinks : blogNavLinks;
  const pathname = window.location.pathname;

  useEffect(() => {
    setIsScrolled(scrollY > 50);
  }, [scrollY]);

  useEffect(() => {
    const stored = window.localStorage.getItem('theme');
    const preferred = window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
    const initialTheme = stored === 'dark' || stored === 'light' ? stored : preferred;
    setTheme(initialTheme);
    document.documentElement.setAttribute('data-theme', initialTheme);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
    window.localStorage.setItem('theme', nextTheme);
  };

  useEffect(() => {
    if (mode !== 'home') {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3 }
    );

    navLinks.forEach((link) => {
      if (link.type !== 'section') {
        return;
      }

      const section = document.querySelector(link.href);
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, [mode, navLinks]);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    link: NavLink
  ) => {
    if (link.type === 'section') {
      e.preventDefault();
      const element = document.querySelector(link.href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }

    setIsMobileMenuOpen(false);
  };

  const isLinkActive = (link: NavLink) => {
    if (link.type === 'section') {
      return activeSection === link.href.slice(1);
    }

    if (link.href === '/') {
      return pathname === '/';
    }

    return pathname.startsWith(link.href);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'glass border-b border-black/5 py-3'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="section-container">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <a
              href="/"
              className={`text-xl font-semibold tracking-tight transition-all duration-300 ${
                isScrolled ? 'scale-90' : 'scale-100'
              }`}
              style={{ color: 'var(--apple-dark)' }}
            >
              Portfolio
            </a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link)}
                  className={`text-sm font-medium link-underline transition-colors duration-300 ${
                    isLinkActive(link)
                      ? 'text-[var(--apple-blue)]'
                      : 'text-[var(--apple-dark)] hover:text-[var(--apple-blue)]'
                  }`}
                >
                  {link.name}
                </a>
              ))}
            </div>

            {/* CTA Button */}
            <div className="hidden md:flex items-center gap-3">
              <button
                type="button"
                onClick={toggleTheme}
                className="w-10 h-10 rounded-full border border-black/10 bg-white/80 hover:bg-[var(--apple-gray)] transition-colors flex items-center justify-center"
                aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-[var(--apple-dark)]" />
                ) : (
                  <Moon className="w-4 h-4 text-[var(--apple-dark)]" />
                )}
              </button>
              <a
                href={mode === 'home' ? '#contact' : '/#contact'}
                onClick={(e) =>
                  mode === 'home'
                    ? handleNavClick(e, { name: 'Contact', href: '#contact', type: 'section' })
                    : setIsMobileMenuOpen(false)
                }
                className="btn-apple text-xs py-2 px-5"
              >
                Let&apos;s Talk
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-black/5 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-500 ${
          isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        <div
          className="absolute inset-0 bg-black/20 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
        <div
          className={`absolute top-0 right-0 w-72 h-full bg-white shadow-2xl transition-transform duration-500 ${
            isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          style={{ transitionTimingFunction: 'var(--ease-expo-out)' }}
        >
          <div className="pt-20 px-6">
            <div className="flex flex-col gap-4">
              {navLinks.map((link, index) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link)}
                  className="text-lg font-medium text-[var(--apple-dark)] hover:text-[var(--apple-blue)] transition-colors py-2"
                  style={{
                    animationDelay: `${index * 50}ms`,
                  }}
                >
                  {link.name}
                </a>
              ))}
              <a
                href={mode === 'home' ? '#contact' : '/#contact'}
                onClick={(e) =>
                  mode === 'home'
                    ? handleNavClick(e, { name: 'Contact', href: '#contact', type: 'section' })
                    : setIsMobileMenuOpen(false)
                }
                className="btn-apple mt-4 text-center"
              >
                Let&apos;s Talk
              </a>
              <button
                type="button"
                onClick={toggleTheme}
                className="mt-2 w-full inline-flex items-center justify-center gap-2 rounded-full border border-black/10 bg-[var(--apple-gray)] px-4 py-3 text-sm font-medium text-[var(--apple-dark)]"
                aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              >
                {theme === 'dark' ? (
                  <>
                    <Sun className="w-4 h-4" />
                    Light Mode
                  </>
                ) : (
                  <>
                    <Moon className="w-4 h-4" />
                    Dark Mode
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
