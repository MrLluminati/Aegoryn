"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
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

const initialMessages: ChatMessage[] = [
  {
    role: "assistant",
    text: "Aego parser is ready for MVP testing. Try: Paid ₹500 for groceries from Kotak from Savings."
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

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [historyNotice, setHistoryNotice] = useState("Loading recent parser history...");
  const hasLocalConversation = useRef(false);

  useEffect(() => {
    let isActive = true;

    async function loadSavedMessages() {
      try {
        const supabase = createBrowserSupabaseClient();
        const { data, error } = await supabase
          .from("ai_messages")
          .select("id,user_id,user_message,ai_response,classification,status,created_at")
          .order("created_at", { ascending: false })
          .limit(6)
          .returns<AiMessage[]>();

        if (!isActive) {
          return;
        }

        if (error) {
          setHistoryNotice("Recent parser history could not be loaded. New messages can still be parsed.");
          return;
        }

        const records = (data ?? []).slice().reverse();

        if (records.length === 0) {
          setHistoryNotice("No saved parser history yet. Your next successful parse will be stored.");
          return;
        }

        if (!hasLocalConversation.current) {
          setMessages([...initialMessages, ...buildSavedConversation(records)]);
        }

        setHistoryNotice(`Showing ${records.length} saved parser ${records.length === 1 ? "entry" : "entries"}.`);
      } catch (error) {
        if (isActive) {
          setHistoryNotice(error instanceof Error ? error.message : "Recent parser history could not be loaded.");
        }
      }
    }

    loadSavedMessages();

    return () => {
      isActive = false;
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const message = input.trim();

    if (!message || isLoading) {
      return;
    }

    hasLocalConversation.current = true;
    setMessages((current) => [...current, { role: "user", text: message }]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/aego/parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message })
      });

      const payload = (await response.json()) as { ok: boolean; result?: AegoParserResult; error?: string };

      if (!response.ok || !payload.ok || !payload.result) {
        setMessages((current) => [
          ...current,
          { role: "assistant", text: payload.error || "Aego could not parse that update." }
        ]);
        return;
      }

      const result = payload.result;
      const responseText = getParserResponseText(result);

      setMessages((current) => [...current, { role: "assistant", text: responseText, result }]);
      setHistoryNotice("Parser result saved. Refresh the page to confirm it reloads from history.");
    } catch (error) {
      setMessages((current) => [
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
      subtitle="First working parser phase. Aego now classifies natural-language updates and detects missing details before any database write is attempted."
      maxWidthClassName="max-w-4xl"
    >
      <ProtectedRoute>
        <Panel className="flex min-h-[60vh] flex-col p-0">
          <section className="flex-1 space-y-4 p-6">
            <div className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-xs text-white/50">
              {historyNotice}
            </div>
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
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
                    <p><span className="text-aegoryn-gold">Classification:</span> {message.result.classification}</p>
                    <p><span className="text-aegoryn-gold">Intent:</span> {message.result.intent}</p>
                    <p><span className="text-aegoryn-gold">Needs clarification:</span> {message.result.requiresClarification ? "Yes" : "No"}</p>
                    {message.result.actions[0]?.transaction ? (
                      <pre className="mt-3 overflow-auto rounded-xl bg-black/40 p-3 text-[11px] text-white/55">
                        {JSON.stringify(message.result.actions[0].transaction, null, 2)}
                      </pre>
                    ) : null}
                  </div>
                ) : null}
              </div>
            ))}
          </section>

          <footer className="border-t border-white/10 p-4">
            <form className="flex gap-3 rounded-full border border-white/10 bg-black/35 p-2" onSubmit={handleSubmit}>
              <input
                className="flex-1 bg-transparent px-4 text-sm outline-none placeholder:text-white/35"
                placeholder="Dump an update for Aego to classify..."
                value={input}
                onChange={(event) => setInput(event.target.value)}
              />
              <button className={`${primaryButtonClassName} px-5 py-2`} type="submit" disabled={isLoading || !input.trim()}>
                {isLoading ? "Parsing..." : "Send"}
              </button>
            </form>
          </footer>
        </Panel>
      </ProtectedRoute>
    </AppShell>
  );
}
