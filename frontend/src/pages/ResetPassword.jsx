/* eslint-disable no-unused-vars */
import { useState } from "react"
import axios from "../api"
import { useNavigate, useLocation } from "react-router-dom"

export default function ResetPassword() {
  const nav=useNavigate()
  const location=useLocation()
  const email=location.state?.email || ""

  const [password,setPassword]=useState("")
  const [showPassword,setShowPassword]=useState(false)
  const [success,setSuccess]=useState("")
  const [error,setError]=useState("")
  const [shake,setShake]=useState(false)

  const submit=async(e)=>{
    e.preventDefault()
    setShake(false)
    try{
      await axios.post("/auth/reset-password",{email,newPassword:password})
      setSuccess("Password reset successfully")
      setError("")
      setTimeout(()=>nav("/login"),1500)
    }catch{
      setError("Failed to reset password")
      setSuccess("")
      setShake(true)
      setTimeout(()=>setShake(false),400)
    }
  }

  return(
    <div style={styles.page}>
      <div style={styles.bridgeGlow}></div>

      <style>{`
        @keyframes soft-shake{
          0%{transform:translateX(0)}
          20%{transform:translateX(-4px)}
          40%{transform:translateX(4px)}
          60%{transform:translateX(-3px)}
          80%{transform:translateX(3px)}
          100%{transform:translateX(0)}
        }
        .shake-card{animation:soft-shake 0.35s ease}
      `}</style>

      <div style={styles.centerPanel}>
        <div style={styles.card} className={shake?"shake-card":""}>
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
                type={showPassword?"text":"password"}
                placeholder="New password"
                value={password}
                onChange={e=>setPassword(e.target.value)}
                required
              />

              <span
                onClick={()=>setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                {showPassword ? (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M22 12S19 18 12 18 2 12 2 12s3-6 10-6 10 6 10 6z"/>
                    <circle cx="12" cy="12" r="3"/>
                    <path d="M3 21L20 4"/>
                  </svg>
                ) : (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 5C4.367 5 1 12 1 12s3.367 7 11 7 11-7 11-7-3.367-7-11-7zm0 12a5 5 0 110-10 5 5 0 010 10z"/>
                  </svg>
                )}
              </span>
            </div>

            <button style={styles.button} type="submit">
              Update Password
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

const responsive={
  "@media (max-width:850px)":{
    card:{width:"92%",padding:"30px 22px"},
    cardTitle:{fontSize:"22px"},
    tagline:{fontSize:"13px"},
    passwordInput:{fontSize:"14px",padding:"10px 40px 10px 12px"},
    button:{fontSize:"15px",padding:"12px"}
  },
  "@media (max-width:480px)":{
    page:{padding:"14px",height:"auto"},
    card:{width:"100%",padding:"26px 20px"},
    cardTitle:{fontSize:"20px"},
    passwordInput:{fontSize:"13px",padding:"10px 38px 10px 12px"},
    button:{fontSize:"14px",padding:"10px"}
  }
}

const styles={
  page:{
    height:"100vh",
    display:"flex",
    alignItems:"center",
    justifyContent:"center",
    background:"linear-gradient(135deg,var(--c1),var(--c5))",
    position:"relative",
    overflow:"hidden",
    fontFamily:"-apple-system,BlinkMacSystemFont,sans-serif"
  },

  bridgeGlow:{
    position:"absolute",
    left:"50%",
    top:"50%",
    transform:"translate(-50%,-50%)",
    width:"340px",
    height:"340px",
    borderRadius:"50%",
    background:"radial-gradient(circle,rgba(255,255,255,0.22),rgba(255,255,255,0))",
    filter:"blur(55px)",
    opacity:0.8,
    zIndex:1
  },

  centerPanel:{
    zIndex:3,
    display:"flex",
    justifyContent:"center",
    width:"100%"
  },

  card:{
    width:"360px",
    padding:"42px 40px",
    borderRadius:"20px",
    background:"rgba(10,10,25,0.65)",
    backdropFilter:"blur(20px)",
    border:"1px solid rgba(255,255,255,0.18)",
    boxShadow:"0 10px 30px rgba(0,0,0,0.35)",
    color:"#fff",
    textAlign:"center"
  },

  cardTitle:{
    fontSize:"26px",
    fontWeight:"600",
    marginBottom:"10px",
    color:"var(--c3)"
  },

  tagline:{
    fontSize:"14px",
    opacity:0.85,
    marginBottom:"20px"
  },

  form:{
    display:"flex",
    flexDirection:"column",
    gap:"15px"
  },

  passwordWrapper:{
    position:"relative",
    width:"100%",
    maxWidth:"260px",
    margin:"0 auto"
  },

  passwordInput:{
    padding:"12px 42px 12px 14px",
    borderRadius:"10px",
    border:"1px solid rgba(255,255,255,0.35)",
    background:"rgba(8,8,20,0.75)",
    color:"#fff",
    fontSize:"15px",
    outline:"none",
    width:"100%",
    boxSizing:"border-box"
  },

  eyeIcon:{
    position:"absolute",
    right:"12px",
    top:"50%",
    transform:"translateY(-50%)",
    cursor:"pointer",
    opacity:0.85,
    display:"flex",
    alignItems:"center",
    justifyContent:"center",
    height:"26px",
    width:"26px",
    zIndex:5
  },

  button:{
    padding:"12px",
    background:"var(--c3)",
    borderRadius:"10px",
    border:"none",
    color:"#fff",
    fontWeight:"600",
    fontSize:"16px",
    cursor:"pointer"
  },

  error:{
    color:"#ff6b6b",
    marginBottom:"10px"
  },

  success:{
    color:"#00ff99",
    marginBottom:"10px"
  },

  ...responsive
}