import React, { useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import type { st_bazli, Ambalaj, Coordinate } from "../../types";
import "./StatisticsPage.css";

interface StatisticsPageProps {
  st_bazliData: st_bazli[];
  ambalajData: Ambalaj[];
  coordinates: Coordinate[];
}

const COLORS = ["#6366f1", "#8b5cf6", "#ec4899", "#f43f5e", "#f59e0b", "#10b981", "#3b82f6", "#14b8a6"];

export function StatisticsPage({ st_bazliData, ambalajData, coordinates }: StatisticsPageProps) {
  const [metric, setMetric] = useState<"Miktar" | "Palet">("Miktar");
  const [selectedReps, setSelectedReps] = useState<string[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Sort st_bazliData by the chosen metric in descending order
  const sortedStBazli = useMemo(() => {
    return [...st_bazliData].sort((a, b) => b[metric] - a[metric]);
  }, [st_bazliData, metric]);

  const chartData = useMemo(() => {
    if (selectedReps.length > 0) {
      return sortedStBazli.filter((item) => selectedReps.includes(item.sales_rep));
    }
    return sortedStBazli.slice(0, 10); // Top 10 default
  }, [sortedStBazli, selectedReps]);

  const handleSelectAll = () => setSelectedReps(st_bazliData.map(r => r.sales_rep));
  const handleDeselectAll = () => setSelectedReps([]);
  const toggleRep = (rep: string) => {
    setSelectedReps(prev => 
      prev.includes(rep) ? prev.filter(r => r !== rep) : [...prev, rep]
    );
  };
  
  const totalMiktar = useMemo(() => st_bazliData.reduce((acc, curr) => acc + curr.Miktar, 0), [st_bazliData]);
  const totalPalet = useMemo(() => st_bazliData.reduce((acc, curr) => acc + curr.Palet, 0), [st_bazliData]);

  // Aggregate ambalaj data for pie chart
  const pieData = useMemo(() => {
    return ambalajData.map((item) => ({
      name: item.İçerik,
      value: item[metric],
    })).sort((a, b) => b.value - a.value);
  }, [ambalajData, metric]);

  return (
    <div className="stats-page" id="statistics-page">
      <div className="stats__header">
        <div>
          <h1 className="stats__heading">Logistics Analytics</h1>
          <p className="stats__sub">Performance & Sales Representation Analysis</p>
        </div>
        <div className="stats__controls">
          <button
            className={`stats__toggle ${metric === "Miktar" ? "active" : ""}`}
            onClick={() => setMetric("Miktar")}
          >
            Miktar
          </button>
          <button
            className={`stats__toggle ${metric === "Palet" ? "active" : ""}`}
            onClick={() => setMetric("Palet")}
          >
            Palet
          </button>
        </div>
      </div>

      <div className="stats__kpi-cards">
        <div className="stats__kpi-card">
          <h4>Total Miktar</h4>
          <div className="value">{totalMiktar.toLocaleString()}</div>
        </div>
        <div className="stats__kpi-card">
          <h4>Total Palet</h4>
          <div className="value">{totalPalet.toLocaleString()}</div>
        </div>
        <div className="stats__kpi-card">
          <h4>Unique Sales Reps / Routes</h4>
          <div className="value">{st_bazliData.length}</div>
        </div>
        <div className="stats__kpi-card">
          <h4>Total Coordinates</h4>
          <div className="value">{coordinates.length}</div>
        </div>
      </div>

      {/* Sales Rep Summary Cards */}
      <div className="stats__card" style={{ padding: "20px" }}>
        <h3 style={{ margin: "0 0 16px 0", fontSize: "1.125rem", color: "#f8fafc" }}>Sales Rep Summaries</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "12px" }}>
          {chartData.map(rep => (
            <div key={rep.sales_rep} style={{ background: "#0f172a", border: "1px solid #334155", borderRadius: "8px", padding: "12px" }}>
              <div style={{ fontSize: "0.875rem", fontWeight: "600", color: "#e2e8f0", marginBottom: "8px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }} title={rep.sales_rep}>
                {rep.sales_rep}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "#94a3b8" }}>
                <span>Miktar:</span>
                <span style={{ color: "#f8fafc", fontWeight: "600" }}>{rep.Miktar.toLocaleString()}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "#94a3b8", marginTop: "4px" }}>
                <span>Palet:</span>
                <span style={{ color: "#f8fafc", fontWeight: "600" }}>{rep.Palet.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="stats__grid">
        {/* Main Chart: Sales Rep Performance */}
        <div className="stats__card stats__card--main">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px" }}>
            <h3>Top Sales by Sales Rep / Route ({metric})</h3>
            
            <div className="custom-multiselect" style={{ position: "relative", minWidth: "220px", zIndex: 50 }}>
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                style={{
                  width: "100%", background: "#0f172a", color: "#f8fafc", border: "1px solid #334155",
                  borderRadius: "6px", padding: "8px 12px", display: "flex", justifyContent: "space-between",
                  alignItems: "center", cursor: "pointer", fontSize: "12px", fontFamily: "inherit"
                }}
              >
                {selectedReps.length === 0 ? "Default (Top 10)" : `${selectedReps.length} Selected`}
                <span style={{ fontSize: "10px", marginLeft: "8px", transform: isDropdownOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>▼</span>
              </button>

              {isDropdownOpen && (
                <div style={{
                  position: "absolute", top: "100%", left: 0, right: 0, marginTop: "4px",
                  background: "#1e293b", border: "1px solid #334155", borderRadius: "6px",
                  boxShadow: "0 10px 15px -3px rgba(0,0,0,0.5), 0 4px 6px -2px rgba(0,0,0,0.3)",
                  overflow: "hidden", display: "flex", flexDirection: "column"
                }}>
                  <div style={{ display: "flex", gap: "8px", padding: "8px", borderBottom: "1px solid #334155", background: "#0f172a" }}>
                    <button onClick={handleSelectAll} style={{ flex: 1, padding: "6px", background: "#6366f1", color: "white", border: "none", borderRadius: "4px", fontSize: "11px", cursor: "pointer", fontWeight: 600 }}>Select All</button>
                    <button onClick={handleDeselectAll} style={{ flex: 1, padding: "6px", background: "transparent", color: "#f43f5e", border: "1px solid #f43f5e", borderRadius: "4px", fontSize: "11px", cursor: "pointer", fontWeight: 600 }}>Clear All</button>
                  </div>
                  <div style={{ maxHeight: "200px", overflowY: "auto", padding: "4px 0" }}>
                    {sortedStBazli.map(rep => (
                      <label key={rep.sales_rep} style={{ display: "flex", alignItems: "center", padding: "8px 12px", cursor: "pointer", fontSize: "13px", color: "#e2e8f0", transition: "background 0.2s" }}
                             onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.05)"}
                             onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                      >
                        <input 
                          type="checkbox" 
                          checked={selectedReps.includes(rep.sales_rep)}
                          onChange={() => toggleRep(rep.sales_rep)}
                          style={{ marginRight: "10px", accentColor: "#6366f1", width: "16px", height: "16px", cursor: "pointer" }}
                        />
                        {rep.sales_rep}
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="stats__chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                <XAxis 
                  dataKey="sales_rep" 
                  angle={-45} 
                  textAnchor="end" 
                  tick={{ fill: "#94a3b8", fontSize: 12 }} 
                  interval={0}
                  height={60}
                />
                <YAxis tick={{ fill: "#94a3b8" }} />
                <Tooltip 
                  cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }} 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                />
                <Bar dataKey={metric} fill="#6366f1" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Ambalaj Pie Chart and Table */}
        <div className="stats__card">
          <h3>Packaging Overview ({metric})</h3>
          <div className="stats__chart-container" style={{ height: 250 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }} />
                <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '12px' }}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="stats__small-table-wrapper">
            <table className="stats__small-table">
              <thead>
                <tr>
                  <th>Packaging</th>
                  <th>Miktar</th>
                  <th>Palet</th>
                </tr>
              </thead>
              <tbody>
                {ambalajData.map((item, idx) => (
                  <tr key={idx}>
                    <td>{item.İçerik}</td>
                    <td>{item.Miktar}</td>
                    <td>{item.Palet}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Coordinates section removed */}
    </div>
  );
}
