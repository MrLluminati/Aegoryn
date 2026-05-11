"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { Mic, MicOff } from "lucide-react";
import { AppShell, Panel, primaryButtonClassName } from "../../components/brand/AppShell";
import { ProtectedRoute } from "../../components/auth/ProtectedRoute";
import type { AegoParserResult } from "../../lib/aego/parser";
import { createBrowserSupabaseClient } from "../../lib/supabase/client";
import type { AiMessage } from "../../lib/supabase/types";

type ChatMessage = {
  role: "user" | "assistant";
  text: string;
  result?: AegoParserResult;
  savedAt?: string;
  status?: string;
};

type DailyLogGroup = {
  dayKey: string;
  count: number;
};

type AegoSpeechRecognitionAlternative = {
  transcript: string;
};

type AegoSpeechRecognitionResult = {
  isFinal: boolean;
  length: number;
  [index: number]: AegoSpeechRecognitionAlternative;
};

type AegoSpeechRecognitionResultList = {
  length: number;
  [index: number]: AegoSpeechRecognitionResult;
};

type AegoSpeechRecognitionEvent = {
  results: AegoSpeechRecognitionResultList;
};

type AegoSpeechRecognitionErrorEvent = {
  error?: string;
};

type AegoSpeechRecognition = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onresult: ((event: AegoSpeechRecognitionEvent) => void) | null;
  onerror: ((event: AegoSpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
};

type AegoSpeechRecognitionConstructor = new () => AegoSpeechRecognition;

declare global {
  interface Window {
    SpeechRecognition?: AegoSpeechRecognitionConstructor;
    webkitSpeechRecognition?: AegoSpeechRecognitionConstructor;
  }
}

const historyLimit = 200;
const initialMessages: ChatMessage[] = [
  {
    role: "assistant",
    text: "Aego parser is ready for MVP testing. Try: Paid Rs. 500 for groceries from Kotak from Savings."
  }
];

function isAegoParserResult(value: unknown): value is AegoParserResult {
  return (
    typeof value === "object" &&
    value !== null &&
    "classification" in value &&
    "intent" in value &&
    "actions" in value &&
    "summary" in value
  );
}

function getParserResponseText(result: AegoParserResult): string {
  return result.requiresClarification && result.clarificationQuestion ? result.clarificationQuestion : result.summary;
}

function buildSavedConversation(records: AiMessage[]): ChatMessage[] {
  return records.flatMap((record) => {
    const result = isAegoParserResult(record.ai_response) ? record.ai_response : undefined;
    const userMessage: ChatMessage = {
      role: "user",
      text: record.user_message,
      savedAt: record.created_at
    };
    const assistantMessage: ChatMessage = {
      role: "assistant",
      text: result ? getParserResponseText(result) : "Aego saved this message, but the parser result could not be displayed.",
      result,
      savedAt: record.created_at,
      status: record.status
    };

    return [userMessage, assistantMessage];
  });
}

function getLocalDayKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getDayKeyFromIso(value: string): string {
  return getLocalDayKey(new Date(value));
}

function getDateFromDayKey(dayKey: string): Date {
  const [year = "0", month = "1", day = "1"] = dayKey.split("-");
  return new Date(Number(year), Number(month) - 1, Number(day));
}

function formatDayLabel(dayKey: string, todayKey: string): string {
  if (dayKey === todayKey) {
    return "Today";
  }

  return new Intl.DateTimeFormat(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric"
  }).format(getDateFromDayKey(dayKey));
}

function formatFullDayLabel(dayKey: string, todayKey: string): string {
  if (dayKey === todayKey) {
    return "Today's log";
  }

  return new Intl.DateTimeFormat(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric"
  }).format(getDateFromDayKey(dayKey));
}

function buildDailyGroups(records: AiMessage[], todayKey: string): DailyLogGroup[] {
  const counts = new Map<string, number>([[todayKey, 0]]);

  records.forEach((record) => {
    const dayKey = getDayKeyFromIso(record.created_at);
    counts.set(dayKey, (counts.get(dayKey) ?? 0) + 1);
  });

  return Array.from(counts.entries())
    .map(([dayKey, count]) => ({ dayKey, count }))
    .sort((first, second) => second.dayKey.localeCompare(first.dayKey));
}

function mergeSavedMessage(records: AiMessage[], nextRecord: AiMessage): AiMessage[] {
  return [...records.filter((record) => record.id !== nextRecord.id), nextRecord].sort(
    (first, second) => new Date(first.created_at).getTime() - new Date(second.created_at).getTime()
  );
}

function getSpeechRecognitionConstructor(): AegoSpeechRecognitionConstructor | null {
  if (typeof window === "undefined") {
    return null;
  }

  return window.SpeechRecognition ?? window.webkitSpeechRecognition ?? null;
}

function extractSpeechTranscript(results: AegoSpeechRecognitionResultList): string {
  const transcriptParts: string[] = [];

  for (let index = 0; index < results.length; index += 1) {
    const result = results[index];
    const alternative = result?.[0];

    if (alternative?.transcript) {
      transcriptParts.push(alternative.transcript.trim());
    }
  }

  return transcriptParts.join(" ").trim();
}

export default function ChatPage() {
  const [savedMessages, setSavedMessages] = useState<AiMessage[]>([]);
  const [pendingMessages, setPendingMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);
  const [historyError, setHistoryError] = useState<string | null>(null);
  const [saveNotice, setSaveNotice] = useState<string | null>(null);
  const [todayKey, setTodayKey] = useState(() => getLocalDayKey(new Date()));
  const [activeDayKey, setActiveDayKey] = useState(() => getLocalDayKey(new Date()));
  const [isListening, setIsListening] = useState(false);
  const [voiceNotice, setVoiceNotice] = useState<string | null>(null);
  const previousTodayKey = useRef(todayKey);
  const recognitionRef = useRef<AegoSpeechRecognition | null>(null);
  const speechBaseInput = useRef("");

  useEffect(() => {
    const timer = window.setInterval(() => {
      setTodayKey(getLocalDayKey(new Date()));
    }, 60_000);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    if (previousTodayKey.current === todayKey) {
      return;
    }

    const oldTodayKey = previousTodayKey.current;
    previousTodayKey.current = todayKey;

    setPendingMessages([]);
    setSaveNotice(null);
    setActiveDayKey((current) => (current === oldTodayKey ? todayKey : current));
  }, [todayKey]);

  useEffect(() => {
    let isActive = true;

    async function loadSavedMessages() {
      try {
        const supabase = createBrowserSupabaseClient();
        const { data, error } = await supabase
          .from("ai_messages")
          .select("id,user_id,user_message,ai_response,classification,status,created_at")
          .order("created_at", { ascending: false })
          .limit(historyLimit)
          .returns<AiMessage[]>();

        if (!isActive) {
          return;
        }

        if (error) {
          setHistoryError("Daily logs could not be loaded. New messages can still be parsed.");
          setIsHistoryLoading(false);
          return;
        }

        setSavedMessages((data ?? []).slice().reverse());
        setHistoryError(null);
        setIsHistoryLoading(false);
      } catch (error) {
        if (isActive) {
          setHistoryError(error instanceof Error ? error.message : "Daily logs could not be loaded.");
          setIsHistoryLoading(false);
        }
      }
    }

    loadSavedMessages();

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    return () => {
      recognitionRef.current?.abort();
    };
  }, []);

  const dailyGroups = useMemo(() => buildDailyGroups(savedMessages, todayKey), [savedMessages, todayKey]);

  const activeDayRecords = useMemo(
    () => savedMessages.filter((record) => getDayKeyFromIso(record.created_at) === activeDayKey),
    [activeDayKey, savedMessages]
  );

  const visibleMessages = useMemo(() => {
    const savedConversation = buildSavedConversation(activeDayRecords);
    const dayMessages = savedConversation.length > 0 ? savedConversation : activeDayKey === todayKey ? initialMessages : [];
    const pendingConversation = activeDayKey === todayKey ? pendingMessages : [];

    return [...dayMessages, ...pendingConversation];
  }, [activeDayKey, activeDayRecords, pendingMessages, todayKey]);

  const historyNotice = useMemo(() => {
    if (isHistoryLoading) {
      return "Loading daily logs...";
    }

    if (historyError) {
      return historyError;
    }

    if (saveNotice && activeDayKey === todayKey) {
      return saveNotice;
    }

    if (activeDayRecords.length === 0 && activeDayKey === todayKey) {
      return "Fresh daily log. Aego will save today's parser entries here.";
    }

    if (activeDayRecords.length === 0) {
      return `${formatFullDayLabel(activeDayKey, todayKey)} has no saved parser entries.`;
    }

    return `${formatFullDayLabel(activeDayKey, todayKey)} has ${activeDayRecords.length} saved parser ${
      activeDayRecords.length === 1 ? "entry" : "entries"
    }.`;
  }, [activeDayKey, activeDayRecords.length, historyError, isHistoryLoading, saveNotice, todayKey]);

  function handleDaySelect(dayKey: string) {
    setActiveDayKey(dayKey);
    setSaveNotice(null);
  }

  function stopVoiceInput() {
    recognitionRef.current?.stop();
  }

  function startVoiceInput() {
    const Recognition = getSpeechRecognitionConstructor();

    if (!Recognition) {
      setVoiceNotice("Voice input is not supported in this browser yet.");
      return;
    }

    try {
      const recognition = new Recognition();
      speechBaseInput.current = input.trim();
      recognition.lang = "en-IN";
      recognition.interimResults = true;
      recognition.continuous = false;
      recognition.onresult = (event) => {
        const transcript = extractSpeechTranscript(event.results);
        setInput(speechBaseInput.current ? `${speechBaseInput.current} ${transcript}`.trim() : transcript);
      };
      recognition.onerror = () => {
        setIsListening(false);
        recognitionRef.current = null;
        setVoiceNotice("Voice input stopped. You can type or try the mic again.");
      };
      recognition.onend = () => {
        setIsListening(false);
        recognitionRef.current = null;
        setVoiceNotice((current) => (current === "Listening..." ? "Voice captured. Review before sending." : current));
      };

      recognitionRef.current = recognition;
      setIsListening(true);
      setVoiceNotice("Listening...");
      recognition.start();
    } catch (error) {
      setIsListening(false);
      recognitionRef.current = null;
      setVoiceNotice(error instanceof Error ? error.message : "Voice input could not start.");
    }
  }

  function toggleVoiceInput() {
    if (isListening) {
      stopVoiceInput();
      return;
    }

    startVoiceInput();
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const message = input.trim();

    if (!message || isLoading) {
      return;
    }

    setActiveDayKey(todayKey);
    setPendingMessages([{ role: "user", text: message }]);
    setInput("");
    setIsLoading(true);
    setSaveNotice(null);
    recognitionRef.current?.abort();

    try {
      const response = await fetch("/api/aego/parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message })
      });

      const payload = (await response.json()) as {
        ok: boolean;
        result?: AegoParserResult;
        message?: AiMessage;
        error?: string;
      };

      if (!response.ok || !payload.ok || !payload.result) {
        setPendingMessages((current) => [
          ...current,
          { role: "assistant", text: payload.error || "Aego could not parse that update." }
        ]);
        return;
      }

      const result = payload.result;

      if (payload.message) {
        setSavedMessages((current) => mergeSavedMessage(current, payload.message as AiMessage));
        setPendingMessages([]);
      } else {
        setPendingMessages((current) => [...current, { role: "assistant", text: getParserResponseText(result), result }]);
      }

      setSaveNotice("Saved to today's daily log.");
    } catch (error) {
      setPendingMessages((current) => [
        ...current,
        {
          role: "assistant",
          text: error instanceof Error ? error.message : "Aego parser request failed."
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AppShell
      eyebrow="Aego"
      title="Chat Assistant"
      subtitle="First working parser phase. Aego now classifies natural-language updates, keeps daily logs, and detects missing details before any database write is attempted."
      maxWidthClassName="max-w-6xl"
    >
      <ProtectedRoute>
        <Panel className="grid min-h-[68vh] overflow-hidden p-0 lg:grid-cols-[16rem_1fr]">
          <aside className="border-b border-white/10 p-4 lg:border-b-0 lg:border-r">
            <p className="text-xs uppercase tracking-[0.25em] text-aegoryn-gold">Daily logs</p>
            <div className="mt-4 space-y-2">
              {dailyGroups.map((group) => {
                const isActive = group.dayKey === activeDayKey;

                return (
                  <button
                    className={
                      isActive
                        ? "flex w-full items-center justify-between rounded-2xl border border-aegoryn-gold/60 bg-aegoryn-gold/10 px-3 py-3 text-left text-sm text-aegoryn-gold"
                        : "flex w-full items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-3 py-3 text-left text-sm text-white/65 transition hover:border-aegoryn-gold/50 hover:text-aegoryn-gold"
                    }
                    key={group.dayKey}
                    onClick={() => handleDaySelect(group.dayKey)}
                    type="button"
                  >
                    <span>{formatDayLabel(group.dayKey, todayKey)}</span>
                    <span className="rounded-full border border-white/10 px-2 py-1 text-[11px] text-white/45">{group.count}</span>
                  </button>
                );
              })}
            </div>
          </aside>

          <div className="flex min-h-[68vh] flex-col">
            <section className="flex-1 space-y-4 overflow-y-auto p-6">
              <div className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-xs text-white/50">
                {historyNotice}
              </div>
              {visibleMessages.length === 0 ? (
                <div className="rounded-3xl border border-white/10 bg-black/25 p-5 text-sm text-white/50">
                  No saved messages for this day.
                </div>
              ) : (
                visibleMessages.map((message, index) => (
                  <div
                    key={`${message.role}-${index}-${message.savedAt ?? message.text}`}
                    className={
                      message.role === "user"
                        ? "ml-auto max-w-xl rounded-3xl bg-aegoryn-gold p-4 text-black"
                        : "mr-auto max-w-2xl rounded-3xl border border-white/10 bg-black/35 p-4 text-white/75"
                    }
                  >
                    <p className="text-xs uppercase tracking-[0.2em] opacity-60">{message.role}</p>
                    <p className="mt-2 text-sm leading-6">{message.text}</p>
                    {message.savedAt ? (
                      <p className="mt-2 text-[11px] uppercase tracking-[0.2em] text-white/35">
                        Saved {new Date(message.savedAt).toLocaleString()}
                        {message.status ? ` - ${message.status.replace("_", " ")}` : ""}
                      </p>
                    ) : null}

                    {message.result ? (
                      <div className="mt-4 rounded-2xl border border-white/10 bg-black/30 p-4 text-xs leading-5 text-white/60">
                        <p>
                          <span className="text-aegoryn-gold">Classification:</span> {message.result.classification}
                        </p>
                        <p>
                          <span className="text-aegoryn-gold">Intent:</span> {message.result.intent}
                        </p>
                        <p>
                          <span className="text-aegoryn-gold">Needs clarification:</span>{" "}
                          {message.result.requiresClarification ? "Yes" : "No"}
                        </p>
                        {message.result.actions[0]?.transaction ? (
                          <pre className="mt-3 overflow-auto rounded-xl bg-black/40 p-3 text-[11px] text-white/55">
                            {JSON.stringify(message.result.actions[0].transaction, null, 2)}
                          </pre>
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                ))
              )}
            </section>

            <footer className="border-t border-white/10 p-4">
              <form className="rounded-[2rem] border border-white/10 bg-black/35 p-2" onSubmit={handleSubmit}>
                <div className="flex items-center gap-2">
                  <input
                    className="min-w-0 flex-1 bg-transparent px-4 text-sm outline-none placeholder:text-white/35"
                    placeholder="Dump an update for Aego to classify..."
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                  />
                  <button
                    aria-label={isListening ? "Stop voice input" : "Start voice input"}
                    className={
                      isListening
                        ? "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-aegoryn-gold bg-aegoryn-gold text-black transition hover:bg-white"
                        : "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/15 text-white/70 transition hover:border-aegoryn-gold hover:text-aegoryn-gold"
                    }
                    onClick={toggleVoiceInput}
                    title={isListening ? "Stop voice input" : "Start voice input"}
                    type="button"
                  >
                    {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  </button>
                  <button className={`${primaryButtonClassName} px-5 py-2`} type="submit" disabled={isLoading || !input.trim()}>
                    {isLoading ? "Parsing..." : "Send"}
                  </button>
                </div>
                {voiceNotice ? <p className="px-4 pb-1 pt-2 text-xs text-white/45">{voiceNotice}</p> : null}
              </form>
            </footer>
          </div>
        </Panel>
      </ProtectedRoute>
    </AppShell>
  );
}
