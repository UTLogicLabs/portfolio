import { Resend } from "resend";
import { getPrisma } from "~/db.server";
import { verifyTurnstile } from "~/services/turnstile.server";
import { escapeHtml } from "~/utils/html.server";
import type { CloudflareEnv } from "~/types/env";

export type CommentTargetType = "BLOG_POST" | "PROJECT";

export interface SubmitCommentInput {
  targetType: CommentTargetType;
  targetSlug: string;
  name: string;
  email: string;
  body: string;
  parentId?: string | null;
  turnstileToken: string;
}

export interface SubmitCommentResult {
  parentId: string | null;
  success?: boolean;
  errors?: {
    name?: string;
    email?: string;
    body?: string;
    form?: string;
  };
}

export async function submitComment(
  input: SubmitCommentInput,
  env: CloudflareEnv
): Promise<SubmitCommentResult> {
  const parentId = input.parentId ?? null;

  const turnstilePassed = await verifyTurnstile(input.turnstileToken, env.TURNSTILE_SECRET_KEY);
  if (!turnstilePassed) {
    return { parentId, errors: { form: "Bot check failed. Please try again." } };
  }

  const name = input.name.trim();
  const email = input.email.trim();
  const body = input.body.trim();

  const errors: NonNullable<SubmitCommentResult["errors"]> = {};
  if (!name) errors.name = "Name is required.";
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    errors.email = "A valid email address is required.";
  if (!body || body.length < 3) errors.body = "Comment must be at least 3 characters.";

  const db = getPrisma(env.portfolio_db);

  if (input.parentId) {
    const parent = await db.comment.findUnique({ where: { id: input.parentId } });
    if (!parent || parent.targetType !== input.targetType || parent.targetSlug !== input.targetSlug) {
      errors.form = "Unable to find the comment you're replying to.";
    }
  }

  if (Object.keys(errors).length > 0) {
    return { parentId, errors };
  }

  await db.comment.create({
    data: {
      targetType: input.targetType,
      targetSlug: input.targetSlug,
      name,
      email,
      body,
      parentId: input.parentId ?? null,
    },
  });

  if (env.RESEND_API_KEY) {
    try {
      const resend = new Resend(env.RESEND_API_KEY);
      const targetLabel = input.targetType === "BLOG_POST" ? "blog post" : "project";
      const safeName = escapeHtml(name);
      const safeBody = escapeHtml(body);
      const safeSlug = escapeHtml(input.targetSlug);
      const siteUrl = env.SITE_URL ?? "";
      await resend.emails.send({
        from: "Portfolio Comments <contact@utlogiclabs.com>",
        to: "joshua.dix@utlogiclabs.com",
        subject: `New comment from ${name} on ${targetLabel} "${input.targetSlug}"`,
        text: `Name: ${name}\nEmail: ${email}\nTarget: ${input.targetType} / ${input.targetSlug}\n\n${body}\n\nReview at ${siteUrl}/admin/comments`,
        html: `<p><strong>Name:</strong> ${safeName}</p><p><strong>Target:</strong> ${targetLabel} "${safeSlug}"</p><p>${safeBody}</p><p><a href="${siteUrl}/admin/comments">Review pending comments</a></p>`,
      });
    } catch (err) {
      console.error("[resend] failed to send comment notification email", err);
    }
  }

  return { parentId, success: true };
}
