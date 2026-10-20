export interface Profile {
  id: string
  prenom: string
  ville: string
  secteur: string
  tip: string
}

export interface TableMeetup {
  id: string
  titre: string
  lieu: string
  ville: string
  adresse: string
  lat: number
  lng: number
  date: string // YYYY-MM-DD
  heure: string // HH:mm
  placesMax: number
  participantIds: string[]
  hoteId: string
  description: string
}

export interface Message {
  id: string
  tableId: string
  auteurId: string
  contenu: string
  horodatage: string // ISO 8601
}

export type CategorieLien =
  | 'Aides publiques'
  | 'Communautés & réseautage'
  | 'Formation'
  | 'Offres & candidature'

export interface LienUtile {
  id: string
  titre: string
  url: string
  description: string
  categorie: CategorieLien
}
