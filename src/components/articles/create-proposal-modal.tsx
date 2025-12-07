"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Copy, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface CreateProposalModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  articleId: string;
  draftText: string;
}

export function CreateProposalModal({
  open,
  onOpenChange,
  articleId,
  draftText,
}: CreateProposalModalProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [proposedText, setProposedText] = useState("");
  const [justification, setJustification] = useState("");
  const [errors, setErrors] = useState<{
    proposedText?: string;
    justification?: string;
  }>({});

  // Character limits
  const PROPOSED_TEXT_MIN = 10;
  const PROPOSED_TEXT_MAX = 10000;
  const JUSTIFICATION_MIN = 20;
  const JUSTIFICATION_MAX = 2000;

  // Copy draft text to proposed text field
  const handleCopyFromDraft = () => {
    setProposedText(draftText);
    toast.success("Текст скопійовано з проєкту");
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (!proposedText.trim()) {
      newErrors.proposedText = "Текст пропозиції обов'язковий";
    } else if (proposedText.length < PROPOSED_TEXT_MIN) {
      newErrors.proposedText = `Мінімум ${PROPOSED_TEXT_MIN} символів`;
    } else if (proposedText.length > PROPOSED_TEXT_MAX) {
      newErrors.proposedText = `Максимум ${PROPOSED_TEXT_MAX} символів`;
    }

    if (!justification.trim()) {
      newErrors.justification = "Обґрунтування обов'язкове";
    } else if (justification.length < JUSTIFICATION_MIN) {
      newErrors.justification = `Мінімум ${JUSTIFICATION_MIN} символів`;
    } else if (justification.length > JUSTIFICATION_MAX) {
      newErrors.justification = `Максимум ${JUSTIFICATION_MAX} символів`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit proposal
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/proposals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          articleId,
          proposedText: proposedText.trim(),
          justification: justification.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Помилка при створенні пропозиції");
      }

      // Success!
      toast.success("Пропозицію успішно створено!");

      // Reset form
      setProposedText("");
      setJustification("");
      setErrors({});

      // Close modal
      onOpenChange(false);

      // Refresh the page to show the new proposal
      router.refresh();
    } catch (error) {
      console.error("Error creating proposal:", error);
      toast.error(
        error instanceof Error ? error.message : "Виникла помилка"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle dialog close
  const handleClose = () => {
    if (!isSubmitting) {
      setProposedText("");
      setJustification("");
      setErrors({});
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Створити пропозицію</DialogTitle>
          <DialogDescription>
            Запропонуйте зміни до статті та обґрунтуйте їх необхідність
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Proposed Text Field */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="proposedText" className="text-base font-medium">
                Запропонований текст <span className="text-destructive">*</span>
              </Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCopyFromDraft}
                className="gap-2"
              >
                <Copy className="w-4 h-4" />
                Скопіювати з проєкту
              </Button>
            </div>
            <Textarea
              id="proposedText"
              value={proposedText}
              onChange={(e) => {
                setProposedText(e.target.value);
                if (errors.proposedText) {
                  setErrors({ ...errors, proposedText: undefined });
                }
              }}
              placeholder="Введіть запропонований текст статті..."
              className={`min-h-[200px] resize-y ${
                errors.proposedText ? "border-destructive" : ""
              }`}
              disabled={isSubmitting}
            />
            <div className="flex items-center justify-between text-sm">
              {errors.proposedText ? (
                <span className="text-destructive">{errors.proposedText}</span>
              ) : (
                <span className="text-muted-foreground">
                  Мінімум {PROPOSED_TEXT_MIN} символів
                </span>
              )}
              <span
                className={`${
                  proposedText.length > PROPOSED_TEXT_MAX
                    ? "text-destructive"
                    : "text-muted-foreground"
                }`}
              >
                {proposedText.length} / {PROPOSED_TEXT_MAX}
              </span>
            </div>
          </div>

          {/* Justification Field */}
          <div className="space-y-2">
            <Label htmlFor="justification" className="text-base font-medium">
              Обґрунтування (чому ця зміна потрібна){" "}
              <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="justification"
              value={justification}
              onChange={(e) => {
                setJustification(e.target.value);
                if (errors.justification) {
                  setErrors({ ...errors, justification: undefined });
                }
              }}
              placeholder="Поясніть, чому ця зміна необхідна та які переваги вона принесе..."
              className={`min-h-[150px] resize-y ${
                errors.justification ? "border-destructive" : ""
              }`}
              disabled={isSubmitting}
            />
            <div className="flex items-center justify-between text-sm">
              {errors.justification ? (
                <span className="text-destructive">{errors.justification}</span>
              ) : (
                <span className="text-muted-foreground">
                  Мінімум {JUSTIFICATION_MIN} символів
                </span>
              )}
              <span
                className={`${
                  justification.length > JUSTIFICATION_MAX
                    ? "text-destructive"
                    : "text-muted-foreground"
                }`}
              >
                {justification.length} / {JUSTIFICATION_MAX}
              </span>
            </div>
          </div>

          {/* Preview Section */}
          {proposedText && (
            <div className="border border-border rounded-lg p-4 bg-muted">
              <p className="text-sm font-medium text-muted-foreground mb-2">
                Попередній перегляд:
              </p>
              <p className="text-sm text-foreground whitespace-pre-wrap line-clamp-6">
                {proposedText}
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Скасувати
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting || !proposedText.trim() || !justification.trim()}
            className="gap-2"
          >
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
            {isSubmitting ? "Збереження..." : "Подати пропозицію"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
