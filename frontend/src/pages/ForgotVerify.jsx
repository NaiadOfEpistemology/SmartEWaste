/* eslint-disable no-unused-vars */
import {useState} from "react"
import axios from "../api"
import {useLocation, useNavigate} from "react-router-dom"

export default function ForgotVerify(){
  const nav=useNavigate()
  const location=useLocation()
  const email=location.state?.email || ""

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

  return(
    <>
    <h1 style={styles.title}><center>Smart E Waste App</center></h1>
    <div style={styles.container}>
      <div style={styles.card}>
        
        <h2 style={styles.subtitle}>Verify OTP</h2>

        {success && <p style={styles.success}>{success}</p>}
        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={submit} style={styles.form}>
          <input
            style={styles.input}
            placeholder="Enter OTP"
            value={otp}
            onChange={e=>setOtp(e.target.value)}
            required
          />

          <button style={styles.button} type="submit">Verify</button>
        </form>

      </div>
    </div>
    </>
  )
}
// MOBILE RESPONSIVE FIX
const responsive = {
  "@media (max-width: 850px)": {

    page: {
      flexDirection: "column",
      height: "auto",
      padding: "20px",
      justifyContent: "flex-start",
      overflowY: "auto"
    },

    leftPanel: {
      width: "100%",
      justifyContent: "center",
      padding: "0px",
      marginBottom: "25px"
    },

    leftGlass: {
      width: "90%",
      padding: "35px 28px",
      textAlign: "center",
      maxWidth: "none"
    },

    bigTitle: {
      fontSize: "30px",
      lineHeight: "1.2"
    },

    desc: {
      fontSize: "15px",
      marginBottom: "18px"
    },

    featureItem: {
      fontSize: "14px"
    },

    rightPanel: {
      width: "100%",
      padding: "0px",
      marginLeft: "0px",
      justifyContent: "center"
    },

    card: {
      width: "92%",
      padding: "30px 22px"
    },

    cardTitle: {
      fontSize: "22px"
    },

    tagline: {
      fontSize: "13px"
    },

    input: {
      width: "100%",
      fontSize: "14px",
      padding: "10px 12px"
    },

    button: {
      fontSize: "15px",
      padding: "12px"
    }
  }
}
const styles={
  container:{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh",background:"var(--c1)"},
  card:{background:"var(--c2)",padding:"40px",borderRadius:"12px",width:"340px",textAlign:"center"},
  title:{margin:"40px 0 10px 0",color:"var(--c3)"},
  subtitle:{margin:"0 0 20px 0",color:"#fff",fontSize:"20px"},
  error:{color:"#DE3C4B",fontSize:"14px"},
  success:{color:"#00ff99",fontSize:"14px"},
  form:{display:"flex",flexDirection:"column",gap:"15px"},
  input:{padding:"12px",borderRadius:"8px",border:"none",outline:"none",background:"var(--c5)",color:"#fff"},
  button:{padding:"12px",border:"none",borderRadius:"8px",background:"var(--c3)",color:"#fff",fontWeight:"bold",cursor:"pointer"},
  ...responsive
}
