import { Link } from 'react-router-dom'
import { formaterDateHeure } from '../lib/format'
import { useAppStore } from '../store/AppStore'

export function Accueil() {
  const { moi, tables, profils, liens } = useAppStore()

  const mesTables = tables
    .filter((t) => t.participantIds.includes(moi.id))
    .sort((a, b) => `${a.date}${a.heure}`.localeCompare(`${b.date}${b.heure}`))
  const prochaineTable = mesTables[0]

  const tip = Object.values(profils).find((p) => p.id !== moi.id && p.tip)

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">
        {moi.prenom ? `Salut ${moi.prenom} 👋` : 'Bienvenue 👋'}
      </h1>
      <p className="mt-1 text-sm text-stone-600 dark:text-stone-400">
        Voici où tu en es sur NoJobTalk.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl bg-white/70 p-5 ring-1 ring-stone-900/10 dark:bg-stone-900/60 dark:ring-white/10">
          <h2 className="font-semibold">Ta prochaine table</h2>
          {prochaineTable ? (
            <>
              <p className="mt-2 text-sm">{prochaineTable.titre}</p>
              <p className="text-sm text-stone-600 dark:text-stone-400">
                {prochaineTable.ville} · {formaterDateHeure(prochaineTable.date, prochaineTable.heure)}
              </p>
              <Link
                to={`/discussion?table=${prochaineTable.id}`}
                className="mt-3 inline-block text-sm font-medium text-orange-700 underline dark:text-orange-400"
              >
                Voir la discussion
              </Link>
            </>
          ) : (
            <>
              <p className="mt-2 text-sm text-stone-600 dark:text-stone-400">
                Tu n'as pas encore de table prévue.
              </p>
              <Link
                to="/tables"
                className="mt-3 inline-block rounded-full bg-orange-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-orange-700"
              >
                Trouver une table
              </Link>
            </>
          )}
        </div>

        <div className="rounded-2xl bg-white/70 p-5 ring-1 ring-stone-900/10 dark:bg-stone-900/60 dark:ring-white/10">
          <h2 className="font-semibold">Tip du moment</h2>
          {tip ? (
            <p className="mt-2 text-sm text-stone-600 dark:text-stone-400">
              « {tip.tip} » — {tip.prenom}, {tip.secteur}
            </p>
          ) : (
            <p className="mt-2 text-sm text-stone-600 dark:text-stone-400">Rien à afficher pour l'instant.</p>
          )}
          <Link
            to="/liens"
            className="mt-3 inline-block text-sm font-medium text-orange-700 underline dark:text-orange-400"
          >
            Voir les {liens.length} liens utiles
          </Link>
        </div>
      </div>

      <div className="mt-4 rounded-2xl bg-white/70 p-5 ring-1 ring-stone-900/10 dark:bg-stone-900/60 dark:ring-white/10">
        <h2 className="font-semibold">Explorer</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link
            to="/carte"
            className="rounded-full bg-stone-900/5 px-4 py-1.5 text-sm font-medium hover:bg-stone-900/10 dark:bg-white/10 dark:hover:bg-white/20"
          >
            🗺️ Voir la carte
          </Link>
          <Link
            to="/tables"
            className="rounded-full bg-stone-900/5 px-4 py-1.5 text-sm font-medium hover:bg-stone-900/10 dark:bg-white/10 dark:hover:bg-white/20"
          >
            ☕ Toutes les tables
          </Link>
          <Link
            to="/profil"
            className="rounded-full bg-stone-900/5 px-4 py-1.5 text-sm font-medium hover:bg-stone-900/10 dark:bg-white/10 dark:hover:bg-white/20"
          >
            👤 Compléter mon profil
          </Link>
        </div>
      </div>
    </div>
  )
}
