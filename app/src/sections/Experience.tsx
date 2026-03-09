import { useEffect, useRef, useState } from 'react';
import { GraduationCap, Calendar, MapPin, Award, BookOpen } from 'lucide-react';

interface EducationItem {
  id: number;
  degree: string;
  institution: string;
  location: string;
  period: string;
  description?: string;
  current?: boolean;
}

const education: EducationItem[] = [
  {
    id: 1,
    degree: 'B.Tech in Computer Science & Engineering',
    institution: 'KIIT Deemed to be University',
    location: 'Bhubaneswar, Odisha',
    period: '2022 - 2026',
    description: 'Pursuing B.Tech with focus on software development, algorithms, and system design. Built production-style projects, practiced secure coding fundamentals, and stayed active in coding competitions and hackathons.',
    current: true,
  },
  {
    id: 2,
    degree: 'Minor in AI/ML',
    institution: 'IIT Ropar',
    location: 'Punjab',
    period: '2024 - 2025',
    description: 'Specialized minor program covering machine learning fundamentals, deep learning, and AI applications, with emphasis on model reliability and practical deployment.',
  },
];

const certifications = [
  {
    name: 'AWS Cloud Architecture',
    provider: 'Amazon Web Services',
    icon: Award,
    url: 'https://www.credly.com/badges/2949816d-9fc3-4bdf-9014-0ce4d77718a1/public_url',
  }, 
  {
    name: 'AWS Cloud Foundation',
    provider: 'Amazon Web Services',
    icon: Award,
    url: 'https://www.credly.com/badges/284ac671-37c4-4d14-89b6-fcb6f6e6d171/public_url',
  },
   {
    name: 'Red Hat System Administration I (RH124 - RHA)',
    provider: 'Red Hat',
    icon: Award,
    url: 'https://www.credly.com/badges/ce39b3aa-96f9-43ea-8b5d-e09164d3339d/public_url',
  },
  {
    name: 'Cisco Cyber Threat Management',
    provider: 'Cisco',
    icon: BookOpen,
    url: 'https://www.credly.com/badges/0f4b4814-42cf-432a-9dc1-eabc45b9f453/public_url',
  },
  {
    name: 'Junior Cybersecurity Analyst',
    provider: 'Cisco',
    icon: Award,
    url: 'https://www.credly.com/badges/8d4216c6-9335-47e2-b31b-cd50d2f7c9c9/public_url',
  },
  {
    name: 'Cloud Computing Security',
    provider: 'Coursera (University of Colorado)',
    icon: BookOpen,
    url: 'https://coursera.org/share/a9ff90c1cdfa40f7eb28b55baa5d8630',
  },
];

function TimelineItem({
  item,
  index,
  isVisible,
  isLast,
}: {
  item: EducationItem;
  index: number;
  isVisible: boolean;
  isLast: boolean;
}) {
  const isEven = index % 2 === 0;

  return (
    <div
      className={`relative grid md:grid-cols-2 gap-8 md:gap-16 transition-all duration-700 ${
        isVisible
          ? 'opacity-100 translate-x-0'
          : `opacity-0 ${isEven ? '-translate-x-16' : 'translate-x-16'}`
      }`}
      style={{
        transitionTimingFunction: 'var(--ease-expo-out)',
        transitionDelay: `${400 + index * 150}ms`,
      }}
    >
      {/* Timeline line and dot */}
      <div className="hidden md:block absolute left-1/2 top-0 bottom-0 -translate-x-1/2">
        {/* Vertical line */}
        {!isLast && (
          <div
            className={`absolute top-8 left-1/2 -translate-x-1/2 w-[2px] h-full bg-gradient-to-b from-[var(--apple-blue)]/30 to-transparent transition-all duration-1000 ${
              isVisible ? 'scale-y-100' : 'scale-y-0'
            }`}
            style={{
              transformOrigin: 'top',
              transitionDelay: `${500 + index * 150}ms`,
            }}
          />
        )}
        {/* Dot */}
        <div
          className={`relative z-10 w-4 h-4 rounded-full border-2 transition-all duration-500 ${
            item.current
              ? 'bg-[var(--apple-blue)] border-[var(--apple-blue)]'
              : 'bg-white border-[var(--apple-blue)]'
          } ${isVisible ? 'scale-100' : 'scale-0'}`}
          style={{
            transitionTimingFunction: 'var(--ease-elastic)',
            transitionDelay: `${400 + index * 150}ms`,
          }}
        >
          {item.current && (
            <div className="absolute inset-0 rounded-full bg-[var(--apple-blue)] animate-ping opacity-30" />
          )}
        </div>
      </div>

      {/* Content */}
      <div
        className={`${
          isEven ? 'md:text-right md:pr-8' : 'md:col-start-2 md:pl-8'
        }`}
      >
        <div className="group relative p-6 rounded-2xl bg-white border border-black/5 hover:border-[var(--apple-blue)]/20 hover:shadow-lg transition-all duration-500">
          {/* Current badge */}
          {item.current && (
            <span className="absolute -top-3 right-4 px-3 py-1 text-xs font-medium rounded-full bg-[var(--apple-blue)] text-white">
              Current
            </span>
          )}

          {/* Header */}
          <div className={`mb-4 ${isEven ? 'md:text-right' : ''}`}>
            <div
              className={`flex items-center gap-2 mb-2 ${
                isEven ? 'md:justify-end' : ''
              }`}
            >
              <GraduationCap className="w-5 h-5 text-[var(--apple-blue)]" />
              <span className="text-sm text-[var(--apple-text)]">Education</span>
            </div>
            <h3 className="text-xl font-semibold text-[var(--apple-dark)] mb-1 group-hover:text-[var(--apple-blue)] transition-colors">
              {item.degree}
            </h3>
            <p className="text-[var(--apple-text)] font-medium">{item.institution}</p>
          </div>

          {/* Meta info */}
          <div
            className={`flex flex-wrap items-center gap-4 mb-4 text-sm text-[var(--apple-text)] ${
              isEven ? 'md:justify-end' : ''
            }`}
          >
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{item.period}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>{item.location}</span>
            </div>
          </div>

          {/* Description */}
          {item.description && (
            <p
              className={`text-[var(--apple-text)] leading-relaxed text-sm ${
                isEven ? 'md:text-right' : ''
              }`}
            >
              {item.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Experience() {
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
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="education"
      ref={sectionRef}
      className="py-24 sm:py-32 bg-[var(--apple-gray)] relative"
    >
      <div className="section-container">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2
            className={`text-4xl sm:text-5xl font-semibold text-[var(--apple-dark)] mb-4 transition-all duration-700 ${
              isVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-10'
            }`}
            style={{ transitionTimingFunction: 'var(--ease-expo-out)' }}
          >
            Education & Certifications
          </h2>
          <p
            className={`text-[var(--apple-text)] text-lg transition-all duration-700 ${
              isVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-8'
            }`}
            style={{
              transitionTimingFunction: 'var(--ease-expo-out)',
              transitionDelay: '200ms',
            }}
          >
            My academic journey and professional certifications
          </p>
        </div>

        {/* Timeline */}
        <div className="max-w-4xl mx-auto space-y-8 md:space-y-0 mb-16">
          {education.map((item, index) => (
            <TimelineItem
              key={item.id}
              item={item}
              index={index}
              isVisible={isVisible}
              isLast={index === education.length - 1}
            />
          ))}
        </div>

        {/* Certifications */}
        <div
          className={`max-w-4xl mx-auto transition-all duration-700 ${
            isVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-8'
          }`}
          style={{
            transitionTimingFunction: 'var(--ease-expo-out)',
            transitionDelay: '1000ms',
          }}
        >
          <h3 className="text-xl font-semibold text-[var(--apple-dark)] mb-6 text-center">
            Professional Certifications
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {certifications.map((cert, index) => (
              <a
                key={cert.name}
                href={cert.url}
                target="_blank"
                rel="noreferrer"
                className={`flex items-center gap-4 p-4 rounded-xl bg-white border border-black/5 hover:border-[var(--apple-blue)]/20 hover:shadow-md transition-all duration-500 ${
                  isVisible
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-4'
                }`}
                style={{
                  transitionTimingFunction: 'var(--ease-expo-out)',
                  transitionDelay: `${1100 + index * 100}ms`,
                  textDecoration: 'none',
                }}
              >
                <div className="w-10 h-10 rounded-full bg-[var(--apple-blue)]/10 flex items-center justify-center flex-shrink-0">
                  <cert.icon className="w-5 h-5 text-[var(--apple-blue)]" />
                </div>
                <div>
                  <p className="font-medium text-[var(--apple-dark)]">{cert.name}</p>
                  <p className="text-sm text-[var(--apple-text)]">{cert.provider}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
