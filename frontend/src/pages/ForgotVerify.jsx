/* eslint-disable no-unused-vars */
import {useState} from "react"
import axios from "../api"
import {useLocation, useNavigate} from "react-router-dom"
import {useEffect} from "react"

export default function ForgotVerify(){
  const nav=useNavigate()
  const location=useLocation()
  const email=location.state?.email || ""
  const [theme, setTheme] = useState("dark");

  const [otp,setOtp]=useState("")
  const [error,setError]=useState("")
  const [success,setSuccess]=useState("")

  const submit=async(e)=>{
    e.preventDefault()
    try{
      await axios.post("/auth/verify-forgot",{email,otp})
      setSuccess("OTP Verified")
      setError("")
      setTimeout(()=>nav("/reset-password",{ state:{ email } }),1500)
    }catch{
      setError("Invalid OTP")
      setSuccess("")
    }
  }
  const toggleTheme = () => {
      const newTheme = theme === "dark" ? "light" : "dark";
       setTheme(newTheme);
       document.documentElement.setAttribute("data-theme", newTheme);
     };
     useEffect(() => {
         document.documentElement.setAttribute("data-theme", theme);
       }, [theme]);

  return(
    <>
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
      color: "#fff",
      cursor: "pointer"
    }}
  >
    {theme === "dark" ? "Light Mode" : "Dark Mode"}
  </button>

  <div style={styles.centerPanel}>
    <div style={styles.card}>
      <h2 style={styles.cardTitle}>Verify OTP</h2>

      {success && <p style={styles.success}>{success}</p>}
      {error && <p style={styles.error}>{error}</p>}

      <form onSubmit={submit} style={styles.form}>
        <input
          style={styles.input}
          placeholder="Enter OTP"
          value={otp}
          onChange={e => setOtp(e.target.value)}
          required
        />

        <button style={styles.button} type="submit">Verify</button>
      </form>

    </div>
  </div>
</div>

    </>
  )
}
const responsive = {
  "@media (max-width: 850px)": {
    card: { width: "92%", padding: "30px 22px" },
    cardTitle: { fontSize: "22px" },
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
};

const styles = {
  page: {
    height: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "var(--bg1)",
    position: "relative",
    fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif"
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
    boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
    color: "var(--white)",
    textAlign: "center",
    transition: "background-color 0.5s ease, color 0.5s ease"
  },

  cardTitle: { fontSize: "26px", fontWeight: 600, marginBottom: "10px", color: "var(--c3)" },
  form: { display: "flex", flexDirection: "column", gap: "15px" },
  input: {
    padding: "12px 14px",
    borderRadius: "10px",
    border: "1px solid rgba(255,255,255,0.35)",
    background: "var(--bg3)",
    color: "var(--white)",
    fontSize: "15px",
    outline: "none",
    width: "100%",
    margin: "0 auto",
    display: "block",
    transition: "all 0.5s ease"
  },
  button: {
    padding: "12px",
    background: "var(--c3)",
    borderRadius: "10px",
    border: "none",
    color: "#fff",
    fontWeight: 600,
    fontSize: "16px",
    cursor: "pointer",
    transition: "all 0.5s ease"
  },
  switch: { marginTop: "18px", color: "var(--white)", fontSize: "14px" },
  link: { color: "var(--c3)", fontWeight: 600, marginLeft: "6px", textDecoration: "underline" },
  error: { color: "#ff6b6b", marginBottom: "10px" },
  success: { color: "#00ff99", marginBottom: "10px" },
  ...responsive
};
