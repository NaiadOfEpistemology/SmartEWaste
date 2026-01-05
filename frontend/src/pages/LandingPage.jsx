import { useEffect, useState } from "react";

export default function LandingPage() {
  const heroImages = [
    {
      src: "https://cleanmanagement.com/wp-content/uploads/2024/05/AdobeStock_500968458.jpeg",
      caption: "Safe, certified e-waste recycling",
    },
    {
      src: "https://static.vecteezy.com/system/resources/previews/055/946/082/large_2x/a-large-area-is-covered-with-discarded-electronic-devices-including-old-televisions-and-computer-parts-amidst-cloudy-weather-highlighting-the-growing-challenge-of-e-waste-management-photo.jpg",
      caption: "Mountains of e-waste shouldn’t be the norm",
    },
    {
      src: "https://assets.weforum.org/article/image/large_juoZmAH_JersSRfagVHVIyuEK85v_opCc3wfa-yV_UI.jpg",
      caption: "Make responsible disposal part of daily life",
    },
    {
      src: "https://ewasterecyclehub.com/wp-content/uploads/2025/08/electronic-ewaste-recycling.jpg",
      caption: "Give electronics a second life, not a landfill",
    },
  ];

  const infoCards = [
    {
      title: "What is E-Waste?",
      front: "Any discarded electronic device - phones, laptops, TVs, batteries & more.",
      back: "If it has a plug, battery, or circuit board and you’re not using it anymore… it’s e-waste.",
    },
    {
      title: "Why Is It Harmful?",
      front: "E-waste contains lead, mercury and toxic materials.",
      back: "When dumped, these leak into soil and water, harming communities & crops.",
    },
    {
      title: "How Smart E-Waste Helps",
      front: "We connect users with verified collectors.",
      back: "Every pickup follows eco-friendly routing & certified recycling partners.",
    },
    {
      title: "What You Can Do",
      front: "Don’t dump or burn electronics.",
      back: "Schedule a pickup and encourage others to dispose responsibly.",
    },
  ];

  const [activeSlide, setActiveSlide] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState("dark");
  

const toggleTheme = () => {
  const newTheme = theme === "dark" ? "light" : "dark";
  setTheme(newTheme);
  document.documentElement.setAttribute("data-theme", newTheme);
};
useEffect(() => {
  document.documentElement.setAttribute("data-theme", theme);
}, [theme]); 


  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const scrollToId = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    setMenuOpen(false);
  };

  return (
    <div
  style={{
    fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
    background: "var(--bg1)",
    color: "var(--white)",
    minHeight: "100vh",
    overflowX: "hidden",
    transition: "background-color 0.5s ease, color 0.5s ease",
  }}
>

      <nav
        style={{
          width: "100%",
          padding: "16px 4%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "fixed",
          top: 0,
          background: "var(--bg2)",
backdropFilter: "blur(20px)",
borderBottom: "1px solid var(--muted)",
transition: "background-color 0.5s ease, border-color 0.5s ease",

          zIndex: 1000,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              height: 38,
              width: 38,
              borderRadius: 12,
              background: "var(--accent)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              fontSize: 18,
            }}
          >
            EW
          </div>
          <div>
            <div style={{ fontSize: 20, fontWeight: 700 }}>Smart E-Waste</div>
            <div style={{ fontSize: 12, opacity: 0.7 }}>
              Dispose responsibly, effortlessly.
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>

          <div className="desktop-nav" style={{ display: "flex", gap: 18, alignItems: "center", flexWrap: "wrap" }}>
            <button style={btn} onClick={() => scrollToId("about")}>About</button>
            <button style={btn} onClick={() => scrollToId("services")}>Services</button>
            <button style={btn} onClick={() => scrollToId("dosdonts")}>Do's & Dont's</button>
            <button style={btn} onClick={() => scrollToId("contact")}>Contact</button>
            <a href="/login" style={loginBtn}>Login</a>
            <button
    onClick={toggleTheme}
    style={{
      padding: "6px 10px",
      borderRadius: "6px",
      border: "none",
      background: "var(--c3)",
      color: "var(--white)",
      cursor: "pointer",
      fontSize: 13,
    }}
  >
    {theme === "dark" ? "Light Mode" : "Dark Mode"}
  </button>
          </div>

          <div
            className="mobile-nav-toggle"
            style={{
              display: "none",
              cursor: "pointer",
              flexDirection: "column",
              gap: 5,
            }}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                style={{
                  width: 26,
                  height: 2.5,
                  background: "white",
                  borderRadius: 5,
                }}
              />
            ))}
          </div>
        </div>
      </nav>

      {menuOpen && (
        <div
          style={{
            position: "fixed",
            top: 70,
            right: 0,
            left: 0,
            width: "100%",
            background: "rgba(10,10,20,0.92)",
            backdropFilter: "blur(12px)",
            padding: "20px 0",
            display: "flex",
            flexDirection: "column",
            gap: 18,
            textAlign: "center",
            zIndex: 999,
          }}
        >
          <button style={mobileBtn} onClick={() => scrollToId("about")}>About</button>
          <button style={mobileBtn} onClick={() => scrollToId("services")}>Services</button>
          <button style={mobileBtn} onClick={() => scrollToId("dosdonts")}>Do's & Dont's</button>
          <button style={mobileBtn} onClick={() => scrollToId("contact")}>Contact</button>
          <a href="/login" style={{ ...mobileBtn, textDecoration: "none" }}>Login</a>
        </div>
      )}

      <HeroSection heroImages={heroImages} activeSlide={activeSlide} />

      <AboutSection />
      <InfoSection infoCards={infoCards} />
      <ServicesSection />
      <DosDontsSection />
      <ContactSection />

      <footer
        style={{
          padding: 22,
          textAlign: "center",
          fontSize: 12,
          color: "var(--muted)",
transition: "color 0.5s ease",

        }}
      >
        © {new Date().getFullYear()} Smart E-Waste App
      </footer>
      <style>{`
        @media (max-width: 1100px) {
          .desktop-nav { display: none !important; }
          .mobile-nav-toggle { display: flex !important; }
        }
      `}</style>
    </div>
  );
}

const btn = {
  background: "transparent",
  border: "none",
  color: "var(--white)",
  cursor: "pointer",
  padding: 0,
  fontSize: 14,
  opacity: 0.85,
  transition: "color 0.5s ease",
};


const loginBtn = {
  padding: "9px 18px",
  borderRadius: 999,
  border: "1px solid var(--muted)",
  textDecoration: "none",
  color: "var(--white)",
  fontWeight: 600,
  fontSize: 14,
  transition: "background-color 0.5s ease, color 0.5s ease, border-color 0.5s ease",
};


const mobileBtn = {
  background: "transparent",
  border: "none",
  color: "var(--white)",
  fontSize: 18,
  cursor: "pointer",
  transition: "color 0.5s ease",
};


function HeroSection({ heroImages, activeSlide }) {
  return (
    <section
  id="hero"
  style={{
    padding: "90px 6% 90px",
    display: "flex",
    flexWrap: "wrap",
    gap: "40px",
    alignItems: "center",
    justifyContent: "space-between",
    maxWidth: "1200px",
    margin: "0 auto",
    transition: "background-color 0.5s ease, color 0.5s ease",
  }}
>

      <div style={{ flex: "1 1 420px" }}>
        <div
          style={{
            padding: "6px 12px",
            borderRadius: 999,
            border: "1px solid rgba(255,255,255,0.18)",
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontSize: 12,
            marginBottom: 12,
            background: "rgba(255,255,255,0.03)",
          }}
        >
          <span
            style={{
              height: 7,
              width: 7,
              borderRadius: "50%",
              background: "#50fa7b",
              boxShadow: "0 0 10px rgba(80,250,123,0.6)",
            }}
          />
          Live • Smart pickups
        </div>

        <h1
          style={{
            fontSize: "46px",
            lineHeight: 1.12,
            fontWeight: 800,
          }}
        >
          Turn your old gadgets
          <br />
          into a cleaner tomorrow.
        </h1>

        <p
          style={{
            marginTop: 10,
            fontSize: 17,
            maxWidth: 520,
            lineHeight: 1.6,
            opacity: 0.9,
          }}
        >
          Smart E-Waste helps you book doorstep pickups for electronics. Track every
          request while ensuring safe and certified recycling.
        </p>

        <div style={{ display: "flex", gap: 14, marginTop: 26 }}>
          <a
            href="/register"
            style={{
              padding: "13px 26px",
              borderRadius: 999,
              background: "var(--accent)",
              color: "white",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Get Started
          </a>

          <button
            type="button"
            style={{
              padding: "12px 22px",
              borderRadius: 999,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.22)",
              color: "var(--white)",
            }}
            onClick={() =>
              document
                .getElementById("services")
                .scrollIntoView({ behavior: "smooth" })
            }
          >
            View Core Services
          </button>
        </div>
      </div>

      <div style={{ flex: "1 1 380px" }}>
        <div
          style={{
            width: "100%",
            maxWidth: "480px",
            borderRadius: 22,
            padding: 12,
            background: "var(--bg2)",
border: "1px solid var(--muted)",
boxShadow: "0 18px 40px rgba(0,0,0,0.35)",
backdropFilter: "blur(20px)",
transition: "background-color 0.5s ease, border-color 0.5s ease",

          }}
        >
          <div
            style={{
              position: "relative",
              width: "100%",
              height: 310,
              borderRadius: 18,
              overflow: "hidden",
            }}
          >
            {heroImages.map((img, idx) => (
              <img
                key={idx}
                src={img.src}
                alt={img.caption}
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  opacity: idx === activeSlide ? 1 : 0,
                  transform: idx === activeSlide ? "scale(1)" : "scale(1.03)",
                  transition: "opacity 0.7s ease, transform 0.7s ease",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}





function AboutSection() {
  return (
    <section id="about" style={{ padding: "50px 6% 80px", background: "var(--bg2)" }}>
      <h2 style={{
        fontSize: 30,
        textAlign: "center",
        fontWeight: 700,
        marginBottom: 30
      }}>
        What is the Smart E-Waste App?
      </h2>

      <div style={{
        maxWidth: 1100,
        margin: "0 auto",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 32,
        alignItems: "center"
      }}>
        <p style={{ fontSize: 16, lineHeight: 1.7, opacity: 0.9 }}>
          The Smart E-Waste App helps you submit electronic waste pickups, track every status, and ensures devices are disposed of only through certified recycling partners.
        </p>

        <div style={{
          padding: 22,
          borderRadius: 18,
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.18)"
        }}>
          <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 10 }}>
            Built for real-world waste problems.
          </h3>
          <p style={{ fontSize: 14, opacity: 0.9, lineHeight: 1.6 }}>
            Students, offices, households — anyone with unused electronics can request verified, traceable disposal.
          </p>
        </div>
      </div>
    </section>
  )
}


function InfoSection({ infoCards }) {
  return (
    <section style={{ padding: "60px 6%" }}>
      <h2 style={{
        textAlign: "center",
        fontSize: 30,
        fontWeight: 700,
        marginBottom: 30
      }}>
        Understand E-Waste
      </h2>

      <div style={{
        maxWidth: 1100,
        margin: "0 auto",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
        gap: 20
      }}>
        {infoCards.map((c, i) => (
          <FlipCard key={i} title={c.title} front={c.front} back={c.back} />
        ))}
      </div>
    </section>
  )
}


function FlipCard({ title, front, back }) {
  const [hover, setHover] = useState(false)
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        borderRadius: 16,
        padding: 18,
        background: "var(--bg3)",
border: "1px solid var(--muted)",
transition: "background-color 0.5s ease, border-color 0.5s ease",

        boxShadow: "0 10px 26px rgba(0,0,0,0.4)",
        minHeight: 150,
        
      }}
    >
      <h3 style={{ fontSize: 17, fontWeight: 600, marginBottom: 10 }}>{title}</h3>
      <p style={{ opacity: 0.9, lineHeight: 1.6 }}>{hover ? back : front}</p>
    </div>
  )
}


function ServicesSection() {
  return (
    <section id="services" style={{ padding: "70px 6% 80px", background: "var(--bg2)" }}>
      <h2 style={{
        textAlign: "center",
        fontSize: 30,
        fontWeight: 700,
        marginBottom: 10
      }}>Core Services</h2>

      <div style={{
        maxWidth: 1100,
        margin: "0 auto",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
        gap: 22
      }}>
        <ServiceCard title="Doorstep Pickup" text="Submit detailed e-waste requests with photos, and admins arrange pickup." />
        <ServiceCard title="Smart Scheduling" text="You receive email-confirmed pickup slots instantly updated in your dashboard." />
        <ServiceCard title="Verified Disposal" text="All items are processed through authorized recycling partners." />
        <ServiceCard title="Live Status & History" text="Track requests across Pending, Accepted, Rejected, Picked-Up." />
      </div>
    </section>
  )
}


function ServiceCard({ title, text }) {
  return (
    <div style={{
      padding: 22,
      borderRadius: 16,
      background: "var(--bg3)",
border: "1px solid var(--muted)",
transition: "background-color 0.5s ease, border-color 0.5s ease",

    }}>
      <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>{title}</h3>
      <p style={{ opacity: 0.9 }}>{text}</p>
    </div>
  )
}


function DosDontsSection() {
  return (
    <section id="dosdonts" style={{ padding: "70px 6% 80px" }}>
      <h2 style={{
        textAlign: "center",
        fontSize: 30,
        fontWeight: 700,
        marginBottom: 28
      }}>E-Waste Do's & Dont's</h2>

      <div style={{
        maxWidth: 900,
        margin: "0 auto",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
        gap: 26
      }}>
        <DosDontCard title="Do's" items={[
          "Back up and wipe data",
          "Sort electronics separately",
          "Use certified Smart E-Waste pickups",
          "Store old batteries safely",
          "Encourage others to dispose responsibly"
        ]} />

        <DosDontCard title="Dont's" items={[
          "Don’t burn electronics",
          "Don’t dump with regular trash",
          "Don’t sell to unverified dealers",
          "Don’t store swollen batteries",
          "Don’t throw away cables & chargers"
        ]} />
      </div>
    </section>
  )
}


function DosDontCard({ title, items }) {
  return (
    <div style={{
      padding: 22,
      borderRadius: 16,
      background: "var(--bg3)",
border: "1px solid var(--muted)",
transition: "background-color 0.5s ease, border-color 0.5s ease",

    }}>
      <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 10 }}>{title}</h3>
      <ul style={{
        paddingLeft: 18,
        lineHeight: 1.7,
        opacity: 0.9
      }}>
        {items.map((i, idx) => (
          <li key={idx}>{i}</li>
        ))}
      </ul>
    </div>
  )
}


function ContactSection() {
  return (
    <section id="contact" style={{
      padding: "70px 6% 80px",
      background: "var(--bg2)"
    }}>
      <h2 style={{
        textAlign: "center",
        fontSize: 28,
        fontWeight: 700,
        marginBottom: 30
      }}>
        Contact & Support
      </h2>

      <div style={{
        maxWidth: 600,
        margin: "0 auto",
        padding: 28,
        borderRadius: 18,
        background: "var(--bg3)",
border: "1px solid var(--muted)",
transition: "background-color 0.5s ease, border-color 0.5s ease",

      }}>
        <p><strong>Email:</strong> support@ewaste.com</p>
        <p><strong>Phone:</strong> +91 84669 93344</p>
        <p><strong>Location:</strong> Hyderabad, Telangana</p>
      </div>
    </section>
  )
}