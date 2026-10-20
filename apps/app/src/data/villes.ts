export const COORDONNEES_VILLES: Record<string, [number, number]> = {
  Paris: [48.8566, 2.3522],
  Lyon: [45.764, 4.8357],
  Marseille: [43.2965, 5.3698],
  'Clermont-Ferrand': [45.7772, 3.087],
  Toulouse: [43.6047, 1.4442],
  Bordeaux: [44.8378, -0.5792],
  Lille: [50.6292, 3.0573],
  Nantes: [47.2184, -1.5536],
  Strasbourg: [48.5734, 7.7521],
  Rennes: [48.1173, -1.6778],
}

export const CENTRE_FRANCE: [number, number] = [46.6, 2.5]

export function coordonneesVille(ville: string): [number, number] {
  return COORDONNEES_VILLES[ville.trim()] ?? CENTRE_FRANCE
}
