"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  confirmVariant?: "default" | "destructive";
  onConfirm: (note?: string) => void;
  isLoading?: boolean;
  showNoteInput?: boolean;
  noteLabel?: string;
  notePlaceholder?: string;
  noteValue?: string;
  onNoteChange?: (value: string) => void;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirm",
  confirmVariant = "default",
  onConfirm,
  isLoading = false,
  showNoteInput = false,
  noteLabel = "Admin Note",
  notePlaceholder = "Enter a note...",
  noteValue = "",
  onNoteChange,
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        {showNoteInput && (
          <div className="space-y-2">
            <Label>{noteLabel}</Label>
            <Input
              value={noteValue}
              onChange={(e) => onNoteChange?.(e.target.value)}
              placeholder={notePlaceholder}
            />
          </div>
        )}

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant={confirmVariant}
            onClick={() => onConfirm(noteValue)}
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
