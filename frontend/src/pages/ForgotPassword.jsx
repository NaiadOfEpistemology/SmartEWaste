/* eslint-disable no-unused-vars */
import { useState } from "react"
import axios from "../api"
import { Link, useNavigate } from "react-router-dom"

export default function ForgotPassword() {
  const nav = useNavigate()

  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [shake, setShake] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setShake(false)
    try {
      await axios.post("/auth/forgot-password", { email })
      setSuccess("OTP has been sent to your email.")
      setError("")
      setTimeout(() => nav("/forgot-verify", { state: { email } }), 1500)
    } catch {
      setError("Email not found")
      setSuccess("")
      setShake(true)
      setTimeout(() => setShake(false), 400)
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.bridgeGlow}></div>

      <style>{`
        @keyframes soft-shake {
          0% { transform: translateX(0); }
          20% { transform: translateX(-4px); }
          40% { transform: translateX(4px); }
          60% { transform: translateX(-3px); }
          80% { transform: translateX(3px); }
          100% { transform: translateX(0); }
        }
        .shake-card { animation: soft-shake 0.35s ease; }
      `}</style>

      <div style={styles.centerPanel}>
        <div style={styles.card} className={shake ? "shake-card" : ""}>
          <h2 style={styles.cardTitle}>Forgot Password</h2>
          <p style={styles.tagline}>
            Enter your registered email to receive an OTP.
          </p>

          {success && <p style={styles.success}>{success}</p>}
          {error && <p style={styles.error}>{error}</p>}

          <form onSubmit={submit} style={styles.form}>
            <input
              style={styles.input}
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

<button style={styles.button} type="submit">
              Send OTP
            </button>
          </form>

          <p style={styles.switch}>
            Remembered your password?
            <Link to="/login" style={styles.link}> Login</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

const responsive = {
  "@media (max-width: 850px)": {
    card: { width: "92%", padding: "30px 22px" },
    cardTitle: { fontSize: "22px" },
    tagline: { fontSize: "13px" },
    input: { fontSize: "14px", padding: "10px 12px" },
    button: { fontSize: "15px", padding: "12px" }
  },
  "@media (max-width: 480px)": {
    page: { padding: "14px", height: "auto" },
    card: { width: "100%", padding: "26px 20px" },
    cardTitle: { fontSize: "20px" },
    input: { fontSize: "13px", padding: "10px" },
    button: { fontSize: "14px", padding: "10px" }
  }
}

const styles = {
  page: {
    height: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, var(--c1), var(--c5))",
    position: "relative",
    overflow: "hidden",
    fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif"
  },

  bridgeGlow: {
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: "translate(-50%, -50%)",
    width: "340px",
    height: "340px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(255,255,255,0.22), rgba(255,255,255,0))",
    filter: "blur(55px)",
    opacity: 0.8,
    zIndex: 1
  },

  centerPanel: {
    zIndex: 3,
    display: "flex",
    justifyContent: "center",
    width: "100%"
  },

  card: {
    width: "360px",
    padding: "42px 40px",
    borderRadius: "20px",
    background: "rgba(10,10,25,0.65)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255,255,255,0.18)",
    boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
    color: "#fff",
    textAlign: "center",
    transition: "0.25s ease"
  },

  cardTitle: {
    fontSize: "26px",
    fontWeight: "600",
    marginBottom: "10px",
    color: "var(--c3)"
  },

  tagline: {
    fontSize: "14px",
    opacity: 0.85,
    marginBottom: "20px"
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px"
  },

  input: {
    padding: "12px 14px",
    borderRadius: "10px",
    border: "1px solid rgba(255,255,255,0.35)",
    background: "rgba(8,8,20,0.75)",
    color: "#fff",
    fontSize: "15px",
    outline: "none",
    width: "100%",
    maxWidth: "260px",
    margin: "0 auto",
    display: "block"
  },

  button: {
    padding: "12px",
    background: "var(--c3)",
    borderRadius: "10px",
    border: "none",
    color: "#fff",
    fontWeight: "600",
    fontSize: "16px",
    cursor: "pointer"
  },

  switch: {
    marginTop: "18px",
    color: "#ddd",
    fontSize: "14px"
  },

  link: {
    color: "var(--c3)",
    fontWeight: "600",
    marginLeft: "6px",
    textDecoration: "underline"
  },

  error: {
    color: "#ff6b6b",
    marginBottom: "10px"
  },

  success: {
    color: "#00ff99",
    marginBottom: "10px"
  },

  ...responsive
}