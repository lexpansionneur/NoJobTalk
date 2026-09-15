import { type FormEvent, useState } from 'react'

const STEPS = [
  {
    icon: '☕',
    title: 'Tu proposes ou tu rejoins',
    body: "Propose un café à un jour et une heure, ou laisse-toi regrouper avec 3-4 personnes dispos près de chez toi — sans avoir besoin d'organiser quoi que ce soit.",
  },
  {
    icon: '🤝',
    title: 'Vous vous voyez, en vrai',
    body: 'Un lieu public, un créneau court (45-60 min). Pas de questionnaire de personnalité à rallonge : juste ta zone, tes disponibilités et ce que tu cherches.',
  },
  {
    icon: '💡',
    title: 'Vous repartez avec quelque chose',
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
    <div className="relative min-h-screen overflow-hidden bg-amber-50 text-stone-900 dark:bg-stone-950 dark:text-stone-100">
      {/* décor : taches de couleur douces, purement esthétiques */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-orange-200/50 blur-3xl dark:bg-orange-900/20"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-40 -right-24 h-80 w-80 rounded-full bg-rose-200/40 blur-3xl dark:bg-rose-900/20"
      />

      <div className="relative">
        <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
          <span className="flex items-center gap-2 text-lg font-bold tracking-tight">
            <span aria-hidden>☕</span> NoJobTalk
          </span>
          <a
            href="#rejoindre"
            className="rounded-full bg-stone-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-stone-700 dark:bg-amber-400 dark:text-stone-900 dark:hover:bg-amber-300"
          >
            Rejoindre la liste d'attente
          </a>
        </header>

        <main className="mx-auto max-w-3xl px-6 pb-24 pt-12 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-1.5 text-sm font-medium text-orange-700 shadow-sm ring-1 ring-orange-200 dark:bg-stone-900/80 dark:text-orange-300 dark:ring-orange-900">
            Entre chercheurs d'emploi, sans recruteur — jamais
          </span>

          <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-stone-900 sm:text-5xl dark:text-white">
            Chercher un emploi, c'est plus{' '}
            <span className="text-orange-600 dark:text-orange-400">
              chouette à plusieurs
            </span>
            .
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-stone-600 dark:text-stone-400">
            NoJobTalk organise des rencontres physiques et informelles entre
            personnes en recherche d'emploi, autour d'un café, pour se
            partager tips, contacts et opportunités. Pas besoin
            d'organisateur, pas de questionnaire interminable — juste un
            lieu, un créneau, et quelques personnes dans la même situation
            que toi.
          </p>

          <section className="mt-16 grid gap-6 text-left sm:grid-cols-3">
            {STEPS.map((step, index) => (
              <div
                key={step.title}
                className="rounded-3xl bg-white/70 p-6 shadow-sm ring-1 ring-stone-900/5 backdrop-blur-sm transition hover:-translate-y-0.5 hover:shadow-md dark:bg-stone-900/60 dark:ring-white/10"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-lg dark:bg-orange-900/40">
                  <span aria-hidden>{step.icon}</span>
                </div>
                <h2 className="mt-4 text-base font-semibold text-stone-900 dark:text-white">
                  {index + 1}. {step.title}
                </h2>
                <p className="mt-2 text-sm text-stone-600 dark:text-stone-400">
                  {step.body}
                </p>
              </div>
            ))}
          </section>

          <section
            id="rejoindre"
            className="mt-20 rounded-3xl bg-gradient-to-br from-orange-500 to-rose-500 p-8 text-white shadow-lg shadow-orange-500/20 sm:p-10"
          >
            <h2 className="text-2xl font-bold">On lance le pilote bientôt ✨</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-orange-50">
              Laisse ton email et ta ville pour être prévenu·e dès que
              NoJobTalk ouvre près de chez toi — et faire partie des
              premières tables.
            </p>

            {status === 'done' ? (
              <p className="mt-6 text-sm font-semibold">
                Merci, tu es sur la liste ! On te tient au courant. 🎉
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
                  className="w-full rounded-full border-0 bg-white/95 px-4 py-2.5 text-sm text-stone-900 outline-none ring-2 ring-transparent placeholder:text-stone-400 focus:ring-white sm:w-64"
                />
                <input
                  type="text"
                  placeholder="Ta ville"
                  value={ville}
                  onChange={(event) => setVille(event.target.value)}
                  className="w-full rounded-full border-0 bg-white/95 px-4 py-2.5 text-sm text-stone-900 outline-none ring-2 ring-transparent placeholder:text-stone-400 focus:ring-white sm:w-40"
                />
                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="rounded-full bg-stone-900 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-stone-800 disabled:opacity-50"
                >
                  Je m'inscris
                </button>
              </form>
            )}
            {status === 'error' && (
              <p className="mt-3 text-sm font-medium text-rose-50">
                Vérifie ton email et réessaie.
              </p>
            )}
          </section>
        </main>

        <footer className="border-t border-stone-900/10 py-6 text-center text-xs text-stone-500 dark:border-white/10 dark:text-stone-500">
          NoJobTalk — projet en cours de construction.
        </footer>
      </div>
    </div>
  )
}

export default App
