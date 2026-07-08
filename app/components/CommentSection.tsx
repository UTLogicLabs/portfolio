import type { CommentNode } from "~/utils/comments";
import CommentForm, { type CommentFormErrors } from "~/components/CommentForm";
import CommentThread from "~/components/CommentThread";

interface CommentSectionProps {
  comments: CommentNode[];
  turnstileSiteKey: string;
  actionData?: { success?: boolean; errors?: CommentFormErrors };
}

export default function CommentSection({ comments, turnstileSiteKey, actionData }: CommentSectionProps) {
  return (
    <section className="mt-16 pt-12 border-t border-border">
      <h2 className="text-2xl font-bold tracking-tight mb-6">Comments</h2>

      {comments.length === 0 ? (
        <p className="text-muted-foreground mb-8">No comments yet — be the first!</p>
      ) : (
        <div className="space-y-4 mb-10">
          {comments.map((comment) => (
            <CommentThread
              key={comment.id}
              comment={comment}
              turnstileSiteKey={turnstileSiteKey}
              actionData={actionData}
            />
          ))}
        </div>
      )}

      <CommentForm turnstileSiteKey={turnstileSiteKey} errors={actionData?.errors} success={actionData?.success} />
    </section>
  );
}
