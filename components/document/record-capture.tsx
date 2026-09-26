"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Mic, Square } from "lucide-react";
import { createVoiceCaptureAction } from "@/app/(app)/document/actions";

function getLocalDate(date = new Date()) {
  const year = date.getFullYear();

  const month = String(date.getMonth() + 1).padStart(2, "0");

  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function buildLocalDateTime(date: Date) {
  return date.toISOString();
}

export function RecordCapture() {
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const finalizedRef = useRef("");

  const shouldContinueRef = useRef(false);

  const [supported, setSupported] = useState<boolean | null>(null);

  const [isListening, setIsListening] = useState(false);

  const [finalizedText, setFinalizedText] = useState("");

  const [interimText, setInterimText] = useState("");

  const [startedAt, setStartedAt] = useState<Date | null>(null);

  const [captureDate, setCaptureDate] = useState("");

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const Constructor =
      window.SpeechRecognition ?? window.webkitSpeechRecognition;

    if (!Constructor) {
      setSupported(false);
      return;
    }

    setSupported(true);

    const recognition = new Constructor();

    recognition.continuous = true;

    recognition.interimResults = true;

    recognition.lang = "en-CA";

    recognition.onstart = () => {
      setIsListening(true);

      setErrorMessage(null);
    };

    recognition.onresult = (event) => {
      let newFinal = "";
      let newInterim = "";

      for (
        let index = event.resultIndex;
        index < event.results.length;
        index += 1
      ) {
        const result = event.results[index];

        const transcript = result[0]?.transcript ?? "";

        if (result.isFinal) {
          newFinal += transcript;
        } else {
          newInterim += transcript;
        }
      }

      if (newFinal) {
        const previous = finalizedRef.current;

        const next = previous
          ? `${previous.trim()} ${newFinal.trim()}`
          : newFinal.trim();

        finalizedRef.current = next;

        setFinalizedText(next);
      }

      setInterimText(newInterim.trim());
    };

    recognition.onerror = (event) => {
      if (event.error === "aborted") {
        return;
      }

      if (event.error === "not-allowed") {
        setErrorMessage(
          "Microphone access was blocked. Allow microphone access for this site and try again.",
        );
      } else if (event.error === "no-speech") {
        setErrorMessage("No speech was detected. You can try again.");
      } else if (event.error === "audio-capture") {
        setErrorMessage("No microphone was available.");
      } else if (event.error === "network") {
        setErrorMessage(
          "Speech recognition could not connect. Check your connection and try again.",
        );
      } else {
        setErrorMessage(
          "Speech recognition stopped unexpectedly. You can try again.",
        );
      }

      shouldContinueRef.current = false;

      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);

      if (shouldContinueRef.current) {
        try {
          recognition.start();
        } catch {
          shouldContinueRef.current = false;
        }
      }
    };

    recognitionRef.current = recognition;

    return () => {
      shouldContinueRef.current = false;

      recognition.abort();

      recognitionRef.current = null;
    };
  }, []);

  function startListening() {
    const recognition = recognitionRef.current;

    if (!recognition) {
      return;
    }

    setErrorMessage(null);

    if (!startedAt) {
      const now = new Date();

      setStartedAt(now);

      setCaptureDate(getLocalDate(now));
    }

    shouldContinueRef.current = true;

    try {
      recognition.start();
    } catch {
      // The browser may throw
      // when recognition is
      // already active.
    }
  }

  function stopListening() {
    shouldContinueRef.current = false;

    recognitionRef.current?.stop();
  }

  function handleTranscriptChange(value: string) {
    finalizedRef.current = value;

    setFinalizedText(value);

    setInterimText("");
  }

  const displayedTranscript = interimText
    ? finalizedText
      ? `${finalizedText} ${interimText}`
      : interimText
    : finalizedText;

  const canSave =
    finalizedText.trim().length > 0 && Boolean(startedAt) && !isListening;

  if (supported === null) {
    return (
      <div className="mx-auto max-w-4xl">
        <p className="text-sm text-muted-foreground">
          Preparing speech recognition...
        </p>
      </div>
    );
  }

  if (!supported) {
    return (
      <div className="mx-auto max-w-4xl">
        <header>
          <Link
            href="/document"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Document
          </Link>

          <h1 className="mt-5 text-3xl font-bold tracking-tight">Record</h1>

          <p className="mt-1 text-[15px] text-muted-foreground">
            Speak naturally and capture what happened.
          </p>
        </header>

        <section className="mt-8 rounded-2xl border bg-card p-5 sm:p-6">
          <h2 className="text-base font-bold">
            Speech recognition isn&apos;t available
          </h2>

          <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
            This browser does not support the speech recognition feature
            DailyLogr uses for live transcription. You can use Manual capture
            instead or try a supported browser.
          </p>

          <Link
            href="/document/manual"
            className="mt-5 inline-flex min-h-12 items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Use Manual capture
          </Link>
        </section>
      </div>
    );
  }

  return (
    <form action={createVoiceCaptureAction} className="mx-auto max-w-4xl">
      <input type="hidden" name="capture_date" value={captureDate} />

      <input
        type="hidden"
        name="start_time"
        value={startedAt ? buildLocalDateTime(startedAt) : ""}
      />

      <input type="hidden" name="text" value={finalizedText} />

      <header>
        <Link
          href="/document"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Document
        </Link>

        <h1 className="mt-5 text-3xl font-bold tracking-tight">Record</h1>

        <p className="mt-1 text-[15px] text-muted-foreground">
          Speak naturally. You can edit the transcript before saving it.
        </p>
      </header>

      <section className="mt-8 rounded-2xl border bg-card px-5 py-10 sm:px-8 sm:py-12">
        <div className="flex flex-col items-center text-center">
          <button
            type="button"
            onClick={isListening ? stopListening : startListening}
            className={`flex size-24 cursor-pointer items-center justify-center rounded-full transition-all ${
              isListening
                ? "bg-destructive text-white shadow-lg"
                : "bg-primary text-primary-foreground hover:opacity-90"
            }`}
            aria-label={
              isListening ? "Stop" : finalizedText ? "Continue" : "Start"
            }
          >
            {isListening ? (
              <Square className="size-7 fill-current" />
            ) : (
              <Mic className="size-9" />
            )}
          </button>

          <p className="mt-5 text-lg font-bold">
            {isListening
              ? "Listening..."
              : finalizedText
                ? "Continue"
                : "Start"}
          </p>

          <p className="mt-1 max-w-sm text-sm leading-6 text-muted-foreground">
            {isListening
              ? "Tap when you're finished."
              : finalizedText
                ? "Tap the microphone to add more."
                : "Tap the microphone and start speaking."}
          </p>

          {isListening && (
            <div className="mt-5 flex items-center gap-2">
              <span className="size-2 animate-pulse rounded-full bg-destructive" />

              <span className="text-xs font-medium text-muted-foreground">
                Live transcription
              </span>
            </div>
          )}
        </div>

        {errorMessage && (
          <div className="mx-auto mt-8 max-w-xl rounded-xl border bg-muted px-4 py-3">
            <p className="text-sm leading-6 text-muted-foreground">
              {errorMessage}
            </p>
          </div>
        )}
      </section>

      {(startedAt || displayedTranscript) && (
        <section className="mt-4 rounded-2xl border bg-card p-5 sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-base font-bold">Transcript</h2>

            {isListening && (
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <span className="size-1.5 rounded-full bg-destructive" />
                Live
              </span>
            )}
          </div>

          {isListening ? (
            <div className="mt-4 min-h-48 whitespace-pre-wrap rounded-xl border bg-card px-4 py-3 text-base leading-7">
              {finalizedText}

              {finalizedText && interimText && " "}

              {interimText && (
                <span className="text-muted-foreground">{interimText}</span>
              )}

              {!displayedTranscript && (
                <span className="text-muted-foreground">Start speaking...</span>
              )}
            </div>
          ) : (
            <textarea
              id="transcript"
              rows={9}
              value={finalizedText}
              onChange={(event) => {
                handleTranscriptChange(event.target.value);
              }}
              placeholder="Your transcript will appear here..."
              className="mt-4 w-full resize-none rounded-xl border bg-card px-4 py-3 text-base leading-7 outline-none transition-colors placeholder:text-muted-foreground focus:border-foreground"
            />
          )}

          {startedAt && (
            <p className="mt-3 text-xs text-muted-foreground">
              Started{" "}
              {new Intl.DateTimeFormat("en-CA", {
                hour: "numeric",
                minute: "2-digit",
              }).format(startedAt)}
            </p>
          )}
        </section>
      )}

      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Link
          href="/document"
          className="inline-flex min-h-12 items-center justify-center rounded-xl border bg-card px-5 text-sm font-semibold transition-colors hover:bg-muted"
        >
          Cancel
        </Link>

        <button
          type="submit"
          disabled={!canSave}
          className="inline-flex min-h-12 cursor-pointer items-center justify-center rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Save documentation
        </button>
      </div>
    </form>
  );
}
