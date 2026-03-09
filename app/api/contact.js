import nodemailer from "nodemailer";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().trim().min(2, "Name is too short").max(80),
  email: z.string().trim().email().max(120),
  subject: z.string().trim().min(2).max(120),
  message: z.string().trim().min(10).max(2000),
  website: z.string().trim().optional(),
});

const contactWindowMs = Number(process.env.CONTACT_RATE_LIMIT_WINDOW_MS || 60000);
const contactMaxPerWindow = Number(process.env.CONTACT_RATE_LIMIT_MAX || 8);
const headerInjectionPattern = /[\r\n]/;
const normalizeOrigin = (origin) =>
  origin.trim().replace(/\/+$/, "").toLowerCase();

const allowedOrigins = (
  process.env.CONTACT_ALLOWED_ORIGINS ||
  process.env.CONTACT_ORIGIN ||
  ""
)
  .split(",")
  .map((origin) => normalizeOrigin(origin))
  .filter(Boolean);

const autoReplyEnabled = process.env.AUTO_REPLY_ENABLED === "true";
const autoReplySubject =
  process.env.AUTO_REPLY_SUBJECT || "Thanks for reaching out — I received your message!";
const autoReplyBody =
  process.env.AUTO_REPLY_BODY ||
  "Hi there,\n\nThanks for contacting me! I’ve received your message and will get back to you as soon as possible.\n\nBest,\nPortfolio";

const contactRateStore = new Map();

function hasHeaderInjection(value) {
  return headerInjectionPattern.test(value);
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

function cleanupRateStore() {
  const now = Date.now();
  for (const [ip, entry] of contactRateStore.entries()) {
    if (now > entry.resetAt) {
      contactRateStore.delete(ip);
    }
  }
}

function handleCors(req, res) {
  const origin = req.headers.origin;
  const normalizedOrigin = origin ? normalizeOrigin(origin) : "";
  const originAllowed =
    !origin ||
    allowedOrigins.length === 0 ||
    allowedOrigins.includes(normalizedOrigin);

  if (originAllowed && normalizedOrigin) {
    res.setHeader("Access-Control-Allow-Origin", normalizedOrigin);
    res.setHeader("Vary", "Origin");
  }

  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (!originAllowed) {
    return false;
  }

  return true;
}

function getClientIp(req) {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.length > 0) {
    return forwarded.split(",")[0].trim();
  }
  return req.socket?.remoteAddress || "unknown";
}

export default async function handler(req, res) {
  cleanupRateStore();

  if (!handleCors(req, res)) {
    return res.status(403).json({ ok: false, message: "Origin not allowed." });
  }

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST,OPTIONS");
    return res.status(405).json({ ok: false, message: "Method not allowed" });
  }

  const clientIp = getClientIp(req);
  if (isRateLimited(clientIp)) {
    return res.status(429).json({
      ok: false,
      message: "Too many requests. Please wait and try again.",
    });
  }

  const parsed = contactSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      ok: false,
      message: "Invalid form data",
      issues: parsed.error.issues.map((issue) => issue.path.join(".")),
    });
  }

  const { website, ...payload } = parsed.data;

  if (website) {
    return res.status(200).json({ ok: true });
  }

  if (
    hasHeaderInjection(payload.name) ||
    hasHeaderInjection(payload.email) ||
    hasHeaderInjection(payload.subject)
  ) {
    return res.status(400).json({ ok: false, message: "Invalid form data" });
  }

  const smtpHost = process.env.SMTP_HOST;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const contactRecipient = process.env.CONTACT_RECIPIENT;

  if (!smtpHost || !smtpUser || !smtpPass || !contactRecipient) {
    console.error("Contact API is missing SMTP configuration.");
    return res.status(500).json({
      ok: false,
      message: "Service temporarily unavailable.",
    });
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });

  const receivedAt = new Date().toISOString();
  const text = [
    `New contact request (${receivedAt})`,
    "",
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    `Subject: ${payload.subject}`,
    "",
    payload.message,
  ].join("\n");

  try {
    await transporter.sendMail({
      from: process.env.CONTACT_FROM || smtpUser,
      to: contactRecipient,
      replyTo: payload.email,
      subject: `Portfolio Contact: ${payload.subject}`,
      text,
    });

    if (autoReplyEnabled) {
      try {
        await transporter.sendMail({
          from: process.env.CONTACT_FROM || smtpUser,
          to: payload.email,
          subject: autoReplySubject,
          text: autoReplyBody,
        });
      } catch (error) {
        console.error("Auto-reply failed:", error?.message || error);
      }
    }

    return res.status(200).json({ ok: true, message: "Message received" });
  } catch (error) {
    console.error("Contact email failed:", {
      message: error?.message,
      code: error?.code,
    });
    return res.status(500).json({
      ok: false,
      message: "Service temporarily unavailable.",
    });
  }
}
