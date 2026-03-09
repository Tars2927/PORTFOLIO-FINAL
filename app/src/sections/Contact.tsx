import { useEffect, useRef, useState } from 'react';
import { Mail, Github, Linkedin, Twitter, Send, CheckCircle } from 'lucide-react';

interface SocialLink {
  name: string;
  icon: React.ElementType;
  href: string;
  color: string;
}

const socialLinks: SocialLink[] = [
  { name: 'GitHub', icon: Github, href: 'https://github.com/Tars2927', color: '#333' },
  { name: 'LinkedIn', icon: Linkedin, href: 'https://linkedin.com/in/raunak-mishra-a72961256', color: '#0077b5' },
  { name: 'Twitter', icon: Twitter, href: 'https://x.com/TARS79004679', color: '#1da1f2' },
];

export default function Contact() {
  const [isVisible, setIsVisible] = useState(false);
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    const payload = {
      name: formState.name.trim(),
      email: formState.email.trim(),
      subject: formState.subject.trim(),
      message: formState.message.trim(),
      website: '',
    };

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        const message =
          payload?.message || 'Something went wrong. Please try again.';
        throw new Error(message);
      }

      setIsSubmitted(true);
      setFormState({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to send message.';
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormState((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="py-24 sm:py-32 bg-white relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-0 right-0 w-1/2 h-full opacity-30"
          style={{
            background:
              'radial-gradient(ellipse at top right, rgba(0,113,227,0.05) 0%, transparent 60%)',
          }}
        />
      </div>

      <div className="section-container relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 max-w-6xl mx-auto">
          {/* Left Column - Content */}
          <div>
            <h2
              className={`text-4xl sm:text-5xl font-semibold text-[var(--apple-dark)] mb-6 transition-all duration-700 ${
                isVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionTimingFunction: 'var(--ease-expo-out)' }}
            >
              Let&apos;s Connect
              <br />
              <span className="gradient-text">& Collaborate</span>
            </h2>

            <p
              className={`text-[var(--apple-text)] text-lg leading-relaxed mb-8 transition-all duration-700 ${
                isVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
              }`}
              style={{
                transitionTimingFunction: 'var(--ease-expo-out)',
                transitionDelay: '200ms',
              }}
            >
              I&apos;m actively seeking internship and early-career opportunities in 
              Full-Stack Development, AI/ML Engineering, and Cybersecurity. Whether 
              you have a project idea, role opening, or collaboration in mind, I&apos;d 
              love to connect.
            </p>

            {/* Email */}
            <div
              className={`flex items-center gap-3 mb-10 transition-all duration-700 ${
                isVisible
                  ? 'opacity-100 translate-x-0'
                  : 'opacity-0 -translate-x-8'
              }`}
              style={{
                transitionTimingFunction: 'var(--ease-expo-out)',
                transitionDelay: '400ms',
              }}
            >
              <div className="w-12 h-12 rounded-full bg-[var(--apple-gray)] flex items-center justify-center">
                <Mail className="w-5 h-5 text-[var(--apple-blue)]" />
              </div>
              <div>
                <p className="text-sm text-[var(--apple-text)]">Email me at</p>
                <a
                  href="mailto:mishraraunakkumar3@gmail.com"
                  className="text-[var(--apple-dark)] font-medium hover:text-[var(--apple-blue)] transition-colors"
                >
                  mishraraunakkumar3@gmail.com
                </a>
              </div>
            </div>

            {/* Social Links */}
            <div
              className={`transition-all duration-700 ${
                isVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
              }`}
              style={{
                transitionTimingFunction: 'var(--ease-expo-out)',
                transitionDelay: '600ms',
              }}
            >
              <p className="text-sm text-[var(--apple-text)] mb-4">
                Find me on social media
              </p>
              <div className="flex gap-3">
                {socialLinks.map((social, index) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group w-12 h-12 rounded-full bg-[var(--apple-gray)] flex items-center justify-center transition-all duration-300 hover:scale-110"
                    style={{
                      transitionDelay: `${700 + index * 80}ms`,
                    }}
                    aria-label={social.name}
                  >
                    <social.icon
                      className="w-5 h-5 text-[var(--apple-dark)] transition-colors duration-300"
                      onMouseEnter={(e: React.MouseEvent<SVGSVGElement>) =>
                        ((e.currentTarget as SVGSVGElement).style.color = social.color)
                      }
                      onMouseLeave={(e: React.MouseEvent<SVGSVGElement>) =>
                        ((e.currentTarget as SVGSVGElement).style.color = 'var(--apple-dark)')
                      }
                    />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Form */}
          <div
            className={`transition-all duration-700 ${
              isVisible
                ? 'opacity-100 translate-x-0'
                : 'opacity-0 translate-x-16'
            }`}
            style={{
              transitionTimingFunction: 'var(--ease-expo-out)',
              transitionDelay: '500ms',
            }}
          >
            <div className="bg-[var(--apple-gray)] rounded-3xl p-8 sm:p-10">
              {isSubmitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-semibold text-[var(--apple-dark)] mb-2">
                    Message Sent!
                  </h3>
                  <p className="text-[var(--apple-text)]">
                    Thank you for reaching out. I&apos;ll get back to you soon.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Name & Email Row */}
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div className="relative">
                      <label
                        htmlFor="name"
                        className={`absolute left-4 transition-all duration-300 pointer-events-none ${
                          focusedField === 'name' || formState.name
                            ? 'top-1 text-xs text-[var(--apple-blue)]'
                            : 'top-1/2 -translate-y-1/2 text-sm text-[var(--apple-text)]'
                        }`}
                      >
                        Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formState.name}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('name')}
                        onBlur={() => setFocusedField(null)}
                        maxLength={80}
                        autoComplete="name"
                        required
                        className="w-full pt-6 pb-2 px-4 rounded-xl bg-white border border-transparent focus:border-[var(--apple-blue)] outline-none transition-all duration-300"
                      />
                    </div>
                    <div className="relative">
                      <label
                        htmlFor="email"
                        className={`absolute left-4 transition-all duration-300 pointer-events-none ${
                          focusedField === 'email' || formState.email
                            ? 'top-1 text-xs text-[var(--apple-blue)]'
                            : 'top-1/2 -translate-y-1/2 text-sm text-[var(--apple-text)]'
                        }`}
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formState.email}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('email')}
                        onBlur={() => setFocusedField(null)}
                        maxLength={120}
                        autoComplete="email"
                        required
                        className="w-full pt-6 pb-2 px-4 rounded-xl bg-white border border-transparent focus:border-[var(--apple-blue)] outline-none transition-all duration-300"
                      />
                    </div>
                  </div>

                  {/* Subject */}
                  <div className="relative">
                    <label
                      htmlFor="subject"
                      className={`absolute left-4 transition-all duration-300 pointer-events-none ${
                        focusedField === 'subject' || formState.subject
                          ? 'top-1 text-xs text-[var(--apple-blue)]'
                          : 'top-1/2 -translate-y-1/2 text-sm text-[var(--apple-text)]'
                      }`}
                    >
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formState.subject}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('subject')}
                      onBlur={() => setFocusedField(null)}
                      maxLength={120}
                      autoComplete="off"
                      required
                      className="w-full pt-6 pb-2 px-4 rounded-xl bg-white border border-transparent focus:border-[var(--apple-blue)] outline-none transition-all duration-300"
                    />
                  </div>

                  {/* Message */}
                  <div className="relative">
                    <label
                      htmlFor="message"
                      className={`absolute left-4 transition-all duration-300 pointer-events-none ${
                        focusedField === 'message' || formState.message
                          ? 'top-3 text-xs text-[var(--apple-blue)]'
                          : 'top-4 text-sm text-[var(--apple-text)]'
                      }`}
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formState.message}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('message')}
                      onBlur={() => setFocusedField(null)}
                      required
                      maxLength={2000}
                      rows={5}
                      className="w-full pt-8 pb-4 px-4 rounded-xl bg-white border border-transparent focus:border-[var(--apple-blue)] outline-none transition-all duration-300 resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  {submitError ? (
                    <p className="text-sm text-red-600">{submitError}</p>
                  ) : null}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full btn-apple py-4 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg
                          className="animate-spin w-5 h-5"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Sending...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        Send Message
                        <Send className="w-4 h-4" />
                      </span>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
