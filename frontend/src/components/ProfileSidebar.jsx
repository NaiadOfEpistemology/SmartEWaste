/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react"
import api from "../api"

export default function ProfileSidebar({ open, onClose, email, refreshProfile }) {
  const [profile, setProfile] = useState({ email: "", fullName: "", phone: "", profilePhoto: "" })
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState("")
  const [saving, setSaving] = useState(false)

  const [theme, setTheme] = useState(
    document.documentElement.getAttribute("data-theme") || "light"
  )

  function toggleTheme() {
    const next = theme === "light" ? "dark" : "light"
    document.documentElement.setAttribute("data-theme", next)
    setTheme(next)
  }

  useEffect(() => {
    if (open && email) {
      api.get("/user/profile", { params: { email } })
        .then(r => setProfile(r.data || {}))
        .catch(() => {})
    }
  }, [open, email])

  function handleFile(e) {
    const f = e.target.files[0]
    if (!f) return
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  async function uploadImage() {
    if (!file) return null
    const fd = new FormData()
    fd.append("email", profile.email || email)
    fd.append("photo", file)
    const r = await api.post("/user/photo", fd)
    return r.data
  }

  async function save() {
    setSaving(true)
    try {
      const url = await uploadImage()
      const body = {
        email: profile.email,
        fullName: profile.fullName,
        phone: profile.phone
      }
      if (url) body.profilePhoto = url
      await api.put("/user/profile", body)
      refreshProfile && refreshProfile()
      onClose && onClose()
    } catch { /* empty */ }
    setSaving(false)
  }

  function logout() {
    localStorage.clear()
    window.location.href = "/login"
  }

  return (
    <div
  className="profile-glass"
  style={{
    ...styles.drawer,
    transform: open ? "translateX(0)" : "translateX(110%)"
  }}
>

      <button style={styles.close} onClick={onClose}>✕</button>

      <div style={styles.center}>
        <img
          style={styles.avatar}
          src={preview || (profile.profilePhoto ? `http://localhost:8080${profile.profilePhoto}` : "/")}
          onError={e => (e.currentTarget.src = "/")}
        />

        <input
          type="file"
          id="pf"
          accept="image/*"
          hidden
          onChange={handleFile}
        />

        <button style={styles.secondary} onClick={() => document.getElementById("pf").click()}>
          Change Photo
        </button>

        <div style={{ textAlign: "center" }}>
          <div style={{ fontWeight: 700 }}>{profile.fullName}</div>
          <div style={{ fontSize: 13, color: "var(--muted)" }}>{profile.email}</div>
        </div>
      </div>

      <div style={styles.section}>
        <div style={styles.label}>Full name</div>
        <input
          style={styles.input}
          value={profile.fullName || ""}
          onChange={e => setProfile({ ...profile, fullName: e.target.value })}
        />
      </div>

      <div style={styles.section}>
        <div style={styles.label}>Phone</div>
        <input
          style={styles.input}
          value={profile.phone || ""}
          onChange={e => {
            const v = e.target.value.replace(/\D/g, "")
            if (v.length <= 10) setProfile({ ...profile, phone: v })
          }}
        />
      </div>

      <button style={styles.btn} onClick={save} disabled={saving}>
        {saving ? "Saving..." : "Save changes"}
      </button>

      <button style={styles.secondary} onClick={logout}>
        Logout
      </button>

      <button style={styles.themeBtn} onClick={toggleTheme}>
        Switch to {theme === "light" ? "Dark" : "Light"} Mode
      </button>

      <div style={styles.footer}>Profile settings</div>
    </div>
  )
}

const styles = {
  drawer: {
    position: "fixed",
    top: 0,
    right: 0,
    height: "100vh",
    width: "300px",
  
    background: "rgba(255,255,255,0.45)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
  
    borderLeft: "1px solid rgba(255,255,255,0.35)",
  
    padding: 22,
    display: "flex",
    flexDirection: "column",
    gap: 18,
    transition: "transform .35s ease",
    zIndex: 9999,
    color: "var(--white)",
    fontFamily: "var(--font-main)"
  },
  
  close: {
    position: "absolute",
    top: 14,
    right: 14,
    background: "none",
    border: "none",
    fontSize: 20,
    color: "var(--white)",
    cursor: "pointer"
  },
  center: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 12,
    marginTop: 20
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: "50%",
    objectFit: "cover"
  },
  section: {
    display: "flex",
    flexDirection: "column",
    gap: 6
  },
  label: {
    fontSize: 13,
    color: "var(--muted)"
  },
  input: {
    padding: 12,
    borderRadius: 10,
    border: "1px solid var(--bg3)",
    background: "var(--bg1)",
    color: "var(--white)"
  },
  btn: {
    padding: 12,
    borderRadius: 10,
    background: "var(--accent)",
    color: "#fff",
    border: "none",
    fontWeight: 600,
    cursor: "pointer"
  },
  secondary: {
    padding: 12,
    borderRadius: 10,
    background: "transparent",
    border: "1px solid var(--bg3)",
    color: "var(--white)",
    cursor: "pointer"
  },
  themeBtn: {
    padding: 10,
    borderRadius: 10,
    background: "var(--c3)",
    border: "none",
    fontWeight: 600,
    cursor: "pointer"
  },
  footer: {
    marginTop: "auto",
    textAlign: "center",
    fontSize: 13,
    color: "var(--muted)"
  }
}
