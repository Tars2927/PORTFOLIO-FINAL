import { useEffect, useState, useRef } from 'react';
import Navigation from './sections/Navigation';
import About from './sections/About';
import Projects from './sections/Projects';
import BlogPreview from './sections/BlogPreview';
import OngoingProjects from './sections/OngoingProjects';
import Skills from './sections/Skills';
import Experience from './sections/Experience';
import Contact from './sections/Contact';
import Footer from './sections/Footer';
import Loading from './components/Loading';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';

function HomePage({ scrollY }: { scrollY: number }) {
  return (
    <>
      <Navigation scrollY={scrollY} mode="home" />
      <main>
        <About />
        <Projects />
        <BlogPreview />
        <OngoingProjects />
        <Skills />
        <Experience />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

function App() {
  const [scrollY, setScrollY] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);
  const pathname =
    window.location.pathname === '/'
      ? '/'
      : window.location.pathname.replace(/\/+$/, '');

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLoadingComplete = () => {
    setIsLoaded(true);
    // Small delay before showing content for smooth transition
    setTimeout(() => setShowContent(true), 50);
  };

  const renderPage = () => {
    if (pathname === '/blog') {
      return <BlogPage scrollY={scrollY} />;
    }

    if (pathname.startsWith('/blog/')) {
      const slug = decodeURIComponent(pathname.slice('/blog/'.length));
      return <BlogPostPage slug={slug} scrollY={scrollY} />;
    }

    return <HomePage scrollY={scrollY} />;
  };

  return (
    <>
      {!isLoaded && <Loading onComplete={handleLoadingComplete} />}
      
      <div 
        ref={mainRef}
        className={`min-h-screen bg-white transition-all duration-700 ${
          showContent ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
      >
        {renderPage()}
      </div>
    </>
  );
}

export default App;
