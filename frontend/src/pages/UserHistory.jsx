/* eslint-disable react-hooks/static-components */
import { useEffect, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom"
import ProfileSidebar from "../components/ProfileSidebar"


export default function UserHistory() {
  const [email] = useState(() => localStorage.getItem("email") || "");
  const [pending, setPending] = useState([]);
  const [accepted, setAccepted] = useState([]);
  const [rejected, setRejected] = useState([]);
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [dateFilter, setDateFilter] = useState("");
  const [customDate, setCustomDate] = useState("");

  const norm = (d) => (d ? d.slice(0, 10) : null);

  const applyDateFilter = (list) => {
    if (!dateFilter) return list;

    const today = new Date();
    const fmt = (d) => d.toISOString().slice(0, 10);
    const t = fmt(today);

    if (dateFilter === "today") {
      return list.filter((r) => norm(r.pickupDate) === t);
    }

    if (dateFilter === "week") {
      const start = new Date();
      start.setDate(today.getDate() - 7);
      const s = fmt(start);

      return list.filter((r) => {
        const d = norm(r.pickupDate);
        return d && d >= s && d <= t;
      });
    }

    if (dateFilter === "month") {
      const start = new Date();
      start.setDate(today.getDate() - 30);
      const s = fmt(start);

      return list.filter((r) => {
        const d = norm(r.pickupDate);
        return d && d >= s && d <= t;
      });
    }

    if (dateFilter === "custom" && customDate) {
      return list.filter((r) => norm(r.pickupDate) === customDate);
    }

    return list;
  };

  useEffect(() => {
    const loadHistory = async () => {
      const res = await api.get(`/requests/history?email=${email}`);
      const combined = [
        ...(res.data.pending || []),
        ...(res.data.completed || []),
      ].map((r) => ({
        ...r,
        status: r.status?.toUpperCase() || "PENDING",
        rejectionReason: r.rejectionReason || "",
      }));

      setPending(combined.filter((r) => r.status === "PENDING"));
      setAccepted(
        combined.filter((r) => r.status === "ACCEPTED" || r.status === "PICKED_UP")
      );
      setRejected(combined.filter((r) => r.status === "REJECTED"));
    };

    loadHistory();
  }, [email]);

  const StatCard = ({ label, value, color }) => (
    <div style={{ ...st.statCard, background: color.background, color: color.text }}>
      <div style={st.statValue}>{value}</div>
      <div style={st.statLabel}>{label}</div>
    </div>
  );

  const Row = ({ r }) => (
    <div
      style={{
        ...st.rowCard,
        
      }}
    >
      <div style={st.statusCol}>
        <div
          style={{ ...st.badge, ...st[r.status.toLowerCase().replace("_", "")] }}
        >
          {r.status}
        </div>
      </div>
  
      <img
        src={`http://localhost:8080/uploads/requests/${r.image}`}
        onError={(e) => (e.currentTarget.src = "/")}
        style={st.thumb}
      />
  
      <div style={st.col}>
        <div style={st.name}>
          {r.wasteType} • {r.brand} {r.model}
        </div>
  
        <div style={st.meta}>
          <span style={st.label}>Qty:</span> {r.quantity || 1}
          <span style={st.dot}>•</span>
          <span style={st.label}>Condition:</span> {r.condition}
        </div>
  
        <div style={st.meta}>
          <span style={st.label}>Pickup:</span> {r.pickupDate || "Not set"}
        </div>
  
        <div style={st.meta}>
          <span style={st.label}>Location:</span> {r.location}
        </div>
  
        {r.status === "REJECTED" && r.rejectionReason && (
          <div
            style={{
              ...st.metaLine,
              color: "#FF7B8A",
              fontWeight: 600,
              marginTop: 4,
            }}
          >
            <span style={st.label}>Rejection Reason:</span> {r.rejectionReason}
          </div>
        )}
      </div>
    </div>
  );
  

  const metricColors = {
    pending: { background: "rgba(255,200,0,0.25)", text: "#FFD166" },
    accepted: { background: "rgba(54,196,113,0.25)", text: "#38D39F" },
    rejected: { background: "rgba(222,60,75,0.25)", text: "#FF7B8A" },
    success: { background: "rgba(95,170,255,0.25)", text: "#82BDFF" },
    total: { background: "rgba(200,200,200,0.25)", text: "#fff" },
  };

  const totalRequests = pending.length + accepted.length + rejected.length;
  const successPercent = Math.round((accepted.length / Math.max(1, totalRequests)) * 100);

  return (
    <div style={st.page}>
      <div style={st.header}>
  <div>
    <div style={st.title}>Your History</div>
    <div style={st.sub}>Track all your e-waste requests</div>
  </div>

  <div style={st.headerRight}>
    <button style={st.newBtn} onClick={() => navigate("/dashboard")}>
      Dashboard
    </button>

    <button style={st.newBtn} onClick={() => setSidebarOpen(true)}>
  Profile
</button>

  </div>
</div>


      <div style={st.statsRow}>
        <StatCard label="Total Requests" value={totalRequests} color={metricColors.total} />
        <StatCard label="Pending" value={pending.length} color={metricColors.pending} />
        <StatCard label="Accepted" value={accepted.length} color={metricColors.accepted} />
        <StatCard label="Rejected" value={rejected.length} color={metricColors.rejected} />
        <StatCard label="Success %" value={successPercent + "%"} color={metricColors.success} />
        
      </div>

      <div style={st.filterRow}>
        <select style={st.input} value={dateFilter} onChange={(e) => setDateFilter(e.target.value)}>
          <option value="">All Dates</option>
          <option value="today">Pickup Today</option>
          <option value="week">Last 7 Days</option>
          <option value="month">Last 30 Days</option>
          <option value="custom">Select Date</option>
        </select>

        {dateFilter === "custom" && (
          <input
            type="date"
            style={st.input}
            value={customDate}
            onChange={(e) => setCustomDate(e.target.value)}
          />
        )}
      </div>

      <div style={st.section}>Pending</div>
      {applyDateFilter(pending).length === 0 ? (
        <div style={st.empty}>No pending requests</div>
      ) : (
        applyDateFilter(pending).map((r, i) => <Row r={r} key={i} />)
      )}

      <div style={st.section}>Accepted</div>
      {applyDateFilter(accepted).length === 0 ? (
        <div style={st.empty}>No accepted requests</div>
      ) : (
        applyDateFilter(accepted).map((r, i) => <Row r={r} key={i} />)
      )}

      <div style={st.section}>Rejected</div>
      {applyDateFilter(rejected).length === 0 ? (
        <div style={st.empty}>No rejected requests</div>
      ) : (
        applyDateFilter(rejected).map((r, i) => <Row r={r} key={i} />)
      )}
      {sidebarOpen && (
  <div
    onClick={() => setSidebarOpen(false)}
    style={{
      position: "fixed",
      inset: 0,
      zIndex: 9998
    }}
  />
)}

<ProfileSidebar
  open={sidebarOpen}
  onClose={() => setSidebarOpen(false)}
  email={email}
/>

    </div>
  );
}

const st = {
  page: {
    minHeight: "100vh",
    padding: 26,
    background: "var(--bg1)",
    color: "var(--white)",
  },
  

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 16,
    flexWrap: "wrap",
    marginBottom: 20
  },

  headerRight: {
    display: "flex",
    gap: 12
  },
  newBtn: {
    padding: "12px 18px",
    borderRadius: 14,
    background: "var(--accent)",
    border: "none",
    color: "var(--white)",
    fontWeight: 600,
    cursor: "pointer"
  },
  

  title: {
    fontSize: 26,
    fontWeight: 700
  },

  sub: {
    fontSize: 14,
    color: "var(--muted)"
  },

  primaryBtn: {
    padding: "12px 18px",
    borderRadius: 14,
    background: "var(--accent)",
    color: "#fff",
    border: "none",
    fontWeight: 600,
    cursor: "pointer"
  },
  statsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))",
    gap: 16,
    marginBottom: 24
  },

  statCard: {
    padding: 18,
    borderRadius: 18,
    background: "var(--bg2)",
    textAlign: "center",
    color: "var(--white)"
  },
  

  statValue: { fontSize: 28, fontWeight: 700 },
  statLabel: { opacity: 0.7, fontSize: 13 },

  filterRow: {
    display: "flex",
    gap: 12,
    marginBottom: 24,
    flexWrap: "wrap"
  },

  input: {
    padding: "12px 14px",
    borderRadius: 12,
    background: "var(--bg2)",
    border: "1px solid var(--bg3)",
    color: "var(--white)",
    flex: 1
  },

  section: {
    marginTop: 28,
    marginBottom: 12,
    fontSize: 18,
    fontWeight: 600
  },

  rowCard: {
    display: "flex",
    alignItems: "flex-start",
    gap: 16,
    padding: 16,
    borderRadius: 18,
    background: "var(--bg2)",
    border: "1px solid var(--muted)",
    backdropFilter: "blur(14px)",
    marginBottom: 14,
    position: "relative",
    flexWrap: "wrap"
  },
  

  thumb: {
    width: 80,
    height: 80,
    borderRadius: 14,
    objectFit: "cover"
  },

  col: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: 6
  },

  name: {
    fontWeight: 700,
    fontSize: 15
  },

  meta: {
    fontSize: 13,
    opacity: 0.85,
    display: "flex",
    gap: 6,
    flexWrap: "wrap"
  },

  dot: { opacity: 0.5 },
  label: { opacity: 0.6 },

  statusCol: {
    position: "absolute",
    top: 12,
    right: 12
  },

  badge: {
    padding: "6px 12px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 700
  },

  pending: { background: "rgba(255,200,0,0.25)", color: "#FFD166" },
  accepted: { background: "rgba(54,196,113,0.25)", color: "#38D39F" },
  rejected: { background: "rgba(222,60,75,0.25)", color: "#FF7B8A" },
  pickedup: { background: "rgba(95,170,255,0.25)", color: "#82BDFF" },

  empty: {
    opacity: 0.6,
    marginBottom: 10
  }
}
