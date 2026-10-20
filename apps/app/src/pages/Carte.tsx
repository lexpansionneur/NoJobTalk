import L from 'leaflet'
import { useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import { iconeTable } from '../components/MarqueurTable'
import { formaterDateHeure } from '../lib/format'
import { useAppStore } from '../store/AppStore'

function CadrerSurLesTables({ positions }: { positions: [number, number][] }) {
  const carte = useMap()

  useEffect(() => {
    if (positions.length === 0) return
    carte.fitBounds(L.latLngBounds(positions), { padding: [32, 32], maxZoom: 12 })
  }, [carte, positions])

  return null
}

export function Carte() {
  const { tables } = useAppStore()

  const positions = useMemo<[number, number][]>(
    () => tables.map((table) => [table.lat, table.lng]),
    [tables],
  )

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Carte des tables</h1>
      <p className="mt-1 text-sm text-stone-600 dark:text-stone-400">
        Toutes les rencontres à venir, en un coup d'œil.
      </p>

      <div className="mt-4 h-[60vh] min-h-96 overflow-hidden rounded-2xl ring-1 ring-stone-900/10 dark:ring-white/10">
        <MapContainer
          center={[46.6, 2.5]}
          zoom={5}
          scrollWheelZoom
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <CadrerSurLesTables positions={positions} />
          {tables.map((table) => (
            <Marker key={table.id} position={[table.lat, table.lng]} icon={iconeTable}>
              <Popup>
                <div className="min-w-48">
                  <p className="font-semibold">{table.titre}</p>
                  <p className="text-sm text-stone-600">
                    {table.lieu} — {table.ville}
                  </p>
                  <p className="mt-1 text-sm text-stone-600">{formaterDateHeure(table.date, table.heure)}</p>
                  <p className="mt-1 text-sm text-stone-600">
                    {table.participantIds.length}/{table.placesMax} places prises
                  </p>
                  <Link
                    to="/tables"
                    className="mt-2 inline-block text-sm font-medium text-orange-700 underline"
                  >
                    Voir dans la liste des tables
                  </Link>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  )
}
