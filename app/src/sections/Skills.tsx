import { useEffect, useRef, useState } from 'react';

interface Skill {
  name: string;
  category: 'languages' | 'web' | 'databases' | 'datascience' | 'devtools' | 'other';
}

const skills: Skill[] = [
  // Languages
  { name: 'C', category: 'languages' },
  { name: 'C++', category: 'languages' },
  { name: 'Java', category: 'languages' },
  { name: 'Python', category: 'languages' },
  { name: 'HTML/CSS', category: 'languages' },
  { name: 'JavaScript', category: 'languages' },
  { name: 'GoLang', category: 'languages' },
  // Web Development
  { name: 'Next.js', category: 'web' },
  { name: 'React', category: 'web' },
  { name: 'Express', category: 'web' },
  { name: 'Node.js', category: 'web' },
  { name: 'Tailwind CSS', category: 'web' },
  { name: 'Bootstrap', category: 'web' },
  { name: 'Streamlit', category: 'web' },
  // Databases
  { name: 'MongoDB', category: 'databases' },
  { name: 'MySQL', category: 'databases' },
  { name: 'Firestore', category: 'databases' },
  { name: 'SQLite', category: 'databases' },
  // Data Science
  { name: 'TensorFlow', category: 'datascience' },
  { name: 'PyTorch', category: 'datascience' },
  { name: 'NumPy', category: 'datascience' },
  { name: 'Pandas', category: 'datascience' },
  // DevTools
  { name: 'Git', category: 'devtools' },
  { name: 'GitHub', category: 'devtools' },
  { name: 'VS Code', category: 'devtools' },
  { name: 'PyCharm', category: 'devtools' },
  { name: 'Google Colab', category: 'devtools' },
  { name: 'Vercel', category: 'devtools' },
  { name: 'Firebase', category: 'devtools' },
  // Other
  { name: 'AWS', category: 'other' },
  { name: 'GCP', category: 'other' },
  { name: 'Linux', category: 'other' },
  { name: 'REST APIs', category: 'other' },
];

const categories = [
  {
    key: 'languages',
    label: 'Languages',
    color:
      'bg-[var(--surface-2)] text-[var(--text-strong)] border border-[var(--border-soft)]',
  },
  { key: 'web', label: 'Web Development', color: 'bg-[var(--apple-blue)] text-white' },
  { key: 'databases', label: 'Databases', color: 'bg-purple-600 text-white' },
  { key: 'datascience', label: 'Data Science & AI', color: 'bg-emerald-600 text-white' },
  { key: 'devtools', label: 'DevTools', color: 'bg-orange-500 text-white' },
  { key: 'other', label: 'Cloud & Others', color: 'bg-slate-600 text-white' },
];

function SkillBadge({
  skill,
  index,
  isVisible,
  colorClass,
}: {
  skill: Skill;
  index: number;
  isVisible: boolean;
  colorClass: string;
}) {
  return (
    <div
      className={`transition-all duration-500 ${
        isVisible
          ? 'opacity-100 translate-y-0 scale-100'
          : 'opacity-0 translate-y-8 scale-90'
      }`}
      style={{
        transitionTimingFunction: 'var(--ease-expo-out)',
        transitionDelay: `${400 + index * 40}ms`,
      }}
    >
      <span
        className={`inline-block px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105 hover:shadow-md ${colorClass}`}
      >
        {skill.name}
      </span>
    </div>
  );
}

export default function Skills() {
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
      id="skills"
      ref={sectionRef}
      className="pt-14 pb-24 sm:pt-16 sm:pb-32 bg-white relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-30"
          style={{
            background:
              'radial-gradient(circle, rgba(0,113,227,0.05) 0%, transparent 70%)',
          }}
        />
      </div>

      <div className="section-container relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2
            className={`text-4xl sm:text-5xl font-semibold text-[var(--apple-dark)] mb-4 transition-all duration-700 ${
              isVisible
                ? 'opacity-100 translate-y-0 scale-100'
                : 'opacity-0 translate-y-10 scale-95'
            }`}
            style={{ transitionTimingFunction: 'var(--ease-expo-out)' }}
          >
            Skills & Technologies
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
            Technologies and tools I work with to build intelligent, scalable applications
          </p>
        </div>

        {/* Skills by Category */}
        <div className="max-w-5xl mx-auto space-y-10">
          {categories.map((category, catIndex) => {
            const categorySkills = skills.filter((s) => s.category === category.key);
            if (categorySkills.length === 0) return null;

            return (
              <div
                key={category.key}
                className={`transition-all duration-700 ${
                  isVisible
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-8'
                }`}
                style={{
                  transitionTimingFunction: 'var(--ease-expo-out)',
                  transitionDelay: `${300 + catIndex * 100}ms`,
                }}
              >
                <h3 className="text-sm font-medium text-[var(--apple-text)] uppercase tracking-wider mb-4">
                  {category.label}
                </h3>
                <div className="flex flex-wrap gap-3">
                  {categorySkills.map((skill, index) => (
                    <SkillBadge
                      key={skill.name}
                      skill={skill}
                      index={index}
                      isVisible={isVisible}
                      colorClass={category.color}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Languages */}
        <div
          className={`mt-16 text-center transition-all duration-700 ${
            isVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-8'
          }`}
          style={{
            transitionTimingFunction: 'var(--ease-expo-out)',
            transitionDelay: '1000ms',
          }}
        >
          <p className="text-sm text-[var(--apple-text)] mb-3">Languages I Speak</p>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-4 max-w-3xl mx-auto">
            <span className="px-3 sm:px-4 py-2 rounded-full bg-[var(--apple-gray)] text-[var(--apple-dark)] text-xs sm:text-sm font-medium">
              English
            </span>
            <span className="px-3 sm:px-4 py-2 rounded-full bg-[var(--apple-gray)] text-[var(--apple-dark)] text-xs sm:text-sm font-medium">
              Hindi
            </span>
            <span className="px-3 sm:px-4 py-2 rounded-full bg-[var(--apple-gray)] text-[var(--apple-dark)] text-xs sm:text-sm font-medium">
              Japanese (Elementary)
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
