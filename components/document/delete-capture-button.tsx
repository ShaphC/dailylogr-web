"use client";

import { useState } from "react";
import { Trash2, X } from "lucide-react";
import { deleteCaptureAction } from "@/app/(app)/document/actions";

interface DeleteCaptureButtonProps {
  captureId: string;
}

export function DeleteCaptureButton({ captureId }: DeleteCaptureButtonProps) {
  const [confirming, setConfirming] = useState(false);

  if (confirming) {
    return (
      <div className="flex flex-wrap items-center gap-2">
        <span className="mr-1 text-sm text-muted-foreground">
          Delete this documentation?
        </span>

        <form action={deleteCaptureAction}>
          <input type="hidden" name="capture_id" value={captureId} />

          <button
            type="submit"
            className="inline-flex h-10 items-center justify-center rounded-xl bg-destructive px-4 text-sm font-medium text-destructive-foreground transition-opacity hover:opacity-90"
          >
            Delete
          </button>
        </form>

        <button
          type="button"
          onClick={() => {
            setConfirming(false);
          }}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border px-4 text-sm font-medium transition-colors hover:bg-accent"
        >
          <X className="h-4 w-4" />
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => {
        setConfirming(true);
      }}
      className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border px-4 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
    >
      <Trash2 className="h-4 w-4" />
      Delete
    </button>
  );
}
