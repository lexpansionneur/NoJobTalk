import { type FormEvent, useState } from 'react'
import { Link } from 'react-router-dom'
import { formaterDateHeure } from '../lib/format'
import { useAppStore } from '../store/AppStore'

export function Profil() {
  const { moi, mettreAJourMoi, tables } = useAppStore()
  const [champs, setChamps] = useState({ prenom: moi.prenom, ville: moi.ville, secteur: moi.secteur, tip: moi.tip })
  const [enregistre, setEnregistre] = useState(false)

  const mesTables = tables.filter((t) => t.participantIds.includes(moi.id))

  function soumettre(event: FormEvent) {
    event.preventDefault()
    mettreAJourMoi(champs)
    setEnregistre(true)
    setTimeout(() => setEnregistre(false), 2000)
  }

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold tracking-tight">Ton profil</h1>
      <p className="mt-1 text-sm text-stone-600 dark:text-stone-400">
        Pas de CV ici — juste de quoi te présenter et un tip à partager.
      </p>

      <form
        onSubmit={soumettre}
        className="mt-4 grid gap-3 rounded-2xl bg-white/70 p-5 ring-1 ring-stone-900/10 dark:bg-stone-900/60 dark:ring-white/10"
      >
        <label className="text-sm font-medium">
          Prénom
          <input
            value={champs.prenom}
            onChange={(e) => setChamps({ ...champs, prenom: e.target.value })}
            className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 text-sm font-normal dark:border-stone-700 dark:bg-stone-900"
          />
        </label>
        <label className="text-sm font-medium">
          Ville
          <input
            value={champs.ville}
            onChange={(e) => setChamps({ ...champs, ville: e.target.value })}
            className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 text-sm font-normal dark:border-stone-700 dark:bg-stone-900"
          />
        </label>
        <label className="text-sm font-medium">
          Secteur / métier recherché
          <input
            value={champs.secteur}
            onChange={(e) => setChamps({ ...champs, secteur: e.target.value })}
            placeholder="Ex : comptabilité, développement web..."
            className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 text-sm font-normal dark:border-stone-700 dark:bg-stone-900"
          />
        </label>
        <label className="text-sm font-medium">
          Un tip ou une ressource à partager
          <textarea
            value={champs.tip}
            onChange={(e) => setChamps({ ...champs, tip: e.target.value })}
            rows={3}
            placeholder="Ce que tu as appris récemment et qui pourrait servir à d'autres..."
            className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 text-sm font-normal dark:border-stone-700 dark:bg-stone-900"
          />
        </label>
        <button
          type="submit"
          className="w-fit rounded-full bg-orange-600 px-5 py-2 text-sm font-semibold text-white hover:bg-orange-700"
        >
          Enregistrer
        </button>
        {enregistre && <p className="text-sm text-emerald-600 dark:text-emerald-400">Profil mis à jour.</p>}
      </form>

      <h2 className="mt-8 text-lg font-semibold">Mes tables</h2>
      {mesTables.length === 0 ? (
        <p className="mt-2 text-sm text-stone-500">
          Tu n'as encore rejoint aucune table.{' '}
          <Link to="/tables" className="font-medium text-orange-700 underline dark:text-orange-400">
            En voir la liste
          </Link>
          .
        </p>
      ) : (
        <ul className="mt-2 space-y-2">
          {mesTables.map((table) => (
            <li
              key={table.id}
              className="rounded-xl bg-white/70 p-3 text-sm ring-1 ring-stone-900/10 dark:bg-stone-900/60 dark:ring-white/10"
            >
              <span className="font-medium">{table.titre}</span> — {table.ville},{' '}
              {formaterDateHeure(table.date, table.heure)}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
