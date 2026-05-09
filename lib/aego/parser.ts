export type AegoIntent =
  | "create_transaction"
  | "create_task"
  | "create_project_update"
  | "create_money_bucket"
  | "note"
  | "question"
  | "unknown";

export type AegoClassification = "account_management" | "task_management" | "project_update" | "note" | "question" | "unknown";

export type ParsedTransaction = {
  type: "income" | "expense" | "transfer" | null;
  amount: number | null;
  category: string | null;
  accountName: string | null;
  bucketName: string | null;
  description: string | null;
  sourceText: string;
};

export type AegoAction = {
  actionType: AegoIntent;
  transaction?: ParsedTransaction;
  confidence: "low" | "medium" | "high";
};

export type AegoParserResult = {
  classification: AegoClassification;
  intent: AegoIntent;
  requiresClarification: boolean;
  clarificationQuestion: string | null;
  actions: AegoAction[];
  summary: string;
  rawText: string;
};

const bankPatterns = [
  { canonical: "Kotak Mahindra Bank", patterns: ["kotak", "kotak mahindra"] },
  { canonical: "Axis Bank", patterns: ["axis", "axis bank"] },
  { canonical: "SBI", patterns: ["sbi", "state bank", "state bank of india"] }
];

const bucketPatterns = [
  { canonical: "Pocket Money", patterns: ["pocket money", "pocket"] },
  { canonical: "Savings", patterns: ["saving", "savings"] }
];

const expenseWords = ["paid", "spent", "bought", "purchased", "expense", "refill", "debited", "deducted"];
const incomeWords = ["received", "got", "credited", "income", "salary", "pocket money received", "deposit"];
const taskWords = ["remind", "todo", "to-do", "task", "follow up", "deadline", "call", "email"];
const questionWords = ["what", "why", "how", "when", "where", "should", "can", "could", "is", "are"];

function normalize(input: string): string {
  return input.trim().replace(/\s+/g, " ");
}

function lower(input: string): string {
  return input.toLowerCase();
}

function includesAny(text: string, words: string[]): boolean {
  return words.some((word) => text.includes(word));
}

function extractAmount(text: string): number | null {
  const match = text.match(/(?:₹|rs\.?|inr)?\s*([0-9]+(?:,[0-9]{2,3})*(?:\.[0-9]+)?|[0-9]+(?:\.[0-9]+)?)/i);

  if (!match?.[1]) {
    return null;
  }

  const amount = Number(match[1].replace(/,/g, ""));
  return Number.isFinite(amount) ? amount : null;
}

function extractKnownName(text: string, patterns: { canonical: string; patterns: string[] }[]): string | null {
  const lowered = lower(text);
  const match = patterns.find((item) => item.patterns.some((pattern) => lowered.includes(pattern)));
  return match?.canonical ?? null;
}

function inferTransactionType(text: string): "income" | "expense" | "transfer" | null {
  const lowered = lower(text);

  if (includesAny(lowered, incomeWords)) {
    return "income";
  }

  if (includesAny(lowered, expenseWords)) {
    return "expense";
  }

  return null;
}

function inferCategory(text: string): string | null {
  const lowered = lower(text);

  const categories = [
    "petrol",
    "fuel",
    "snacks",
    "grocery",
    "groceries",
    "food",
    "travel",
    "rent",
    "emi",
    "recharge",
    "subscription",
    "court",
    "learning",
    "laptop",
    "repair"
  ];

  const found = categories.find((category) => lowered.includes(category));

  if (!found) {
    return null;
  }

  if (found === "grocery") {
    return "groceries";
  }

  if (found === "fuel") {
    return "petrol";
  }

  return found;
}

function classifyText(text: string): { classification: AegoClassification; intent: AegoIntent } {
  const lowered = lower(text);
  const amount = extractAmount(text);
  const transactionType = inferTransactionType(text);

  if (amount !== null || transactionType !== null || extractKnownName(text, bankPatterns) || extractKnownName(text, bucketPatterns)) {
    return { classification: "account_management", intent: "create_transaction" };
  }

  if (includesAny(lowered, taskWords)) {
    return { classification: "task_management", intent: "create_task" };
  }

  if (questionWords.some((word) => lowered.startsWith(`${word} `)) || lowered.endsWith("?")) {
    return { classification: "question", intent: "question" };
  }

  if (lowered.length > 0) {
    return { classification: "note", intent: "note" };
  }

  return { classification: "unknown", intent: "unknown" };
}

function buildClarification(transaction: ParsedTransaction): string | null {
  const missing: string[] = [];

  if (!transaction.amount) {
    missing.push("amount");
  }

  if (!transaction.type) {
    missing.push("whether this is income or expense");
  }

  if (!transaction.accountName) {
    missing.push("which bank account was used");
  }

  if (!transaction.bucketName) {
    missing.push("whether this came from Savings, Pocket Money, or another money bucket");
  }

  if (missing.length === 0) {
    return null;
  }

  return `Please clarify ${missing.join(", ")}.`;
}

export function parseAegoCommand(input: string): AegoParserResult {
  const rawText = normalize(input);
  const { classification, intent } = classifyText(rawText);

  if (!rawText) {
    return {
      classification: "unknown",
      intent: "unknown",
      requiresClarification: true,
      clarificationQuestion: "Please enter an update for Aego to classify.",
      actions: [],
      summary: "No input received.",
      rawText
    };
  }

  if (classification === "account_management" && intent === "create_transaction") {
    const transaction: ParsedTransaction = {
      type: inferTransactionType(rawText),
      amount: extractAmount(rawText),
      category: inferCategory(rawText),
      accountName: extractKnownName(rawText, bankPatterns),
      bucketName: extractKnownName(rawText, bucketPatterns),
      description: rawText,
      sourceText: rawText
    };

    const clarificationQuestion = buildClarification(transaction);
    const requiresClarification = Boolean(clarificationQuestion);

    return {
      classification,
      intent,
      requiresClarification,
      clarificationQuestion,
      actions: [
        {
          actionType: "create_transaction",
          transaction,
          confidence: requiresClarification ? "medium" : "high"
        }
      ],
      summary: requiresClarification
        ? "Aego detected a financial update but needs missing details before saving."
        : "Aego detected a complete financial transaction ready for review.",
      rawText
    };
  }

  return {
    classification,
    intent,
    requiresClarification: false,
    clarificationQuestion: null,
    actions: [
      {
        actionType: intent,
        confidence: classification === "unknown" ? "low" : "medium"
      }
    ],
    summary: `Aego classified this as ${classification.replace("_", " ")}.`,
    rawText
  };
}
