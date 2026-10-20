import { useMemo } from 'react'
import { useAppStore } from '../store/AppStore'
import type { CategorieLien } from '../types'

const ORDRE_CATEGORIES: CategorieLien[] = [
  'Aides publiques',
  'Communautés & réseautage',
  'Formation',
  'Offres & candidature',
]

export function Liens() {
  const { liens } = useAppStore()

  const parCategorie = useMemo(() => {
    const groupes = new Map<CategorieLien, typeof liens>()
    for (const categorie of ORDRE_CATEGORIES) groupes.set(categorie, [])
    for (const lien of liens) groupes.get(lien.categorie)?.push(lien)
    return groupes
  }, [liens])

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Liens utiles</h1>
      <p className="mt-1 text-sm text-stone-600 dark:text-stone-400">
        Une sélection de ressources pour compléter ce qu'on se partage en vrai — à affiner au fil du temps.
      </p>

      <div className="mt-6 space-y-8">
        {ORDRE_CATEGORIES.map((categorie) => {
          const items = parCategorie.get(categorie) ?? []
          if (items.length === 0) return null
          return (
            <section key={categorie}>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-orange-700 dark:text-orange-400">
                {categorie}
              </h2>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {items.map((lien) => (
                  <a
                    key={lien.id}
                    href={lien.url}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-2xl bg-white/70 p-4 ring-1 ring-stone-900/10 transition hover:-translate-y-0.5 hover:shadow-md dark:bg-stone-900/60 dark:ring-white/10"
                  >
                    <p className="font-semibold">{lien.titre}</p>
                    <p className="mt-1 text-sm text-stone-600 dark:text-stone-400">{lien.description}</p>
                  </a>
                ))}
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}
