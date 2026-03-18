
import { useState } from "react";
import { T, catClr, priClr, card, badge, SEC } from "../constants";

const EXAMPLES = [
  "Where is my order #BL9912? It's been 6 days with no update at all",
  "I want a full refund, the product was completely different from what was listed",
  "My subscription payment failed twice, please fix this urgently",
  "The creatine powder I received smells really off - is it expired?",
];

const CATEGORY_RULES = [
  {
    category: "Order Tracking",
    keywords: ["where is my order", "track", "tracking", "shipment", "shipped", "dispatch", "awb", "eta"],
  },
  {
    category: "Delivery Delay",
    keywords: ["late", "delay", "delayed", "not arrived", "still not", "overdue", "stuck"],
  },
  {
    category: "Refund Request",
    keywords: ["refund", "return", "money back", "cancel order", "reversal"],
  },
  {
    category: "Product Complaint",
    keywords: ["damaged", "broken", "wrong product", "expired", "smells", "defective", "fake"],
  },
  {
    category: "Subscription",
    keywords: ["subscription", "pause", "renew", "plan", "cancel my plan", "upgrade"],
  },
  {
    category: "Payment Failure",
    keywords: ["payment failed", "payment error", "declined", "upi", "card", "transaction failed", "charged twice"],
  },
  {
    category: "General Query",
    keywords: ["how", "what", "when", "which", "guide", "help"],
  },
];

function pickCategory(text) {
  const q = text.toLowerCase();
  let best = { category: "General Query", score: 0 };

  CATEGORY_RULES.forEach(rule => {
    const score = rule.keywords.reduce((acc, kw) => acc + (q.includes(kw) ? 1 : 0), 0);
    if (score > best.score) best = { category: rule.category, score };
  });

  return best;
}

function detectSentiment(text) {
  const q = text.toLowerCase();
  const negative = ["bad", "worst", "angry", "unacceptable", "frustrated", "upset", "hate", "sick", "issue", "problem"];
  const urgent = ["urgent", "asap", "immediately", "right now", "escalate", "manager"];
  const positive = ["thanks", "thank you", "great", "awesome", "love"];

  const negHits = negative.filter(w => q.includes(w)).length;
  const urgHits = urgent.filter(w => q.includes(w)).length;
  const posHits = positive.filter(w => q.includes(w)).length;

  if (urgHits > 0 || negHits >= 2) return "Frustrated";
  if (negHits === 1) return "Negative";
  if (posHits > 0) return "Positive";
  return "Neutral";
}

function priorityFrom(text, category, sentiment) {
  const q = text.toLowerCase();
  if (sentiment === "Frustrated" || q.includes("refund") || q.includes("payment") || q.includes("urgent")) {
    return "Urgent";
  }
  if (["Delivery Delay", "Order Tracking", "Product Complaint"].includes(category)) return "High";
  if (["Subscription", "Refund Request"].includes(category)) return "Medium";
  return "Low";
}

function buildSuggestedReply(category) {
  const replies = {
    "Order Tracking": "Thanks for reaching out to Beastlife. Please share your order ID and we will send your latest tracking status and ETA right away.",
    "Delivery Delay": "Sorry for the delay and thanks for your patience. Beastlife is checking your shipment now and we will share an updated ETA shortly.",
    "Refund Request": "We understand and can help with this. Beastlife will review your order details and initiate the refund process with an update soon.",
    "Product Complaint": "We are sorry this happened. Beastlife will investigate this issue immediately and arrange the best resolution for you.",
    "Subscription": "Happy to help with your subscription. Beastlife can assist with pause, resume, or cancellation based on your preference.",
    "Payment Failure": "Sorry for the payment trouble. Beastlife can help you retry securely and confirm once the payment is successful.",
    "General Query": "Thanks for your message. Beastlife is here to help and we will share a clear answer right away.",
  };

  return replies[category] || replies["General Query"];
}

function summarize(text, category) {
  const clean = text.replace(/\s+/g, " ").trim();
  if (!clean) return "Customer asked for help.";
  return `${category}: ${clean.slice(0, 95)}${clean.length > 95 ? "..." : ""}`;
}

async function analyzeWithFreeModel(query) {
  const picked = pickCategory(query);
  const sentiment = detectSentiment(query);
  const priority = priorityFrom(query, picked.category, sentiment);
  const confidenceBase = 74 + Math.min(20, picked.score * 8);
  const confidence = Math.max(70, Math.min(98, confidenceBase + (sentiment === "Frustrated" ? 2 : 0)));
  const escalate = priority === "Urgent" || sentiment === "Frustrated";
  const canAutomate = !["Product Complaint"].includes(picked.category) && !escalate;

  await new Promise(resolve => setTimeout(resolve, 500));

  return {
    category: picked.category,
    confidence,
    sentiment,
    priority,
    summary: summarize(query, picked.category),
    suggested_reply: buildSuggestedReply(picked.category),
    can_automate: canAutomate,
    escalate,
    escalation_reason: escalate ? "Urgency or frustration detected in message tone." : null,
    model: "Free Local Model (No API Key)",
  };
}

export default function AIAnalyzer({ addToLog }) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  async function analyze() {
    if (!query.trim() || loading) return;
    setLoading(true);
    setResult(null);

    try {
      const parsed = await analyzeWithFreeModel(query);

      setResult(parsed);

      addToLog({
        id: Date.now(),
        text: query.slice(0, 55) + (query.length > 55 ? "..." : ""),
        ch: "Analyzer",
        cat: parsed.category || "General Query",
        conf: parsed.confidence || 85,
        time: "now",
        pri: parsed.priority || "Medium",
        sent: parsed.sentiment || "Neutral",
        auto: parsed.can_automate || false,
        esc: parsed.escalate || false,
      });
    } catch (err) {
      console.error("Free model analysis error:", err);
      setResult({ error: true });
    }

    setLoading(false);
  }

  return (
    <div style={{ maxWidth: 760 }}>
      <div style={{ ...card(), marginBottom: 16 }}>
        <div style={SEC}>Paste Customer Query - Instagram DM / WhatsApp / Email / Chat</div>

        <textarea
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === "Enter" && e.ctrlKey && analyze()}
          placeholder="e.g. 'I ordered 5 days ago and my package still hasn't arrived. This is unacceptable, I want a refund now!'"
          style={{
            width: "100%",
            background: T.s2,
            border: `1px solid ${T.bor}`,
            borderRadius: 6,
            padding: 12,
            color: T.txt,
            fontFamily: "inherit",
            fontSize: 13,
            resize: "vertical",
            outline: "none",
            minHeight: 88,
            boxSizing: "border-box",
            lineHeight: 1.6,
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 12 }}>
          <button
            onClick={analyze}
            disabled={loading}
            style={{
              background: loading ? T.s2 : T.acc,
              color: loading ? T.mut : "#000",
              border: "none",
              borderRadius: 6,
              padding: "10px 26px",
              fontFamily: "inherit",
              fontSize: 12,
              fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
              letterSpacing: "0.5px",
              transition: "background 0.2s",
            }}
          >
            {loading ? "Analyzing..." : "Analyze Query"}
          </button>

          <span style={{ fontSize: 11, color: T.mut }}>Free local model (no API key)</span>
          <span style={{ fontSize: 11, color: T.mut }}>Ctrl + Enter to run</span>
          <div style={{ marginLeft: "auto", fontSize: 11, color: T.mut }}>{query.length} chars</div>
        </div>
      </div>

      {loading && (
        <div style={{ ...card(), textAlign: "center", padding: 44 }}>
          <div style={{ fontSize: 28, marginBottom: 12, color: T.acc }}>#</div>
          <div style={{ color: T.mut, letterSpacing: "0.5px" }}>Free model is classifying the query...</div>
          <div style={{ fontSize: 11, color: T.mut, marginTop: 6 }}>Category - Priority - Sentiment - Routing</div>
        </div>
      )}


      {result && !result.error && (
        <div style={card()}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 18,
              flexWrap: "wrap",
            }}
          >
            <span style={badge(catClr(result.category))}>{result.category}</span>
            <span style={badge(priClr[result.priority] || T.mut)}>{result.priority} priority</span>
            <span
              style={badge(
                result.sentiment === "Positive" ? "#4ade80" :
                result.sentiment === "Frustrated" ? "#ef4444" :
                "#71717a"
              )}
            >
              {result.sentiment}
            </span>
            <div style={{ marginLeft: "auto", fontSize: 12, color: T.mut }}>
              Confidence: <strong style={{ color: T.txt }}>{result.confidence}%</strong>
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <div style={{ ...SEC, marginBottom: 6 }}>AI Summary</div>
            <div style={{ color: T.txt, lineHeight: 1.7 }}>{result.summary}</div>
          </div>

          <div
            style={{
              background: T.s2,
              border: `1px solid ${T.bor}`,
              borderRadius: 6,
              padding: "12px 14px",
              marginBottom: 18,
            }}
          >
            <div style={{ ...SEC, marginBottom: 8 }}>Suggested Auto-Reply</div>
            <div style={{ color: T.txt, lineHeight: 1.75, fontStyle: "italic" }}>
              "{result.suggested_reply}"
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div
              style={{
                background: result.can_automate ? "#4ade8010" : "#ef444410",
                border: `1px solid ${result.can_automate ? "#4ade8030" : "#ef444430"}`,
                borderRadius: 6,
                padding: 12,
              }}
            >
              <div style={{ ...SEC, marginBottom: 4 }}>Automation</div>
              <div
                style={{
                  color: result.can_automate ? "#4ade80" : "#ef4444",
                  fontWeight: 700,
                }}
              >
                {result.can_automate ? "Automate this query" : "Manual review needed"}
              </div>
            </div>

            <div
              style={{
                background: result.escalate ? "#ef444410" : "#4ade8010",
                border: `1px solid ${result.escalate ? "#ef444430" : "#4ade8030"}`,
                borderRadius: 6,
                padding: 12,
              }}
            >
              <div style={{ ...SEC, marginBottom: 4 }}>Routing</div>
              <div
                style={{
                  color: result.escalate ? "#ef4444" : "#4ade80",
                  fontWeight: 700,
                }}
              >
                {result.escalate ? "Escalate to human agent" : "Bot handles this"}
              </div>
            </div>
          </div>

          {result.escalation_reason && (
            <div style={{ marginTop: 10, fontSize: 11, color: T.mut }}>
              Escalation reason: {result.escalation_reason}
            </div>
          )}

          <div style={{ marginTop: 8, fontSize: 10.5, color: T.mut }}>Model: {result.model}</div>
        </div>
      )}

      {/* -- ERROR -- */}
      {result?.error && (
        <div style={{ ...card(), color: "#f87171" }}>
          Analysis error - please try another query.
        </div>
      )}

      {!result && !loading && (
        <div style={{ marginTop: 20 }}>
          <div style={{ ...SEC, marginBottom: 12 }}>Try a sample query</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {EXAMPLES.map((ex, i) => (
              <button
                key={i}
                onClick={() => setQuery(ex)}
                style={{
                  background: T.s2,
                  border: `1px solid ${T.bor}`,
                  borderRadius: 6,
                  padding: "10px 12px",
                  color: T.mut,
                  fontFamily: "inherit",
                  fontSize: 11,
                  cursor: "pointer",
                  textAlign: "left",
                  lineHeight: 1.5,
                  transition: "border-color 0.15s",
                }}
              >
                <div
                  style={{
                    color: T.acc,
                    fontSize: 9,
                    letterSpacing: "1px",
                    marginBottom: 4,
                  }}
                >
                  CLICK TO TRY
                </div>
                {ex}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
