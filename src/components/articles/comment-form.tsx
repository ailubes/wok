"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface CommentFormProps {
  articleId: string;
  parentId?: string;
  onCancel?: () => void;
  placeholder?: string;
  isReply?: boolean;
}

export function CommentForm({
  articleId,
  parentId,
  onCancel,
  placeholder = "Напишіть свій коментар...",
  isReply = false,
}: CommentFormProps) {
  const [text, setText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (text.length < 10) {
      toast.error("Коментар має містити щонайменше 10 символів");
      return;
    }

    if (text.length > 2000) {
      toast.error("Коментар не може перевищувати 2000 символів");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          articleId,
          text,
          parentId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Не вдалося створити коментар");
      }

      toast.success(data.message || "Коментар успішно додано");
      setText("");

      // Refresh the page to show new comment
      router.refresh();

      // Call onCancel to close reply form if it's a reply
      if (onCancel) {
        onCancel();
      }
    } catch (error) {
      console.error("Comment submission error:", error);
      toast.error(
        error instanceof Error ? error.message : "Виникла помилка при додаванні коментаря"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const charCount = text.length;
  const isValid = charCount >= 10 && charCount <= 2000;

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="relative">
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={placeholder}
          rows={isReply ? 3 : 4}
          disabled={isSubmitting}
          className="w-full resize-none"
        />
        <div
          className={`absolute bottom-2 right-2 text-xs ${
            charCount > 2000
              ? "text-destructive font-medium"
              : charCount >= 10
              ? "text-primary"
              : "text-muted-foreground"
          }`}
        >
          {charCount} / 2000
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          type="submit"
          disabled={!isValid || isSubmitting}
          size="sm"
        >
          {isSubmitting ? "Надсилання..." : "Надіслати"}
        </Button>

        {onCancel && (
          <Button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            variant="outline"
            size="sm"
          >
            Скасувати
          </Button>
        )}
      </div>
    </form>
  );
}
