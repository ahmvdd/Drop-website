import { useEffect, useState, type FormEvent } from 'react'
import { Flower2 } from 'lucide-react'

const EASE_ENTRANCE = 'cubic-bezier(0.16, 1, 0.3, 1)'
const EASE_OVERLAY = 'cubic-bezier(0.76, 0, 0.24, 1)'

const VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260819_212700_3bb9329b-5c50-4257-a09b-ca85cf3654a3.mp4'

const BRAND = 'Nigelle Royale'
const MENU_LINKS = ['Accueil', "L'huile", 'Histoire', 'Rejoindre']

function scrollToForm() {
  document.getElementById('inscription')?.scrollIntoView({ behavior: 'smooth' })
}

function App() {
  const [navMounted, setNavMounted] = useState(false)
  const [heroMounted, setHeroMounted] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const t1 = window.setTimeout(() => setNavMounted(true), 100)
    const t2 = window.setTimeout(() => setHeroMounted(true), 300)
    return () => {
      window.clearTimeout(t1)
      window.clearTimeout(t2)
    }
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  const enter = navMounted
    ? 'opacity-100 translate-y-0'
    : 'opacity-0 -translate-y-4'

  const heroEnter = heroMounted
    ? 'opacity-100 translate-y-0'
    : 'opacity-0 translate-y-8'

  return (
    <div className="bg-black">
      {/* NAVBAR */}
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          scrolled ? 'bg-black/80 backdrop-blur-md' : 'bg-transparent'
        }`}
      >
        {/* grid 3 colonnes égales → le pill reste centré quelle que soit la largeur du logo */}
        <div className="max-w-[1440px] mx-auto px-6 md:px-10 grid grid-cols-3 items-center h-16 md:h-20">
          {/* Logo */}
          <a
            href="#"
            className={`justify-self-start z-50 italic font-instrument text-2xl md:text-3xl tracking-tight text-white transition-all duration-700 ${enter}`}
            style={{ transitionTimingFunction: EASE_ENTRANCE, transitionDelay: '0ms' }}
          >
            {BRAND}
          </a>

          {/* Pill — desktop */}
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            className={`hidden md:flex justify-self-center px-5 py-2 rounded-full border border-white/20 text-white/90 text-sm hover:bg-white/10 items-center gap-2 transition-all duration-700 ${enter}`}
            style={{
              transitionTimingFunction: EASE_ENTRANCE,
              transitionDelay: navMounted ? '200ms' : '0ms',
            }}
          >
            {menuOpen ? 'Fermer' : 'Naviguer'}
          </button>

          {/* colonne centrale vide sur mobile (le pill est caché) */}
          <span aria-hidden className="md:hidden" />

          {/* Hamburger — mobile */}
          <button
            type="button"
            aria-label="Ouvrir le menu"
            onClick={() => setMenuOpen((o) => !o)}
            className={`md:hidden justify-self-end w-8 h-8 flex flex-col items-center justify-center gap-1.5 transition-all duration-700 ${enter}`}
            style={{
              transitionTimingFunction: EASE_ENTRANCE,
              transitionDelay: navMounted ? '200ms' : '0ms',
            }}
          >
            <span
              className={`w-6 h-[2px] bg-white transition-transform duration-500 ${
                menuOpen ? 'rotate-45 translate-y-[4px]' : ''
              }`}
              style={{ transitionTimingFunction: EASE_OVERLAY }}
            />
            <span
              className={`w-6 h-[2px] bg-white transition-transform duration-500 ${
                menuOpen ? '-rotate-45 -translate-y-[4px]' : ''
              }`}
              style={{ transitionTimingFunction: EASE_OVERLAY }}
            />
          </button>
        </div>
      </nav>

      {/* OVERLAY MENU */}
      <div
        className={`fixed inset-0 z-40 bg-black flex flex-col items-center justify-center transition-all duration-700 ${
          menuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        style={{ transitionTimingFunction: EASE_OVERLAY }}
      >
        <div className="flex flex-col items-center gap-8">
          {MENU_LINKS.map((label, i) => (
            <a
              key={label}
              href="#"
              onClick={(e) => {
                e.preventDefault()
                setMenuOpen(false)
                if (label === 'Rejoindre') setTimeout(scrollToForm, 120)
              }}
              className={`text-white font-instrument text-4xl md:text-6xl hover:opacity-60 transition-all duration-[600ms] ${
                menuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
              style={{
                transitionTimingFunction: EASE_OVERLAY,
                transitionDelay: menuOpen ? `${150 + i * 80}ms` : '0ms',
              }}
            >
              {label}
            </a>
          ))}
        </div>
      </div>

      {/* HERO */}
      <section className="relative w-full h-screen overflow-hidden flex items-end justify-center">
        <div
          className={`absolute inset-0 bg-black transition-all duration-[1400ms] ${
            heroMounted ? 'scale-100 opacity-100' : 'scale-105 opacity-0'
          }`}
          style={{ transitionTimingFunction: EASE_ENTRANCE }}
        >
          <video
            src={VIDEO_URL}
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          />
        </div>

        <div className="relative z-10 text-center px-6 pb-16 md:pb-24 max-w-4xl mx-auto">
          <h1
            className={`font-instrument text-white text-[2.5rem] leading-[0.95] sm:text-5xl md:text-6xl lg:text-7xl mb-5 md:mb-6 transition-all duration-[900ms] ${heroEnter}`}
            style={{
              transitionTimingFunction: EASE_ENTRANCE,
              transitionDelay: heroMounted ? '400ms' : '0ms',
            }}
          >
            L&apos;or noir<br className="hidden sm:block" /> de la nature
          </h1>
          <p
            className={`text-white/70 text-base md:text-lg mb-8 md:mb-10 max-w-md mx-auto transition-all duration-[900ms] ${heroEnter}`}
            style={{
              transitionTimingFunction: EASE_ENTRANCE,
              transitionDelay: heroMounted ? '600ms' : '0ms',
            }}
          >
            Notre huile de nigelle arrive bientôt. Réservez votre place avant
            l&apos;ouverture.
          </p>
          <button
            type="button"
            onClick={scrollToForm}
            className={`inline-block px-8 py-3.5 bg-white text-black text-sm md:text-base font-medium rounded-full hover:bg-white/90 transition-all duration-[900ms] ${heroEnter}`}
            style={{
              transitionTimingFunction: EASE_ENTRANCE,
              transitionDelay: heroMounted ? '800ms' : '0ms',
            }}
          >
            Rejoindre la liste
          </button>
        </div>
      </section>

      {/* INSCRIPTION */}
      <SignupSection />
    </div>
  )
}

function SignupSection() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [interest, setInterest] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle')
  const [error, setError] = useState('')

  async function submit(e: FormEvent) {
    e.preventDefault()
    setStatus('loading')
    setError('')
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ name, email, interest }),
      })
      const body = (await res.json().catch(() => ({}))) as { error?: string }
      if (!res.ok) throw new Error(body.error || 'Une erreur est survenue.')
      setStatus('ok')
    } catch (err) {
      setStatus('error')
      setError(err instanceof Error ? err.message : 'Erreur réseau.')
    }
  }

  const field =
    'w-full rounded-lg border border-white/15 bg-white/[0.03] px-4 py-3 text-white placeholder-white/35 outline-none transition-colors focus:border-white/45'

  return (
    <section
      id="inscription"
      className="relative min-h-screen w-full bg-black flex items-center justify-center px-6 py-24"
    >
      <div className="w-full max-w-md">
        {status === 'ok' ? (
          <div className="text-center">
            <Flower2 className="mx-auto mb-5 h-9 w-9 text-white/80" />
            <h2 className="font-instrument text-white text-4xl md:text-5xl mb-3">
              Vous êtes sur la liste
            </h2>
            <p className="text-white/60">
              On vous écrit dès l&apos;ouverture des réservations.
            </p>
          </div>
        ) : (
          <>
            <p className="text-white/45 text-[11px] uppercase tracking-[0.3em] mb-4">
              Liste d&apos;attente
            </p>
            <h2 className="font-instrument text-white text-4xl md:text-5xl mb-3">
              Rejoignez la liste
            </h2>
            <p className="text-white/60 text-base mb-9">
              {BRAND} — huile de nigelle 100&nbsp;% pure, pressée à froid.
              Première série limitée. Laissez vos coordonnées, on vous prévient à
              l&apos;ouverture.
            </p>

            <form onSubmit={submit} className="space-y-4">
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Votre nom"
                autoComplete="name"
                className={field}
              />
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Votre email"
                autoComplete="email"
                className={field}
              />
              <textarea
                value={interest}
                onChange={(e) => setInterest(e.target.value)}
                rows={3}
                placeholder="Pourquoi êtes-vous intéressé ?"
                className={`${field} resize-none`}
              />

              {status === 'error' && (
                <p className="text-sm text-red-400">{error}</p>
              )}

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full rounded-full bg-white px-8 py-3.5 text-sm md:text-base font-medium text-black hover:bg-white/90 disabled:opacity-60"
              >
                {status === 'loading' ? 'Envoi…' : 'Je m’inscris'}
              </button>
              <p className="text-xs text-white/35">
                Aucun spam — seulement l&apos;annonce du lancement.
              </p>
            </form>
          </>
        )}
      </div>
    </section>
  )
}

export default App
