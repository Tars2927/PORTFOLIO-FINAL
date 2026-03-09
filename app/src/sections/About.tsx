import { useEffect, useRef, useState } from 'react';
import { Award, BookOpen, Clock3, GraduationCap, Sparkles } from 'lucide-react';

interface StatProps {
  value: number;
  suffix: string;
  label: string;
  isVisible: boolean;
  delay: number;
}

function AnimatedStat({ value, suffix, label, isVisible, delay }: StatProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isVisible) return;
    let intervalId: number | null = null;
    const timerId = window.setTimeout(() => {
      const duration = 1500;
      const steps = 60;
      const increment = value / steps;
      let current = 0;
      intervalId = window.setInterval(() => {
        current += increment;
        if (current >= value) {
          setCount(value);
          if (intervalId) window.clearInterval(intervalId);
        } else {
          setCount(Math.floor(current));
        }
      }, duration / steps);
    }, delay);
    return () => {
      window.clearTimeout(timerId);
      if (intervalId) window.clearInterval(intervalId);
    };
  }, [delay, isVisible, value]);

  return (
    <div style={{
      textAlign: 'center',
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'scale(1)' : 'scale(0.9)',
      transition: `all 700ms var(--ease-expo-out) ${delay}ms`,
    }}>
      <div style={{ fontSize: '2rem', fontWeight: 600, color: 'var(--text-strong)', marginBottom: '0.25rem' }}>
        {count}{suffix}
      </div>
      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{label}</div>
    </div>
  );
}

export default function About() {
  const [isVisible, setIsVisible] = useState(false);
  const [timeLabel, setTimeLabel] = useState('');
  const [viewportWidth, setViewportWidth] = useState(1200);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { setIsVisible(true); observer.disconnect(); }
      },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const formatter = new Intl.DateTimeFormat('en-IN', {
      hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'Asia/Kolkata',
    });
    const updateTime = () => setTimeLabel(formatter.format(new Date()));
    updateTime();
    const id = window.setInterval(updateTime, 60000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const updateViewport = () => setViewportWidth(window.innerWidth);
    updateViewport();
    window.addEventListener('resize', updateViewport, { passive: true });
    return () => window.removeEventListener('resize', updateViewport);
  }, []);

  const stats = [
    { value: 3,  suffix: '+', label: 'Years Coding'   },
    { value: 20, suffix: '+', label: 'Projects Built' },
    { value: 10, suffix: '+', label: 'Certifications' },
  ];

  const certifications = [
    { name: 'AWS Cloud Architecture', url: 'https://www.credly.com/badges/2949816d-9fc3-4bdf-9014-0ce4d77718a1/public_url' },
    { name: 'AWS Cloud Foundation', url: 'https://www.credly.com/badges/284ac671-37c4-4d14-89b6-fcb6f6e6d171/public_url' },
    { name: 'Red Hat System Administration I (RH124 - RHA)', url: 'https://www.credly.com/badges/ce39b3aa-96f9-43ea-8b5d-e09164d3339d/public_url' },
    { name: 'Cisco Cyber Threat Management', url: 'https://www.credly.com/badges/0f4b4814-42cf-432a-9dc1-eabc45b9f453/public_url' },
    { name: 'Junior Cybersecurity Analyst', url: 'https://www.credly.com/badges/8d4216c6-9335-47e2-b31b-cd50d2f7c9c9/public_url' },
    { name: 'Cloud Computing Security (University of Colorado)', url: 'https://coursera.org/share/a9ff90c1cdfa40f7eb28b55baa5d8630' },
  ];

  const focusAreas = ['Full-Stack', 'AI/ML', 'Cybersecurity'];
  const ease        = 'var(--ease-expo-out)';
  const accentBlue  = '#0071E3';
  const isMobile = viewportWidth < 768;
  const isTablet = viewportWidth < 1024;

  return (
    <section
      id="about"
      ref={sectionRef}
      style={{
        background: 'var(--surface-0)',
        padding: isMobile ? '4rem 0' : '5rem 0',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle blue blob top-right */}
      <div style={{
        position: 'absolute', top: '-5rem', right: '-5rem',
        width: '28rem', height: '28rem', borderRadius: '50%',
        background: 'var(--theme-blob)', filter: 'blur(60px)', pointerEvents: 'none',
      }} />

      <div
        style={{
          maxWidth: '72rem',
          margin: '0 auto',
          padding: isMobile ? '0 1rem' : '0 2rem',
          position: 'relative',
          zIndex: 1,
        }}
      >

        {/* ── TOP ROW: text left · photo right ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isTablet ? '1fr' : '1fr auto',
          columnGap: isTablet ? '1.5rem' : '3.5rem',
          rowGap: isTablet ? '1.5rem' : '0',
          alignItems: 'center',
        }}>

          {/* LEFT — all text content */}
          <div>
            <h2 style={{
              fontFamily: "'DM Serif Display', 'Playfair Display', Georgia, serif",
              fontSize: isMobile ? '2.2rem' : 'clamp(2.8rem, 5.5vw, 4.5rem)',
              fontWeight: 400,
              lineHeight: 0.95,
              letterSpacing: '-0.02em',
              color: 'var(--text-strong)',
              marginBottom: '1.75rem',
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(2.5rem)',
              transition: 'all 700ms',
              transitionTimingFunction: ease,
            }}>
              About Me
            </h2>

            <p style={{
              fontSize: isMobile ? '0.98rem' : '1.05rem',
              lineHeight: 1.75,
              color: 'var(--text-body)',
              marginBottom: '1rem',
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(2rem)',
              transition: 'all 700ms 120ms',
              transitionTimingFunction: ease,
            }}>
              I&apos;m a Computer Science and Engineering student in my 4th year at KIIT Deemed to
              be University. With a minor in AI/ML from IIT Ropar, I&apos;ve built 20+ projects and
              developed a strong foundation in software engineering, machine learning, and
              cybersecurity.
            </p>

            <p style={{
              fontSize: isMobile ? '0.98rem' : '1.05rem',
              lineHeight: 1.75,
              color: 'var(--text-body-2)',
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(2rem)',
              transition: 'all 700ms 220ms',
              transitionTimingFunction: ease,
            }}>
              My work spans full-stack development with Next.js, React, Node.js, and Python, along
              with AI/ML using TensorFlow and PyTorch. I apply cybersecurity essentials — secure
              coding and threat-aware design — to build intelligent, secure, and scalable
              applications.
            </p>

            {/* Focus tags */}
            <div style={{
              marginTop: '1.75rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem',
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(1.5rem)',
              transition: 'all 700ms 300ms',
              transitionTimingFunction: ease,
            }}>
              {focusAreas.map((area) => (
                <span key={area} style={{
                  padding: '0.35rem 0.9rem', fontSize: '0.75rem', fontWeight: 600,
                  borderRadius: '9999px', background: 'var(--chip-bg)', color: 'var(--chip-text)',
                  border: '1px solid var(--border-soft)',
                }}>
                  {area}
                </span>
              ))}
            </div>

            {/* Learning + time pill */}
            <div style={{
              marginTop: '1.5rem',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: '0.75rem',
              maxWidth: '100%',
              padding: isMobile ? '0.85rem 1rem' : '0.6rem 1.25rem',
              borderRadius: isMobile ? '1rem' : '9999px',
              background: 'var(--surface-2)', border: '1px solid var(--border-soft)',
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(1.5rem)',
              transition: 'all 700ms 360ms',
              transitionTimingFunction: ease,
            }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', color: 'var(--text-body)', minWidth: 0 }}>
                <Sparkles style={{ width: '1rem', height: '1rem', color: '#f59e0b' }} />
                Currently learning: LLM-powered workflows and cloud security best practices.
              </span>
              <span style={{ color: 'var(--divider-soft)' }}>•</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-body)' }}>
                <Clock3 style={{ width: '1rem', height: '1rem', color: '#0ea5e9' }} />
                {timeLabel || '--:--'}
              </span>
            </div>
          </div>

          {/* RIGHT — circular profile photo */}
          <div style={{
            flexShrink: 0,
            justifySelf: isTablet ? 'center' : 'end',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateX(0)' : 'translateX(3rem)',
            transition: 'all 700ms 280ms',
            transitionTimingFunction: ease,
          }}>
            <div style={{
              width: isMobile ? '11.5rem' : 'clamp(13rem, 20vw, 21rem)',
              height: isMobile ? '11.5rem' : 'clamp(13rem, 20vw, 21rem)',
              borderRadius: '50%',
              border: '2px solid var(--border-soft)',
              background: 'var(--surface-2)',
              overflow: 'hidden',
              flexShrink: 0,
            }}>
              <img
                src="/profile.jpg?v=20260308"
                alt="Profile Photo"
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block' }}
              />
            </div>
          </div>
        </div>

        {/* ── EDUCATION + CERTIFICATIONS ── */}
        <div style={{
          marginTop: '3rem',
          display: 'grid',
          gridTemplateColumns: isTablet ? '1fr' : 'repeat(2, 1fr)',
          gap: '1.25rem',
        }}>
          {/* Education */}
          <div style={{
            borderRadius: '1rem', border: '1px solid var(--border-soft)', background: 'var(--surface-1)', padding: '1.5rem',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(2rem)',
            transition: 'all 700ms 450ms',
            transitionTimingFunction: ease,
          }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-strong)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <GraduationCap style={{ width: '1rem', height: '1rem', color: accentBlue }} />
              Education
            </h3>
            {[
              { title: 'B.Tech in Computer Science & Engineering', sub: 'KIIT Deemed to be University (2022–2026)' },
              { title: 'Minor in AI/ML', sub: 'IIT Ropar (2024–2025)' },
            ].map((item) => (
              <div key={item.title} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem', marginBottom: '0.65rem' }}>
                <BookOpen style={{ width: '0.9rem', height: '0.9rem', color: 'var(--text-muted)', marginTop: '0.2rem', flexShrink: 0 }} />
                <div>
                  <p style={{ fontWeight: 500, color: 'var(--text-strong)', fontSize: '0.9rem', margin: 0 }}>{item.title}</p>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>{item.sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Certifications */}
          <div style={{
            borderRadius: '1rem', border: '1px solid var(--border-soft)', background: 'var(--surface-1)', padding: '1.5rem',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(2rem)',
            transition: 'all 700ms 520ms',
            transitionTimingFunction: ease,
          }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-strong)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Award style={{ width: '1rem', height: '1rem', color: accentBlue }} />
              Certifications
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {certifications.map((cert) => (
                <a
                  key={cert.name}
                  href={cert.url}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                  padding: '0.3rem 0.75rem', fontSize: '0.75rem', fontWeight: 500,
                  borderRadius: '9999px', background: 'var(--surface-3)', color: 'var(--text-body)', border: '1px solid var(--border-soft)',
                  textDecoration: 'none',
                }}
                >
                  {cert.name}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* ── STATS ── */}
        <div style={{
          marginTop: '1.5rem',
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
          gap: '1rem',
          borderRadius: '1rem',
          border: '1px solid var(--border-soft)',
          background: 'var(--surface-1)',
          padding: isMobile ? '1rem' : '1.5rem 2rem',
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(1.5rem)',
          transition: 'all 700ms 580ms',
          transitionTimingFunction: ease,
        }}>
          {stats.map((stat, i) => (
            <AnimatedStat key={stat.label} {...stat} isVisible={isVisible} delay={650 + i * 140} />
          ))}
        </div>

      </div>
    </section>
  );
}
