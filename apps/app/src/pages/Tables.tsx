import { type FormEvent, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { coordonneesVille } from '../data/villes'
import { formaterDateHeure } from '../lib/format'
import { useAppStore } from '../store/AppStore'
import type { TableMeetup } from '../types'

const CHAMPS_VIDES = {
  titre: '',
  lieu: '',
  ville: '',
  adresse: '',
  date: '',
  heure: '10:00',
  placesMax: 4,
  description: '',
}

export function Tables() {
  const { tables, profils, moi, rejoindreTable, quitterTable, creerTable } = useAppStore()
  const [villeFiltre, setVilleFiltre] = useState('Toutes')
  const [formulaireOuvert, setFormulaireOuvert] = useState(false)
  const [champs, setChamps] = useState(CHAMPS_VIDES)

  const villes = useMemo(
    () => ['Toutes', ...Array.from(new Set(tables.map((t) => t.ville))).sort()],
    [tables],
  )

  const tablesFiltrees = useMemo(
    () =>
      [...tables]
        .filter((t) => villeFiltre === 'Toutes' || t.ville === villeFiltre)
        .sort((a, b) => `${a.date}${a.heure}`.localeCompare(`${b.date}${b.heure}`)),
    [tables, villeFiltre],
  )

  function soumettre(event: FormEvent) {
    event.preventDefault()
    if (!champs.titre || !champs.lieu || !champs.ville || !champs.date) return

    const [lat, lng] = coordonneesVille(champs.ville)
    creerTable({ ...champs, lat, lng })
    setChamps(CHAMPS_VIDES)
    setFormulaireOuvert(false)
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Les tables</h1>
          <p className="mt-1 text-sm text-stone-600 dark:text-stone-400">
            Rejoins une table existante, ou propose la tienne.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setFormulaireOuvert((v) => !v)}
          className="rounded-full bg-orange-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-700"
        >
          {formulaireOuvert ? 'Annuler' : '+ Proposer une table'}
        </button>
      </div>

      {formulaireOuvert && (
        <form
          onSubmit={soumettre}
          className="mt-4 grid gap-3 rounded-2xl bg-white/70 p-5 ring-1 ring-stone-900/10 sm:grid-cols-2 dark:bg-stone-900/60 dark:ring-white/10"
        >
          <input
            required
            placeholder="Titre (ex: Café matinal Bastille)"
            value={champs.titre}
            onChange={(e) => setChamps({ ...champs, titre: e.target.value })}
            className="rounded-lg border border-stone-300 px-3 py-2 text-sm dark:border-stone-700 dark:bg-stone-900 sm:col-span-2"
          />
          <input
            required
            placeholder="Lieu (ex: Café de la Poste)"
            value={champs.lieu}
            onChange={(e) => setChamps({ ...champs, lieu: e.target.value })}
            className="rounded-lg border border-stone-300 px-3 py-2 text-sm dark:border-stone-700 dark:bg-stone-900"
          />
          <input
            required
            placeholder="Ville"
            value={champs.ville}
            onChange={(e) => setChamps({ ...champs, ville: e.target.value })}
            className="rounded-lg border border-stone-300 px-3 py-2 text-sm dark:border-stone-700 dark:bg-stone-900"
          />
          <input
            placeholder="Adresse complète"
            value={champs.adresse}
            onChange={(e) => setChamps({ ...champs, adresse: e.target.value })}
            className="rounded-lg border border-stone-300 px-3 py-2 text-sm dark:border-stone-700 dark:bg-stone-900 sm:col-span-2"
          />
          <input
            required
            type="date"
            value={champs.date}
            onChange={(e) => setChamps({ ...champs, date: e.target.value })}
            className="rounded-lg border border-stone-300 px-3 py-2 text-sm dark:border-stone-700 dark:bg-stone-900"
          />
          <input
            type="time"
            value={champs.heure}
            onChange={(e) => setChamps({ ...champs, heure: e.target.value })}
            className="rounded-lg border border-stone-300 px-3 py-2 text-sm dark:border-stone-700 dark:bg-stone-900"
          />
          <label className="flex items-center gap-2 text-sm text-stone-600 dark:text-stone-400">
            Places max
            <input
              type="number"
              min={2}
              max={10}
              value={champs.placesMax}
              onChange={(e) => setChamps({ ...champs, placesMax: Number(e.target.value) })}
              className="w-20 rounded-lg border border-stone-300 px-3 py-2 text-sm dark:border-stone-700 dark:bg-stone-900"
            />
          </label>
          <textarea
            placeholder="Petite description (facultatif)"
            value={champs.description}
            onChange={(e) => setChamps({ ...champs, description: e.target.value })}
            className="rounded-lg border border-stone-300 px-3 py-2 text-sm sm:col-span-2 dark:border-stone-700 dark:bg-stone-900"
            rows={2}
          />
          <button
            type="submit"
            className="rounded-full bg-stone-900 px-4 py-2 text-sm font-semibold text-white hover:bg-stone-700 sm:col-span-2 sm:w-fit dark:bg-white dark:text-stone-900"
          >
            Créer la table
          </button>
        </form>
      )}

      <div className="mt-6 flex flex-wrap gap-2">
        {villes.map((ville) => (
          <button
            key={ville}
            type="button"
            onClick={() => setVilleFiltre(ville)}
            className={[
              'rounded-full px-3 py-1 text-sm font-medium transition',
              villeFiltre === ville
                ? 'bg-orange-600 text-white'
                : 'bg-white/70 text-stone-600 ring-1 ring-stone-900/10 hover:bg-white dark:bg-stone-900/60 dark:text-stone-400 dark:ring-white/10',
            ].join(' ')}
          >
            {ville}
          </button>
        ))}
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tablesFiltrees.map((table) => (
          <CarteTable
            key={table.id}
            table={table}
            hote={profils[table.hoteId]}
            inscrit={table.participantIds.includes(moi.id)}
            complet={table.participantIds.length >= table.placesMax}
            onRejoindre={() => rejoindreTable(table.id)}
            onQuitter={() => quitterTable(table.id)}
          />
        ))}
        {tablesFiltrees.length === 0 && (
          <p className="text-sm text-stone-500">Aucune table pour cette ville pour le moment.</p>
        )}
      </div>
    </div>
  )
}

function CarteTable({
  table,
  hote,
  inscrit,
  complet,
  onRejoindre,
  onQuitter,
}: {
  table: TableMeetup
  hote: { prenom: string } | undefined
  inscrit: boolean
  complet: boolean
  onRejoindre: () => void
  onQuitter: () => void
}) {
  return (
    <div className="flex flex-col rounded-2xl bg-white/70 p-5 ring-1 ring-stone-900/10 dark:bg-stone-900/60 dark:ring-white/10">
      <p className="text-xs font-medium uppercase tracking-wide text-orange-700 dark:text-orange-400">
        {table.ville} · {formaterDateHeure(table.date, table.heure)}
      </p>
      <h2 className="mt-1 text-lg font-semibold">{table.titre}</h2>
      <p className="mt-1 text-sm text-stone-600 dark:text-stone-400">
        {table.lieu}
        {table.adresse ? ` — ${table.adresse}` : ''}
      </p>
      {table.description && (
        <p className="mt-2 text-sm text-stone-600 dark:text-stone-400">{table.description}</p>
      )}
      <p className="mt-2 text-sm text-stone-500">
        Proposée par {hote?.prenom ?? 'quelqu\'un'} · {table.participantIds.length}/{table.placesMax} places
      </p>

      <div className="mt-4 flex items-center gap-2">
        {inscrit ? (
          <button
            type="button"
            onClick={onQuitter}
            className="rounded-full bg-stone-200 px-4 py-1.5 text-sm font-medium text-stone-700 hover:bg-stone-300 dark:bg-stone-800 dark:text-stone-300"
          >
            Je ne peux plus venir
          </button>
        ) : (
          <button
            type="button"
            onClick={onRejoindre}
            disabled={complet}
            className="rounded-full bg-orange-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {complet ? 'Complet' : 'Rejoindre'}
          </button>
        )}
        <Link
          to={`/discussion?table=${table.id}`}
          className="text-sm font-medium text-orange-700 underline dark:text-orange-400"
        >
          Voir la discussion
        </Link>
      </div>
    </div>
  )
}
