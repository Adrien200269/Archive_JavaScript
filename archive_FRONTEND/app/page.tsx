import Link from 'next/link'

export default function SplashPage() {
  return (
    <main className="page" style={{ justifyContent: 'center', minHeight: '100vh' }}>
      <div className="blob-container">
        <div className="blob blob-tl" />
        <div className="blob blob-br" />
      </div>

      <div className="fade-up d1" style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <div className="splash-logo">
          archive<br />outfitters
        </div>
        <div className="logo-tagline">Style Your Vibe</div>
      </div>

      <Link
        href="/login"
        className="fade-up d3"
        style={{
          marginTop: '3rem',
          position: 'relative',
          zIndex: 1,
          fontSize: '0.75rem',
          letterSpacing: '0.18em',
          color: '#aaa',
          textDecoration: 'none',
          textTransform: 'uppercase',
        }}
      >
        Enter →
      </Link>
    </main>
  )
}
