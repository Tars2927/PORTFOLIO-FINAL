import { useEffect, useRef, useState } from 'react';

interface Testimonial {
  name: string;
  role: string;
  quote: string;
}

const testimonials: Testimonial[] = [
  {
    name: 'Faculty Mentor',
    role: 'Department of CSE, KIIT',
    quote:
      'Raunak consistently combines strong implementation skills with thoughtful engineering decisions. His project execution quality is well above student-level expectations.',
  },
  {
    name: 'Project Collaborator',
    role: 'AI/ML Team Member',
    quote:
      'He handles ambiguity very well, turns rough ideas into working prototypes quickly, and keeps the codebase organized so collaboration stays smooth.',
  },
  {
    name: 'Hackathon Teammate',
    role: 'Full-Stack Developer',
    quote:
      'From architecture to debugging under pressure, Raunak keeps a practical mindset and delivers outcomes without compromising reliability.',
  },
];

export default function Testimonials() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="testimonials" ref={sectionRef} className="py-24 sm:py-32 bg-[var(--apple-gray)]">
      <div className="section-container">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2
            className={`text-4xl sm:text-5xl font-semibold text-[var(--apple-dark)] mb-4 transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ transitionTimingFunction: 'var(--ease-expo-out)' }}
          >
            Testimonials
          </h2>
          <p
            className={`text-[var(--apple-text)] text-lg transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
            style={{ transitionTimingFunction: 'var(--ease-expo-out)', transitionDelay: '120ms' }}
          >
            Feedback from mentors and collaborators I&apos;ve worked with across projects.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((item, index) => (
            <article
              key={item.name + item.role}
              className={`rounded-2xl border border-black/10 bg-white p-6 shadow-sm transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{
                transitionTimingFunction: 'var(--ease-expo-out)',
                transitionDelay: `${220 + index * 120}ms`,
              }}
            >
              <p className="text-[var(--apple-text)] leading-relaxed mb-5">&ldquo;{item.quote}&rdquo;</p>
              <div>
                <p className="font-semibold text-[var(--apple-dark)]">{item.name}</p>
                <p className="text-sm text-[var(--apple-text)]">{item.role}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
