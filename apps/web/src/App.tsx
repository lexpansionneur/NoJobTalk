import { type FormEvent, useState } from 'react'

const STEPS = [
  {
    title: '1. Tu proposes ou tu rejoins',
    body: "Propose un café à un jour et une heure, ou laisse l'appli te regrouper avec 3-4 personnes dispos près de chez toi — sans avoir besoin d'organiser quoi que ce soit.",
  },
  {
    title: '2. Vous vous voyez, en vrai',
    body: 'Un lieu public, un créneau court (45-60 min). Pas de questionnaire de personnalité à rallonge : juste ta zone, tes disponibilités et ce que tu cherches.',
  },
  {
    title: '3. Vous repartez avec quelque chose',
    body: "Un tip, un contact, une piste, une candidature partagée. Chaque rencontre a un fil récap où on note ce qu'on a appris, pour que ça profite à d'autres.",
  },
]

type Status = 'idle' | 'submitting' | 'done' | 'error'

function App() {
  const [email, setEmail] = useState('')
  const [ville, setVille] = useState('')
  const [status, setStatus] = useState<Status>('idle')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!email.includes('@')) {
      setStatus('error')
      return
    }

    setStatus('submitting')
    // TODO(phase 1): remplacer par un insert Supabase (table `waitlist`)
    // une fois le backend branché. Pour l'instant on capture localement
    // afin de pouvoir valider l'intérêt dès le pilote.
    try {
      const entries = JSON.parse(localStorage.getItem('nojobtalk_waitlist') ?? '[]')
      entries.push({ email, ville, date: new Date().toISOString() })
      localStorage.setItem('nojobtalk_waitlist', JSON.stringify(entries))
      setStatus('done')
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
        <span className="text-lg font-semibold tracking-tight">NoJobTalk</span>
        <a
          href="#rejoindre"
          className="rounded-full border border-slate-300 px-4 py-1.5 text-sm font-medium hover:border-slate-500 dark:border-slate-700 dark:hover:border-slate-500"
        >
          Rejoindre la liste d'attente
        </a>
      </header>

      <main className="mx-auto max-w-3xl px-6 pb-24 pt-12 text-center">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          Chercher un emploi, c'est plus efficace à plusieurs.
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-slate-600 dark:text-slate-400">
          NoJobTalk organise des rencontres physiques et informelles entre
          personnes en recherche d'emploi, autour d'un café, pour se partager
          tips, contacts et opportunités. Pas besoin d'organisateur, pas de
          questionnaire interminable — juste un lieu, un créneau, et
          quelques personnes dans la même situation que toi.
        </p>

        <section className="mt-16 grid gap-8 text-left sm:grid-cols-3">
          {STEPS.map((step) => (
            <div key={step.title}>
              <h2 className="text-base font-semibold">{step.title}</h2>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                {step.body}
              </p>
            </div>
          ))}
        </section>

        <section id="rejoindre" className="mt-20 rounded-2xl border border-slate-200 p-8 dark:border-slate-800">
          <h2 className="text-xl font-semibold">On lance le pilote bientôt</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Laisse ton email et ta ville pour être prévenu·e dès que
            NoJobTalk ouvre près de chez toi.
          </p>

          {status === 'done' ? (
            <p className="mt-6 text-sm font-medium text-emerald-600 dark:text-emerald-400">
              Merci, tu es sur la liste ! On te tient au courant.
            </p>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center"
            >
              <input
                type="email"
                required
                placeholder="ton@email.fr"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm outline-none focus:border-slate-500 sm:w-64 dark:border-slate-700 dark:bg-slate-900"
              />
              <input
                type="text"
                placeholder="Ta ville"
                value={ville}
                onChange={(event) => setVille(event.target.value)}
                className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm outline-none focus:border-slate-500 sm:w-40 dark:border-slate-700 dark:bg-slate-900"
              />
              <button
                type="submit"
                disabled={status === 'submitting'}
                className="rounded-lg bg-slate-900 px-5 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-50 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
              >
                Je m'inscris
              </button>
            </form>
          )}
          {status === 'error' && (
            <p className="mt-3 text-sm text-red-500">
              Vérifie ton email et réessaie.
            </p>
          )}
        </section>
      </main>

      <footer className="border-t border-slate-200 py-6 text-center text-xs text-slate-500 dark:border-slate-800">
        NoJobTalk — projet en cours de construction.
      </footer>
    </div>
  )
}

export default App
