import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Shield, MessageSquare, CreditCard, Star, Package, ChevronDown, Menu, X } from 'lucide-react'

export default function Landing() {
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFeature, setActiveFeature] = useState(0)
  const [counters, setCounters] = useState({ dealers: 0, parts: 0, customers: 0, counties: 0 })
  const [countersStarted, setCountersStarted] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
      // Start counters when stats section is visible
      const statsEl = document.getElementById('stats-bar')
      if (statsEl) {
        const rect = statsEl.getBoundingClientRect()
        if (rect.top < window.innerHeight && !countersStarted) {
          setCountersStarted(true)
          animateCounters()
        }
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [countersStarted])

  const animateCounters = () => {
    const targets = { dealers: 500, parts: 10000, customers: 50000, counties: 47 }
    const duration = 2000
    const steps = 60
    const interval = duration / steps
    let step = 0
    const timer = setInterval(() => {
      step++
      const progress = step / steps
      setCounters({
        dealers: Math.floor(targets.dealers * progress),
        parts: Math.floor(targets.parts * progress),
        customers: Math.floor(targets.customers * progress),
        counties: Math.floor(targets.counties * progress),
      })
      if (step >= steps) clearInterval(timer)
    }, interval)
  }

  // Auto rotate features
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % features.length)
    }, 3000)
    return () => clearInterval(timer)
  }, [])

  const features = [
    { icon: <Shield size={48} color="#c9a84c" />, title: 'Verified Dealers Only', text: 'Every supplier is manually verified by our team. No counterfeits, no fraud — just genuine parts from trusted dealers.' },
    { icon: <Search size={48} color="#c9a84c" />, title: 'Smart Part Search', text: 'Search by vehicle model, brand, or part number. Filter by price and location. Find exactly what your vehicle needs in seconds.' },
    { icon: <MessageSquare size={48} color="#c9a84c" />, title: 'Direct Dealer Chat', text: 'Message dealers directly to confirm compatibility before buying. No middlemen, no guesswork.' },
    { icon: <CreditCard size={48} color="#c9a84c" />, title: 'Secure M-Pesa Payments', text: 'Pay safely via M-Pesa. Every transaction is recorded, receipts sent instantly, and your money is protected.' },
    { icon: <Star size={48} color="#c9a84c" />, title: 'Ratings & Reviews', text: 'Real reviews from verified buyers. Know the dealer\'s reputation before you buy.' },
    { icon: <Package size={48} color="#c9a84c" />, title: 'Order Tracking', text: 'Track every order from placement to delivery. Always know where your parts are.' },
  ]

  const testimonials = [
    { name: 'James Mwangi', role: 'Mechanic, Nairobi', text: 'SpareLink saved me hours of calling around. I found the exact alternator for a Mark X within minutes and it was genuine.' },
    { name: 'Grace Wanjiku', role: 'Car Owner, Mombasa', text: 'I was worried about getting fake parts. The verified dealers badge gave me confidence and the part worked perfectly.' },
    { name: 'Kevin Ochieng', role: 'Spare Parts Dealer, Kisumu', text: 'My sales have tripled since joining SpareLink. I now reach customers from all over Kenya without leaving my shop.' },
  ]

  return (
    <div style={styles.page}>

      {/* Navbar */}
      <nav style={{ ...styles.navbar, ...(scrolled ? styles.navbarScrolled : {}) }}>
        <h1 style={styles.logo}>SpareLink <span style={styles.logoAccent}>Kenya</span></h1>
        <div style={styles.navLinks}>
          <span style={styles.navLink} onClick={() => document.getElementById('how-it-works').scrollIntoView({ behavior: 'smooth' })}>How It Works</span>
          <span style={styles.navLink} onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}>Features</span>
          <span style={styles.navLink} onClick={() => document.getElementById('for-dealers').scrollIntoView({ behavior: 'smooth' })}>For Dealers</span>
          <button style={styles.navLogin} onClick={() => navigate('/login')}>Login</button>
          <button style={styles.navRegister} onClick={() => navigate('/register')}>Get Started</button>
        </div>
        <button style={styles.menuBtn} onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={24} color="white" /> : <Menu size={24} color="white" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={styles.mobileMenu}>
          <p style={styles.mobileLink} onClick={() => { navigate('/login'); setMenuOpen(false) }}>Login</p>
          <p style={styles.mobileLink} onClick={() => { navigate('/register'); setMenuOpen(false) }}>Register</p>
        </div>
      )}

      {/* Hero */}
      <div style={styles.hero}>
        <div style={styles.heroOverlay} />
        <div style={styles.heroContent}>
          <div style={styles.heroBadge}>Kenya's #1 Spare Parts Marketplace</div>
          <h1 style={styles.heroTitle}>
            Find Genuine Spare Parts<br />
            <span style={styles.heroHighlight}>Fast. Safe. Verified.</span>
          </h1>
          <p style={styles.heroSubtitle}>
            Connect with verified dealers across Kenya. Search thousands of parts,
            chat with suppliers, and pay securely via M-Pesa.
          </p>

          {/* Hero Search */}
          <div style={styles.heroSearch}>
            <Search size={20} color="#999" />
            <input
              style={styles.heroSearchInput}
              placeholder="Search by part name, vehicle model, or brand..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && navigate('/register')}
            />
            <button style={styles.heroSearchBtn} onClick={() => navigate('/register')}>
              Search Parts
            </button>
          </div>

          <div style={styles.heroTags}>
            {['Toyota Mark X', 'BMW X3', 'Nissan Note', 'Honda Vezel', 'Subaru Forester'].map(tag => (
              <span key={tag} style={styles.heroTag} onClick={() => navigate('/register')}>{tag}</span>
            ))}
          </div>
        </div>

        <div style={styles.heroScroll} onClick={() => document.getElementById('stats-bar').scrollIntoView({ behavior: 'smooth' })}>
          <ChevronDown size={28} color="white" style={styles.bounceArrow} />
        </div>
      </div>

      {/* Stats Bar */}
      <div id="stats-bar" style={styles.statsBar}>
        <div style={styles.stat}>
          <p style={styles.statNumber}>{counters.dealers.toLocaleString()}+</p>
          <p style={styles.statLabel}>Verified Dealers</p>
        </div>
        <div style={styles.statDivider} />
        <div style={styles.stat}>
          <p style={styles.statNumber}>{counters.parts.toLocaleString()}+</p>
          <p style={styles.statLabel}>Parts Listed</p>
        </div>
        <div style={styles.statDivider} />
        <div style={styles.stat}>
          <p style={styles.statNumber}>{counters.customers.toLocaleString()}+</p>
          <p style={styles.statLabel}>Happy Customers</p>
        </div>
        <div style={styles.statDivider} />
        <div style={styles.stat}>
          <p style={styles.statNumber}>{counters.counties}</p>
          <p style={styles.statLabel}>Counties Covered</p>
        </div>
      </div>

      {/* How It Works */}
      <div id="how-it-works" style={styles.section}>
        <div style={styles.sectionBadge}>Simple Process</div>
        <h2 style={styles.sectionTitle}>How SpareLink Works</h2>
        <p style={styles.sectionSubtitle}>Get your genuine spare parts in three simple steps</p>
        <div style={styles.steps}>
          {[
            { num: '01', icon: <Search size={36} color="#c9a84c" />, title: 'Search', text: 'Search by part name, vehicle model or brand. Filter by price and location.' },
            { num: '02', icon: <MessageSquare size={36} color="#c9a84c" />, title: 'Connect', text: 'Message the dealer directly to confirm compatibility and arrange delivery.' },
            { num: '03', icon: <CreditCard size={36} color="#c9a84c" />, title: 'Pay & Receive', text: 'Pay securely via M-Pesa. Track your order until it arrives.' },
          ].map((step, i) => (
            <div key={i} style={styles.stepCard}>
              <div style={styles.stepNum}>{step.num}</div>
              <div style={styles.stepIconWrap}>{step.icon}</div>
              <h3 style={styles.stepTitle}>{step.title}</h3>
              <p style={styles.stepText}>{step.text}</p>
              {i < 2 && <div style={styles.stepConnector} />}
            </div>
          ))}
        </div>
      </div>

      {/* Features - Interactive */}
      <div id="features" style={styles.featuresSection}>
        <div style={styles.sectionBadge}>Why SpareLink</div>
        <h2 style={{ ...styles.sectionTitle, color: 'white' }}>Everything You Need</h2>
        <p style={{ ...styles.sectionSubtitle, color: '#aaa' }}>Built specifically for the Kenyan automotive market</p>

        <div style={styles.featuresLayout}>
          {/* Feature Tabs */}
          <div style={styles.featureTabs}>
            {features.map((f, i) => (
              <div
                key={i}
                style={{ ...styles.featureTab, ...(activeFeature === i ? styles.featureTabActive : {}) }}
                onClick={() => setActiveFeature(i)}
              >
                <span style={styles.featureTabTitle}>{f.title}</span>
              </div>
            ))}
          </div>

          {/* Feature Display */}
          <div style={styles.featureDisplay}>
            <div style={styles.featureIconWrap}>
              {features[activeFeature].icon}
            </div>
            <h3 style={styles.featureDisplayTitle}>{features[activeFeature].title}</h3>
            <p style={styles.featureDisplayText}>{features[activeFeature].text}</p>
            <button style={styles.featureBtn} onClick={() => navigate('/register')}>
              Get Started Free
            </button>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div style={styles.section}>
        <div style={styles.sectionBadge}>Testimonials</div>
        <h2 style={styles.sectionTitle}>What People Are Saying</h2>
        <p style={styles.sectionSubtitle}>Real feedback from buyers and dealers across Kenya</p>
        <div style={styles.testimonials}>
          {testimonials.map((t, i) => (
            <div key={i} style={styles.testimonialCard}>
              <div style={styles.stars}>
                {[1,2,3,4,5].map(s => <Star key={s} size={16} color="#c9a84c" fill="#c9a84c" />)}
              </div>
              <p style={styles.testimonialText}>"{t.text}"</p>
              <div style={styles.testimonialAuthor}>
                <div style={styles.testimonialAvatar}>
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p style={styles.testimonialName}>{t.name}</p>
                  <p style={styles.testimonialRole}>{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* For Dealers */}
      <div id="for-dealers" style={styles.dealersSection}>
        <div style={styles.dealersContent}>
          <div style={styles.sectionBadge}>For Dealers</div>
          <h2 style={styles.dealersTitle}>Grow Your Business with SpareLink</h2>
          <p style={styles.dealersText}>
            Join hundreds of verified dealers already reaching customers across Kenya.
            List your products, manage orders, and receive payments — all from one dashboard.
          </p>
          <div style={styles.dealersBenefits}>
            {[
              'Free to register and list products',
              'Reach buyers across all 47 counties',
              'Manage inventory and orders from your dashboard',
              'Receive payments directly via M-Pesa',
              'Build your reputation with verified reviews',
              'Get verified badge to boost customer trust',
            ].map((benefit, i) => (
              <div key={i} style={styles.benefit}>
                <div style={styles.benefitCheck}>✓</div>
                <span style={styles.benefitText}>{benefit}</span>
              </div>
            ))}
          </div>
          <button style={styles.dealersBtn} onClick={() => navigate('/register')}>
            Register as a Dealer
          </button>
        </div>
        <div style={styles.dealersVisual}>
          <div style={styles.dashboardPreview}>
            <div style={styles.previewHeader}>
              <div style={styles.previewDot} />
              <div style={styles.previewDot} />
              <div style={styles.previewDot} />
              <span style={styles.previewTitle}>Supplier Dashboard</span>
            </div>
            <div style={styles.previewStats}>
              {[
                { label: 'Products Listed', value: '24' },
                { label: 'Pending Orders', value: '8' },
                { label: 'Revenue (KES)', value: '142,500' },
              ].map((stat, i) => (
                <div key={i} style={styles.previewStat}>
                  <p style={styles.previewStatValue}>{stat.value}</p>
                  <p style={styles.previewStatLabel}>{stat.label}</p>
                </div>
              ))}
            </div>
            <div style={styles.previewOrders}>
              <p style={styles.previewOrdersTitle}>Recent Orders</p>
              {['BMW X3 Brake Pads', 'Toyota Mark X Alternator', 'Honda Vezel Gearbox'].map((item, i) => (
                <div key={i} style={styles.previewOrder}>
                  <span style={styles.previewOrderName}>{item}</span>
                  <span style={styles.previewOrderBadge}>New</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={styles.ctaSection}>
        <h2 style={styles.ctaTitle}>Ready to Find Your Parts?</h2>
        <p style={styles.ctaText}>
          Join thousands of Kenyans already buying and selling spare parts on SpareLink
        </p>
        <div style={styles.ctaButtons}>
          <button style={styles.ctaPrimary} onClick={() => navigate('/register')}>
            Create Free Account
          </button>
          <button style={styles.ctaSecondary} onClick={() => navigate('/login')}>
            Sign In
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <div style={styles.footerBrand}>
            <h3 style={styles.footerLogo}>SpareLink <span style={{ color: '#c9a84c' }}>Kenya</span></h3>
            <p style={styles.footerTagline}>Connecting Kenya's automotive ecosystem</p>
          </div>
          <div>
            <h4 style={styles.footerHeading}>Quick Links</h4>
            <p style={styles.footerLink} onClick={() => navigate('/login')}>Login</p>
            <p style={styles.footerLink} onClick={() => navigate('/register')}>Register</p>
            <p style={styles.footerLink} onClick={() => document.getElementById('how-it-works').scrollIntoView({ behavior: 'smooth' })}>How It Works</p>
          </div>
          <div>
            <h4 style={styles.footerHeading}>Legal</h4>
            <p style={styles.footerLink}>Privacy Policy</p>
            <p style={styles.footerLink}>Terms of Service</p>
            <p style={styles.footerLink}>Data Protection</p>
          </div>
          <div>
            <h4 style={styles.footerHeading}>Contact</h4>
            <p style={styles.footerLink}>support@sparelink.co.ke</p>
            <p style={styles.footerLink}>+254 706055453</p>
            <p style={styles.footerLink}>Nairobi, Kenya</p>
          </div>
        </div>
        <div style={styles.footerBottom}>
          <p>© 2025 SpareLink Kenya. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

const styles = {
  page: { fontFamily: "'Segoe UI', sans-serif", color: '#333', overflowX: 'hidden' },
  navbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 4rem', background: 'transparent', position: 'fixed', top: 0, width: '100%', zIndex: 1000, transition: 'all 0.3s', boxSizing: 'border-box' },
  navbarScrolled: { background: '#1a1a2e', boxShadow: '0 2px 20px rgba(0,0,0,0.3)' },
  logo: { color: 'white', fontSize: '1.5rem', margin: 0, fontWeight: 'bold' },
  logoAccent: { color: '#c9a84c' },
  navLinks: { display: 'flex', alignItems: 'center', gap: '2rem' },
  navLink: { color: 'white', cursor: 'pointer', fontSize: '0.95rem', opacity: 0.85 },
  navLogin: { padding: '0.5rem 1.25rem', background: 'transparent', color: 'white', border: '1px solid rgba(255,255,255,0.5)', borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem' },
  navRegister: { padding: '0.5rem 1.25rem', background: '#c9a84c', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 'bold' },
  menuBtn: { display: 'none', background: 'none', border: 'none', cursor: 'pointer' },
  mobileMenu: { position: 'fixed', top: '70px', left: 0, right: 0, background: '#1a1a2e', padding: '1rem', zIndex: 999 },
  mobileLink: { color: 'white', padding: '1rem', borderBottom: '1px solid #333', cursor: 'pointer' },
  hero: { minHeight: '100vh', background: 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 40%, #0f3460 100%)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', padding: '0 4rem', position: 'relative', overflow: 'hidden' },
  heroOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'radial-gradient(ellipse at 80% 50%, rgba(201,168,76,0.1) 0%, transparent 60%)' },
  heroContent: { position: 'relative', zIndex: 1, maxWidth: '750px', paddingTop: '5rem' },
  heroBadge: { display: 'inline-block', background: 'rgba(201,168,76,0.2)', color: '#c9a84c', padding: '0.4rem 1rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '1.5rem', border: '1px solid rgba(201,168,76,0.3)' },
  heroTitle: { fontSize: '3.5rem', color: 'white', lineHeight: '1.15', marginBottom: '1.5rem', fontWeight: '800' },
  heroHighlight: { color: '#c9a84c' },
  heroSubtitle: { fontSize: '1.15rem', color: '#aaa', marginBottom: '2.5rem', lineHeight: '1.7', maxWidth: '600px' },
  heroSearch: { display: 'flex', alignItems: 'center', background: 'white', borderRadius: '8px', padding: '0.5rem 0.5rem 0.5rem 1rem', gap: '0.75rem', marginBottom: '1.5rem', maxWidth: '620px' },
  heroSearchInput: { flex: 1, border: 'none', outline: 'none', fontSize: '1rem', color: '#333' },
  heroSearchBtn: { padding: '0.7rem 1.5rem', background: '#c9a84c', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', whiteSpace: 'nowrap' },
  heroTags: { display: 'flex', gap: '0.5rem', flexWrap: 'wrap' },
  heroTag: { background: 'rgba(255,255,255,0.1)', color: '#ccc', padding: '0.3rem 0.75rem', borderRadius: '20px', fontSize: '0.8rem', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.15)' },
  heroScroll: { position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', cursor: 'pointer', animation: 'bounce 2s infinite' },
  bounceArrow: { animation: 'bounce 1.5s infinite' },
  statsBar: { display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#c9a84c', padding: '2.5rem 4rem', gap: '4rem' },
  stat: { textAlign: 'center' },
  statNumber: { fontSize: '2.25rem', fontWeight: '800', color: 'white', margin: 0 },
  statLabel: { color: '#1a1a2e', fontWeight: '600', margin: '0.25rem 0 0', fontSize: '0.9rem' },
  statDivider: { width: '1px', height: '50px', background: 'rgba(255,255,255,0.35)' },
  section: { padding: '6rem 4rem', textAlign: 'center', background: 'white' },
  sectionBadge: { display: 'inline-block', background: 'rgba(201,168,76,0.15)', color: '#c9a84c', padding: '0.35rem 1rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '1rem', border: '1px solid rgba(201,168,76,0.3)' },
  sectionTitle: { fontSize: '2.25rem', color: '#1a1a2e', marginBottom: '0.75rem', fontWeight: '800' },
  sectionSubtitle: { color: '#888', marginBottom: '3.5rem', fontSize: '1.05rem', maxWidth: '500px', margin: '0 auto 3.5rem' },
  steps: { display: 'flex', justifyContent: 'center', alignItems: 'flex-start', gap: '0', maxWidth: '900px', margin: '0 auto', position: 'relative' },
  stepCard: { background: '#f9f9f9', padding: '2.5rem 2rem', borderRadius: '12px', width: '260px', textAlign: 'center', position: 'relative', flex: 1 },
  stepNum: { position: 'absolute', top: '-15px', left: '50%', transform: 'translateX(-50%)', background: '#1a1a2e', color: '#c9a84c', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.8rem' },
  stepIconWrap: { marginBottom: '1rem' },
  stepTitle: { color: '#1a1a2e', margin: '0.75rem 0 0.5rem', fontWeight: '700', fontSize: '1.1rem' },
  stepText: { color: '#777', fontSize: '0.9rem', lineHeight: '1.6' },
  stepConnector: { position: 'absolute', right: '-20px', top: '50%', transform: 'translateY(-50%)', width: '40px', height: '2px', background: '#c9a84c', zIndex: 1 },
  featuresSection: { padding: '6rem 4rem', background: '#1a1a2e', textAlign: 'center' },
  featuresLayout: { display: 'flex', gap: '3rem', maxWidth: '1000px', margin: '0 auto', textAlign: 'left' },
  featureTabs: { display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '280px', flexShrink: 0 },
  featureTab: { padding: '1rem 1.25rem', borderRadius: '8px', cursor: 'pointer', color: '#aaa', background: 'rgba(255,255,255,0.05)', transition: 'all 0.2s', border: '1px solid transparent' },
  featureTabActive: { background: 'rgba(201,168,76,0.15)', color: '#c9a84c', border: '1px solid rgba(201,168,76,0.3)' },
  featureTabTitle: { fontWeight: '600', fontSize: '0.9rem' },
  featureDisplay: { flex: 1, background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '3rem', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', border: '1px solid rgba(255,255,255,0.1)' },
  featureIconWrap: { marginBottom: '1.5rem' },
  featureDisplayTitle: { color: 'white', fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem' },
  featureDisplayText: { color: '#aaa', lineHeight: '1.7', fontSize: '1rem', marginBottom: '2rem' },
  featureBtn: { padding: '0.75rem 1.75rem', background: '#c9a84c', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' },
  testimonials: { display: 'flex', gap: '2rem', maxWidth: '1000px', margin: '0 auto' },
  testimonialCard: { flex: 1, background: '#f9f9f9', padding: '2rem', borderRadius: '12px', textAlign: 'left', border: '1px solid #eee' },
  stars: { display: 'flex', gap: '0.25rem', marginBottom: '1rem' },
  testimonialText: { color: '#555', lineHeight: '1.7', marginBottom: '1.5rem', fontSize: '0.95rem', fontStyle: 'italic' },
  testimonialAuthor: { display: 'flex', alignItems: 'center', gap: '0.75rem' },
  testimonialAvatar: { width: '42px', height: '42px', background: '#1a1a2e', color: '#c9a84c', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.1rem', flexShrink: 0 },
  testimonialName: { fontWeight: '700', color: '#1a1a2e', margin: 0 },
  testimonialRole: { color: '#999', fontSize: '0.8rem', margin: 0 },
  dealersSection: { display: 'flex', gap: '4rem', padding: '6rem 4rem', background: '#f9f9f9', alignItems: 'center' },
  dealersContent: { flex: 1 },
  dealersTitle: { fontSize: '2.25rem', color: '#1a1a2e', fontWeight: '800', marginBottom: '1rem' },
  dealersText: { color: '#666', lineHeight: '1.7', marginBottom: '2rem', fontSize: '1rem' },
  dealersBenefits: { display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' },
  benefit: { display: 'flex', alignItems: 'center', gap: '0.75rem' },
  benefitCheck: { width: '24px', height: '24px', background: '#c9a84c', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.8rem', flexShrink: 0 },
  benefitText: { color: '#444', fontSize: '0.95rem' },
  dealersBtn: { padding: '0.9rem 2rem', background: '#1a1a2e', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem' },
  dealersVisual: { flex: 1, display: 'flex', justifyContent: 'center' },
  dashboardPreview: { background: '#1a1a2e', borderRadius: '12px', padding: '1.5rem', width: '360px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' },
  previewHeader: { display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' },
  previewDot: { width: '12px', height: '12px', borderRadius: '50%', background: '#c9a84c' },
  previewTitle: { color: '#c9a84c', fontWeight: 'bold', fontSize: '0.9rem', marginLeft: '0.5rem' },
  previewStats: { display: 'flex', gap: '1rem', marginBottom: '1.5rem' },
  previewStat: { flex: 1, background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '8px', textAlign: 'center' },
  previewStatValue: { color: '#c9a84c', fontWeight: 'bold', fontSize: '1.25rem', margin: 0 },
  previewStatLabel: { color: '#888', fontSize: '0.7rem', margin: '0.25rem 0 0' },
  previewOrders: { background: 'rgba(255,255,255,0.05)', borderRadius: '8px', padding: '1rem' },
  previewOrdersTitle: { color: '#c9a84c', fontWeight: 'bold', fontSize: '0.85rem', marginBottom: '0.75rem' },
  previewOrder: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' },
  previewOrderName: { color: '#ccc', fontSize: '0.8rem' },
  previewOrderBadge: { background: 'rgba(201,168,76,0.2)', color: '#c9a84c', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 'bold' },
  ctaSection: { padding: '6rem 4rem', textAlign: 'center', background: 'linear-gradient(135deg, #1a1a2e, #0f3460)' },
  ctaTitle: { fontSize: '2.5rem', color: 'white', fontWeight: '800', marginBottom: '1rem' },
  ctaText: { color: '#aaa', marginBottom: '2.5rem', fontSize: '1.05rem' },
  ctaButtons: { display: 'flex', gap: '1rem', justifyContent: 'center' },
  ctaPrimary: { padding: '1rem 2.5rem', background: '#c9a84c', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '1rem', fontWeight: 'bold' },
  ctaSecondary: { padding: '1rem 2.5rem', background: 'transparent', color: 'white', border: '2px solid rgba(255,255,255,0.4)', borderRadius: '6px', cursor: 'pointer', fontSize: '1rem' },
  footer: { background: '#0a0a12', color: 'white' },
  footerContent: { display: 'flex', gap: '4rem', padding: '4rem', justifyContent: 'space-between' },
  footerBrand: { flex: 2 },
  footerLogo: { fontSize: '1.25rem', marginBottom: '0.5rem' },
  footerTagline: { color: '#666', fontSize: '0.9rem' },
  footerHeading: { color: '#c9a84c', marginBottom: '1rem', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' },
  footerLink: { color: '#666', marginBottom: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' },
  footerBottom: { borderTop: '1px solid #1a1a1a', padding: '1.5rem 4rem', textAlign: 'center', color: '#444', fontSize: '0.85rem' },
}