import { type FormEvent, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { formaterHoraireRelatif } from '../lib/format'
import { useAppStore } from '../store/AppStore'

export function Discussion() {
  const { tables, messages, profils, moi, posterMessage } = useAppStore()
  const [searchParams, setSearchParams] = useSearchParams()
  const [brouillon, setBrouillon] = useState('')

  const tableIdParam = searchParams.get('table')
  const tableSelectionneeId = tables.some((t) => t.id === tableIdParam)
    ? tableIdParam!
    : (tables[0]?.id ?? '')

  const messagesTable = useMemo(
    () =>
      messages
        .filter((m) => m.tableId === tableSelectionneeId)
        .sort((a, b) => a.horodatage.localeCompare(b.horodatage)),
    [messages, tableSelectionneeId],
  )

  function envoyer(event: FormEvent) {
    event.preventDefault()
    const contenu = brouillon.trim()
    if (!contenu || !tableSelectionneeId) return
    posterMessage(tableSelectionneeId, contenu)
    setBrouillon('')
  }

  if (tables.length === 0) {
    return <p className="text-sm text-stone-500">Aucune table pour le moment.</p>
  }

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Discussion</h1>
      <p className="mt-1 text-sm text-stone-600 dark:text-stone-400">
        Un fil de discussion par table, pour préparer ou prolonger la rencontre.
      </p>

      <select
        value={tableSelectionneeId}
        onChange={(e) => setSearchParams({ table: e.target.value })}
        className="mt-4 w-full rounded-lg border border-stone-300 bg-white/80 px-3 py-2 text-sm dark:border-stone-700 dark:bg-stone-900 sm:w-auto"
      >
        {tables.map((table) => (
          <option key={table.id} value={table.id}>
            {table.titre} — {table.ville}
          </option>
        ))}
      </select>

      <div className="mt-4 flex max-h-[55vh] flex-col gap-3 overflow-y-auto rounded-2xl bg-white/70 p-4 ring-1 ring-stone-900/10 dark:bg-stone-900/60 dark:ring-white/10">
        {messagesTable.length === 0 && (
          <p className="text-sm text-stone-500">Aucun message pour l'instant — sois le premier à écrire.</p>
        )}
        {messagesTable.map((message) => {
          const auteur = profils[message.auteurId]
          const deMoi = message.auteurId === moi.id
          return (
            <div key={message.id} className={deMoi ? 'self-end text-right' : 'self-start'}>
              <p
                className={[
                  'inline-block max-w-sm rounded-2xl px-4 py-2 text-sm',
                  deMoi
                    ? 'bg-orange-600 text-white'
                    : 'bg-stone-100 text-stone-800 dark:bg-stone-800 dark:text-stone-200',
                ].join(' ')}
              >
                {message.contenu}
              </p>
              <p className="mt-1 text-xs text-stone-500">
                {deMoi ? 'Toi' : (auteur?.prenom ?? 'Quelqu\'un')} · {formaterHoraireRelatif(message.horodatage)}
              </p>
            </div>
          )
        })}
      </div>

      <form onSubmit={envoyer} className="mt-3 flex gap-2">
        <input
          value={brouillon}
          onChange={(e) => setBrouillon(e.target.value)}
          placeholder="Écrire un message..."
          className="flex-1 rounded-full border border-stone-300 px-4 py-2 text-sm dark:border-stone-700 dark:bg-stone-900"
        />
        <button
          type="submit"
          className="rounded-full bg-orange-600 px-5 py-2 text-sm font-semibold text-white hover:bg-orange-700"
        >
          Envoyer
        </button>
      </form>
    </div>
  )
}
