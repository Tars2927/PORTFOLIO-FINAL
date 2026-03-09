export interface BlogPost {
  slug: string;
  title: string;
  summary: string;
  publishedAt: string;
  readTime: string;
  tags: string[];
  content?: string[];
  markdown?: string;
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'secure-frontend-patterns-for-student-projects',
    title: 'Secure Frontend Patterns for Student Projects',
    summary:
      'Small front-end decisions can quietly create security gaps. These practical patterns help reduce common risks without slowing development.',
    publishedAt: '2026-02-24',
    readTime: '6 min read',
    tags: ['Frontend', 'Security', 'React'],
    content: [
      'Most student projects focus heavily on features and UI polish. Security is often treated as a final checklist item, which can leave avoidable vulnerabilities in production builds.',
      'Start by validating all user input at the boundary, including query params and form fields. Even if your backend also validates, front-end constraints improve reliability and user feedback.',
      'Avoid rendering unknown HTML directly in the DOM. If rich text is necessary, sanitize it first and keep a strict allowlist.',
      'Use least privilege in API design. If a page only needs read access, your token scope and endpoint behavior should reflect that.',
      'Security hygiene is not about perfection. It is about making safe defaults the easiest defaults in daily development.',
    ],
  },
  {
    slug: 'building-better-ml-project-demos',
    title: 'Building Better ML Project Demos',
    summary:
      'A good ML demo does more than predict. It communicates trust, limitations, and why the model should be used in the first place.',
    publishedAt: '2026-02-10',
    readTime: '5 min read',
    tags: ['Machine Learning', 'Product Thinking'],
    content: [
      'An impressive accuracy number is rarely enough for a useful project demo. Viewers need context: what problem is being solved and what tradeoffs were accepted.',
      'Always show where the model fails. False positives and false negatives are not just metrics; they explain risk in real usage.',
      'Use clear confidence thresholds and expose them in your UI so reviewers can see how behavior changes with stricter settings.',
      'If your model output drives decisions, include an explanation panel with feature importance or reason codes when possible.',
      'A strong ML demo is transparent, testable, and honest about scope. That earns more trust than polished charts alone.',
    ],
  },
  {
    slug: 'from-portfolio-projects-to-production-habits',
    title: 'From Portfolio Projects to Production Habits',
    summary:
      'Turning side projects into career signals means adopting production habits: structure, testing, observability, and documentation.',
    publishedAt: '2026-01-28',
    readTime: '7 min read',
    tags: ['Career', 'Engineering', 'Best Practices'],
    content: [
      'Recruiters and engineering teams often look for signs of long-term reliability, not just isolated technical wins. Your portfolio can demonstrate this directly.',
      'Add lightweight test coverage for critical paths and include a short README section describing how to run and verify the app.',
      'Document assumptions in code and avoid hidden magic values. Future collaborators should understand why choices were made.',
      'Treat error handling as a first-class concern. Useful error states, retries, and monitoring hooks separate toy apps from production-oriented work.',
      'The goal is not enterprise complexity. The goal is proving that your engineering habits can scale when projects become real products.',
    ],
  },
];

export const getBlogPostBySlug = (slug: string): BlogPost | undefined =>
  blogPosts.find((post) => post.slug === slug);
