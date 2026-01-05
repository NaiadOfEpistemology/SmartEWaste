/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable no-unused-vars */
import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import ProfileSidebar from "../components/ProfileSidebar";


const palette = {
  bg: "#1E1D24",
  accent: "#5F5AA2",
  glass: "rgba(255,255,255,0.08)"
};


export default function AdminDashboard() {
  const [pendingRequests, setPendingRequests] = useState([]);
  
  const [acceptedRequests, setAcceptedRequests] = useState([]);
  const [rejectedRequests, setRejectedRequests] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [from, setFrom] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const adminEmail = localStorage.getItem("email"); 
  const [to, setTo] = useState("");
  const [toast, setToast] = useState("");
  const [acceptModal, setAcceptModal] = useState(false);
  const [rejectModal, setRejectModal] = useState(false);
  const [activeRequest, setActiveRequest] = useState(null);
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [rejectReason, setRejectReason] = useState("");
  const [personnelList, setPersonnelList] = useState([]);
  const [selectedPersonnel, setSelectedPersonnel] = useState("");
  const [previewRequest, setPreviewRequest] = useState(null);
  const [flipped, setFlipped] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const [addPersonnelModal, setAddPersonnelModal] = useState(false);
const [newUsername, setNewUsername] = useState("");
const [newEmail, setNewEmail] = useState("");
const [newName, setNewName] = useState("");


  const navigate = useNavigate();

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2000);
  };
  function splitRequests(all) {
    return {
      pending: all.filter(r => r.status === "PENDING"),
      accepted: all.filter(r => r.status === "ACCEPTED" || r.status === "PICKED_UP"),
      rejected: all.filter(r => r.status === "REJECTED")
    };
  }
  

  const loadPersonnel = async () => {
    try {
      const res = await api.get("/personnel/available");
      const cleanList = (res.data || []).filter(p => p.name && p.name !== "Select Personnel");
      setPersonnelList(cleanList);
    } catch (err) {
      console.error(err);
    }
  };

  const loadRequests = async () => {
    try {
   
      const res = await api.get("/admin/history");
      const all = [
        ...(res.data.pending || []),
        ...(res.data.completed || [])
      ];
      const groups = splitRequests(all);
      setPendingRequests(groups.pending);
      setAcceptedRequests(groups.accepted); 
      setRejectedRequests(groups.rejected);
    } catch (err) {
      console.error("Error loading requests", err);
    }
  };
  
  
  
  

  useEffect(() => {
    loadPersonnel();
    loadRequests();
  }, []);
  useEffect(() => {
    const trimmed = newUsername.trim().toLowerCase();
    setNewEmail(trimmed ? `${trimmed}@ewaste.com` : "");
    setNewName(trimmed);
  }, [newUsername]);
  

  const getDateOnly = dt => dt?.split("T")[0] || "";

  const metrics = useMemo(() => ({
    "Total Requests": pendingRequests.length + acceptedRequests.length + rejectedRequests.length,
    Pending: pendingRequests.length,
    Accepted: acceptedRequests.length,
    Rejected: rejectedRequests.length
  }), [pendingRequests, acceptedRequests, rejectedRequests]);

 
  const closeAcceptModal = () => {
    setAcceptModal(false);
    setPickupDate("");
    setPickupTime("");
    setSelectedPersonnel("");
  };

  const closeRejectModal = () => {
    setRejectModal(false);
    setRejectReason("");
  };

 
  const RequestCard = ({ r }) => (
    <div
      style={styles.rowCard}
      onClick={() => { setPreviewRequest(r); setFlipped(false); setZoomed(false); }}
    >
      <img
        src={r.image ? `http://localhost:8080/uploads/requests/${r.image}` : "/"}
        onError={e => (e.currentTarget.src = "/")}
        style={styles.thumb}
      />
      <div style={styles.col}>
        <div style={styles.rowHeader}>
          <div style={styles.name}>{r.wasteType} • {r.brand} {r.model}</div>
          <div style={{ ...styles.badge, ...styles[r.status.toLowerCase()] }}>{r.status}</div>
        </div>
        <div style={styles.meta}>
          <span style={styles.label}>Qty:</span> {r.quantity || 1}
          <span style={styles.dot}>•</span>
          <span style={styles.label}>Condition:</span> {r.condition}
        </div>
        <div style={styles.meta}>
          <span style={styles.label}>Pickup:</span> {r.pickupDate || "Not set"}
        </div>
        <div style={styles.meta}>
          <span style={styles.label}>Location:</span> {r.location}
        </div>
        <div style={styles.meta}>
          <span style={styles.label}>User:</span> {r.email}
          <span style={styles.dot}>•</span>
          <span style={styles.label}>Contact:</span> {r.contact}
        </div>
        {r.status === "REJECTED" && r.rejectionReason && (
          <div style={{ ...styles.metaLine, color: "#FF7B8A", fontWeight: 600 }}>
            <span style={styles.label}>Rejection Reason:</span> {r.rejectionReason}
          </div>
        )}
        {r.pickupPersonnel && (
          <div style={{ ...styles.metaLine, fontWeight: 600 }}>
            <span style={styles.label}>Assigned To:</span> {r.pickupPersonnel}
          </div>
        )}
        <div style={styles.actionRow}>
          {r.status === "PENDING" && (
            <>
              <button style={styles.btn} onClick={e => { e.stopPropagation(); setActiveRequest(r); setAcceptModal(true); loadPersonnel(); }}>
                Accept
              </button>
              <button style={styles.btnSecondary} onClick={e => { e.stopPropagation(); setActiveRequest(r); setRejectModal(true); }}>
                Reject
              </button>
            </>
          )}
          {r.status === "ACCEPTED" && (
            <button style={styles.btn} onClick={async e => {
              e.stopPropagation();
              await api.post(`/pickup/${r.id}`);
              showToast("Marked as picked up");
              loadRequests();
            }}>
              Mark Picked Up
            </button>
          )}
        </div>
      </div>
    </div>
  );

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

  const sections = {
    "Pending Requests": pendingRequests,
    "Accepted Requests": acceptedRequests,
    "Rejected Requests": rejectedRequests
  };

  return (
    <div style={styles.page}>
      {toast && <div style={styles.toast}>{toast}</div>}

      <div style={styles.header}>
  <div>
    <div style={styles.title}>Admin Dashboard</div>
    <div style={styles.sub}>Manage all e-waste requests</div>
  </div>

  <div style={styles.headerRight}>
    <button style={styles.newBtn} onClick={() => navigate("/admin/history")}>
      History
    </button>

    <button style={styles.newBtn} onClick={() => navigate("/admin/metrics")}>
      Metrics
    </button>
    <button
  style={styles.primaryBtn}
  onClick={() => setAddPersonnelModal(true)}
>
  Add Personnel
</button>


    <button style={styles.primaryBtn} onClick={() => setSidebarOpen(true)}>
      Profile
    </button>

  </div>
</div>


      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
        {Object.entries(metrics).map(([k, v]) => <MetricCard key={k} label={k} value={v} />)}
      </div>

      <div style={styles.filterRow}>
        <select style={styles.input} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="">All</option>
          <option value="PENDING">Pending</option>
          <option value="ACCEPTED">Accepted</option>
          <option value="REJECTED">Rejected</option>
        </select>
        <input type="date" style={styles.input} value={from} onChange={e => setFrom(e.target.value)} />
        <input type="date" style={styles.input} value={to} onChange={e => setTo(e.target.value)} />
      </div>

      <div style={styles.requestsContainer}>
        {Object.entries(sections).map(([title, list]) => (
          <Section key={title} title={title}>
            {list.length ? list.map(r => <RequestCard key={r.id} r={r} />) : <Empty text={`No ${title.toLowerCase()}`} />}
          </Section>
        ))}
      </div>

      {previewRequest && (
        <div style={styles.modalBackdrop} onClick={() => setPreviewRequest(null)}>
          <div style={{ ...styles.previewCard, transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
               onClick={e => { e.stopPropagation(); setFlipped(!flipped); }}>
            <div style={{ ...styles.previewFace, ...styles.front }}>
              <img src={`http://localhost:8080/uploads/requests/${previewRequest.image}`}
                   style={{ ...styles.previewImage, transform: zoomed ? "scale(1.8)" : "scale(1)" }}
                   onClick={e => { e.stopPropagation(); setZoomed(!zoomed); }} />
              <div style={styles.polaroidFooter}>{previewRequest.wasteType} • {previewRequest.brand}</div>
            </div>
            <div style={{ ...styles.previewFace, ...styles.back }}>
              <div style={styles.detailsBlock}>
                <h3>Pickup Details</h3>
                <p><b>Date:</b> {previewRequest.pickupDate || "—"}</p>
                <p><b>Location:</b> {previewRequest.location}</p>
                <p><b>Personnel:</b> {previewRequest.pickupPersonnel || "—"}</p>
                <p><b>User:</b> {previewRequest.email}</p>
                <p><b>Contact:</b> {previewRequest.contact}</p>
              </div>
            </div>
          </div>
        </div>
      )}

     
      {acceptModal && activeRequest && (
        <div style={styles.modalBackdrop}>
          <div style={styles.modalCard}>
            <div style={styles.modalTitle}>Accept Request</div>
            <input type="date" style={styles.modalInput} min={new Date().toISOString().split("T")[0]} value={pickupDate} onChange={e => setPickupDate(e.target.value)} />
            <input type="time" style={styles.modalInput} value={pickupTime} onChange={e => setPickupTime(e.target.value)} />
            <select style={styles.modalInput} value={selectedPersonnel} onChange={e => setSelectedPersonnel(e.target.value)}>
              <option value="">Select Personnel</option>
              {personnelList.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            <div style={styles.modalActions}>
              <button style={styles.btnSecondary} onClick={closeAcceptModal}>Cancel</button>
              <button style={styles.btn} onClick={async () => {
                if (!selectedPersonnel) return showToast("Select a pickup personnel");
                try {
                  await api.post(`/accept/${activeRequest.id}`, null, {
                    params: { pickupDate, pickupTime, personnelId: selectedPersonnel }
                  });
                  showToast("Request accepted");
                  closeAcceptModal();
                  loadRequests();
                } catch {
                  showToast("Failed to accept request");
                }
              }}>Confirm</button>
            </div>
          </div>
        </div>
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
  email={adminEmail}
/>



      {rejectModal && activeRequest && (
        <div style={styles.modalBackdrop}>
          <div style={styles.modalCard}>
            <div style={styles.modalTitle}>Reject Request</div>
            <textarea style={styles.modalTextarea} value={rejectReason} onChange={e => setRejectReason(e.target.value)} placeholder="Reason" />
            <div style={styles.modalActions}>
              <button style={styles.btnSecondary} onClick={closeRejectModal}>Cancel</button>
              <button style={styles.btn} onClick={async () => {
                try {
                  await api.post(`/reject/${activeRequest.id}`, { reason: rejectReason });
                  showToast("Request rejected");
                  closeRejectModal();
                  loadRequests();
                } catch {
                  showToast("Failed to reject request");
                }
              }}>Confirm</button>
            </div>
          </div>
        </div>
      )}
      {addPersonnelModal && (
  <div style={styles.modalBackdrop}>
    <div style={styles.modalCard}>
      <div style={styles.modalTitle}>Add Pickup Personnel</div>

      <input
        style={styles.modalInput}
        placeholder="Username (before @ewaste.com)"
        value={newUsername}
        onChange={e => setNewUsername(e.target.value)}
      />
      <input style={styles.modalInput} value={newEmail} readOnly placeholder="Email" />
      <input style={styles.modalInput} value={newName} readOnly placeholder="Name" />

      <div style={styles.modalActions}>
        <button
          style={styles.btnSecondary}
          onClick={() => {
            setAddPersonnelModal(false);
            setNewUsername("");
          }}
        >
          Cancel
        </button>
        <button
          style={styles.btn}
          onClick={async () => {
            if (!newUsername) return showToast("Enter username");
            try {
              const res = await api.post("/personnel/add", { username: newUsername });
              showToast("Personnel added!");
              setAddPersonnelModal(false);
              setNewUsername("");
              loadPersonnel(); 
            } catch (err) {
              showToast(err.response?.data || "Failed to add personnel");
            }
          }}
        >
          Add
        </button>
      </div>
    </div>
  </div>
)}


    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginTop: 30 }}>
      <div style={styles.sectionTitle}>{title}</div>
      <div style={styles.list}>{children}</div>
    </div>
  );
}

function Empty({ text }) {
  return <div style={styles.empty}>{text}</div>;
}


const styles = {
  page: {
    minHeight: "100vh",
    padding: 26,
    background: "var(--bg1)",
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
title: {
  fontSize: 28,
  fontWeight: 700
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
  color: "#fff",
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
},
  filterRow: { display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 20 },
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
    cursor: "pointer",
  },
  rowHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" },
  badge: { padding: "4px 10px", borderRadius: 999, fontSize: 12, fontWeight: 700 },
  pending: { background: "rgba(255,200,0,0.25)", color: "#FFD166" },
  accepted: { background: "rgba(54,196,113,0.25)", color: "#38D39F" },
  rejected: { background: "rgba(222,60,75,0.25)", color: "#FF7B8A" },
  thumb: { width: 80, height: 80, borderRadius: 14, objectFit: "cover" },
  col: { flex: 1, display: "flex", flexDirection: "column", gap: 8 },
  name: { fontWeight: 700, fontSize: 15 },
  meta: { fontSize: 13, opacity: 0.85, display: "flex", gap: 5, flexWrap: "wrap" },
  dot: { opacity: 0.5 },
  label: { opacity: 0.6, marginRight:4 },
  actionRow: { display: "flex", gap: 10, marginTop: 12 },
  btn: {
    padding: "8px 14px",
    borderRadius: 12,
    background: "var(--accent)",
    color: "#fff",
    border: "none",
    fontWeight: 600,
    cursor: "pointer",
  },
  btnSecondary: {
    padding: "8px 14px",
    borderRadius: 12,
    background: "transparent",
    border: "1px solid var(--muted)",
    color: "var(--white)",
    cursor: "pointer",
  },


  sectionTitle: { fontSize: 17, fontWeight: 600, marginBottom: 12 },
  metaLine: { fontSize: 13, opacity: 0.85, display: "flex", gap: 5, flexWrap: "wrap" },
  list: { display: "flex", flexDirection: "column", gap: 16 },
  empty: { opacity: 0.6 },
  toast: {
    position: "fixed",
    bottom: 28,
    right: 28,
    padding: "14px 20px",
    borderRadius: 14,
    background: "var(--accent)",
    color: "var(--white)",
    fontWeight: 600,
    zIndex: 999,
    boxShadow: "0 12px 30px rgba(0,0,0,0.2)",
  },
  modalBackdrop: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.45)",
    backdropFilter: "blur(6px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
  modalCard: {
    width: 320,
    padding: 22,
    borderRadius: 16,
    background: "var(--bg2)",
    border: "1px solid var(--muted)",
    color: "var(--white)",
  },
  modalTitle: { fontSize: 18, fontWeight: 700, marginBottom: 12 },
  modalInput: {
    width: "100%",
    padding: 10,
    borderRadius: 10,
    background: "var(--bg3)",
    border: "1px solid var(--muted)",
    color: "var(--white)",
    marginTop: 10,
  },
  modalTextarea: {
    width: "100%",
    height: 80,
    padding: 10,
    borderRadius: 10,
    background: "var(--bg3)",
    border: "1px solid var(--muted)",
    color: "var(--white)",
    marginTop: 12,
  },
  modalActions: { display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 20 },
  previewCard: {
    width: 320,
    height: 420,
    background: "var(--bg2)",
    borderRadius: 14,
    position: "relative",
    transformStyle: "preserve-3d",
    transition: "transform 0.6s ease",
    boxShadow: "0 30px 80px rgba(0,0,0,0.45)",
  },
  previewFace: {
    position: "absolute",
    inset: 0,
    backfaceVisibility: "hidden",
    display: "flex",
    flexDirection: "column",
    color: "var(--white)",
  },
  front: {},
  back: { transform: "rotateY(180deg)", padding: 20, borderRadius: 14, background: "var(--bg2)" },
  previewImage: { width: "100%", height: 300, objectFit: "cover", transition: "transform 0.3s ease" },
  polaroidFooter: { padding: 14, textAlign: "center", fontWeight: 600, fontSize: 14, color: "var(--white)" },

  requestsContainer: {
    maxHeight: "calc(100vh - 300px)",
    overflowY: "auto",
    paddingRight: 6
  },
  picked_up: {      
    background: "rgba(95,170,255,0.25)",
    color: "#82BDFF"
  },
  
  detailsBlock: { color: "#fff", fontSize: 14, lineHeight: 1.6 },
  metricCard: {
    padding: 18,
    borderRadius: 18,
    background: "var(--bg2)",
    textAlign: "center",
    border: "1px solid var(--muted)"
  },
  
};
