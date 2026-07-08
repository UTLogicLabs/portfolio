import { useState } from "react";
import type { CommentNode } from "~/utils/comments";
import CommentForm, { type CommentFormErrors } from "~/components/CommentForm";

interface CommentThreadProps {
  comment: CommentNode;
  turnstileSiteKey: string;
  actionData?: { success?: boolean; errors?: CommentFormErrors; parentId?: string | null };
}

export default function CommentThread({ comment, turnstileSiteKey, actionData }: CommentThreadProps) {
  const [replyOpen, setReplyOpen] = useState(false);
  const isThisReplyResult = actionData?.parentId === comment.id;

  return (
    <div className="border border-border rounded-xl p-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
        <span className="font-medium text-foreground">{comment.name}</span>
        <time>
          {new Date(comment.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </time>
      </div>
      <p className="text-sm">{comment.body}</p>

      <button
        type="button"
        onClick={() => setReplyOpen((open) => !open)}
        className="text-sm font-medium text-primary mt-2 hover:underline"
      >
        {replyOpen ? "Cancel" : "Reply"}
      </button>

      {replyOpen && (
        <div className="mt-4">
          <CommentForm
            turnstileSiteKey={turnstileSiteKey}
            parentId={comment.id}
            errors={isThisReplyResult ? actionData?.errors : undefined}
            success={isThisReplyResult ? actionData?.success : undefined}
            submitLabel="Post Reply"
          />
        </div>
      )}

      {comment.replies.length > 0 && (
        <div className="ml-6 md:ml-8 border-l border-border pl-4 mt-4 space-y-4">
          {comment.replies.map((reply) => (
            <CommentThread
              key={reply.id}
              comment={reply}
              turnstileSiteKey={turnstileSiteKey}
              actionData={actionData}
            />
          ))}
        </div>
      )}
    </div>
  );
}
