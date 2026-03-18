import { useState } from "react";
import { T, catClr, priClr, card, badge, SEC } from "../constants";

const COLUMNS = [
  "Query Text",
  "Channel",
  "Category",
  "Confidence",
  "Priority",
  "Sentiment",
  "Time",
];

const sentClr = {
  Positive:  "#4ade80",
  Neutral:   "#71717a",
  Negative:  "#f87171",
  Frustrated: "#ef4444",
};

export default function QueryLog({ log }) {
  const [search,      setSearch]      = useState("");
  const [filterCat,   setFilterCat]   = useState("All");
  const [filterPri,   setFilterPri]   = useState("All");

  const filtered = log.filter(row => {
    const matchSearch = row.text.toLowerCase().includes(search.toLowerCase()) ||
                        row.cat.toLowerCase().includes(search.toLowerCase());
    const matchCat    = filterCat === "All" || row.cat === filterCat;
    const matchPri    = filterPri === "All" || row.pri === filterPri;
    return matchSearch && matchCat && matchPri;
  });

  const uniqueCats = ["All", ...new Set(log.map(r => r.cat))];
  const uniquePris = ["All", "Urgent", "High", "Medium", "Low"];

  return (
    <div>
      <div style={{
        display:      "flex",
        gap:          10,
        marginBottom: 16,
        flexWrap:     "wrap",
        alignItems:   "center",
      }}>

        <input
          type="text"
          placeholder="Search queries…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            background:   T.s2,
            border:       `1px solid ${T.bor}`,
            borderRadius: 6,
            padding:      "7px 12px",
            color:        T.txt,
            fontFamily:   "inherit",
            fontSize:     12,
            outline:      "none",
            width:        220,
          }}
        />
        <select
          value={filterCat}
          onChange={e => setFilterCat(e.target.value)}
          style={{
            background:   T.s2,
            border:       `1px solid ${T.bor}`,
            borderRadius: 6,
            padding:      "7px 10px",
            color:        T.txt,
            fontFamily:   "inherit",
            fontSize:     12,
            outline:      "none",
            cursor:       "pointer",
          }}
        >
          {uniqueCats.map(c => (
            <option key={c} value={c} style={{ background: T.s2 }}>{c}</option>
          ))}
        </select>

        <select
          value={filterPri}
          onChange={e => setFilterPri(e.target.value)}
          style={{
            background:   T.s2,
            border:       `1px solid ${T.bor}`,
            borderRadius: 6,
            padding:      "7px 10px",
            color:        T.txt,
            fontFamily:   "inherit",
            fontSize:     12,
            outline:      "none",
            cursor:       "pointer",
          }}
        >
          {uniquePris.map(p => (
            <option key={p} value={p} style={{ background: T.s2 }}>{p}</option>
          ))}
        </select>

        <span style={{ fontSize: 11, color: T.mut, marginLeft: "auto" }}>
          {filtered.length} / {log.length} entries
        </span>
      </div>

      <div style={{ ...card(), overflowX: "auto" }}>
        <div style={{ ...SEC, marginBottom: 16 }}>
          Recent Query Log — {log.length} total entries
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {COLUMNS.map(h => (
                <th
                  key={h}
                  style={{
                    textAlign:     "left",
                    fontSize:      9.5,
                    color:         T.mut,
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                    padding:       "8px 10px",
                    borderBottom:  `1px solid ${T.bor}`,
                    fontWeight:    500,
                    whiteSpace:    "nowrap",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  style={{
                    textAlign: "center",
                    padding:   40,
                    color:     T.mut,
                    fontSize:  12,
                  }}
                >
                  No matching queries found.
                </td>
              </tr>
            ) : (
              filtered.map(row => (
                <tr key={row.id}>

                  <td style={{
                    padding:       "10px 10px",
                    borderBottom:  `1px solid ${T.bor}28`,
                    maxWidth:      220,
                    overflow:      "hidden",
                    textOverflow:  "ellipsis",
                    whiteSpace:    "nowrap",
                    fontSize:      12,
                    color:         T.txt,
                  }}>
                    {row.text}
                  </td>

                  <td style={{
                    padding:      "10px 10px",
                    borderBottom: `1px solid ${T.bor}28`,
                    color:        T.mut,
                    fontSize:     12,
                    whiteSpace:   "nowrap",
                  }}>
                    {row.ch}
                  </td>

                  <td style={{
                    padding:      "10px 10px",
                    borderBottom: `1px solid ${T.bor}28`,
                    whiteSpace:   "nowrap",
                  }}>
                    <span style={badge(catClr(row.cat))}>{row.cat}</span>
                  </td>

                  <td style={{
                    padding:      "10px 10px",
                    borderBottom: `1px solid ${T.bor}28`,
                    color:        row.conf >= 90 ? "#4ade80" : "#eab308",
                    fontWeight:   700,
                    fontSize:     12,
                  }}>
                    {row.conf}%
                  </td>

                  <td style={{
                    padding:      "10px 10px",
                    borderBottom: `1px solid ${T.bor}28`,
                    color:        priClr[row.pri] || T.mut,
                    fontWeight:   700,
                    fontSize:     12,
                    whiteSpace:   "nowrap",
                  }}>
                    {row.pri}
                  </td>

                  <td style={{
                    padding:      "10px 10px",
                    borderBottom: `1px solid ${T.bor}28`,
                    color:        sentClr[row.sent] || T.mut,
                    fontSize:     12,
                    whiteSpace:   "nowrap",
                  }}>
                    {row.sent}
                  </td>

                  <td style={{
                    padding:      "10px 10px",
                    borderBottom: `1px solid ${T.bor}28`,
                    color:        T.mut,
                    fontSize:     12,
                    whiteSpace:   "nowrap",
                  }}>
                    {row.time}
                  </td>

                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}