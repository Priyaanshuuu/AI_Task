import { T, card, SEC } from "../constants";

export default function Architecture() {
  return (
    <div>
      <div style={card()}>
        <div style={SEC}>End-to-End AI Workflow Architecture</div>
        <WorkflowDiagram />
      </div>

      <div style={{
        display:             "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap:                 14,
        marginTop:           16,
      }}>
        {TOOL_GROUPS.map(g => (
          <div key={g.title} style={{ ...card(), borderTop: `2px solid ${g.clr}` }}>
            <div style={{ fontWeight: 700, fontSize: 12, color: T.txt, marginBottom: 12 }}>
              {g.title}
            </div>
            {g.items.map(item => (
              <div key={item} style={{
                fontSize:     11,
                color:        T.mut,
                marginBottom: 7,
                display:      "flex",
                alignItems:   "flex-start",
                gap:          8,
                lineHeight:   1.5,
              }}>
                <span style={{
                  width:        5,
                  height:       5,
                  borderRadius: "50%",
                  background:   g.clr,
                  flexShrink:   0,
                  marginTop:    4,
                }} />
                {item}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div style={{ ...card(), marginTop: 16, borderTop: `2px solid ${T.acc}` }}>
        <div style={SEC}>How the Workflow Operates — Step by Step</div>
        <div style={{
          display:             "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap:                 12,
        }}>
          {STEPS.map(step => (
            <div key={step.n} style={{
              background:   T.s2,
              borderRadius: 6,
              padding:      "12px 14px",
            }}>
              <div style={{
                display:      "flex",
                alignItems:   "center",
                gap:          8,
                marginBottom: 6,
              }}>
                <span style={{ color: T.acc, fontWeight: 700, fontSize: 13 }}>
                  {step.n}
                </span>
                <span style={{ fontWeight: 600, fontSize: 12, color: T.txt }}>
                  {step.title}
                </span>
              </div>
              <div style={{ fontSize: 11.5, color: T.mut, lineHeight: 1.65 }}>
                {step.desc}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

function WorkflowDiagram() {
  const bor  = T.bor;
  const mut  = T.mut;
  const txt  = T.txt;
  const acc  = T.acc;
  const s1   = T.s1;
  const s2   = T.s2;

  return (
    <svg
      viewBox="0 0 860 500"
      style={{ width: "100%", display: "block" }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <marker
          id="arrowhead"
          markerWidth="7"
          markerHeight="7"
          refX="5"
          refY="3.5"
          orient="auto"
        >
          <polygon points="0,0 7,3.5 0,7" fill={bor} />
        </marker>
      </defs>

      {/* ── Layer labels (left side) ── */}
      {[
        ["INPUT",            54 ],
        ["INTEGRATION",      154],
        ["AI CLASSIFICATION",248],
        ["ROUTING",          336],
        ["RESOLUTION",       426],
      ].map(([label, y]) => (
        <text
          key={label} x={8} y={y}
          fontSize={7.5} fill="#3a3a4a"
          letterSpacing={1.5}
          style={{ fontFamily: "monospace" }}
        >
          {label}
        </text>
      ))}

      {[
        { x: 80,  label: "Instagram DM",  sub: "Meta Graph API"      },
        { x: 240, label: "WhatsApp",       sub: "Business API"        },
        { x: 400, label: "Email",           sub: "Gmail / IMAP"       },
        { x: 560, label: "Website Chat",    sub: "Intercom / Custom"  },
      ].map(b => (
        <g key={b.label}>
          <rect x={b.x} y={30} width={130} height={48} rx={5} fill={s2} stroke={bor} strokeWidth={0.8} />
          <text x={b.x + 65} y={51} textAnchor="middle" fontSize={11.5} fill={txt} fontWeight={600} style={{ fontFamily: "monospace" }}>
            {b.label}
          </text>
          <text x={b.x + 65} y={66} textAnchor="middle" fontSize={9} fill={mut} style={{ fontFamily: "monospace" }}>
            {b.sub}
          </text>
        </g>
      ))}

      {[
        [145, 78, 390, 132],
        [305, 78, 400, 132],
        [465, 78, 420, 132],
        [625, 78, 430, 132],
      ].map(([x1, y1, x2, y2], i) => (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
          stroke={bor} strokeWidth={0.9} markerEnd="url(#arrowhead)" />
      ))}

      <rect x={240} y={134} width={340} height={46} rx={5} fill={s2} stroke="#f9731635" strokeWidth={1} />
      <text x={410} y={154} textAnchor="middle" fontSize={12} fill={acc} fontWeight={700} style={{ fontFamily: "monospace" }}>
        Webhook / Automation Layer
      </text>
      <text x={410} y={170} textAnchor="middle" fontSize={9} fill={mut} style={{ fontFamily: "monospace" }}>
        Zapier · Make.com · n8n — unified intake &amp; normalization
      </text>

      <line x1={410} y1={180} x2={410} y2={218}
        stroke={bor} strokeWidth={0.9} markerEnd="url(#arrowhead)" />

      <rect x={190} y={220} width={440} height={62} rx={6} fill="#140e08" stroke="#f9731660" strokeWidth={1.2} />
      <text x={410} y={244} textAnchor="middle" fontSize={13.5} fill={acc} fontWeight={700} style={{ fontFamily: "monospace" }}>
        Local AI Classifier
      </text>
      <text x={410} y={261} textAnchor="middle" fontSize={9.5} fill="#f9731660" style={{ fontFamily: "monospace" }}>
        Category · Priority · Sentiment · Confidence · Escalation Flag
      </text>
      <text x={410} y={276} textAnchor="middle" fontSize={8.5} fill={mut} style={{ fontFamily: "monospace" }}>
        No API key mode · rule-based inference · low-latency local scoring
      </text>

      <line x1={410} y1={282} x2={410} y2={314}
        stroke={bor} strokeWidth={0.9} markerEnd="url(#arrowhead)" />

      <rect x={300} y={316} width={220} height={44} rx={5} fill={s2} stroke={bor} strokeWidth={0.8} />
      <text x={410} y={334} textAnchor="middle" fontSize={11.5} fill={txt} fontWeight={600} style={{ fontFamily: "monospace" }}>
        Smart Routing Engine
      </text>
      <text x={410} y={350} textAnchor="middle" fontSize={9} fill={mut} style={{ fontFamily: "monospace" }}>
        Confidence threshold · Rule engine · SLA check
      </text>

      <line x1={345} y1={360} x2={165} y2={398} stroke={bor} strokeWidth={0.9} markerEnd="url(#arrowhead)" />
      <line x1={410} y1={360} x2={410} y2={398} stroke={bor} strokeWidth={0.9} markerEnd="url(#arrowhead)" />
      <line x1={475} y1={360} x2={655} y2={398} stroke={bor} strokeWidth={0.9} markerEnd="url(#arrowhead)" />

      {[
        { x: 65,  label: "Auto-Reply Bot",    sub: "Template + APIs",     clr: "#4ade80" },
        { x: 315, label: "FAQ / RAG Bot",      sub: "Vector DB + LLM",     clr: "#60a5fa" },
        { x: 565, label: "Human Agent Queue",  sub: "Freshdesk / Zendesk", clr: "#f87171" },
      ].map(b => (
        <g key={b.label}>
          <rect x={b.x} y={400} width={160} height={48} rx={5} fill={s2} stroke={b.clr + "40"} strokeWidth={1} />
          <text x={b.x + 80} y={421} textAnchor="middle" fontSize={11} fill={b.clr} fontWeight={600} style={{ fontFamily: "monospace" }}>
            {b.label}
          </text>
          <text x={b.x + 80} y={437} textAnchor="middle" fontSize={8.5} fill={mut} style={{ fontFamily: "monospace" }}>
            {b.sub}
          </text>
        </g>
      ))}

      {[145, 395, 645].map(x => (
        <line key={x} x1={x} y1={448} x2={410} y2={468} stroke={bor} strokeWidth={0.6} />
      ))}
      <text x={410} y={484} textAnchor="middle" fontSize={9} fill={mut} style={{ fontFamily: "monospace" }}>
        All events stream → Analytics Dashboard · Looker Studio / Custom React
      </text>
    </svg>
  );
}

const TOOL_GROUPS = [
  {
    title: "AI & Intelligence",
    clr:   T.acc,
    items: [
      "Local rule-based classifier — no API key",
      "Sentiment + priority scoring engine",
      "Pinecone — vector DB for FAQ RAG",
      "Python retrieval pipeline (optional upgrade path)",
    ],
  },
  {
    title: "Integration Layer",
    clr:   "#60a5fa",
    items: [
      "n8n / Make / Zapier — webhooks",
      "Meta Graph API — Instagram DMs",
      "WhatsApp Business API",
      "Gmail API / IMAP — email intake",
    ],
  },
  {
    title: "Analytics & CRM",
    clr:   "#4ade80",
    items: [
      "React Dashboard (this prototype)",
      "Looker Studio / Metabase — BI",
      "Freshdesk / Zendesk — ticketing",
      "Shiprocket API — order tracking",
    ],
  },
];

const STEPS = [
  {
    n:     "01",
    title: "Message Ingestion",
    desc:  "Customer sends a message on Instagram DM, WhatsApp, Email, or Website Chat. n8n/Make webhook receives it within milliseconds.",
  },
  {
    n:     "02",
    title: "AI Classification",
    desc:  "A local no-key AI layer classifies the query into one of 7 categories and computes confidence, priority, and sentiment with lightweight scoring rules.",
  },
  {
    n:     "03",
    title: "Smart Routing",
    desc:  "The routing engine checks confidence threshold (>85% → auto-respond; <85% → RAG bot; escalation flag → human queue).",
  },
  {
    n:     "04",
    title: "Auto-Resolution",
    desc:  "For automatable queries: templates are filled with live data from order/payment APIs and sent back to the customer instantly.",
  },
  {
    n:     "05",
    title: "RAG Bot Fallback",
    desc:  "For general questions: the RAG chatbot retrieves answers from the Beastlife knowledge base using semantic search + LLM synthesis.",
  },
  {
    n:     "06",
    title: "Human Escalation",
    desc:  "For complex or flagged cases: ticket created in Freshdesk with full AI context (category, sentiment, suggested reply) for the agent.",
  },
];