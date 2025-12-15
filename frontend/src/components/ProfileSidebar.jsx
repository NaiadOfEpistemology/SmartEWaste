/* eslint-disable no-unused-vars */
import {useState,useEffect} from "react"
import api from "../api"

export default function ProfileSidebar({open,onClose,email,refreshProfile}) {
  const [profile,setProfile]=useState({email:"",fullName:"",phone:"",profilePhoto:""})
  const [file,setFile]=useState(null)
  const [preview,setPreview]=useState("")
  const [saving,setSaving]=useState(false)

  useEffect(()=>{
    if(open && email){
      api.get("/user/profile",{params:{email}})
        .then(r=>setProfile(r.data||{}))
        .catch(()=>{})
    }
  },[open,email])

  function handleFile(e){
    const f=e.target.files[0]
    if(!f) return
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  async function uploadImage(){
    if(!file) return null
    const fd=new FormData()
    fd.append("email", profile.email || email)
    fd.append("photo", file)
    const r = await api.post("/user/photo", fd)
    return r.data
  }

  async function save(){
    setSaving(true)
    try{
      const url = await uploadImage()
      const body = {
        email: profile.email,
        fullName: profile.fullName,
        phone: profile.phone
      }
      if(url) body.profilePhoto = url
      await api.put("/user/profile", body)
      refreshProfile && refreshProfile()
      onClose && onClose()
    }catch(e){/*empty*/}
    setSaving(false)
  }

  function logout(){
    localStorage.clear()
    window.location.href="/login"
  }

  const styles={
    drawer:{
      position:"fixed",
      top:0,
      right:0,
      height:"100vh",
      width:"300px",
      background:"rgba(255,255,255,0.12)",
      backdropFilter:"blur(18px)",
      borderLeft:"1px solid rgba(255,255,255,0.22)",
      padding:"22px",
      display:"flex",
      flexDirection:"column",
      gap:"18px",
      transform: open ? "translateX(0)" : "translateX(110%)",
      transition:"transform .35s ease",
      zIndex:9999,
      color:"#fff",
      fontFamily:"-apple-system,BlinkMacSystemFont,sans-serif"
    },
    close:{
      position:"absolute",
      top:14,
      right:14,
      fontSize:"20px",
      background:"none",
      border:"none",
      color:"#fff",
      cursor:"pointer"
    },
    avatar:{
      width:"110px",
      height:"110px",
      borderRadius:"50%",
      objectFit:"cover",
      boxShadow:"0 6px 18px rgba(0,0,0,0.35)"
    },
    section:{
      display:"flex",
      flexDirection:"column",
      gap:6
    },
    input:{
      padding:"12px",
      borderRadius:"10px",
      border:"1px solid rgba(255,255,255,0.25)",
      background:"rgba(255,255,255,0.10)",
      color:"#fff",
      fontSize:"14px",
      width:"100%"
    },
    btn:{
      padding:"12px",
      width:"100%",
      borderRadius:"10px",
      background:"var(--c3,#5F5AA2)",
      border:"none",
      color:"#fff",
      fontWeight:600,
      fontSize:"15px",
      cursor:"pointer"
    },
    secondary:{
      padding:"12px",
      width:"100%",
      borderRadius:"10px",
      background:"transparent",
      border:"1px solid rgba(255,255,255,0.25)",
      color:"#fff",
      fontWeight:500,
      fontSize:"14px",
      cursor:"pointer",
      marginTop:"6px"
    },
    footer:{
      position:"absolute",
      bottom:18,
      left:0,
      width:"100%",
      textAlign:"center",
      fontSize:"13px",
      opacity:.6
    }
  }

  return (
    <div style={styles.drawer}>
      <button style={styles.close} onClick={onClose}>✕</button>

      <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:12,marginTop:20}}>
        <img 
          style={styles.avatar}
          src={preview || (profile.profilePhoto ? `http://localhost:8080${profile.profilePhoto}` : "/")}
          onError={e=>e.currentTarget.src="/"}
        />

        <input
          type="file"
          id="pf"
          accept="image/*"
          style={{display:"none"}}
          onChange={handleFile}
        />

        <button style={styles.secondary} onClick={()=>document.getElementById("pf").click()}>
          Change Photo
        </button>

        <div style={{textAlign:"center"}}>
          <div style={{fontWeight:700}}>{profile.fullName}</div>
          <div style={{opacity:.7,fontSize:13}}>{profile.email}</div>
        </div>
      </div>

      <div style={styles.section}>
        <div style={{opacity:.7,fontSize:13}}>Full name</div>
        <input 
          style={styles.input}
          value={profile.fullName||""}
          onChange={e=>setProfile({...profile,fullName:e.target.value})}
        />
      </div>

      <div style={styles.section}>
        <div style={{opacity:.7,fontSize:13}}>Phone</div>
        <input 
          style={styles.input}
          value={profile.phone||""}
          onChange={e=>setProfile({...profile,phone:e.target.value})}
        />
      </div>

      <button style={styles.btn} onClick={save} disabled={saving}>
        {saving ? "Saving..." : "Save changes"}
      </button>

      <button style={styles.secondary} onClick={logout}>
        Logout
      </button>

      <div style={styles.footer}>Profile settings</div>
    </div>
  )
}