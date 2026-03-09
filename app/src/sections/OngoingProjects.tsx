import { useEffect, useRef, useState } from 'react';
import { Clock, GitBranch, AlertCircle, Brain, MessageSquare } from 'lucide-react';

interface OngoingProject {
  id: number;
  name: string;
  tagline: string;
  description: string;
  image: string;
  techStack: string[];
  status: 'in-progress' | 'prototype' | 'testing';
  progress: number;
  keyFeatures: string[];
  icon: React.ElementType;
}

const ongoingProjects: OngoingProject[] = [
  {
    id: 1,
    name: 'SentinelAI',
    tagline: 'Proactive Cyberbullying Detection System',
    description: 'An end-to-end AI-driven framework that shifts moderation from reactive filtering to proactive intervention. Uses BERT and RoBERTa to detect implicit toxicity, with real-time nudge mechanisms and SHAP/LIME explainability.',
    image: '/ongoing-1.jpg',
    techStack: ['Python', 'BERT', 'RoBERTa', 'FastAPI', 'Streamlit', 'SHAP', 'LIME'],
    status: 'in-progress',
    progress: 65,
    keyFeatures: [
      'Real-time toxicity detection using Transformers',
      'Proactive nudge before message submission',
      'SHAP/LIME explainability for transparency',
      'FastAPI backend with Streamlit dashboard'
    ],
    icon: AlertCircle,
  },
  {
    id: 2,
    name: 'MindWell AI',
    tagline: 'AI-Powered Mental Health Support Platform',
    description: 'An intelligent mental wellness platform that uses NLP and sentiment analysis to provide personalized support. Features AI chatbot therapy sessions, mood tracking, and evidence-based coping strategies.',
    image: '/ongoing-2.jpg',
    techStack: ['TensorFlow', 'React', 'Node.js', 'Python', 'MongoDB', 'Socket.io'],
    status: 'prototype',
    progress: 40,
    keyFeatures: [
      'AI therapist with contextual understanding',
      'Real-time sentiment analysis',
      'Personalized wellness recommendations',
      'Secure, HIPAA-compliant architecture'
    ],
    icon: Brain,
  },
];

function StatusBadge({ status }: { status: string }) {
  const styles = {
    'in-progress': 'bg-amber-100 text-amber-700',
    'prototype': 'bg-blue-100 text-blue-700',
    'testing': 'bg-green-100 text-green-700',
  };

  const labels = {
    'in-progress': 'In Progress',
    'prototype': 'Prototype',
    'testing': 'Testing',
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>
      {labels[status as keyof typeof labels]}
    </span>
  );
}

function ProjectCard({ project, index, isVisible }: { project: OngoingProject; index: number; isVisible: boolean }) {
  const isReversed = index % 2 === 1;

  return (
    <div
      className={`grid lg:grid-cols-2 gap-8 lg:gap-12 items-center transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'
      }`}
      style={{
        transitionTimingFunction: 'var(--ease-expo-out)',
        transitionDelay: `${400 + index * 200}ms`,
      }}
    >
      {/* Image */}
      <div className={`relative ${isReversed ? 'lg:order-2' : ''}`}>
        <div className="relative overflow-hidden rounded-2xl shadow-xl bg-[var(--apple-gray)]">
          <img
            src={project.image}
            alt={project.name}
            className="w-full aspect-video object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          
          {/* Progress Overlay */}
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center justify-between text-white text-sm mb-2">
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Progress
              </span>
              <span className="font-medium">{project.progress}%</span>
            </div>
            <div className="h-2 bg-white/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-[var(--apple-blue)] rounded-full transition-all duration-1000 ease-out"
                style={{ width: isVisible ? `${project.progress}%` : '0%' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className={`${isReversed ? 'lg:order-1' : ''}`}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-[var(--apple-blue)]/10 flex items-center justify-center">
            <project.icon className="w-5 h-5 text-[var(--apple-blue)]" />
          </div>
          <StatusBadge status={project.status} />
        </div>

        <h3 className="text-2xl sm:text-3xl font-semibold text-[var(--apple-dark)] mb-2">
          {project.name}
        </h3>
        <p className="text-[var(--apple-blue)] font-medium mb-4">{project.tagline}</p>
        <p className="text-[var(--apple-text)] leading-relaxed mb-6">
          {project.description}
        </p>

        {/* Key Features */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-[var(--apple-dark)] mb-3">
            Key Features
          </h4>
          <ul className="space-y-2">
            {project.keyFeatures.map((feature, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-[var(--apple-text)]">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--apple-blue)] mt-2 flex-shrink-0" />
                {feature}
              </li>
            ))}
          </ul>
        </div>

        {/* Tech Stack */}
        <div>
          <h4 className="text-sm font-semibold text-[var(--apple-dark)] mb-3 flex items-center gap-2">
            <GitBranch className="w-4 h-4" />
            Tech Stack
          </h4>
          <div className="flex flex-wrap gap-2">
            {project.techStack.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1.5 text-xs font-medium rounded-lg bg-[var(--apple-gray)] text-[var(--apple-dark)]"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OngoingProjects() {
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
      id="ongoing"
      ref={sectionRef}
      className="pt-14 pb-14 sm:pt-16 sm:pb-16 bg-white relative"
    >
      <div className="section-container">
        {/* Header */}
        <div className="max-w-3xl mb-16">
          <div
            className={`flex items-center gap-2 mb-4 transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{ transitionTimingFunction: 'var(--ease-expo-out)' }}
          >
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm font-medium text-green-600">Currently Building</span>
          </div>
          
          <h2
            className={`text-4xl sm:text-5xl font-semibold text-[var(--apple-dark)] mb-4 transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
            style={{ transitionTimingFunction: 'var(--ease-expo-out)', transitionDelay: '100ms' }}
          >
            Ongoing Projects
          </h2>
          <p
            className={`text-lg text-[var(--apple-text)] transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ transitionTimingFunction: 'var(--ease-expo-out)', transitionDelay: '200ms' }}
          >
            Here&apos;s what I&apos;m working on right now. These projects represent my focus areas 
            in AI/ML and full-stack development.
          </p>
        </div>

        {/* Projects */}
        <div className="space-y-20">
          {ongoingProjects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              isVisible={isVisible}
            />
          ))}
        </div>

        {/* Call to Action */}
        <div
          className={`mt-20 text-center transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ transitionTimingFunction: 'var(--ease-expo-out)', transitionDelay: '800ms' }}
        >
          <div className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl bg-[var(--apple-gray)]">
            <MessageSquare className="w-5 h-5 text-[var(--apple-blue)]" />
            <p className="text-[var(--apple-text)]">
              Interested in collaborating?{' '}
              <a href="#contact" className="text-[var(--apple-blue)] font-medium hover:underline">
                Let&apos;s talk
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
