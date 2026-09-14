import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Flower2 } from 'lucide-react'

const EASE_ENTRANCE = 'cubic-bezier(0.16, 1, 0.3, 1)'

const VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260819_212700_3bb9329b-5c50-4257-a09b-ca85cf3654a3.mp4'

const BRAND = 'Nigelle Royale'
const LAUNCH_DATE = new Date('2026-10-13T10:00:00')

function scrollToForm() {
  document.getElementById('inscription')?.scrollIntoView({ behavior: 'smooth' })
}

function useInView<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.2 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return [ref, inView] as const
}

function useCountdown(target: Date) {
  const [timeLeft, setTimeLeft] = useState(() => target.getTime() - Date.now())

  useEffect(() => {
    const id = window.setInterval(() => {
      setTimeLeft(target.getTime() - Date.now())
    }, 1000)
    return () => window.clearInterval(id)
  }, [target])

  const clamped = Math.max(0, timeLeft)
  const days = Math.floor(clamped / (1000 * 60 * 60 * 24))
  const hours = Math.floor((clamped / (1000 * 60 * 60)) % 24)
  const minutes = Math.floor((clamped / (1000 * 60)) % 60)
  const seconds = Math.floor((clamped / 1000) % 60)

  return { days, hours, minutes, seconds }
}

function App() {
  const [heroMounted, setHeroMounted] = useState(false)
  const [badgeMounted, setBadgeMounted] = useState(false)

  useEffect(() => {
    const t1 = window.setTimeout(() => setBadgeMounted(true), 100)
    const t2 = window.setTimeout(() => setHeroMounted(true), 300)
    return () => {
      window.clearTimeout(t1)
      window.clearTimeout(t2)
    }
  }, [])

  const heroEnter = heroMounted
    ? 'opacity-100 translate-y-0'
    : 'opacity-0 translate-y-8'

  return (
    <div className="bg-black">
      {/* IDENTITE — logo + repère collection, sans menu */}
      <div
        className={`fixed top-0 left-0 w-full z-50 px-6 md:px-10 h-16 md:h-20 flex items-center justify-between transition-all duration-700 ${
          badgeMounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-3'
        }`}
        style={{ transitionTimingFunction: EASE_ENTRANCE }}
      >
        <span className="italic font-instrument text-2xl md:text-3xl tracking-tight text-white">
          {BRAND}
        </span>
        <span className="text-white/50 text-xs tracking-[0.35em] uppercase">
          2026 &mdash; 2027
        </span>
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
            Notre huile de nigelle arrive bient&ocirc;t. R&eacute;servez votre place avant
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

      {/* GALERIE */}
      <GallerySection />

      {/* COUNTDOWN */}
      <CountdownSection />

      {/* INSCRIPTION */}
      <SignupSection />

      {/* FOOTER */}
      <Footer />
    </div>
  )
}

function GallerySection() {
  const [ref, inView] = useInView<HTMLDivElement>()

  return (
    <section
      ref={ref}
      className="relative w-full bg-black py-32 md:py-40 px-6 overflow-hidden flex items-center justify-center min-h-[80vh] md:min-h-screen"
    >
      {/* mot géant en fond */}
      <span
        aria-hidden
        className={`absolute font-instrument text-[5.5rem] sm:text-[9rem] md:text-[13rem] lg:text-[16rem] leading-none whitespace-nowrap select-none pointer-events-none transition-all duration-[1400ms] ${
          inView ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
        style={{
          transitionTimingFunction: EASE_ENTRANCE,
          color: 'transparent',
          WebkitTextStroke: '1px rgba(255,255,255,0.12)',
        }}
      >
        NIGELLE
      </span>

      {/* flacon */}
      <img
        src="/images/bottle-floating.jpeg"
        alt="Flacon Nigelle Royale"
        className={`relative z-10 w-[200px] sm:w-[240px] md:w-[300px] rounded-md shadow-2xl shadow-black/70 transition-all duration-[1100ms] ${
          inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
        style={{
          transitionTimingFunction: EASE_ENTRANCE,
          transitionDelay: inView ? '250ms' : '0ms',
        }}
      />

      {/* légende */}
      <div
        className={`absolute z-10 bottom-10 right-6 md:bottom-16 md:right-16 max-w-[220px] text-right transition-all duration-[1000ms] ${
          inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}
        style={{
          transitionTimingFunction: EASE_ENTRANCE,
          transitionDelay: inView ? '550ms' : '0ms',
        }}
      >
        <p className="text-white/45 text-[11px] uppercase tracking-[0.3em] mb-3">
          L&apos;essentiel
        </p>
        <p className="text-white/60 text-sm md:text-base">
          Press&eacute;e &agrave; froid, sans additifs. Une goutte suffit pour r&eacute;v&eacute;ler
          tout ce que la nigelle a &agrave; offrir.
        </p>
      </div>
    </section>
  )
}

function CountdownSection() {
  const [ref, inView] = useInView<HTMLDivElement>()
  const { days, hours, minutes, seconds } = useCountdown(LAUNCH_DATE)

  const units = [
    { value: days, label: 'Jours' },
    { value: hours, label: 'Heures' },
    { value: minutes, label: 'Min' },
    { value: seconds, label: 'Sec' },
  ]

  return (
    <section
      ref={ref}
      className="relative w-full bg-black py-24 md:py-32 px-6 flex flex-col items-center text-center"
    >
      <p
        className={`text-white/45 text-[11px] uppercase tracking-[0.3em] mb-4 transition-all duration-[900ms] ${
          inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}
        style={{ transitionTimingFunction: EASE_ENTRANCE }}
      >
        Pr&eacute;commandes
      </p>
      <h2
        className={`font-instrument text-white text-4xl md:text-6xl mb-4 transition-all duration-[1100ms] ${
          inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
        style={{
          transitionTimingFunction: EASE_ENTRANCE,
          transitionDelay: inView ? '150ms' : '0ms',
          textShadow: inView ? '0 0 40px rgba(255,255,255,0.18)' : '0 0 0 rgba(255,255,255,0)',
        }}
      >
        Lancement des pr&eacute;commandes
      </h2>
      <p
        className={`text-white/60 text-base md:text-lg mb-14 max-w-md transition-all duration-[1100ms] ${
          inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
        style={{
          transitionTimingFunction: EASE_ENTRANCE,
          transitionDelay: inView ? '300ms' : '0ms',
        }}
      >
        Compte &agrave; rebours avant l&apos;ouverture des commandes.
      </p>

      <div
        className={`flex items-start gap-4 sm:gap-8 transition-all duration-[1100ms] ${
          inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
        style={{
          transitionTimingFunction: EASE_ENTRANCE,
          transitionDelay: inView ? '450ms' : '0ms',
        }}
      >
        {units.map((u, i) => (
          <div key={u.label} className="flex items-start">
            <div className="flex flex-col items-center w-16 sm:w-20">
              <span className="font-instrument text-white text-5xl sm:text-6xl md:text-7xl tabular-nums">
                {String(u.value).padStart(2, '0')}
              </span>
              <span className="text-white/40 text-[10px] uppercase tracking-[0.25em] mt-2">
                {u.label}
              </span>
            </div>
            {i < units.length - 1 && (
              <span className="font-instrument text-white/25 text-5xl sm:text-6xl md:text-7xl mx-1 sm:mx-2 select-none">
                :
              </span>
            )}
          </div>
        ))}
      </div>
    </section>
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
              Vous &ecirc;tes sur la liste
            </h2>
            <p className="text-white/60">
              On vous &eacute;crit d&egrave;s l&apos;ouverture des r&eacute;servations.
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
              {BRAND} &mdash; huile de nigelle 100&nbsp;% pure, press&eacute;e &agrave; froid.
              Premi&egrave;re s&eacute;rie limit&eacute;e. Laissez vos coordonn&eacute;es, on vous pr&eacute;vient &agrave;
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
                placeholder="Pourquoi &ecirc;tes-vous int&eacute;ress&eacute; ?"
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
                Aucun spam &mdash; seulement l&apos;annonce du lancement.
              </p>
            </form>
          </>
        )}
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="w-full bg-black border-t border-white/10 px-6 py-8 text-center">
      <p className="text-white/35 text-xs max-w-lg mx-auto leading-relaxed">
        Ce site est une page de pr&eacute;commande / manifestation d&apos;int&eacute;r&ecirc;t. Aucune
        commande ferme n&apos;est trait&eacute;e &agrave; ce stade.
        <br />
        &copy; 2026 {BRAND} &mdash; Tous droits r&eacute;serv&eacute;s.
      </p>
    </footer>
  )
}

export default App
