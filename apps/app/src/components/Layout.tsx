import { NavLink, Outlet } from 'react-router-dom'

const ONGLETS = [
  { to: '/', label: 'Accueil', icone: '🏠', fin: true },
  { to: '/carte', label: 'Carte', icone: '🗺️' },
  { to: '/tables', label: 'Tables', icone: '☕' },
  { to: '/discussion', label: 'Discussion', icone: '💬' },
  { to: '/liens', label: 'Liens utiles', icone: '🔗' },
  { to: '/profil', label: 'Profil', icone: '👤' },
] as const

export function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-amber-50 text-stone-900 dark:bg-stone-950 dark:text-stone-100">
      <header className="sticky top-0 z-20 border-b border-stone-900/10 bg-amber-50/90 backdrop-blur-sm dark:border-white/10 dark:bg-stone-950/90">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <span className="flex items-center gap-2 text-lg font-bold tracking-tight">
            <span aria-hidden>☕</span> NoJobTalk
          </span>
        </div>
        <nav className="mx-auto flex max-w-5xl gap-1 overflow-x-auto px-4 pb-2 text-sm">
          {ONGLETS.map((onglet) => (
            <NavLink
              key={onglet.to}
              to={onglet.to}
              end={'fin' in onglet ? onglet.fin : false}
              className={({ isActive }) =>
                [
                  'flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 font-medium transition',
                  isActive
                    ? 'bg-orange-600 text-white'
                    : 'text-stone-600 hover:bg-stone-900/5 dark:text-stone-400 dark:hover:bg-white/10',
                ].join(' ')
              }
            >
              <span aria-hidden>{onglet.icone}</span>
              {onglet.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6">
        <Outlet />
      </main>

      <footer className="border-t border-stone-900/10 py-4 text-center text-xs text-stone-500 dark:border-white/10">
        NoJobTalk — version de démonstration, données factices.
      </footer>
    </div>
  )
}
