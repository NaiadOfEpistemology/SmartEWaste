/* eslint-disable react-hooks/immutability */
import { useEffect, useRef, useState } from "react"
import api from "../api"
import ProfileSidebar from "../components/ProfileSidebar"
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const email = localStorage.getItem("email") || ""

  const [profile, setProfile] = useState({})
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [toast, setToast] = useState("")
  const [pending, setPending] = useState([])
  const [accepted, setAccepted] = useState([])
  const [rejected, setRejected] = useState([])
  const navigate = useNavigate();
  const [preview, setPreview] = useState("")
  const [phone, setPhone] = useState("");

  const fileRef = useRef(null)

  const normalizeRequest = r => {
    let brand = r.brand || ""
    let model = r.model || ""
    if (!brand && !model && r.description) {
      const match = r.description.match(/- ([^\s]+) ([^\s]+)\./)
      if (match) {
        brand = match[1]
        model = match[2]
      }
    }
    return {
      id: r.id,
      wasteType: r.wasteType || "",
      brand,
      model,
      contact: r.contact || r.contact_number || "",
      pickupDate: r.pickupDate || r.date || "Not scheduled",
      location: r.location || "",
      image: r.image || "",
      status: r.status || "",
      description: r.description || "",
      remarks: r.remarks || "",
      rejectionReason: r.rejectionReason || ""
    }
  }
  
  const [form, setForm] = useState({
    name: "",
    date: "",
    type: "",
    brand: "",
    model: "",
    condition: "",
    quantity: "",
    remarks: "",
    description: "",
    contact: "",
    location: "",
    image: null
  })

  const today = new Date().toISOString().split("T")[0]

  useEffect(() => {
    loadProfile()
    loadRequests()
  }, [])
  useEffect(() => {
    const email=localStorage.getItem("email")
    if(!email) return
  
    api
      .get(`/user/profile?email=${email}`)
      .then(res => {
        if(res.data?.phone) {
          setPhone(res.data.phone);
setForm(f => ({ ...f, contact: res.data.phone }));

        }
      })
      .catch(() => {})
  }, [])

  const loadProfile = async () => {
    const res = await api.get("/user/profile", { params: { email } })
    setProfile(res.data || {})
  }

  const loadRequests = async () => {
    try {
      const pendingRes = await api.get("/ewaste/my-requests", { params: { email } });
      const pendingAll = pendingRes.data || [];
  
      const historyRes = await api.get("/requests/history", { params: { email } });
      const history = historyRes.data || { pending: [], completed: [] };
  
      const normalize = str => str?.toUpperCase?.() || "";
  
      setPending(
        pendingAll
          .filter(r => normalize(r.status) === "PENDING")
          .map(normalizeRequest)
          .slice(0, 5) 
      );
  
      setAccepted(
        [
          ...pendingAll.filter(r =>
            ["ACCEPTED", "PICKED_UP"].includes(normalize(r.status))
          ),
          ...history.completed.filter(r =>
            ["ACCEPTED", "PICKED_UP"].includes(normalize(r.status))
          )
        ]
          .map(normalizeRequest)
          .slice(0, 5) 
      );
  
      setRejected(
        [
          ...pendingAll.filter(r => normalize(r.status) === "REJECTED"),
          ...history.completed.filter(r => normalize(r.status) === "REJECTED")
        ]
          .map(normalizeRequest)
          .slice(0, 5) 
      );
    } catch (err) {
      console.error("Error loading requests", err);
    }
  };
  

  const handleFile = e => {
    const file = e.target.files[0]
    setForm(f => ({ ...f, image: file }))
    setPreview(file ? URL.createObjectURL(file) : "")
  }

  const submitRequest = async e => {
    e.preventDefault()
    if (!form.date || !form.location || !form.contact || !form.type) return
    const fd = new FormData()
    fd.append("email", email)
    fd.append("wasteType", form.type)
    fd.append("brand", form.brand)
    fd.append("model", form.model)
    fd.append("condition", form.condition)
    fd.append("quantity", form.quantity || 1)
    fd.append("remarks", form.remarks)
    fd.append("description", `${form.name} - ${form.brand} ${form.model}. ${form.description}`)
    fd.append("contact", form.contact)
    fd.append("pickupDate", form.date)
    fd.append("location", form.location)
    if (form.image) fd.append("image", form.image)
    await api.post("/ewaste/create", fd, { headers: { "Content-Type": "multipart/form-data" } })
    setForm({ name:"", date:"", type:"", brand:"", model:"", condition:"", quantity:"", remarks:"", description:"", contact:phone, location:"", image:null })
    setPreview("")
    if (fileRef.current) fileRef.current.value = ""
    setShowForm(false)
    loadRequests()
    setToast("Pickup request submitted")
    setTimeout(() => setToast(""), 3000)
  }

  return (
    <div style={st.page}>
      {toast && <div style={st.toast}>{toast}</div>}
      <div style={st.header}>
        <div>
          <div style={st.title}>Your Dashboard</div>
          <div style={st.sub}>Manage your e-waste requests here.</div>
        </div>
        <div style={st.headerRight}>
          <button style={st.newBtn} onClick={() => setShowForm(!showForm)}>+ New Request</button>
          <button style={st.newBtn} onClick={() => navigate("/history")}>View History</button>
          <div style={st.userBox} onClick={() => setSidebarOpen(true)}>
            <img src={profile.profilePhoto ? `http://localhost:8080${profile.profilePhoto}` : "/"} style={st.avatar} onError={e => (e.currentTarget.src = "/")} />
            <div>
              <div style={st.name}>{profile.fullName || "User"}</div>
              <div style={st.email}>{email}</div>
            </div>
          </div>
        </div>
      </div>

      {showForm && (
        <form onSubmit={submitRequest} style={st.formCard}>
          <div style={st.formSection}>
            <div style={st.formTitle}>Device Details</div>
            <div style={st.grid2}>
              <input style={st.input} placeholder="Device Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              <select style={st.input} value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                <option value="">Device Type</option>
                <option>Mobile</option>
                <option>Laptop</option>
                <option>Battery</option>
                <option>TV</option>
                <option>Other</option>
              </select>
              <input style={st.input} placeholder="Brand" value={form.brand} onChange={e => setForm({ ...form, brand: e.target.value })} />
              <input style={st.input} placeholder="Model" value={form.model} onChange={e => setForm({ ...form, model: e.target.value })} />
              <select style={st.input} value={form.condition} onChange={e => setForm({ ...form, condition: e.target.value })}>
                <option value="">Condition</option>
                <option>Working</option>
                <option>Damaged</option>
                <option>Dead</option>
              </select>
              <input style={st.input} placeholder="Quantity" value={form.quantity} type="number" onChange={e => setForm({ ...form, quantity: e.target.value })} />
            </div>
          </div>

          <div style={st.formSection}>
            <div style={st.formTitle}>Pickup Information</div>
            <div style={st.grid2}>
              <input type="date" min={today} style={st.input} value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
              <input
  style={st.input}
  value={form.contact}
  onChange={e => {
    const v = e.target.value.replace(/\D/g, "");
    if (v.length > 10) return;
    if (v.length === 1 && !/[6-9]/.test(v)) return;

    setForm({ ...form, contact: v });
  }}
  placeholder="Contact number"
/>


              <input style={{ ...st.input, gridColumn: "1 / -1" }} placeholder="Pickup Location" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
            </div>
          </div>

          <div style={st.formSection}>
            <div style={st.formTitle}>Device Image</div>
            <label style={st.uploadBox}>
              <input ref={fileRef} type="file" hidden accept="image/*" onChange={handleFile} />
              <div style={st.uploadText}><strong>Click to upload</strong></div>
            </label>
            {preview && <img src={preview} style={st.previewLarge} />}
          </div>

          <div style={st.formSection}>
            <div style={st.formTitle}>Additional Details</div>
            <textarea style={st.textarea} placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
            <textarea style={st.textarea} placeholder="Remarks" value={form.remarks} onChange={e => setForm({ ...form, remarks: e.target.value })} />
          </div>

          <div style={st.formActions}><button style={st.submitBig}>Submit Request</button></div>
        </form>
      )}

      <div style={st.statsRow}>
        
      <StatCard label="Total Requests" value={pending.length + accepted.length + rejected.length} />
        <StatCard label="Pending" value={pending.length} />
        <StatCard label="Accepted" value={accepted.length} />
        <StatCard label="Rejected" value={rejected.length} />
        
      </div>
      <div style={st.requestsContainer}>
      <Section title="Pending Requests">
        {pending.length ? pending.map((r, i) => <RequestCard key={i} r={r} />) : <Empty text="No pending requests" />}
      </Section>

      <Section title="Accepted Requests">
        {accepted.length ? accepted.map((r, i) => <RequestCard key={i} r={r} />) : <Empty text="No accepted requests" />}
      </Section>

      <Section title="Rejected Requests">
        {rejected.length ? rejected.map((r, i) => <RequestCard key={i} r={r} />) : <Empty text="No rejected requests" />}
      </Section>
      </div>
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

      <ProfileSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} email={email} refreshProfile={loadProfile} />
    </div>
  )
}

function StatCard({ label, value }) {
  let extra = {}

  if (label === "Pending") extra = st.pending
  if (label === "Accepted") extra = st.accepted
  if (label === "Rejected") extra = st.rejected

  return (
    <div style={{ ...st.statCard, ...extra }}>
      <div style={st.statValue}>{value}</div>
      <div style={st.statLabel}>{label}</div>
    </div>
  )
}


function Section({ title, children }) {
  return (
    <div style={{ marginTop: 28 }}>
      <div style={st.sectionTitle}>{title}</div>
      <div style={{ marginTop: 18 }}>
        <div style={st.list}>{children}</div>
      </div>
    </div>
  )
}

function Empty({ text }) {
  return <div style={st.empty}>{text}</div>
}

function RequestCard({ r }) {
  const badgeStyle = st[r.status.toLowerCase().replace("_", "")] || {}

  return (
    <div style={st.reqCard}>
      <img
        src={r.image ? `http://localhost:8080/uploads/requests/${r.image}` : "/"}
        onError={e => (e.currentTarget.src = "/")}
        style={st.thumb}
      />

      <div style={st.reqCol}>
     
        <div style={st.reqHeader}>
          <div style={st.reqTitle}>
            {r.wasteType} • {r.brand} {r.model}
          </div>
          <div style={{ ...st.badge, ...badgeStyle }}>
            {r.status.replace("_", " ")}
          </div>
        </div>

        
        <div style={st.metaLine}>
          <span style={st.label}>Pickup:</span> {r.pickupDate || "Not scheduled"}
        </div>

        <div style={st.metaLine}>
          <span style={st.label}>Location:</span> {r.location}
        </div>

        <div style={st.metaLine}>
          <span style={st.label}>Contact:</span> {r.contact}
        </div>

        {r.description && (
          <div style={st.metaLine}>
            <span style={st.label}>Description:</span> {r.description}
          </div>
        )}

        {r.remarks && (
          <div style={st.metaLine}>
            <span style={st.label}>Remarks:</span> {r.remarks}
          </div>
        )}
        {r.status === "REJECTED" && r.rejectionReason && (
          <div style={{ ...st.metaLine, color: "#FF7B8A", fontWeight: 600 }}>
            <span style={st.label}>Rejection Reason:</span> {r.rejectionReason}
          </div>
        )}
      </div>
    </div>
  )
}
const st = {
  page: { minHeight: "100vh", padding: 26, background: "var(--bg1)", color: "var(--white)" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap" },
  headerRight: { display: "flex", gap: 14, alignItems: "center" },
  title: { fontSize: 28, fontWeight: 700 },
  sub: { opacity: 0.7 },
  newBtn: { padding: "12px 18px", borderRadius: 14, background: "var(--accent)", border: "none", color: "#fff", fontWeight: 600, cursor: "pointer" },
  userBox: { display: "flex", gap: 12, alignItems: "center", cursor: "pointer" },
  avatar: { width: 42, height: 42, borderRadius: "50%", objectFit: "cover" },
  name: { fontWeight: 600 },
  email: { fontSize: 12, opacity: 0.7 },
  statsRow: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 16, marginTop: 24 },
  statCard: { padding: 18, borderRadius: 18, background: "var(--bg2)", color:"var(--white)",textAlign: "center" },
  statValue: { fontSize: 30, fontWeight: 700 },
  statLabel: { opacity: 0.7 },
  formCard: { marginTop: 24, padding: 24, borderRadius: 20, background: "var(--bg2)", border: "1px solid var(--muted)" },
  input: { height: 42, borderRadius: 10, background: "var(--bg3)", border: "1px solid var(--muted)", color: "var(--white)", padding: "0 12px" },
  textarea: { marginTop: 12, minHeight: 70, borderRadius: 12, background: "var(--bg3)", border: "1px solid var(--muted)", color: "var(--white)", padding: 12 },
  submitBig: { padding: "14px 32px", borderRadius: 16, background: "var(--accent)", border: "none", color: "var(--white)", fontWeight: 700, fontSize: 15, cursor: "pointer" },
  formSection: { marginBottom: 26 },
  formTitle: { fontSize: 15, fontWeight: 600, marginBottom: 12, opacity: 0.85 },
  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
  uploadBox: { height: 120, borderRadius: 16, border: "2px dashed var(--muted)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", background: "var(--bg2)" },
  uploadText: { textAlign: "center", fontSize: 14 },
  previewLarge: { marginTop: 14, width: 160, height: 160, borderRadius: 16, objectFit: "cover" },
  formActions: { display: "flex", justifyContent: "center", marginTop: 10 },
  toast: { position: "fixed", bottom: 28, right: 28, padding: "14px 20px", borderRadius: 14, background: "var(--bg2)", color: "var(--white)", fontWeight: 600, border:"1px solid var(--bg3)",boxShadow: "0 12px 30px rgba(0,0,0,0.2)", zIndex: 999 },
  reqCard: { display: "flex", gap: 16, padding: 16, borderRadius: 18, background: "var(--bg2)", border: "1px solid var(--muted)", backdropFilter: "blur(14px)", flexWrap:"wrap" },
  reqCol: { flex: 1, display: "flex", flexDirection: "column", gap: 6 },
  reqHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" },
  reqTitle: { fontWeight: 700, fontSize: 15 },
  metaLine: { fontSize: 13, opacity: 0.85, lineHeight: 1.4 },
  label: { opacity: 0.6, marginRight: 4 },
  thumb: { width: 80, height: 80, borderRadius: 14, objectFit: "cover" },
  badge: { padding: "4px 10px", borderRadius: 999, fontSize: 12, fontWeight: 700 },
  pending: { background: "rgba(255,200,0,0.25)", color: "#FFD166" },
  accepted: { background: "rgba(54,196,113,0.25)", color: "#38D39F" },
  rejected: { background: "rgba(222,60,75,0.25)", color: "#FF7B8A" },
  pickedup: { background: "rgba(95,170,255,0.25)", color: "#82BDFF" },
  sectionTitle: { fontSize: 18, fontWeight: 600 },
  list: { display: "flex", flexDirection: "column", gap: 14 },
  empty: { opacity: 0.6, marginTop: 8 }
}
