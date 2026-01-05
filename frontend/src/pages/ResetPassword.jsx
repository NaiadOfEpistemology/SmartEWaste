/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react"
import axios from "../api"
import { useNavigate, useLocation, Link } from "react-router-dom"

export default function ResetPassword() {
  const nav = useNavigate()
  const location = useLocation()
  const email = location.state?.email || ""

  const [theme, setTheme] = useState("dark")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")
  const [shake, setShake] = useState(false)

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme)
  }, [theme])

  const toggleTheme = () =>
    setTheme(prev => (prev === "dark" ? "light" : "dark"))

  const submit = async (e) => {
    e.preventDefault()
    setShake(false)
    try {
      await axios.post("/auth/reset-password", {
        email,
        newPassword: password
      })
      setSuccess("Password reset successfully")
      setError("")
      setTimeout(() => nav("/login"), 1500)
    } catch {
      setError("Failed to reset password")
      setSuccess("")
      setShake(true)
      setTimeout(() => setShake(false), 400)
    }
  }

  return (
    <div style={styles.page}>
      <button
        onClick={toggleTheme}
        style={styles.themeToggle}
      >
        {theme === "dark" ? "Light Mode" : "Dark Mode"}
      </button>

      <style>{`
        @keyframes soft-shake {
          0% { transform: translateX(0) }
          20% { transform: translateX(-4px) }
          40% { transform: translateX(4px) }
          60% { transform: translateX(-3px) }
          80% { transform: translateX(3px) }
          100% { transform: translateX(0) }
        }
        .shake-card {
          animation: soft-shake 0.35s ease;
        }
      `}</style>

      <div style={styles.card} className={shake ? "shake-card" : ""}>
        <h2 style={styles.cardTitle}>Reset Password</h2>
        <p style={styles.tagline}>
          Choose a strong password to secure your account.
        </p>

        {success && <p style={styles.success}>{success}</p>}
        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={submit} style={styles.form}>
          <div style={styles.passwordWrapper}>
            <input
              style={styles.passwordInput}
              type={showPassword ? "text" : "password"}
              placeholder="New password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <span
              onClick={() => setShowPassword(!showPassword)}
              style={styles.eyeIcon}
            >
              {showPassword ? (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M22 12S19 18 12 18 2 12 2 12s3-6 10-6 10 6 10 6z" />
                  <circle cx="12" cy="12" r="3" />
                  <path d="M3 21L20 4" />
                </svg>
              ) : (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 5C4.367 5 1 12 1 12s3.367 7 11 7 11-7 11-7-3.367-7-11-7zm0 12a5 5 0 110-10 5 5 0 010 10z" />
                </svg>
              )}
            </span>
          </div>

          <button style={styles.button} type="submit">
            Update Password
          </button>
        </form>

        <p style={styles.switch}>
          Changed your mind?
          <Link to="/login" style={styles.link}> Login</Link>
        </p>
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
    marginBottom: "14px",
    minHeight: "20px"
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px"
  },

  passwordWrapper: {
    position: "relative",
    width: "100%",
    maxWidth: "260px",
    margin: "0 auto"
  },

  passwordInput: {
    padding: "12px 42px 12px 14px",
    borderRadius: "10px",
    border: "1px solid rgba(255,255,255,0.35)",
    background: "var(--bg3)",
    color: "var(--white)",
    fontSize: "15px",
    outline: "none",
    width: "100%",
    boxSizing: "border-box"
  },

  eyeIcon: {
    position: "absolute",
    right: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    cursor: "pointer",
    opacity: 0.85,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "26px",
    width: "26px",
    zIndex: 5
  },

  button: {
    padding: "12px",
    borderRadius: "10px",
    border: "none",
    background: "var(--c3)",
    color: "var(--white)",
    fontWeight: "600",
    fontSize: "16px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.25)",
    cursor: "pointer"
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
    marginBottom: "10px"
  },

  success: {
    color: "#00ff99",
    marginBottom: "10px"
  }
}
