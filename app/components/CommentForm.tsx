import { useEffect, useRef } from "react";
import { Form, useNavigation } from "react-router";
import { useTurnstile } from "~/hooks/useTurnstile";

export interface CommentFormErrors {
  name?: string;
  email?: string;
  body?: string;
  form?: string;
}

interface CommentFormProps {
  turnstileSiteKey: string;
  parentId?: string;
  errors?: CommentFormErrors;
  success?: boolean;
  onSuccess?: () => void;
  submitLabel?: string;
}

export default function CommentForm({
  turnstileSiteKey,
  parentId,
  errors,
  success,
  onSuccess,
  submitLabel = "Post Comment",
}: CommentFormProps) {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const { turnstileRef, turnstileReady, turnstileError, resetTurnstile } = useTurnstile(turnstileSiteKey);
  const formRef = useRef<HTMLFormElement>(null);
  const prevNavigationState = useRef(navigation.state);
  const fieldId = parentId ?? "root";

  useEffect(() => {
    const justFinishedSubmitting = prevNavigationState.current === "submitting" && navigation.state === "idle";
    if (justFinishedSubmitting) {
      if (success) {
        formRef.current?.reset();
        onSuccess?.();
      }
      if (errors?.form) {
        resetTurnstile();
      }
    }
    prevNavigationState.current = navigation.state;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigation.state, success, errors?.form]);

  return (
    <Form method="post" ref={formRef} className="space-y-4" noValidate>
      {parentId && <input type="hidden" name="parentId" value={parentId} />}

      {success && (
        <p role="status" className="text-sm text-muted-foreground">
          Thanks! Your comment has been submitted and is awaiting approval.
        </p>
      )}

      {errors?.form && (
        <p role="alert" className="text-red-500 text-sm">
          {errors.form}
        </p>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor={`name-${fieldId}`} className="block text-sm font-medium mb-1.5">
            Name
          </label>
          <input
            id={`name-${fieldId}`}
            name="name"
            type="text"
            autoComplete="name"
            required
            aria-describedby={errors?.name ? `name-error-${fieldId}` : undefined}
            className="w-full border border-border rounded-lg px-3.5 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
          />
          {errors?.name && (
            <p id={`name-error-${fieldId}`} className="text-red-500 text-sm mt-1">
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <label htmlFor={`email-${fieldId}`} className="block text-sm font-medium mb-1.5">
            Email
          </label>
          <input
            id={`email-${fieldId}`}
            name="email"
            type="email"
            autoComplete="email"
            required
            aria-describedby={errors?.email ? `email-error-${fieldId}` : undefined}
            className="w-full border border-border rounded-lg px-3.5 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
          />
          {errors?.email && (
            <p id={`email-error-${fieldId}`} className="text-red-500 text-sm mt-1">
              {errors.email}
            </p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor={`body-${fieldId}`} className="block text-sm font-medium mb-1.5">
          Comment
        </label>
        <textarea
          id={`body-${fieldId}`}
          name="body"
          rows={3}
          required
          aria-describedby={errors?.body ? `body-error-${fieldId}` : undefined}
          className="w-full border border-border rounded-lg px-3.5 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary resize-y"
        />
        {errors?.body && (
          <p id={`body-error-${fieldId}`} className="text-red-500 text-sm mt-1">
            {errors.body}
          </p>
        )}
      </div>

      {!!turnstileSiteKey && (
        <div ref={turnstileRef} className="cf-turnstile" data-sitekey={turnstileSiteKey} />
      )}
      {turnstileError && (
        <p role="alert" className="text-red-500 text-sm">
          {turnstileError}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting || !turnstileReady}
        className="bg-primary text-primary-foreground px-5 py-2.5 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Posting…" : submitLabel}
      </button>
    </Form>
  );
}
