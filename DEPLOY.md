# Déploiement

Un seul service : le serveur Node sert le front (`dist/`) + l'API `/api/*` + la base
SQLite (fichier sur volume persistant). Une seule URL, pas de CORS.

À définir sur l'hébergeur :

| Variable  | Valeur                    | Rôle                                  |
|-----------|---------------------------|---------------------------------------|
| `ADMIN_KEY`| *(un secret à toi)*      | protège `/api/waitlist` et l'export   |
| `DB_PATH` | `/data/waitlist.db`       | base sur le volume persistant         |
| `PORT`    | *(auto sur la plupart)*   | port d'écoute                         |

**Volume persistant monté sur `/data` obligatoire** — sinon la liste d'attente
est effacée à chaque redéploiement.

Récupérer les inscrits : `https://<domaine>/api/waitlist.csv?key=<ADMIN_KEY>`

---

## Option A — Railway (tout au clic, ~5 $/mo)

1. railway.app → **New Project → Deploy from GitHub repo** → `ahmvdd/Drop-website`
2. Railway détecte le `Dockerfile`.
3. **Variables** : ajouter `ADMIN_KEY` et `DB_PATH=/data/waitlist.db`
4. **Volumes → New Volume**, mount path `/data`
5. **Settings → Networking → Generate Domain** (URL en `*.up.railway.app`)
6. Domaine perso : **Settings → Networking → Custom Domain** → Railway donne un
   enregistrement **CNAME** → l'ajouter chez ton registrar (voir plus bas).

## Option B — Fly.io (CLI, quasi gratuit)

```bash
brew install flyctl          # ou : curl -L https://fly.io/install.sh | sh
fly auth login               # ouvre le navigateur
cd ~/Desktop/aurevon
fly launch --copy-config --no-deploy   # reprend fly.toml ; garde/ajuste le nom d'app
fly volumes create data --region cdg --size 1
fly secrets set ADMIN_KEY=le-vrai-secret
fly deploy
fly open
```

Domaine perso :

```bash
fly certs add tondomaine.fr
fly certs show tondomaine.fr        # affiche les enregistrements DNS à créer
```

---

## DNS (chez le registrar : OVH, Namecheap, Cloudflare, Gandi…)

- **Sous-domaine** (`www.` ou `app.`) → un enregistrement **CNAME** vers la cible
  donnée par l'hébergeur.
- **Domaine nu** (`tondomaine.fr` sans `www`) → enregistrements **A / AAAA** vers
  les IP données par l'hébergeur (Fly : `fly ips list` ; Railway : fournies dans l'UI).
- Propagation : quelques minutes à quelques heures. Le certificat HTTPS est
  généré automatiquement une fois le DNS en place.
