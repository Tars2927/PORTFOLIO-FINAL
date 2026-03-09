import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Github } from 'lucide-react';

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  tags: string[];
  githubLink: string;
}

const projects: Project[] = [
  {
    id: 1,
    title: 'Real-Time Object Detection Using YOLO',
    description: 'An AI-powered object detection system using YOLO for real-time accuracy. Integrated backend APIs to streamline data handling and improve performance with customizable detection models for video feeds and images.',
    image: '/project-1.jpg',
    tags: ['Python', 'YOLO', 'OpenCV', 'Flask', 'TensorFlow'],
    githubLink: 'https://github.com/Tars2927/Real-Time-Object-Detection-Using-YoLo-V8',
  },
  {
    id: 2,
    title: 'Neural Nexus: LLM Classifier Comparison Dashboard',
    description: 'An interactive Streamlit dashboard that benchmarks Gemini and Groq Llama 3.1 for zero-shot classification of long-tail web services. It visualizes accuracy and Macro F1, with comparison charts and misclassification analysis.',
    image: '/project-2.jpg',
    tags: ['Python', 'Streamlit', 'Plotly', 'Scikit-learn', 'Gemini', 'Groq'],
    githubLink: 'https://github.com/Tars2927/LONG-TAIL-WEB-SERVICE-CLASSIFICATION-USING-LLM-S-',
  },
  {
    id: 3,
    title: 'Adhyayan-Mitra: AI in Personalized Learning',
    description: 'A hybrid AI system that predicts student grades and generates personalized learning plans. Integrated Google Gemini API for dynamic feedback with a RandomForestRegressor model achieving 84% R² score.',
    image: '/project-3.jpg',
    tags: ['Python', 'Streamlit', 'Gemini API', 'Scikit-learn', 'Pandas'],
    githubLink: 'https://github.com/Tars2927/Adhyayan-Mitra-AI-in-Personalized-Learning',
  },
];

function ProjectCard({
  project,
  index,
  isVisible,
}: {
  project: Project;
  index: number;
  isVisible: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`group relative transition-all duration-700 ${
        isVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-16'
      }`}
      style={{
        transitionTimingFunction: 'var(--ease-expo-out)',
        transitionDelay: `${400 + index * 150}ms`,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden rounded-2xl bg-[var(--apple-gray)] card-hover">
        {/* Image */}
        <div className="relative aspect-[16/10] overflow-hidden">
          <img
            src={project.image}
            alt={project.title}
            className={`w-full h-full object-cover transition-transform duration-700 ${
              isHovered ? 'scale-105' : 'scale-100'
            }`}
          />
          {/* Overlay gradient */}
          <div
            className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-500 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
          />
          {/* Action buttons */}
          <div
            className={`absolute top-4 right-4 flex gap-2 transition-all duration-500 ${
              isHovered
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 -translate-y-2'
            }`}
          >
            <a
              href={project.githubLink}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open ${project.title} GitHub repository`}
              className="w-10 h-10 rounded-full backdrop-blur-sm flex items-center justify-center transition-colors"
              style={{
                background: 'color-mix(in srgb, var(--surface-0) 88%, transparent)',
                border: '1px solid var(--border-soft)',
                color: 'var(--text-strong)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <Github className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-start justify-between mb-3">
            <a
              href={project.githubLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xl font-semibold text-[var(--apple-dark)] group-hover:text-[var(--apple-blue)] transition-colors duration-300 hover:underline"
            >
              {project.title}
            </a>
            <ArrowUpRight
              className={`w-5 h-5 text-[var(--apple-text)] transition-all duration-300 ${
                isHovered
                  ? 'text-[var(--apple-blue)] translate-x-1 -translate-y-1'
                  : ''
              }`}
            />
          </div>
          <p className="text-[var(--apple-text)] text-sm leading-relaxed mb-4">
            {project.description}
          </p>
          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 text-xs font-medium rounded-full bg-white text-[var(--apple-dark)] border border-black/5"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Projects() {
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
      id="projects"
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
            Featured Projects
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
            A showcase of my work in AI/ML, full-stack development, and web applications.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              isVisible={isVisible}
            />
          ))}
        </div>

        {/* GitHub Link */}
        <div
          className={`text-center mt-12 transition-all duration-700 ${
            isVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-8'
          }`}
          style={{
            transitionTimingFunction: 'var(--ease-expo-out)',
            transitionDelay: '800ms',
          }}
        >
          <a
            href="https://github.com/Tars2927"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[var(--apple-blue)] font-medium hover:underline"
          >
            <Github className="w-5 h-5" />
            View More on GitHub
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
