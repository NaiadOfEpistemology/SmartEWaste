/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import ProfileSidebar from "../components/ProfileSidebar";

export default function PersonnelDashboard() {
  const email = localStorage.getItem("email") || "";

  const [accepted, setAccepted] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate=useNavigate();
  const [sidebarOpen, setSidebarOpen]=useState(false);

  // ================= Load requests =================
  useEffect(() => {
    if (!email) return;
  
    setLoading(true);
  
    // Accepted
    api.get("/auth/personnel/requests", { params: { email } })
      .then(res => setAccepted(res.data || []))
      .catch(() => setAccepted([]));
  
    // Completed
    api.get("/personnel/completed", { params: { personnelEmail: email } })
      .then(res => setCompleted(res.data || []))
      .catch(() => setCompleted([]))
      .finally(() => setLoading(false));
  
  }, [email]);
  

  // ================= Pickup =================
  const markPickedUp = async (req) => {
    try {
      await api.post(
        `/personnel/pickup/${req.id}`,
        null,
        { params: { personnelEmail: email } }
      );

      // Move request from accepted → completed (UI only)
      setAccepted(prev => prev.filter(r => r.id !== req.id));
      setCompleted(prev => [
        { ...req, status: "PICKED_UP" },
        ...prev
      ]);

    } catch (err) {
      console.error("Pickup failed:", err.response?.data);
      alert(err.response?.data || "Pickup failed");
    }
  };

  if (loading) return <div style={st.page}>Loading…</div>;

  return (
    <div style={st.page}>
      {/* ================= Header ================= */}
      <div style={st.header}>
  <div>
    <div style={st.title}>Personnel Dashboard</div>
    <div style={st.sub}>Logged in as: {email}</div>
  </div>

  <div style={st.headerRight}>
    <button
      style={st.primaryBtn}
      onClick={() => navigate("/")}
    >
      Dashboard
    </button>

    <button
      style={st.primaryBtn}
      onClick={() => setSidebarOpen(true)}
    >
      Profile
    </button>
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
  email={email}
/>

</div>


      {/* ================= Stat Cards ================= */}
      <div style={st.statsRow}>
        <StatCard label="Accepted Requests" value={accepted.length} />
        <StatCard label="Completed Requests" value={completed.length} />
      </div>

      {/* ================= Accepted ================= */}
      <Section title="Accepted Requests">
        {accepted.length ? (
          accepted.map(r => (
            <RequestCard
              key={r.id}
              r={r}
              onPickup={() => markPickedUp(r)}
            />
          ))
        ) : (
          <Empty text="No accepted requests" />
        )}
      </Section>

      {/* ================= Completed ================= */}
      <Section title="Completed Requests">
        {completed.length ? (
          completed.map(r => <RequestCard key={r.id} r={r} completed />)
        ) : (
          <Empty text="No completed requests" />
        )}
      </Section>
    </div>
  );
}

/* ================= Reusable UI ================= */

function StatCard({ label, value }) {
  return (
    <div style={st.statCard}>
      <div style={st.statValue}>{value}</div>
      <div style={st.statLabel}>{label}</div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginTop: 28 }}>
      <div style={st.sectionTitle}>{title}</div>
      <div style={{ marginTop: 16 }}>{children}</div>
    </div>
  );
}

function Empty({ text }) {
  return <div style={st.empty}>{text}</div>;
}

function RequestCard({ r, onPickup, completed }) {
  return (
    <div style={st.card}>
      <img
        src={r.image ? `http://localhost:8080/uploads/requests/${r.image}` : "/"}
        onError={e => (e.currentTarget.src = "/")}
        style={st.thumb}
      />

      <div style={st.col}>
        <div style={st.row}>
          <div style={st.reqTitle}>
            {r.wasteType} • {r.brand} {r.model}
          </div>
          <div
            style={{
              ...st.badge,
              ...(completed ? st.picked : st.accepted)
            }}
          >
            {completed ? "PICKED UP" : "ACCEPTED"}
          </div>
        </div>

        <div style={st.meta}><span>Pickup:</span> {r.pickupDate}</div>
        <div style={st.meta}><span>Location:</span> {r.location}</div>
        <div style={st.meta}><span>Contact:</span> {r.contact}</div>

        {!completed && (
          <button style={st.pickupBtn} onClick={onPickup}>
            Mark as Picked Up
          </button>
        )}
      </div>
    </div>
  );
}

/* ================= Styles ================= */

const st = {
  page: {
    minHeight: "100vh",
    padding: 26,
    background: "var(--bg1)",
color: "var(--white)"

  },
  headerRight: {
    display: "flex",
    gap: 14,
    alignItems: "center"
  },
  
  primaryBtn: {
    padding: "12px 18px",
    borderRadius: 14,
    background: "var(--accent)",
    border: "none",
    color: "var(--white)",
    fontWeight: 600,
    cursor: "pointer"
  },  
  header: { marginBottom: 24, display:"flex", justifyContent:"space-between", alignItems:"center",flexWrap:"wrap",gap:16 },
  title: { fontSize: 26, fontWeight: 700 },
  sub: { opacity: 0.7 },

  statsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
    gap: 16
  },
  statCard: {
    padding: 18,
    borderRadius: 18,
    background: "var(--bg2)",
    border:"1px solid rgba(255,255,255,0.15)",
    backdropFilter:"blur(14px)",
    textAlign:"center"
  },
  statValue: { fontSize: 30, fontWeight: 700 },
  statLabel: { opacity: 0.7 },

  card: {
    display: "flex",
    gap: 16,
    padding: 16,
    borderRadius: 18,
    background: "var(--bg2)",
    border: "1px solid rgba(255,255,255,0.15)",
    backdropFilter:"blur(14px)",
    marginBottom:14
  },
  thumb: {
    width: 80,
    height: 80,
    borderRadius: 14,
    objectFit: "cover"
  },
  col: { flex: 1, display: "flex", flexDirection: "column", gap: 6 },
  row: { display: "flex", justifyContent: "space-between" },
  reqTitle: { fontWeight: 700 },

  badge: {
    padding: "4px 10px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 700
  },
  accepted: {
    background: "rgba(54,196,113,0.25)",
    color: "#38D39F"
  },
  picked: {
    background: "rgba(95,170,255,0.25)",
    color: "#82BDFF"
  },

  meta: { fontSize: 13, opacity: 0.8 },

  pickupBtn: {
    marginTop: 10,
    alignSelf: "flex-start",
    padding: "10px 16px",
    borderRadius: 14,
    background: "var(--accent)",
    border: "none",
    color: "var(--white)",
    fontWeight: 700,
    cursor: "pointer"
  },

  sectionTitle: { fontSize: 18, fontWeight: 600 },
  empty: { opacity: 0.6, padding:"12px 4px" }
};
