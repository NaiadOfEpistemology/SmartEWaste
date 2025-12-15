/* eslint-disable no-unused-vars */
import { useState } from "react"
import axios from "../api"
import { useNavigate, useLocation } from "react-router-dom"

export default function Verify() {
  const nav = useNavigate()
  const location = useLocation()
  const initialEmail = (location.state && location.state.email) || ""

  const [email, setEmail] = useState(initialEmail)
  const [otp, setOtp] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

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
      <div style={styles.bridgeGlow}></div>

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

const responsive = {
  "@media (max-width: 850px)": {
    card: {
      width: "92%",
      padding: "32px 22px"
    },
    cardTitle: {
      fontSize: "22px"
    },
    tagline: {
      fontSize: "13px"
    },
    input: {
      fontSize: "14px",
      padding: "10px 12px"
    },
    button: {
      fontSize: "15px",
      padding: "12px"
    }
  },

  "@media (max-width: 480px)": {
    page: {
      padding: "14px",
      height: "auto"
    },
    card: {
      width: "100%",
      padding: "26px 20px"
    },
    cardTitle: {
      fontSize: "20px"
    },
    tagline: {
      fontSize: "12px"
    },
    input: {
      fontSize: "13px",
      padding: "10px"
    },
    button: {
      fontSize: "14px",
      padding: "10px"
    }
  }
}

const styles = {
  page: {
    height: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, var(--c1), var(--c5))",
    fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
    position: "relative",
    padding: "20px"
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
    position: "relative",
    zIndex: 3
  },

  cardTitle: {
    fontSize: "26px",
    fontWeight: "600",
    marginBottom: "10px",
    color: "var(--c3)"
  },

  tagline: {
    fontSize: "14px",
    opacity: 0.8,
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
    border: "1px solid rgba(255,255,255,0.25)",
    background: "rgba(255,255,255,0.12)",
    color: "#fff",
    fontSize: "15px"
  },

  button: {
    padding: "12px",
    background: "var(--c3)",
    border: "none",
    borderRadius: "10px",
    color: "#fff",
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
    color: "#fff",
    fontSize: "14px",
    cursor: "pointer",
    marginTop: "6px"
  },

  error: {
    color: "#ff6b6b",
    marginBottom: "8px",
    fontSize: "14px"
  },

  success: {
    color: "#7CFC9A",
    marginBottom: "8px",
    fontSize: "14px"
  },

  ...responsive
}