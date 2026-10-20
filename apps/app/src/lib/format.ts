const formateurDate = new Intl.DateTimeFormat('fr-FR', {
  weekday: 'short',
  day: 'numeric',
  month: 'short',
})

export function formaterDateHeure(date: string, heure: string): string {
  const jour = formateurDate.format(new Date(`${date}T00:00:00`))
  return `${jour} à ${heure.replace(':', 'h')}`
}

export function formaterHoraireRelatif(horodatage: string): string {
  const diffMs = Date.now() - new Date(horodatage).getTime()
  const minutes = Math.round(diffMs / 60000)
  if (minutes < 1) return "à l'instant"
  if (minutes < 60) return `il y a ${minutes} min`
  const heures = Math.round(minutes / 60)
  if (heures < 24) return `il y a ${heures} h`
  const jours = Math.round(heures / 24)
  return `il y a ${jours} j`
}
