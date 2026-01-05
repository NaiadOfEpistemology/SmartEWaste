

/* eslint-disable no-unused-vars */
import { useState } from "react"
import axios from "../api"
import { Link, useNavigate } from "react-router-dom"
import { useEffect } from "react"

export default function Login() {
  const nav = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [tagline, setTagline] = useState("Login to access your dashboard.")
  const [showPassword, setShowPassword] = useState(false)
  const [shake, setShake] = useState(false)
  const [theme, setTheme] = useState("dark");
  


  const updateTagline = (val) => {
    const trimmed = val.trim()
    if (trimmed.length > 0) {
      const first = trimmed.split("@")[0]
      setTagline(`Welcome back, ${first}`)
    } else {
      setTagline("Login to access your dashboard.")
    }
  }
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, []); 
  
  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };
  
  const login = async (e) => {
    e.preventDefault()
    setShake(false)
    try {
      const res = await axios.post("/auth/login", { email, password })
      const { role, name, email: backendEmail } = res.data
     
      localStorage.setItem("email", backendEmail)
      localStorage.setItem("role", role)
      localStorage.setItem("name", name);
      console.log("LOGIN STORAGE:", {
        email: backendEmail,
        role,
        name
      });
      if (role === "ADMIN") {
        nav("/admin")
      } else if (role === "PERSONNEL") {
        nav("/personneldashboard") 
      } else {
        nav("/dashboard")
      }
    } catch (err) {
      setError(
        err.response?.data === "UNVERIFIED"
          ? "Please verify your email first."
          : "Invalid credentials"
      )
      setShake(true)
      setTimeout(() => setShake(false), 400)
    }
  }
  

  return (
    <div style={styles.page}>
      <button
  onClick={toggleTheme}
  style={{
    position: "absolute",
    top: "20px",
    right: "20px",
    padding: "6px 10px",
    borderRadius: "6px",
    border: "none",
    background: "var(--c3)",
    color: "var(--white)",
    cursor: "pointer",
    zIndex: 10
  }}
>
  {theme === "dark" ? "Light Mode" : "Dark Mode"}
</button>

      {/* <div style={styles.bridgeGlow}></div> */}

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
          <h2 style={styles.cardTitle}>Login</h2>
          <p style={styles.tagline}>{tagline}</p>

          {error && <p style={styles.error}>{error}</p>}

          <form onSubmit={login} style={styles.form}>
            <input
              style={styles.input}
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                updateTagline(e.target.value)
              }}
              required
            />

<div style={styles.passwordWrapper}>
  <input
    style={styles.passwordInput}
    type={showPassword ? "text" : "password"}
    placeholder="Password"
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
              Login
            </button>
          </form>

          <p style={styles.switch}>
            No account?
            <Link style={styles.link} to="/register"> Register</Link>
          </p>

          <p style={styles.switch}>
            Forgot Password?
            <Link style={styles.link} to="/forgot-password"> Reset Here</Link>
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
    background: "var(--bg1)",
    position: "relative",
    overflow: "hidden",
    fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
    transition: "background-color 0.5s ease"
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
    background: "var(--bg2)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255,255,255,0.18)",
    boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
    color: "var(--white)",
    textAlign: "center",
    transition: "background-color 0.5s ease, color 0.5s ease, border-color 0.5s ease"
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
    marginBottom: "20px",
    minHeight: "20px"
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px"
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
  boxSizing: "border-box",
  transition: "background-color 0.5s ease, color 0.5s ease, border-color 0.5s ease"
},


  input: {
    padding: "12px 14px",
    borderRadius: "10px",
    border: "1px solid rgba(255,255,255,0.35)",
    background: "var(--bg3)",
    color: "var(--white)",
    fontSize: "15px",
    outline: "none",
    width: "100%",
    maxWidth: "260px",
    margin: "0 auto",
    display: "block",
    transition: "background-color 0.5s ease, color 0.5s ease, border-color 0.5s ease"

  },

  passwordWrapper: {
    position: "relative",
    width: "100%",
    maxWidth: "260px",
    margin: "0 auto"
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
    background: "var(--c3)",
    borderRadius: "10px",
    border: "none",
    color: "var(--white)",
    fontWeight: "600",
    fontSize: "16px",
    cursor: "pointer",
    transition: "background-color 0.5s ease, color 0.5s ease"
  },

  switch: {
    marginTop: "18px",
    color: "var(--white)",
    fontSize: "14px",
    transition: "color 0.5s ease"

  },

  link: {
    color: "var(--c3)",
    fontWeight: "600",
    marginLeft: "6px",
    textDecoration: "underline",
    transition: "color 0.5s ease"
  },

  error: {
    color: "#ff6b6b",
    marginBottom: "10px"
  },

  ...responsive
}
