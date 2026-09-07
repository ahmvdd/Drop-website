// Lance l'API + le front en une commande : npm run dev:all
import { spawn } from 'node:child_process'

const procs = [
  spawn('npm', ['run', 'server'], { stdio: 'inherit' }),
  spawn('npm', ['run', 'dev'], { stdio: 'inherit' }),
]

const stop = () => {
  for (const p of procs) p.kill('SIGTERM')
  process.exit(0)
}
process.on('SIGINT', stop)
process.on('SIGTERM', stop)
for (const p of procs) p.on('exit', stop)
