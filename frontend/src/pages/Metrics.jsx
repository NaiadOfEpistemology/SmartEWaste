import { useEffect, useState } from "react";
import api from "../api";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
  LineChart, Line
} from "recharts";
import { useNavigate } from "react-router-dom";
import ProfileSidebar from "../components/ProfileSidebar";


const COLORS = ["#FFD166", "#38D39F", "#FF7B8A", "#5F5AA2", "#9B5DE5"];

export default function Metrics() {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
const [sidebarOpen, setSidebarOpen] = useState(false);
const adminEmail = localStorage.getItem("email");


  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    loadMetrics();
  }, []);

  const loadMetrics = async () => {
    const res = await api.get("/admin/history");

    const pending = res.data.pending || [];
    const completed = res.data.completed || [];

    const all = [
      ...pending.map(r => ({
        status: r.status,
        date: r.requestDate ? r.requestDate.split("T")[0] : "",
        user: r.email,
        personnel: r.pickupPersonnel || null
      })),
      ...completed.map(r => ({
        status: r.status,
        date: r.date ? r.date.split("T")[0] : "",
        user: r.email,
        personnel: r.pickupPersonnel || null
      }))
    ];

    setData(all);
  };

  const counts = {
    PENDING: data.filter(d => d.status === "PENDING").length,
    ACCEPTED: data.filter(d => d.status === "ACCEPTED").length,
    REJECTED: data.filter(d => d.status === "REJECTED").length,
    PICKED_UP: data.filter(d => d.status === "PICKED_UP").length
  };

  const total = data.length;

  const barData = Object.entries(counts).map(([k, v]) => ({
    name: k,
    value: v
  }));

  const pieData = barData.filter(d => d.value > 0);

  const userMap = {};
  data.forEach(d => {
    if (!d.user) return;
    userMap[d.user] = (userMap[d.user] || 0) + 1;
  });

  const userStats = Object.entries(userMap)
    .map(([user, count]) => ({ user, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const totalUsers = Object.keys(userMap).length;

  const personnelMap = {};
  data.forEach(d => {
    if (!d.personnel) return;
    personnelMap[d.personnel] = (personnelMap[d.personnel] || 0) + 1;
  });

  const personnelStats = Object.entries(personnelMap)
    .map(([name, count]) => ({ name, count }));

  const completionRate = total
    ? Math.round((counts.PICKED_UP / total) * 100)
    : 0;

  const rejectionRate = total
    ? Math.round((counts.REJECTED / total) * 100)
    : 0;

  const dateMap = {};
  data.forEach(d => {
    if (!d.date) return;
    dateMap[d.date] = (dateMap[d.date] || 0) + 1;
  });

  const trendData = Object.entries(dateMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, count]) => ({ date, count }));

  const tooltipProps = {
    cursor: false,
    contentStyle: styles.tooltip,
    labelStyle: { color: "var(--white)" },
itemStyle: { color: "var(--white)" }

  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
  <div>
    <div style={styles.title}>System Metrics</div>
    <div style={styles.sub}>Analytics overview</div>
  </div>

  <div style={styles.headerRight}>
    <button style={styles.newBtn} onClick={() => navigate("/admin")}>
      Dashboard
    </button>
    <button style={styles.primaryBtn} onClick={() => setSidebarOpen(true)}>
      Profile
    </button>
  </div>
</div>
{sidebarOpen && (
  <div
    onClick={() => setSidebarOpen(false)}
    style={{ position: "fixed", inset: 0, zIndex: 9998 }}
  />
)}

<ProfileSidebar
  open={sidebarOpen}
  onClose={() => setSidebarOpen(false)}
  email={adminEmail}
/>



      <div style={styles.cardRow}>
        <MetricCard label="Total Requests" value={total} color="#5F5AA2" />
        <MetricCard label="Pending" value={counts.PENDING} color="#FFD166" />
        <MetricCard label="Accepted" value={counts.ACCEPTED} color="#38D39F" />
        <MetricCard label="Rejected" value={counts.REJECTED} color="#FF7B8A" />
      </div>

      <ChartBox title="Status Distribution">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={barData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip {...tooltipProps} />
            <Bar dataKey="value">
              {barData.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartBox>

      <ChartBox title="Request Share">
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={100} label>
              {pieData.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip {...tooltipProps} />
          </PieChart>
        </ResponsiveContainer>
      </ChartBox>

      <ChartBox title="Top Users">
        <p>Total Users: <b>{totalUsers}</b></p>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={userStats}>
            <XAxis dataKey="user" hide />
            <YAxis />
            <Tooltip {...tooltipProps} />
            <Bar dataKey="count" fill="#5F5AA2" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartBox>

      <ChartBox title="Pickup Personnel Load">
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={personnelStats}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip {...tooltipProps} />
            <Bar dataKey="count" fill="#38D39F" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartBox>

      <div style={styles.cardRow}>
        <MetricCard label="Completion Rate" value={`${completionRate}%`} color="#38D39F" />
        <MetricCard label="Rejection Rate" value={`${rejectionRate}%`} color="#FF7B8A" />
      </div>

      <ChartBox title="Daily Request Trend">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={trendData}>
            <XAxis dataKey="date" tickFormatter={d => d.slice(5)} />
            <YAxis />
            <Tooltip {...tooltipProps} />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#FFD166"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartBox>
    </div>
  );
}

function MetricCard({ label, value, color }) {
  return (
    <div style={{
      background: `${color}33`,
      borderRadius: 18,
      padding: 20,
      flex: 1,
      textAlign: "center",
      color
    }}>
      <div style={{ fontSize: 14, opacity: 0.8 }}>{label}</div>
      <div style={{ fontSize: 30, fontWeight: 700 }}>{value}</div>
    </div>
  );
}

function ChartBox({ title, children }) {
  return (
    <div style={styles.chartBox}>
      <h3>{title}</h3>
      {children}
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    padding: 24,
    background: "var(--bg1)",
    color: "var(--white)"
  },
  
  title: {
    fontSize: 24,
    fontWeight: 700,
    marginBottom: 20,
    position: "sticky",
    top: 0,
    background: "var(--bg1)",
    zIndex: 10,
    paddingBottom: 10
  },
  cardRow: {
    display: "flex",
    gap: 16,
    marginBottom: 30,
    flexWrap: "wrap"
  },
  chartBox: {
    background: "var(--bg2)",
    borderRadius: 18,
    padding: 20,
    marginBottom: 30,
    border: "1px solid var(--muted)"
  },
  
  tooltip: {
    background: "var(--bg3)",
    borderRadius: 10,
    border: "1px solid var(--muted)",
    color: "var(--white)"
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 16,
    flexWrap: "wrap",
    marginBottom: 24
  },
  headerRight: {
    display: "flex",
    gap: 14,
    alignItems: "center"
  },
  sub: {
    opacity: 0.7,
    fontSize: 14
  },
  primaryBtn: {
    padding: "12px 18px",
    borderRadius: 14,
    background: "var(--bg2)",
    border: "none",
    color: "var(--white)",
    fontWeight: 600,
    cursor: "pointer"
  },
  newBtn: {
    padding: "12px 18px",
    borderRadius: 14,
    background: "var(--bg2)",
    border: "1px solid var(--muted)",
    color: "var(--white)",
    fontWeight: 600,
    cursor: "pointer"
  }
  
  
};
