import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, Tooltip, Cell as BarCell,
  LineChart, Line, CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { T, CATS, TREND, card, SEC } from "../constants";

const tooltipStyle = {
  contentStyle: {
    background:   T.s2,
    border:       `1px solid ${T.bor}`,
    borderRadius: 6,
    fontSize:     12,
    color:        T.txt,
  },
};

export default function Dashboard({ total, log }) {

  const counts = CATS.reduce((acc, c) => {
    acc[c.name] = 0;
    return acc;
  }, {});

  const rows = log || [];
  rows.forEach(row => {
    if (counts[row.cat] !== undefined) counts[row.cat] += 1;
  });

  const totalRows = rows.length || 1;
  const dist = CATS.map(c => {
    const pct = Math.round((counts[c.name] / totalRows) * 100);
    return {
      ...c,
      pct,
    };
  });

  const autoCount = rows.filter(r => r.auto === true).length;
  const autoRate = rows.length ? Math.round((autoCount / rows.length) * 100) : 70;
  const urgentRate = rows.length
    ? Math.round((rows.filter(r => r.pri === "Urgent" || r.pri === "High").length / rows.length) * 100)
    : 35;

  return (
    <div>
      <div style={{
        display:             "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap:                 12,
        marginBottom:        20,
      }}>
        {[
          { value: total.toLocaleString(), label: "Total Queries (30d)",   color: T.txt     },
          { value: `${autoRate}%`,          label: "Auto-Resolved Rate",     color: "#4ade80" },
          { value: `${Math.max(1, 6 - Math.round(autoRate / 20))}.0h`, label: "Avg Response Time", color: T.acc },
          { value: Math.round((total * autoRate) / 100 / 2).toString(), label: "Tickets Saved / Month",  color: "#60a5fa" },
        ].map((kpi, i) => (
          <div key={i} style={card()}>
            <div style={{
              fontSize:      26,
              fontWeight:    700,
              letterSpacing: "-1px",
              color:         kpi.color,
            }}>
              {kpi.value}
            </div>
            <div style={{ fontSize: 11, color: T.mut, marginTop: 3 }}>
              {kpi.label}
            </div>
          </div>
        ))}
      </div>

      <div style={{
        display:             "grid",
        gridTemplateColumns: "1fr 1fr",
        gap:                 16,
        marginBottom:        20,
      }}>

        <div style={card()}>
          <div style={SEC}>Issue Distribution — % of Total Queries</div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ flexShrink: 0 }}>
              <ResponsiveContainer width={155} height={155}>
                <PieChart>
                  <Pie
                    data={dist.map(c => ({ name: c.name, value: c.pct }))}
                    dataKey="value"
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={2}
                  >
                    {dist.map((c, i) => <Cell key={i} fill={c.clr} />)}
                  </Pie>
                  <Tooltip {...tooltipStyle} formatter={v => [`${v}%`]} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div style={{ flex: 1 }}>
              {dist.map(c => (
                <div key={c.name} style={{
                  display:     "flex",
                  alignItems:  "center",
                  gap:         8,
                  marginBottom: 7,
                }}>
                  <div style={{
                    width:        8,
                    height:       8,
                    borderRadius: 2,
                    background:   c.clr,
                    flexShrink:   0,
                  }} />
                  <div style={{ flex: 1, fontSize: 11, color: T.mut }}>{c.name}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: T.txt }}>{c.pct}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div style={card()}>
          <div style={SEC}>Automation Potential by Category</div>
          <ResponsiveContainer width="100%" height={210}>
            <BarChart
              data={dist.map(c => ({ n: c.name, v: c.auto, clr: c.clr }))}
              layout="vertical"
              margin={{ left: 8, right: 30, top: 0, bottom: 0 }}
            >
              <XAxis
                type="number"
                domain={[0, 100]}
                tick={{ fontSize: 9, fill: T.mut }}
                tickLine={false}
                axisLine={false}
                tickFormatter={v => `${v}%`}
              />
              <YAxis
                type="category"
                dataKey="n"
                tick={{ fontSize: 9.5, fill: T.mut }}
                tickLine={false}
                axisLine={false}
                width={72}
              />
              <Tooltip
                {...tooltipStyle}
                formatter={v => [`${v}%`, "Auto-resolvable"]}
              />
              <Bar
                dataKey="v"
                radius={3}
                label={{ position: "right", fontSize: 9, fill: T.mut, formatter: v => `${v}%` }}
              >
                {dist.map((c, i) => <BarCell key={i} fill={c.clr} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={card()}>
        <div style={SEC}>Weekly Volume Trend — Top 4 Categories (Jan–Feb) · Urgent+High: {urgentRate}%</div>

        <ResponsiveContainer width="100%" height={230}>
          <LineChart data={TREND} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="2 5" stroke={T.bor} />
            <XAxis dataKey="w" tick={{ fontSize: 10, fill: T.mut }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 10, fill: T.mut }} tickLine={false} axisLine={false} />
            <Tooltip {...tooltipStyle} />
            <Line type="monotone" dataKey="o" stroke="#f97316" strokeWidth={2} dot={false} name="Order Tracking"    />
            <Line type="monotone" dataKey="d" stroke="#eab308" strokeWidth={2} dot={false} name="Delivery Delay"    />
            <Line type="monotone" dataKey="r" stroke="#60a5fa" strokeWidth={2} dot={false} name="Refund Request"    />
            <Line type="monotone" dataKey="p" stroke="#f87171" strokeWidth={2} dot={false} name="Product Complaint" />
          </LineChart>
        </ResponsiveContainer>

        <div style={{ display: "flex", gap: 20, marginTop: 10, flexWrap: "wrap" }}>
          {[
            ["#f97316", "Order Tracking"],
            ["#eab308", "Delivery Delay"],
            ["#60a5fa", "Refund Request"],
            ["#f87171", "Product Complaint"],
          ].map(([clr, label]) => (
            <span key={label} style={{
              display:    "flex",
              alignItems: "center",
              gap:        6,
              fontSize:   11,
              color:      T.mut,
            }}>
              <span style={{
                width:        16,
                height:       2,
                background:   clr,
                display:      "inline-block",
                borderRadius: 1,
              }} />
              {label}
            </span>
          ))}
        </div>
      </div>

    </div>
  );
}