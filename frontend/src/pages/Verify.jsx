/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react"
import axios from "../api"
import { useNavigate, useLocation, Link } from "react-router-dom"

export default function Verify() {
  const nav = useNavigate()
  const location = useLocation()
  const initialEmail = location.state?.email || ""

  const [theme, setTheme] = useState("dark")
  const [email, setEmail] = useState(initialEmail)
  const [otp, setOtp] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme)
  }, [theme])

  const toggleTheme = () =>
    setTheme(prev => (prev === "dark" ? "light" : "dark"))

  const submit = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post("/auth/verify", { email, otp })
      setSuccess(res.data)
      setError("")
      setTimeout(() => nav("/login"), 1500)
    } catch {
      setError("Invalid OTP")
      setSuccess("")
    }
  }

  const resendOtp = async () => {
    try {
      await axios.post("/auth/resend-otp", { email })
      setSuccess("OTP resent to your email.")
      setError("")
    } catch {
      setError("Unable to resend OTP")
      setSuccess("")
    }
  }

  return (
    <div style={styles.page}>
      
      <button onClick={toggleTheme} style={styles.themeToggle}>
        {theme === "dark" ? "Light Mode" : "Dark Mode"}
      </button>

      <div style={styles.card}>
        <h2 style={styles.cardTitle}>Verify Email</h2>
        <p style={styles.tagline}>
          Enter the 6-digit OTP sent to your registered email.
        </p>

        {success && <p style={styles.success}>{success}</p>}
        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={submit} style={styles.form}>
          <input
            style={styles.input}
            type="email"
            placeholder="Registered Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            style={styles.input}
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />

          <button style={styles.button} type="submit">
            Verify Account
          </button>

          <button
            type="button"
            style={styles.secondaryButton}
            onClick={resendOtp}
          >
            Resend OTP
          </button>
        </form>

       
      </div>
    </div>
  )
}

const styles = {
  page: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "var(--bg1)",
    fontFamily: "var(--font-main)",
    padding: "20px",
    position: "relative"
  },

  themeToggle: {
    position: "absolute",
    top: "20px",
    right: "20px",
    padding: "6px 10px",
    borderRadius: "6px",
    border: "none",
    background: "var(--c3)",
    color: "var(--white)",
    cursor: "pointer",
    fontWeight: 600
  },

  card: {
    width: "100%",
    maxWidth: "380px",
    padding: "42px 35px",
    borderRadius: "20px",
    background: "var(--bg2)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255,255,255,0.14)",
    boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
    color: "var(--white)",
    textAlign: "center"
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
    marginBottom: "14px"
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
    background: "var(--bg3)",
    color: "var(--white)",
    fontSize: "15px",
    outline: "none"
  },

  button: {
    padding: "12px",
    background: "var(--c3)",
    border: "none",
    borderRadius: "10px",
    color: "var(--white)",
    fontWeight: "600",
    fontSize: "16px",
    cursor: "pointer",
    marginTop: "5px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.25)"
  },

  secondaryButton: {
    padding: "11px",
    borderRadius: "10px",
    background: "transparent",
    border: "1px solid rgba(255,255,255,0.5)",
    color: "var(--white)",
    fontSize: "14px",
    cursor: "pointer",
    marginTop: "6px"
  },

  switch: {
    marginTop: "22px",
    color: "var(--white)"
  },

  link: {
    color: "var(--c3)",
    marginLeft: "6px",
    fontWeight: "600",
    textDecoration: "underline"
  },

  error: {
    color: "#ff6b6b",
    marginBottom: "8px",
    fontSize: "14px"
  },

  success: {
    color: "#7CFFAE",
    marginBottom: "8px",
    fontSize: "14px"
  }
}
