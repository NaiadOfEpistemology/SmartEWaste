/* eslint-disable react-hooks/static-components */
import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import ProfileSidebar from "../components/ProfileSidebar";



export default function AdminHistory() {
  const [pending, setPending] = useState([]);
  const [accepted, setAccepted] = useState([]);
  const [rejected, setRejected] = useState([]);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const adminEmail = localStorage.getItem("email");
  const navigate = useNavigate();

  function splitRequests(all) {
    return {
      pending: all.filter(r => r.status === "PENDING"),
      accepted: all.filter(r => r.status === "ACCEPTED" || r.status === "PICKED_UP"),
      rejected: all.filter(r => r.status === "REJECTED")
    };
  }

  async function loadHistory() {
    try {
      const res = await api.get("/admin/history");
      const all = [...(res.data.pending || []), ...(res.data.completed || [])];
      const groups = splitRequests(all);
      setPending(groups.pending);
      setAccepted(groups.accepted);
      setRejected(groups.rejected);
    } catch (e) { console.error(e); }
  }

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { loadHistory(); }, []);

  const filtered = (arr) => arr.filter(r => {
    const d = r.createdAt || r.pickupDate || "";
    if (from && d < from) return false;
    if (to && d > to) return false;
    return true;
  });

  const metrics = useMemo(() => ({
    "Total Requests": pending.length + accepted.length + rejected.length,
    Pending: pending.length,
    Accepted: accepted.length,
    Rejected: rejected.length
  }), [pending, accepted, rejected]);

  const MetricCard = ({ label, value }) => {
    const bgColors = {
      Pending: "rgba(255,200,0,0.25)",
      Accepted: "rgba(54,196,113,0.25)",
      Rejected: "rgba(222,60,75,0.25)",
      "Total Requests": "rgba(95,90,162,0.25)"
    };
    const textColors = {
      Pending: "#FFD166",
      Accepted: "#38D39F",
      Rejected: "#FF7B8A",
      "Total Requests": "#fff"
    };
    return (
      <div style={{ background: bgColors[label], borderRadius: 18, padding: 18, flex: 1, textAlign: "center", color: textColors[label], fontWeight: 600 }}>
        <div style={{ fontSize: 14, opacity: 0.8 }}>{label}</div>
        <div style={{ fontSize: 28, fontWeight: 700 }}>{value}</div>
      </div>
    );
  };

  const Row = ({ r }) => (
    <div style={styles.rowCard}>
      <img
        src={`http://localhost:8080/uploads/requests/${r.image}`}
        onError={e => (e.currentTarget.src = "/")}
        style={styles.thumb}
      />
      <div style={styles.col}>
        <div style={styles.rowHeader}>
          <div style={styles.name}>{r.wasteType}</div>
          <div style={{ ...styles.badge, ...styles[r.status.toLowerCase()] }}>{r.status.replace("_"," ")}</div>
        </div>
        <div style={styles.meta}><span style={styles.label}>User:</span>{r.email}</div>
        <div style={styles.meta}><span style={styles.label}>Condition:</span>{r.condition || "Unknown"} • <span style={styles.label}>Qty:</span>{r.quantity}</div>
        {r.pickupDate && <div style={styles.meta}><span style={styles.label}>Pickup:</span>{r.pickupDate}</div>}
        <div style={styles.meta}><span style={styles.label}>Contact:</span>{r.contact}</div>
        <div style={styles.meta}><span style={styles.label}>Location:</span>{r.location}</div>
        {r.description && <div style={styles.desc}>{r.description.length > 140 ? r.description.slice(0,140) + "…" : r.description}</div>}
        {r.remarks && <div style={styles.remarks}>Remarks: {r.remarks}</div>}
        {r.status === "REJECTED" && r.rejectionReason && (
          <div style={{ ...styles.metaLine, color: "#FF7B8A", fontWeight: 600 }}>
            <span style={styles.label}>Rejection Reason:</span> {r.rejectionReason}
          </div>
        )}
      </div>
    </div>
  );

  const Section = ({ title, data }) => {
    const list = filtered(data);
    return (
      <div style={{ marginTop: 30 }}>
        <div style={styles.sectionTitle}>{title}</div>
        <div style={styles.list}>
          {list.length ? list.map((r,i) => <Row key={i} r={r} />) : <div style={styles.empty}>No {title.toLowerCase()} requests</div>}
        </div>
      </div>
    );
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <div style={styles.title}>Admin History</div>
          <div style={styles.sub}>All past requests</div>
        </div>
        <div style={styles.headerRight}>
          <button style={styles.primaryBtn} onClick={() => navigate("/admin")}>Back to Dashboard</button>
          <button style={styles.primaryBtn} onClick={() => setSidebarOpen(true)}>Profile</button>
        </div>
      </div>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 20 }}>
        {Object.entries(metrics).map(([k,v]) => <MetricCard key={k} label={k} value={v} />)}
      </div>

      <div style={styles.filterRow}>
        <input type="date" style={styles.input} value={from} onChange={e => setFrom(e.target.value)} />
        <input type="date" style={styles.input} value={to} onChange={e => setTo(e.target.value)} />
      </div>

      <div style={styles.requestsContainer}>
        <Section title="Pending" data={pending} />
        <Section title="Accepted" data={accepted} />
        <Section title="Rejected" data={rejected} />
      </div>

      {sidebarOpen && <div onClick={() => setSidebarOpen(false)} style={{ position:"fixed", inset:0, zIndex:9998 }}/>}
      <ProfileSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} email={adminEmail} />
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    padding: 26,
    background: "var(--bg1)",
    color: "var(--white)"
  },
  
  header: { display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:16, marginBottom:24 },
  headerRight: { display:"flex", gap:14, alignItems:"center" },
  title: { fontSize:28, fontWeight:700 },
  sub: { opacity:0.7, fontSize:14 },
  primaryBtn: {
    padding: "12px 18px",
    borderRadius: 14,
    background: "var(--bg2)",
    border: "1px solid var(--muted)",
    color: "var(--white)",
    fontWeight: 600,
    cursor: "pointer"
  },
  
  filterRow: { display:"flex", gap:12, flexWrap:"wrap", marginBottom:20 },
  input: {
    padding: "10px 14px",
    borderRadius: 12,
    background: "var(--bg2)",
    border: "1px solid var(--muted)",
    color: "var(--white)",
    flex: 1,
    colorScheme: "light dark"
  },
  
  rowCard: {
    display: "flex",
    gap: 16,
    padding: 16,
    borderRadius: 18,
    background: "var(--bg2)",
    border: "1px solid var(--muted)",
    backdropFilter: "blur(14px)",
    flexWrap: "wrap",
    cursor: "pointer"
  },
  
  rowHeader: { display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap" },
  badge: { padding:"4px 10px", borderRadius:999, fontSize:12, fontWeight:700 },
  pending: { background:"rgba(255,200,0,0.25)", color:"#FFD166" },
  accepted: { background:"rgba(54,196,113,0.25)", color:"#38D39F" },
  rejected: { background:"rgba(222,60,75,0.25)", color:"#FF7B8A" },
  picked_up: { background:"rgba(95,170,255,0.25)", color:"#82BDFF" },
  thumb: { width:80, height:80, borderRadius:14, objectFit:"cover" },
  col: { flex:1, display:"flex", flexDirection:"column", gap:8 },
  name: { fontWeight:700, fontSize:15 },
  meta: { fontSize:13, opacity:0.85, display:"flex", gap:5, flexWrap:"wrap" },
  label: { opacity:0.6, marginRight:4 },
  desc: { marginTop:6, opacity:0.75, fontSize:13 },
  remarks: { marginTop:6, opacity:0.65, fontSize:12, fontStyle:"italic" },
  metaLine: { fontSize:13, opacity:0.85, display:"flex", gap:5, flexWrap:"wrap" },
  sectionTitle: { fontSize:17, fontWeight:600, marginBottom:12 },
  list: { display:"flex", flexDirection:"column", gap:16 },
  empty: { opacity:0.6 },
  requestsContainer: { maxHeight:"calc(100vh - 300px)", overflowY:"auto", paddingRight:6 }
};
