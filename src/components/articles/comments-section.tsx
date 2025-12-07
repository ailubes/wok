"use client";

import { CommentItem } from "./comment-item";
import { CommentForm } from "./comment-form";
import { MessageSquare } from "lucide-react";

interface CommentUser {
  id: string;
  fullName: string;
  organization: string | null;
}

interface CommentData {
  id: string;
  text: string;
  createdAt: Date | string;
  user: CommentUser;
  replies?: CommentData[];
}

interface CommentsSectionProps {
  articleId: string;
  comments: CommentData[];
  canComment: boolean;
}

export function CommentsSection({ articleId, comments, canComment }: CommentsSectionProps) {
  const commentCount = comments.length;

  return (
    <div className="bg-card rounded-lg border border-border shadow-sm">
      {/* Header */}
      <div className="border-b border-border px-6 py-4">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-muted-foreground" />
          <h2 className="text-lg font-semibold text-foreground">
            Коментарі ({commentCount})
          </h2>
        </div>
      </div>

      {/* Comment Form (if user can comment) */}
      {canComment && (
        <div className="border-b border-border px-6 py-5 bg-muted">
          <CommentForm articleId={articleId} placeholder="Додати коментар..." />
        </div>
      )}

      {/* Comments List */}
      <div className="px-6 py-5">
        {commentCount === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">
              Поки що немає коментарів. Будьте першим!
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                articleId={articleId}
                canReply={canComment}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
