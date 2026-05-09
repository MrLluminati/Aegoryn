"use client";

import { FormEvent, useState } from "react";
import { AppShell, Panel, primaryButtonClassName } from "../../components/brand/AppShell";
import { ProtectedRoute } from "../../components/auth/ProtectedRoute";
import type { AegoParserResult } from "../../lib/aego/parser";

type ChatMessage = {
  role: "user" | "assistant";
  text: string;
  result?: AegoParserResult;
};

const initialMessages: ChatMessage[] = [
  {
    role: "assistant",
    text: "Aego parser is ready for MVP testing. Try: Paid ₹500 for groceries from Kotak from Savings."
  }
];

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const message = input.trim();

    if (!message || isLoading) {
      return;
    }

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
      const responseText = result.requiresClarification && result.clarificationQuestion
        ? result.clarificationQuestion
        : result.summary;

      setMessages((current) => [...current, { role: "assistant", text: responseText, result }]);
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
