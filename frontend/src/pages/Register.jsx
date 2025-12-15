/* eslint-disable no-unused-vars */
import { useState } from "react"
import axios from "../api"
import { Link, useNavigate } from "react-router-dom"

export default function Register(){

  const nav = useNavigate()

  const [fullName,setFullName] = useState("")
  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const [phone,setPhone] = useState("")
  const [error,setError] = useState("")
  const [tagline,setTagline] = useState("Create your account to access features.")

  const [requirements,setRequirements] = useState({
    length:false,
    upper:false,
    number:false,
    special:false
  })

  const [phoneError,setPhoneError] = useState("")
  const [isPhoneValid,setIsPhoneValid] = useState(false)
  const [canSubmit,setCanSubmit] = useState(false)

  function updateCanSubmit(reqs = requirements, phoneOk = isPhoneValid, name = fullName, mail = email){
    const emailValid = /^[^@]+@[^@]+\.[^@]+$/.test(mail)
    const pwdValid = Object.values(reqs).every(v => v === true)
    const nameValid = name.trim().length >= 2
    setCanSubmit(pwdValid && phoneOk && nameValid && emailValid)
  }

  function updateTagline(val){
    if(val.trim().length>0){
      setTagline(`Welcome, ${val.split(" ")[0]}, let's get you started`)
    } else {
      setTagline("Create your account to access features.")
    }
  }

  function validatePhone(num){
    const cleaned = num.replace(/\D/g, "")
    const ok = cleaned.length === 10 && /^[6-9]/.test(cleaned)
    setIsPhoneValid(ok)
    setPhoneError(ok ? "" : "Enter a valid phone number")
    updateCanSubmit(requirements, ok, fullName, email)
  }

  function evaluatePassword(pwd){
    const req = {
      length: pwd.length >= 6,
      upper: /[A-Z]/.test(pwd),
      number: /\d/.test(pwd),
      special: /[^A-Za-z0-9]/.test(pwd)
    }
    setRequirements(req)
    updateCanSubmit(req, isPhoneValid, fullName, email)
  }

  function changeField(field,val){
    if(field === "name"){
      setFullName(val)
      updateTagline(val)
      updateCanSubmit(requirements, isPhoneValid, val, email)
    }
    if(field === "email"){
      setEmail(val)
      updateCanSubmit(requirements, isPhoneValid, fullName, val)
    }
    if(field === "password"){
      setPassword(val)
      evaluatePassword(val)
    }
    if(field === "phone"){
      setPhone(val)
      validatePhone(val)
    }
  }

  const register = async(e)=>{
    e.preventDefault()
    try{
      await axios.post("/auth/register",{fullName,email,password,phone})
      nav("/verify",{state:{email}})
    } catch(err){
      setError("Account already exists or registration failed")
    }
  }

  const reqStyle = (ok)=>({
    color: ok ? "#7CFFAE" : "#ff9b9b",
    fontSize:"13px",
    transition:"0.3s ease"
  })

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.cardTitle}>Create Account</h2>
        <p style={styles.tagline}>{tagline}</p>
        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={register} style={styles.form}>
          <input
            style={styles.input}
            placeholder="Full Name"
            value={fullName}
            onChange={e=>changeField("name",e.target.value)}
            required
          />

          <input
            style={styles.input}
            placeholder="Email"
            type="email"
            value={email}
            onChange={e=>changeField("email",e.target.value)}
            required
          />

          <input
            style={styles.input}
            placeholder="Password"
            type="password"
            value={password}
            onChange={e=>changeField("password",e.target.value)}
            required
          />

          {password.length>0 && (
            <div style={styles.checklistBox}>
              <div style={reqStyle(requirements.length)}>• At least 6 characters</div>
              <div style={reqStyle(requirements.upper)}>• Contains uppercase letter</div>
              <div style={reqStyle(requirements.number)}>• Contains number</div>
              <div style={reqStyle(requirements.special)}>• Contains special character</div>
            </div>
          )}

          <input
            style={styles.input}
            placeholder="Phone Number"
            value={phone}
            onChange={e=>changeField("phone",e.target.value)}
            required
          />

          {phoneError && (
            <p style={styles.phoneError}>{phoneError}</p>
          )}

          <button
            style={{
              ...styles.button,
              opacity: canSubmit ? 1 : 0.45,
              cursor: canSubmit ? "pointer" : "not-allowed"
            }}
            type="submit"
            disabled={!canSubmit}
          >
            Register
          </button>
        </form>

        <p style={styles.switch}>
          Already have an account?
          <Link style={styles.link} to="/login"> Login</Link>
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
    background:"linear-gradient(135deg, var(--c1), var(--c5))",
    fontFamily:"-apple-system, BlinkMacSystemFont, sans-serif",
    padding: "20px"
  },

  card:{
    width:"100%",
    maxWidth:"380px",
    padding:"42px 35px",
    borderRadius:"20px",
    background:"rgba(10,10,25,0.7)",
    backdropFilter:"blur(20px)",
    border:"1px solid rgba(255,255,255,0.14)",
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
    marginBottom:"14px",
    minHeight:"20px"
  },

  form:{
    display:"flex",
    flexDirection:"column",
    gap:"15px"
  },

  input:{
    padding:"12px 14px",
    borderRadius:"10px",
    border:"1px solid rgba(255,255,255,0.35)",
    background:"rgba(8,8,20,0.75)",
    color:"#fff",
    fontSize:"15px",
    outline:"none"
  },

  checklistBox:{
    textAlign:"left",
    marginTop:"-6px",
    lineHeight:"1.5"
  },

  button:{
    padding:"12px",
    borderRadius:"10px",
    border:"none",
    background:"var(--c3)",
    color:"#fff",
    fontWeight:"600",
    fontSize:"16px",
    boxShadow:"0 4px 10px rgba(0,0,0,0.25)"
  },

  switch:{
    marginTop:"22px",
    color:"#ddd"
  },

  link:{
    color:"var(--c3)",
    marginLeft:"6px",
    fontWeight:"600",
    textDecoration:"underline"
  },

  phoneError:{
    color:"#ff6b6b",
    fontSize:"13px",
    marginTop:"-6px"
  },

  error:{
    color:"#ff6b6b",
    marginBottom:"10px"
  }
}