"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageSquare } from "lucide-react";
import { CommentForm } from "./comment-form";

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

interface CommentItemProps {
  comment: CommentData;
  articleId: string;
  depth?: number;
  canReply: boolean;
}

// Helper function to format timestamps in Ukrainian
function formatTimestamp(date: Date | string): string {
  const now = new Date();
  const commentDate = typeof date === "string" ? new Date(date) : date;
  const diffInSeconds = Math.floor((now.getTime() - commentDate.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return "щойно";
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    if (diffInMinutes === 1) return "1 хв тому";
    if (diffInMinutes < 5) return `${diffInMinutes} хв тому`;
    if (diffInMinutes < 20) return `${diffInMinutes} хв тому`;
    return `${diffInMinutes} хв тому`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    if (diffInHours === 1) return "1 год тому";
    if (diffInHours < 5) return `${diffInHours} год тому`;
    return `${diffInHours} год тому`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    if (diffInDays === 1) return "1 день тому";
    if (diffInDays < 5) return `${diffInDays} дні тому`;
    return `${diffInDays} днів тому`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    if (diffInMonths === 1) return "1 місяць тому";
    if (diffInMonths < 5) return `${diffInMonths} місяці тому`;
    return `${diffInMonths} місяців тому`;
  }

  const diffInYears = Math.floor(diffInMonths / 12);
  if (diffInYears === 1) return "1 рік тому";
  if (diffInYears < 5) return `${diffInYears} роки тому`;
  return `${diffInYears} років тому`;
}

// Helper function to get user initials for avatar
function getInitials(fullName: string): string {
  const parts = fullName.trim().split(" ");
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return fullName.substring(0, 2).toUpperCase();
}

export function CommentItem({ comment, articleId, depth = 0, canReply }: CommentItemProps) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const maxDepth = 5; // Maximum nesting level

  const initials = getInitials(comment.user.fullName);

  return (
    <div className={depth > 0 ? "ml-8 mt-4" : ""}>
      <div className={depth > 0 ? "border-l-2 border-primary/20 pl-4" : ""}>
        <div className="flex gap-3">
          {/* User Avatar */}
          <div className="flex-shrink-0">
            <Avatar className="w-10 h-10">
              <AvatarFallback className="bg-primary/10 text-primary font-medium text-sm">
                {initials}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Comment Content */}
          <div className="flex-1 min-w-0">
            {/* User Info */}
            <div className="flex items-baseline gap-2 mb-1">
              <span className="font-medium text-foreground text-sm">
                {comment.user.fullName}
              </span>
              {comment.user.organization && (
                <span className="text-xs text-muted-foreground">
                  • {comment.user.organization}
                </span>
              )}
              <span className="text-xs text-muted-foreground">
                • {formatTimestamp(comment.createdAt)}
              </span>
            </div>

            {/* Comment Text */}
            <div className="text-sm text-foreground mb-2 whitespace-pre-wrap break-words">
              {comment.text}
            </div>

            {/* Reply Button */}
            {canReply && depth < maxDepth && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowReplyForm(!showReplyForm)}
                className="h-8 px-2 text-xs text-muted-foreground hover:text-primary -ml-2"
              >
                <MessageSquare className="w-3.5 h-3.5 mr-1" />
                Відповісти
              </Button>
            )}

            {/* Reply Form */}
            {showReplyForm && (
              <div className="mt-3 mb-4">
                <CommentForm
                  articleId={articleId}
                  parentId={comment.id}
                  onCancel={() => setShowReplyForm(false)}
                  placeholder="Напишіть відповідь..."
                  isReply={true}
                />
              </div>
            )}
          </div>
        </div>

        {/* Nested Replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-4 space-y-4">
            {comment.replies.map((reply) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                articleId={articleId}
                depth={depth + 1}
                canReply={canReply}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
