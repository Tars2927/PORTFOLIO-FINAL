import { useEffect, useRef, useState } from 'react';
import { ArrowRight, ChevronDown } from 'lucide-react';

export default function Hero() {
  const [isVisible, setIsVisible] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 200);
    return () => clearTimeout(timer);
  }, []);

  // Aurora background effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener('resize', resize);

    const drawAurora = () => {
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Create gradient aurora effect
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, `rgba(0, 113, 227, ${0.03 + Math.sin(time) * 0.01})`);
      gradient.addColorStop(0.5, `rgba(245, 245, 247, ${0.5 + Math.cos(time * 0.5) * 0.1})`);
      gradient.addColorStop(1, `rgba(0, 113, 227, ${0.02 + Math.sin(time * 0.7) * 0.01})`);

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Add flowing waves
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.moveTo(0, canvas.height * (0.3 + i * 0.2));

        for (let x = 0; x < canvas.width; x += 10) {
          const y =
            canvas.height * (0.3 + i * 0.2) +
            Math.sin((x + time * 50) * 0.003 + i) * 50 +
            Math.sin((x + time * 30) * 0.001) * 30;
          ctx.lineTo(x, y);
        }

        ctx.lineTo(canvas.width, canvas.height);
        ctx.lineTo(0, canvas.height);
        ctx.closePath();

        const waveGradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
        waveGradient.addColorStop(
          0,
          `rgba(0, 113, 227, ${0.02 - i * 0.005})`
        );
        waveGradient.addColorStop(
          0.5,
          `rgba(0, 113, 227, ${0.04 - i * 0.01})`
        );
        waveGradient.addColorStop(
          1,
          `rgba(0, 113, 227, ${0.02 - i * 0.005})`
        );

        ctx.fillStyle = waveGradient;
        ctx.fill();
      }

      time += 0.01;
      animationId = requestAnimationFrame(drawAurora);
    };

    drawAurora();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  const handleScrollToProjects = () => {
    const element = document.querySelector('#projects');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScrollToContact = () => {
    const element = document.querySelector('#contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Aurora Background Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ zIndex: 0 }}
      />

      {/* Floating decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 1 }}>
        <div
          className="absolute top-1/4 left-[10%] w-64 h-64 rounded-full opacity-30"
          style={{
            background: 'radial-gradient(circle, rgba(0,113,227,0.1) 0%, transparent 70%)',
            animation: 'float 8s ease-in-out infinite',
          }}
        />
        <div
          className="absolute bottom-1/3 right-[15%] w-48 h-48 rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(0,113,227,0.15) 0%, transparent 70%)',
            animation: 'float 10s ease-in-out infinite reverse',
          }}
        />
        <div
          className="absolute top-1/2 right-[25%] w-32 h-32 rounded-full opacity-25"
          style={{
            background: 'radial-gradient(circle, rgba(0,113,227,0.12) 0%, transparent 70%)',
            animation: 'float 6s ease-in-out infinite 1s',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 section-container text-center max-w-4xl mx-auto px-6">
        {/* Eyebrow */}
        <div
          className={`mb-6 transition-all duration-700 ${
            isVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-4'
          }`}
          style={{ transitionTimingFunction: 'var(--ease-expo-out)', transitionDelay: '300ms' }}
        >
          <span className="inline-block text-sm font-medium tracking-widest uppercase text-[var(--apple-text)]">
            B.Tech CSE Student | Full-Stack Developer | AI/ML Enthusiast
          </span>
        </div>

        {/* Main Heading */}
        <h1 className="mb-8">
          {['Building', 'Intelligent'].map((word, index) => (
            <span
              key={word}
              className={`inline-block mr-4 last:mr-0 text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tight text-[var(--apple-dark)] transition-all duration-700 ${
                isVisible
                  ? 'opacity-100 translate-y-0 rotate-x-0'
                  : 'opacity-0 translate-y-20'
              }`}
              style={{
                transitionTimingFunction: 'var(--ease-expo-out)',
                transitionDelay: `${500 + index * 100}ms`,
              }}
            >
              {word}
            </span>
          ))}
          <br />
          {['Web', 'Solutions'].map((word, index) => (
            <span
              key={word}
              className={`inline-block mr-4 last:mr-0 text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tight transition-all duration-700 ${
                index === 1 ? 'gradient-text' : 'text-[var(--apple-dark)]'
              } ${
                isVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-20'
              }`}
              style={{
                transitionTimingFunction: 'var(--ease-expo-out)',
                transitionDelay: `${700 + index * 100}ms`,
              }}
            >
              {word}
            </span>
          ))}
        </h1>

        {/* Subheading */}
        <p
          className={`text-lg sm:text-xl text-[var(--apple-text)] max-w-2xl mx-auto mb-10 leading-relaxed transition-all duration-700 ${
            isVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-8'
          }`}
          style={{
            transitionTimingFunction: 'var(--ease-expo-out)',
            transitionDelay: '1000ms',
          }}
        >
          Results-driven Computer Science student with expertise in full-stack development 
          and AI/ML. Passionate about building intelligent, scalable applications that 
          enhance user experiences and drive innovation.
        </p>

        {/* CTA Buttons */}
        <div
          className={`flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-700 ${
            isVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-8'
          }`}
          style={{
            transitionTimingFunction: 'var(--ease-expo-out)',
            transitionDelay: '1200ms',
          }}
        >
          <button onClick={handleScrollToProjects} className="btn-apple group">
            View My Projects
            <ArrowRight className="ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
          <button onClick={handleScrollToContact} className="btn-apple-secondary">
            Get In Touch
          </button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className={`absolute bottom-8 left-1/2 -translate-x-1/2 transition-all duration-700 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          transitionTimingFunction: 'var(--ease-expo-out)',
          transitionDelay: '1500ms',
        }}
      >
        <button
          onClick={handleScrollToProjects}
          className="flex flex-col items-center gap-2 text-[var(--apple-text)] hover:text-[var(--apple-blue)] transition-colors"
          aria-label="Scroll to projects"
        >
          <span className="text-xs font-medium tracking-wide">Scroll</span>
          <ChevronDown className="w-5 h-5 animate-bounce" />
        </button>
      </div>
    </section>
  );
}
