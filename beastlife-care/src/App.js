import { useState } from "react";
import { T, LOG_INITIAL } from "./constants";
import Dashboard    from "./pages/Dashboard";
import AIAnalyzer   from "./pages/AIAnalyzer";
import QueryLog     from "./pages/QueryLog";
import Automation   from "./pages/Automation";
import Architecture from "./pages/Architecture";

const TABS = [
  { id: "dashboard", label: "Dashboard"    },
  { id: "analyze",   label: "AI Analyzer"  },
  { id: "log",       label: "Query Log"    },
  { id: "auto",      label: "Automation"   },
  { id: "arch",      label: "Architecture" },
];

export default function App() {
  const [tab,   setTab]   = useState("dashboard");
  const [log,   setLog]   = useState(LOG_INITIAL);
  const [total, setTotal] = useState(1842);

  function addToLog(entry) {
    setLog(prev => [entry, ...prev.slice(0, 19)]);
    setTotal(t => t + 1);
  }

  return (
    <div style={{
      background:  T.bg,
      minHeight:   "100vh",
      color:       T.txt,
      fontFamily:  "'DM Mono','Fira Code','Consolas',monospace",
      fontSize:    13,
    }}>
      <div style={{
        borderBottom: `1px solid ${T.bor}`,
        padding:      "13px 24px",
        display:      "flex",
        alignItems:   "center",
        gap:          16,
        background:   T.s1,
      }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
          <span style={{ fontSize: 17, fontWeight: 700, color: T.acc, letterSpacing: "-0.5px" }}>
            BEASTLIFE
          </span>
          <span style={{ fontSize: 9, color: T.mut, letterSpacing: "3px" }}>CARE AI</span>
        </div>

        <div style={{ width: 1, height: 16, background: T.bor }} />

        <span style={{ fontSize: 11, color: T.mut }}>
          Customer Support Intelligence Platform
        </span>

        <div style={{ flex: 1 }} />

        <span style={{
          background:   "#4ade8015",
          color:        "#4ade80",
          border:       "1px solid #4ade8025",
          borderRadius: 20,
          padding:      "3px 12px",
          fontSize:     11,
        }}>
          AI Active
        </span>

        <span style={{
          background:   T.s2,
          border:       `1px solid ${T.bor}`,
          borderRadius: 20,
          padding:      "3px 12px",
          fontSize:     11,
          color:        T.mut,
        }}>
          {total.toLocaleString()} queries
        </span>
      </div>

      <div style={{
        display:       "flex",
        borderBottom:  `1px solid ${T.bor}`,
        background:    T.s1,
        paddingLeft:   24,
        overflowX:     "auto",
      }}>
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              padding:        "11px 20px",
              cursor:         "pointer",
              fontFamily:     "inherit",
              fontSize:       11,
              letterSpacing:  "0.8px",
              color:          tab === t.id ? T.acc : T.mut,
              borderTop:      "none",
              borderLeft:     "none",
              borderRight:    "none",
              borderBottom:   tab === t.id
                                ? `2px solid ${T.acc}`
                                : "2px solid transparent",
              background:     "transparent",
              transition:     "color 0.15s",
              whiteSpace:     "nowrap",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ padding: 24 }}>
        {tab === "dashboard" && <Dashboard total={total} log={log} />}
        {tab === "analyze"   && <AIAnalyzer addToLog={addToLog} />}
        {tab === "log"       && <QueryLog   log={log} />}
        {tab === "auto"      && <Automation />}
        {tab === "arch"      && <Architecture />}
      </div>

    </div>
  );
}