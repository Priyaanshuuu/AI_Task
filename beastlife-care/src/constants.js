export const T = {
  bg:  "#07070a", 
  s1:  "#0f0f14",  
  s2:  "#17171e",   
  bor: "#252530",   
  acc: "#f97316",   
  txt: "#f0f0f2",   
  mut: "#6b6b7a",   
};

export const card  = (extra = {}) => ({
  background:   T.s1,
  border:       `1px solid ${T.bor}`,
  borderRadius: 8,
  padding:      16,
  ...extra,
});

export const badge = (clr) => ({
  background:   clr + "22",
  color:        clr,
  borderRadius: 4,
  padding:      "2px 8px",
  fontSize:     11,
  fontWeight:   700,
  display:      "inline-block",
});

export const SEC = {
  fontSize:      10,
  color:         T.mut,
  letterSpacing: "1.5px",
  textTransform: "uppercase",
  marginBottom:  12,
};

export const CATS = [
  { name: "Order Tracking",    clr: "#f97316", pct: 35, auto: 90 },
  { name: "Delivery Delay",    clr: "#eab308", pct: 22, auto: 75 },
  { name: "Refund Request",    clr: "#60a5fa", pct: 18, auto: 60 },
  { name: "Product Complaint", clr: "#f87171", pct: 15, auto: 45 },
  { name: "Subscription",      clr: "#a78bfa", pct:  5, auto: 80 },
  { name: "Payment Failure",   clr: "#22d3ee", pct:  3, auto: 65 },
  { name: "General Query",     clr: "#4ade80", pct:  2, auto: 85 },
];

export const TREND = [
  { w: "Jan W1", o: 120, d: 75, r: 62, p: 51 },
  { w: "Jan W2", o: 135, d: 82, r: 70, p: 48 },
  { w: "Jan W3", o: 118, d: 91, r: 65, p: 55 },
  { w: "Jan W4", o: 142, d: 88, r: 58, p: 45 },
  { w: "Feb W1", o: 156, d: 95, r: 72, p: 52 },
  { w: "Feb W2", o: 148, d: 78, r: 68, p: 49 },
  { w: "Feb W3", o: 162, d: 85, r: 74, p: 53 },
  { w: "Feb W4", o: 170, d: 92, r: 80, p: 58 },
];

export const LOG_INITIAL = [
  { id: 1, text: "Where is my order #BL4892? It's been 5 days!",        ch: "WhatsApp",      cat: "Order Tracking",    conf: 97, time: "2m",  pri: "High",   sent: "Frustrated" },
  { id: 2, text: "Package hasn't arrived — delivery was due Monday",     ch: "Instagram DM",  cat: "Delivery Delay",    conf: 94, time: "8m",  pri: "High",   sent: "Frustrated" },
  { id: 3, text: "I want a refund for order BL3820 please",              ch: "Email",         cat: "Refund Request",    conf: 98, time: "15m", pri: "Medium", sent: "Neutral"    },
  { id: 4, text: "Pre-workout tastes awful, made me feel sick",           ch: "WhatsApp",      cat: "Product Complaint", conf: 91, time: "23m", pri: "Urgent", sent: "Negative"   },
  { id: 5, text: "How do I pause my Beast subscription for 1 month?",    ch: "Website Chat",  cat: "Subscription",      conf: 96, time: "31m", pri: "Low",    sent: "Neutral"    },
  { id: 6, text: "Payment keeps failing, tried 3 different cards",       ch: "Email",         cat: "Payment Failure",   conf: 93, time: "45m", pri: "Urgent", sent: "Frustrated" },
  { id: 7, text: "What's the best protein powder for muscle gain?",      ch: "Instagram DM",  cat: "General Query",     conf: 89, time: "1h",  pri: "Low",    sent: "Positive"   },
  { id: 8, text: "Beast Bundle not shipped after 1 week",                ch: "WhatsApp",      cat: "Order Tracking",    conf: 95, time: "1h",  pri: "High",   sent: "Frustrated" },
];

export const AUTO_CARDS = [
  {
    cat:   "Order Tracking",
    clr:   "#f97316",
    cov:   "90%",
    desc:  "Auto-reply with live tracking link via Shiprocket/Delhivery API. Order ID is detected from the message, status is fetched, reply is sent instantly — zero human touch.",
    tmpl:  "Hi! Order #{{ID}} is {{STATUS}}. Track live: {{LINK}} — ETA: {{DATE}}",
    saves: "~323 tickets/month automated",
  },
  {
    cat:   "Delivery Delay",
    clr:   "#eab308",
    cov:   "75%",
    desc:  "Proactive delay detection. AI monitors all shipment ETAs and notifies customers before they even reach out — preventing inbound tickets entirely.",
    tmpl:  "Update: slight delay on your order. New ETA: {{DATE}}. We're on it — sorry!",
    saves: "~203 tickets/month deflected",
  },
  {
    cat:   "Refund Request",
    clr:   "#60a5fa",
    cov:   "60%",
    desc:  "Auto-refund for orders under ₹2,000 within 7-day window. Larger amounts or flagged cases route to a human reviewer with full context pre-loaded.",
    tmpl:  "Refund of ₹{{AMT}} initiated. Hits your account in 3–5 business days.",
    saves: "~166 tickets/month automated",
  },
  {
    cat:   "Product Complaint",
    clr:   "#f87171",
    cov:   "45%",
    desc:  "Sentiment scoring flags every complaint. AI logs the issue, sends empathy + replacement form. High-frustration scores escalate to human immediately.",
    tmpl:  "We're sorry to hear this. Fill this 30-sec form: {{LINK}} — we'll make it right.",
    saves: "~124 tickets/month triaged",
  },
  {
    cat:   "Subscription",
    clr:   "#a78bfa",
    cov:   "80%",
    desc:  "Self-service portal links for all subscription actions — pause, cancel, upgrade. Churn intent detection triggers a retention offer automatically.",
    tmpl:  "Manage your plan instantly at beastlife.com/account — pause, cancel, or upgrade.",
    saves: "~46 tickets/month self-served",
  },
  {
    cat:   "Payment Failure",
    clr:   "#22d3ee",
    cov:   "65%",
    desc:  "Failed payment auto-detected. Retry link + alternate UPI/card options sent immediately. Auto-retry queued for 24h with smart payment routing.",
    tmpl:  "Payment of ₹{{AMT}} failed. Retry securely: {{LINK}} or try UPI: {{UPI}}",
    saves: "~28 tickets/month resolved",
  },
  {
    cat:   "General Query",
    clr:   "#4ade80",
    cov:   "85%",
    desc:  "RAG-powered chatbot trained on full product catalog, policies, and knowledge base. Retrieves accurate contextual answers in under 2 seconds, 24/7.",
    tmpl:  "Great question! {{AI_ANSWER}} — more at beastlife.com/help",
    saves: "~18 tickets/month deflected",
  },
];
export const catClr = (name = "") =>
  CATS.find(c => name.startsWith(c.name.split(" ")[0]))?.clr || T.mut;

export const priClr = {
  Low:    "#4ade80",
  Medium: "#eab308",
  High:   "#f97316",
  Urgent: "#ef4444",
};