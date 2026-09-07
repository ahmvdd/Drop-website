# Nigelle Royale — landing + liste d'attente

Base : landing luxe une page (React 18 + TypeScript + Vite + Tailwind 3),
`lucide-react` uniquement pour `Flower2`. La spec visuelle d'origine ("Aurevon")
est conservée plus bas comme référence.

## État actuel (`src/App.tsx`)

- **Navbar** + **overlay menu** : inchangés, rebrandés `Nigelle Royale`
  (pill `Naviguer` / `Fermer`, liens `Accueil / L'huile / Histoire / Rejoindre`).
  Le lien `Rejoindre` défile vers le formulaire.
- **Hero** : entrée vidéo plein écran (identique à la spec d'origine), titre
  Instrument Serif « L'or noir / de la nature », sous-texte FR, CTA
  « Rejoindre la liste » qui défile vers `#inscription`.
  Aucune animation de scroll, pas de révélation produit.
- **Section `#inscription`** : formulaire simple (nom, email, « Pourquoi
  êtes-vous intéressé ? »). POST `/api/waitlist`, état de succès inline.

## Backend — liste d'attente (`server/index.mjs`)

Zéro dépendance : `node:http` + `node:sqlite` (Node ≥ 22.5). Base : `server/waitlist.db`
(git-ignorée).

| Méthode | Route | Détail |
|---|---|---|
| `POST` | `/api/waitlist` | corps `{ name, email, interest }` → insert (dédup par email) |
| `GET` | `/api/waitlist?key=<ADMIN_KEY>` | liste JSON des inscrits |
| `GET` | `/api/waitlist.csv?key=<ADMIN_KEY>` | export CSV |

Env : `PORT` (8787), `ADMIN_KEY` (`nigelle-dev`), `CORS_ORIGIN` (`http://localhost:5173`).

### Lancer

```bash
npm run dev:all      # front (5173) + API (8787) ensemble
# ou séparément :
npm run server
npm run dev
```

En dev, Vite proxy `/api` → `http://localhost:8787` (`vite.config.ts`).
Voir les inscrits : `http://localhost:8787/api/waitlist?key=nigelle-dev`

---

## Spec visuelle d'origine (référence)

## Base

- Page title: **Aurevon**
- Root wrapper: `bg-black`
- `html, body { overflow-x: hidden }`
- Global reset: `margin: 0; padding: 0; box-sizing: border-box`

### Fonts

Load Google Fonts exactly:

```
https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap
```

Utility: `.font-instrument { font-family: 'Instrument Serif', serif; }`

Instrument Serif only for the hero H1 and overlay nav links. Logo, nav pill, body copy
and CTA use Tailwind's default sans.

### Easing

- Entrance: `cubic-bezier(0.16, 1, 0.3, 1)`
- Menu overlay / hamburger morph: `cubic-bezier(0.76, 0, 0.24, 1)`

---

## Navbar (fixed)

`fixed top-0 left-0 w-full z-50`. Transparent until `window.scrollY > 40`, then
`bg-black/80 backdrop-blur-md`. Transition `duration-500`.

Inner bar: `max-w-[1440px] mx-auto px-6 md:px-10 flex items-center justify-between h-16 md:h-20`.

- **Left — logo**: text link "Aurevon", `text-white text-xl md:text-2xl font-semibold tracking-tight z-50`.
- **Center (hidden md:flex)** — pill: `px-5 py-2 rounded-full border border-white/20 text-white/90 text-sm hover:bg-white/10`, `items-center gap-2`. Label `Navigate` when closed, `Close` when overlay open. Toggles overlay.
- **Right (hidden md:flex)** — `Flower2`, `w-7 h-7 text-white/90`.
- **Right mobile (md:hidden)** — hamburger `w-8 h-8`, `flex-col items-center justify-center gap-1.5`, `aria-label="Toggle menu"`. Two bars `w-6 h-[2px] bg-white`. Open: top `rotate-45 translate-y-[4px]`, bottom `-rotate-45 -translate-y-[4px]`. Morph `duration-500` overlay easing.

### Navbar entrance

After 100ms set `mounted`. Elements start `opacity-0 -translate-y-4`, end `opacity-100 translate-y-0`. `duration-700` + entrance easing. Delays when mounted: logo 0ms, Navigate/hamburger 200ms, flower 400ms.

When overlay open: `document.body.style.overflow = 'hidden'`; restore on close.

---

## Full-screen overlay menu

`fixed inset-0 z-40 bg-black` (under navbar z-50). Closed `opacity-0 invisible`, open
`opacity-100 visible`. Transition `duration-700` + overlay easing. Center content:
`flex flex-col items-center justify-center`.

Links stacked `gap-8`, centered: **Home / Story / Collection / Inquire**. Each:
`href="#"`, `text-white font-instrument text-4xl md:text-6xl hover:opacity-60`.
Closed `opacity-0 translate-y-6`, open `opacity-100 translate-y-0`. Duration 600ms,
overlay easing. Stagger opening `150 + index * 80` ms. Delay 0 when closing. Click closes.

---

## Hero (full viewport)

`<section class="relative w-full h-screen overflow-hidden flex items-end justify-center">`

### Background video (exact URL)

```
https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260819_212700_3bb9329b-5c50-4257-a09b-ca85cf3654a3.mp4
```

Wrapper `absolute inset-0`. Starts `scale-105 opacity-0`, after 300ms mounted →
`scale-100 opacity-100`. Transition `duration-[1400ms]` + entrance easing.

`<video>`: that src, `autoPlay muted loop playsInline`, `class="w-full h-full object-cover"`.
No overlay gradient in the base spec.

### Foreground (bottom-centered)

`relative z-10 text-center px-6 pb-16 md:pb-24 max-w-4xl mx-auto`

- **H1** (Instrument Serif): `font-instrument text-white text-[2.5rem] leading-[0.95] sm:text-5xl md:text-6xl lg:text-7xl mb-5 md:mb-6`
  Copy: `A carefully curated<br class="hidden sm:block" /> collection beyond compare`
- **Subcopy**: `text-white/70 text-base md:text-lg mb-8 md:mb-10 max-w-md mx-auto` — "Reserve your place in our private gallery."
- **CTA**: `<a href="#">` "Join the waitlist" — `inline-block px-8 py-3.5 bg-white text-black text-sm md:text-base font-medium rounded-full hover:bg-white/90`

### Hero text/CTA entrance

Start `opacity-0 translate-y-8`, end `opacity-100 translate-y-0`. `duration-900` +
entrance easing. Mounted after 300ms, then delays: H1 400ms, subcopy 600ms, CTA 800ms.

---

## Responsive checklist

| Breakpoint | Behavior |
|---|---|
| mobile | Nav 64px, px-24. Hamburger only. Hero pb-64. H1 2.5rem / lh 0.95, no forced break. Subcopy text-base, CTA text-sm. Overlay links text-4xl. |
| sm (640) | H1 text-5xl; H1 line break appears. |
| md (768) | Nav 80px, px-40. Desktop: logo \| Navigate pill \| flower. Overlay links text-6xl. Hero pb-24. H1 text-6xl, mb-6. Subcopy text-lg, mb-10. CTA text-base. |
| lg (1024) | H1 text-7xl. |

No other sections/footer in the base spec (the scroll-reveal extension is layered on top).
