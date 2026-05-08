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
    <main className="min-h-screen bg-aegoryn-black px-6 py-8 text-aegoryn-parchment">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-4xl flex-col rounded-[2rem] border border-white/10 bg-white/[0.03]">
        <header className="border-b border-white/10 p-6">
          <p className="text-sm uppercase tracking-[0.35em] text-aegoryn-gold">Aego</p>
          <h1 className="mt-2 text-3xl font-semibold">Chat Assistant Shell</h1>
          <p className="mt-2 text-sm text-white/55">Static MVP scaffold. AI parser integration will be added later.</p>
        </header>

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
      </div>
    </main>
  );
}
