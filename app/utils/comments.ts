import type { Comment } from "@prisma/client";

export interface CommentNode extends Comment {
  replies: CommentNode[];
}

export function buildCommentTree(comments: Comment[]): CommentNode[] {
  const byId = new Map<string, CommentNode>();
  for (const comment of comments) {
    byId.set(comment.id, { ...comment, replies: [] });
  }

  const roots: CommentNode[] = [];
  for (const comment of comments) {
    const node = byId.get(comment.id)!;
    const parent = comment.parentId ? byId.get(comment.parentId) : undefined;
    if (parent) {
      parent.replies.push(node);
    } else {
      roots.push(node);
    }
  }

  return roots;
}
