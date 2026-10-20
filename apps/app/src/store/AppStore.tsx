import { createContext, type ReactNode, useContext, useEffect, useMemo, useState } from 'react'
import { LIENS_SEED, MESSAGES_SEED, MOI, PROFILS_SEED, TABLES_SEED } from '../data/seed'
import type { LienUtile, Message, Profile, TableMeetup } from '../types'

interface AppState {
  profils: Record<string, Profile>
  tables: TableMeetup[]
  messages: Message[]
}

const STORAGE_KEY = 'nojobtalk_app_state_v1'

function etatInitial(): AppState {
  const profils: Record<string, Profile> = {}
  for (const profil of [MOI, ...PROFILS_SEED]) {
    profils[profil.id] = profil
  }
  return { profils, tables: TABLES_SEED, messages: MESSAGES_SEED }
}

function chargerEtat(): AppState {
  try {
    const brut = localStorage.getItem(STORAGE_KEY)
    if (!brut) return etatInitial()
    const sauvegarde = JSON.parse(brut) as AppState
    if (!sauvegarde.profils || !sauvegarde.tables || !sauvegarde.messages) return etatInitial()
    return sauvegarde
  } catch {
    return etatInitial()
  }
}

interface AppStoreValue {
  moi: Profile
  profils: Record<string, Profile>
  tables: TableMeetup[]
  messages: Message[]
  liens: LienUtile[]
  rejoindreTable: (tableId: string) => void
  quitterTable: (tableId: string) => void
  creerTable: (
    donnees: Pick<
      TableMeetup,
      'titre' | 'lieu' | 'ville' | 'adresse' | 'lat' | 'lng' | 'date' | 'heure' | 'placesMax' | 'description'
    >,
  ) => void
  posterMessage: (tableId: string, contenu: string) => void
  mettreAJourMoi: (partiel: Partial<Omit<Profile, 'id'>>) => void
}

const AppStoreContext = createContext<AppStoreValue | null>(null)

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [etat, setEtat] = useState<AppState>(chargerEtat)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(etat))
    } catch {
      // stockage indisponible (navigation privée...) : on continue sans persister
    }
  }, [etat])

  const valeur = useMemo<AppStoreValue>(
    () => ({
      moi: etat.profils['moi'] ?? MOI,
      profils: etat.profils,
      tables: etat.tables,
      messages: etat.messages,
      liens: LIENS_SEED,

      rejoindreTable: (tableId) => {
        setEtat((precedent) => ({
          ...precedent,
          tables: precedent.tables.map((table) => {
            if (table.id !== tableId) return table
            if (table.participantIds.includes('moi')) return table
            if (table.participantIds.length >= table.placesMax) return table
            return { ...table, participantIds: [...table.participantIds, 'moi'] }
          }),
        }))
      },

      quitterTable: (tableId) => {
        setEtat((precedent) => ({
          ...precedent,
          tables: precedent.tables.map((table) =>
            table.id === tableId
              ? { ...table, participantIds: table.participantIds.filter((id) => id !== 'moi') }
              : table,
          ),
        }))
      },

      creerTable: (donnees) => {
        const nouvelleTable: TableMeetup = {
          ...donnees,
          id: `t-${Date.now()}`,
          hoteId: 'moi',
          participantIds: ['moi'],
        }
        setEtat((precedent) => ({ ...precedent, tables: [nouvelleTable, ...precedent.tables] }))
      },

      posterMessage: (tableId, contenu) => {
        const nouveauMessage: Message = {
          id: `m-${Date.now()}`,
          tableId,
          auteurId: 'moi',
          contenu,
          horodatage: new Date().toISOString(),
        }
        setEtat((precedent) => ({ ...precedent, messages: [...precedent.messages, nouveauMessage] }))
      },

      mettreAJourMoi: (partiel) => {
        setEtat((precedent) => ({
          ...precedent,
          profils: {
            ...precedent.profils,
            moi: { ...(precedent.profils['moi'] ?? MOI), ...partiel },
          },
        }))
      },
    }),
    [etat],
  )

  return <AppStoreContext.Provider value={valeur}>{children}</AppStoreContext.Provider>
}

export function useAppStore(): AppStoreValue {
  const contexte = useContext(AppStoreContext)
  if (!contexte) {
    throw new Error('useAppStore doit être utilisé à l\'intérieur de <AppStoreProvider>')
  }
  return contexte
}
