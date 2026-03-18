// ─────────────────────────────────────────────────────────────
//  src/pages/Automation.jsx
//  Page 4 — Automation playbooks per category
//            Shows: strategy, message template, tickets saved,
//            overall impact summary at top
// ─────────────────────────────────────────────────────────────

import { AUTO_CARDS, T, card, badge, SEC } from "../constants";

export default function Automation() {
  return (
    <div>

      {/* ── IMPACT SUMMARY CARDS ────────────────────────────── */}
      <div style={{ ...card(), marginBottom: 20 }}>
        <div style={SEC}>Automation Impact — Projected Monthly Savings</div>
        <div style={{
          display:             "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap:                 12,
        }}>
          {[
            { value: "~908",  label: "Tickets Automated / Month",  color: "#4ade80" },
            { value: "70%",   label: "Overall Deflection Rate",     color: T.acc     },
            { value: "< 30s", label: "Bot Average Response Time",   color: "#60a5fa" },
          ].map((k, i) => (
            <div key={i} style={{
              background:   T.s2,
              borderRadius: 6,
              padding:      "14px 16px",
            }}>
              <div style={{
                fontSize:      24,
                fontWeight:    700,
                color:         k.color,
                letterSpacing: "-0.5px",
              }}>
                {k.value}
              </div>
              <div style={{ fontSize: 11, color: T.mut, marginTop: 3 }}>
                {k.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── PLAYBOOK GRID ───────────────────────────────────── */}
      <div style={{
        display:             "grid",
        gridTemplateColumns: "1fr 1fr",
        gap:                 14,
      }}>
        {AUTO_CARDS.map(ac => (
          <PlaybookCard key={ac.cat} data={ac} />
        ))}
      </div>

      {/* ── HOW ESCALATION WORKS ────────────────────────────── */}
      <div style={{ ...card(), marginTop: 20, borderTop: `2px solid #f87171` }}>
        <div style={SEC}>When AI Escalates to a Human Agent</div>
        <div style={{
          display:             "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap:                 12,
        }}>
          {[
            {
              trigger: "Confidence < 75%",
              desc:    "If Claude is not confident about the category, it routes to a human rather than send a wrong auto-reply.",
            },
            {
              trigger: "Sentiment = Frustrated + Urgent",
              desc:    "High anger + urgent priority triggers immediate human escalation with the AI summary pre-loaded in the ticket.",
            },
            {
              trigger: "Refund > ₹2,000",
              desc:    "Large refund requests always need human approval. AI creates the ticket with order history and recommends action.",
            },
          ].map((e, i) => (
            <div key={i} style={{
              background:   T.s2,
              borderRadius: 6,
              padding:      "12px 14px",
              borderLeft:   "3px solid #f87171",
            }}>
              <div style={{
                fontSize:     12,
                fontWeight:   700,
                color:        "#f87171",
                marginBottom: 6,
              }}>
                {e.trigger}
              </div>
              <div style={{ fontSize: 11, color: T.mut, lineHeight: 1.6 }}>
                {e.desc}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

// ── Individual playbook card ───────────────────────────────────
function PlaybookCard({ data }) {
  const { cat, clr, cov, desc, tmpl, saves } = data;
  return (
    <div style={{
      ...card(),
      borderLeft: `3px solid ${clr}`,
    }}>
      {/* Header */}
      <div style={{
        display:      "flex",
        justifyContent: "space-between",
        alignItems:   "flex-start",
        marginBottom: 10,
      }}>
        <div style={{ fontWeight: 700, fontSize: 13, color: T.txt }}>
          {cat}
        </div>
        <span style={{
          background:   clr + "22",
          color:        clr,
          borderRadius: 4,
          padding:      "2px 8px",
          fontSize:     11,
          fontWeight:   700,
        }}>
          {cov} auto
        </span>
      </div>

      {/* Strategy description */}
      <div style={{ fontSize: 12, color: T.mut, marginBottom: 12, lineHeight: 1.7 }}>
        {desc}
      </div>

      {/* Message template */}
      <div style={{
        background:   T.s2,
        borderRadius: 4,
        padding:      "9px 11px",
        marginBottom: 10,
        fontSize:     11,
        color:        "#a1a1aa",
        fontStyle:    "italic",
        lineHeight:   1.6,
        borderLeft:   `2px solid ${clr}40`,
      }}>
        "{tmpl}"
      </div>

      {/* Monthly savings */}
      <div style={{ fontSize: 11, color: clr, fontWeight: 700 }}>
        {saves}
      </div>
    </div>
  );
}