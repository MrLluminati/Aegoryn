import { AppShell, NavPill, Panel } from "../../components/brand/AppShell";

const sampleMessages = [
  {
    role: "user",
    text: "Paid ₹500 for groceries."
  },
  {
    role: "assistant",
    text: "Which bank account was used, and was this from savings or pocket money?"
  }
];

export default function ChatPage() {
  return (
    <AppShell
      eyebrow="Aego"
      title="Chat Assistant"
      subtitle="Static MVP shell. The next phase will connect this screen to the backend parser, clarification flow, and structured Supabase actions."
      maxWidthClassName="max-w-4xl"
      actions={
        <>
          <NavPill href="/dashboard">Dashboard</NavPill>
          <NavPill href="/accounts">Accounts</NavPill>
        </>
      }
    >
      <Panel className="flex min-h-[60vh] flex-col p-0">
        <section className="flex-1 space-y-4 p-6">
          {sampleMessages.map((message, index) => (
            <div key={`${message.role}-${index}`} className={message.role === "user" ? "ml-auto max-w-xl rounded-3xl bg-aegoryn-gold p-4 text-black" : "mr-auto max-w-xl rounded-3xl border border-white/10 bg-black/35 p-4 text-white/75"}>
              <p className="text-xs uppercase tracking-[0.2em] opacity-60">{message.role}</p>
              <p className="mt-2 text-sm leading-6">{message.text}</p>
            </div>
          ))}
        </section>

        <footer className="border-t border-white/10 p-4">
          <div className="flex gap-3 rounded-full border border-white/10 bg-black/35 p-2">
            <input
              disabled
              className="flex-1 bg-transparent px-4 text-sm outline-none placeholder:text-white/35"
              placeholder="Chat input will be enabled after backend parser setup"
            />
            <button disabled className="rounded-full bg-white/10 px-5 py-2 text-sm text-white/45">
              Send
            </button>
          </div>
        </footer>
      </Panel>
    </AppShell>
  );
}
