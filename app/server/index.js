import express from 'express';
import cors from 'cors';
import { z } from 'zod';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 8787);
const isProduction = process.env.NODE_ENV === 'production';
const trustProxy = process.env.TRUST_PROXY === 'true';
const contactRecipient = process.env.CONTACT_RECIPIENT;
const autoReplyEnabled = process.env.AUTO_REPLY_ENABLED === 'true';
const autoReplySubject =
  process.env.AUTO_REPLY_SUBJECT ||
  'Thanks for reaching out — I received your message!';
const autoReplyBody =
  process.env.AUTO_REPLY_BODY ||
  "Hi there,\n\nThanks for contacting me! I’ve received your message and will get back to you as soon as possible.\n\nBest,\nPortfolio";
const blogGithubOwner = process.env.BLOG_GITHUB_OWNER;
const blogGithubRepo = process.env.BLOG_GITHUB_REPO;
const blogGithubBranch = process.env.BLOG_GITHUB_BRANCH || 'main';
const blogGithubPath = process.env.BLOG_GITHUB_PATH || 'content/blog-posts.json';
const blogGithubToken = process.env.BLOG_GITHUB_TOKEN;
const blogCacheTtlMs = Number(process.env.BLOG_CACHE_TTL_MS || 300000);

const allowedOrigins = (
  process.env.CONTACT_ALLOWED_ORIGINS ||
  process.env.CONTACT_ORIGIN ||
  'http://localhost:5173'
)
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const contactSchema = z.object({
  name: z.string().trim().min(2, 'Name is too short').max(80),
  email: z.string().trim().email().max(120),
  subject: z.string().trim().min(2).max(120),
  message: z.string().trim().min(10).max(2000),
  website: z.string().trim().optional(),
});

const contactWindowMs = Number(process.env.CONTACT_RATE_LIMIT_WINDOW_MS || 60000);
const contactMaxPerWindow = Number(process.env.CONTACT_RATE_LIMIT_MAX || 8);
const contactRateStore = new Map();
const headerInjectionPattern = /[\r\n]/;
let blogCache = {
  data: null,
  expiresAt: 0,
};

const blogPostSchema = z.object({
  slug: z.string().trim().min(1),
  title: z.string().trim().min(1),
  summary: z.string().trim().min(1),
  publishedAt: z.string().trim().min(1),
  readTime: z.string().trim().min(1).default('5 min read'),
  tags: z.array(z.string().trim()).default([]),
  content: z.union([z.array(z.string()), z.string()]).optional(),
  markdown: z.string().trim().optional(),
}).refine(
  (post) =>
    (typeof post.markdown === 'string' && post.markdown.length > 0) ||
    post.content !== undefined,
  {
    message: 'Each blog post must include markdown or content',
  }
);

app.disable('x-powered-by');
if (trustProxy) {
  app.set('trust proxy', 1);
}

app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Cross-Origin-Resource-Policy', 'same-origin');
  if (isProduction) {
    res.setHeader(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    );
  }
  next();
});

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) {
        callback(null, true);
        return;
      }
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(null, false);
    },
    methods: ['POST', 'GET', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
  })
);
app.use(express.json({ limit: '10kb', strict: true }));

function extractClientIp(req) {
  return req.ip || req.socket.remoteAddress || 'unknown';
}

function isRateLimited(ip) {
  const now = Date.now();
  const current = contactRateStore.get(ip);
  if (!current || now > current.resetAt) {
    contactRateStore.set(ip, { count: 1, resetAt: now + contactWindowMs });
    return false;
  }
  current.count += 1;
  return current.count > contactMaxPerWindow;
}

setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of contactRateStore.entries()) {
    if (now > entry.resetAt) {
      contactRateStore.delete(ip);
    }
  }
}, Math.max(contactWindowMs, 30000)).unref();

function hasHeaderInjection(value) {
  return headerInjectionPattern.test(value);
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.get('/api/blog', async (_req, res) => {
  if (!blogGithubOwner || !blogGithubRepo || !blogGithubToken) {
    return res.status(503).json({
      ok: false,
      message: 'Blog service temporarily unavailable.',
    });
  }

  const now = Date.now();
  if (blogCache.data && now < blogCache.expiresAt) {
    return res.json({
      ok: true,
      source: 'cache',
      count: blogCache.data.length,
      posts: blogCache.data,
    });
  }

  try {
    const githubUrl = new URL(
      `https://api.github.com/repos/${blogGithubOwner}/${blogGithubRepo}/contents/${blogGithubPath}`
    );
    githubUrl.searchParams.set('ref', blogGithubBranch);

    const githubResponse = await fetch(githubUrl, {
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${blogGithubToken}`,
        'X-GitHub-Api-Version': '2022-11-28',
      },
    });

    if (!githubResponse.ok) {
      console.error('Blog GitHub fetch failed:', githubResponse.status);
      return res.status(503).json({
        ok: false,
        message: 'Blog service temporarily unavailable.',
      });
    }

    const githubPayload = await githubResponse.json();
    if (!githubPayload?.content) {
      return res.status(503).json({
        ok: false,
        message: 'Blog service temporarily unavailable.',
      });
    }

    const fileContent = Buffer.from(githubPayload.content, 'base64').toString('utf8');
    const parsedJson = JSON.parse(fileContent);
    const validated = z.array(blogPostSchema).safeParse(parsedJson);

    if (!validated.success) {
      console.error('Blog JSON validation failed');
      return res.status(503).json({
        ok: false,
        message: 'Blog service temporarily unavailable.',
      });
    }

    const posts = validated.data.map((post) => ({
      ...post,
      content:
        post.content === undefined
          ? undefined
          : Array.isArray(post.content)
            ? post.content.map((line) => line.trim()).filter(Boolean)
            : post.content
                .split('\n')
                .map((line) => line.trim())
                .filter(Boolean),
      markdown: post.markdown?.trim() || undefined,
    }));

    blogCache = {
      data: posts,
      expiresAt: Date.now() + blogCacheTtlMs,
    };

    return res.json({
      ok: true,
      source: 'github',
      count: posts.length,
      posts,
    });
  } catch (error) {
    console.error('Blog API failed:', error?.message || error);
    return res.status(503).json({
      ok: false,
      message: 'Blog service temporarily unavailable.',
    });
  }
});

app.post('/api/contact', (req, res) => {
  const clientIp = extractClientIp(req);
  if (isRateLimited(clientIp)) {
    return res.status(429).json({
      ok: false,
      message: 'Too many requests. Please wait and try again.',
    });
  }

  const parsed = contactSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      ok: false,
      message: 'Invalid form data',
      issues: parsed.error.issues.map((issue) => issue.path.join('.')),
    });
  }

  const { website, ...payload } = parsed.data;

  if (website) {
    return res.json({ ok: true });
  }

  if (
    hasHeaderInjection(payload.name) ||
    hasHeaderInjection(payload.email) ||
    hasHeaderInjection(payload.subject)
  ) {
    return res.status(400).json({
      ok: false,
      message: 'Invalid form data',
    });
  }

  const smtpHost = process.env.SMTP_HOST;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (!smtpHost || !smtpUser || !smtpPass || !contactRecipient) {
    console.error('Contact API is missing SMTP configuration.');
    return res.status(500).json({
      ok: false,
      message: 'Service temporarily unavailable.',
    });
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });

  const receivedAt = new Date().toISOString();
  const text = [
    `New contact request (${receivedAt})`,
    '',
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    `Subject: ${payload.subject}`,
    '',
    payload.message,
  ].join('\n');

  transporter
    .sendMail({
      from: process.env.CONTACT_FROM || smtpUser,
      to: contactRecipient,
      replyTo: payload.email,
      subject: `Portfolio Contact: ${payload.subject}`,
      text,
    })
    .then(async () => {
      if (autoReplyEnabled) {
        try {
          await transporter.sendMail({
            from: process.env.CONTACT_FROM || smtpUser,
            to: payload.email,
            subject: autoReplySubject,
            text: autoReplyBody,
          });
        } catch (error) {
          console.error('Auto-reply failed:', error);
        }
      }

      res.json({ ok: true, message: 'Message received' });
    })
    .catch((error) => {
      console.error('Contact email failed:', {
        message: error?.message,
        code: error?.code,
      });
      res.status(500).json({
        ok: false,
        message: 'Service temporarily unavailable.',
      });
    });
});

app.use((_req, res) => {
  res.status(404).json({ ok: false, message: 'Not found' });
});

app.use((err, _req, res, _next) => {
  console.error('Unhandled API error:', err?.message || err);
  res.status(500).json({ ok: false, message: 'Internal server error' });
});

app.listen(port, () => {
  console.log(`Contact API listening on port ${port}`);
});
