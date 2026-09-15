# NoJobTalk

Des rencontres physiques et informelles **entre chômeurs, uniquement**,
pour se partager tips, contacts et opportunités — l'esprit d'un
[Meetup](https://www.meetup.com) croisé avec la simplicité sans
organisateur de [Timeleft](https://timeleft.com) / [UnCafé](https://www.uncafeapp.com).

Point de conception non négociable : **pas de recruteur, pas
d'employeur, pas d'entretien déguisé.** Uniquement des chercheurs
d'emploi entre eux. C'est ce qui distingue le produit des dispositifs
type "coffee meetings"/"job dating" (voir ci-dessous).

## 1. Le constat de marché

Recherche faite avant de trancher quoi que ce soit (voir sources ci-dessous) :

- **Ce qui existe côté "emploi"** est presque toujours porté par un
  organisateur institutionnel, et surtout **met en présence des
  recruteurs/entreprises et des candidats** : Café Contact de l'Emploi
  et les "coffee meetings" de France Travail sont explicitement des
  formats de job dating (l'objectif est de rencontrer des entreprises
  qui recrutent). Les binômes de SNC (Solidarités Nouvelles face au
  Chômage) sont eux pair-à-pair mais associent un chercheur d'emploi à
  un *bénévole accompagnant*, pas à un autre chômeur. Aucun de ces
  dispositifs n'est ce que vise NoJobTalk : une conversation entre
  pairs, sans recruteur ni accompagnant dans la pièce, et sans
  calendrier ni animateur imposé.
- **Ce qui existe côté "rencontre physique sans organisateur"** (Timeleft,
  UnCafé) fonctionne très bien sur la mécanique (matching algorithmique,
  lieu réservé, créneau fixe) mais vise le lien social généraliste, pas
  la recherche d'emploi : aucune structuration autour du partage de
  pistes/contacts, pas de filtre par secteur ou objectif pro.
- Aucun acteur trouvé ne combine les deux : rencontres pair-à-pair,
  sans organisateur obligatoire, **spécifiquement structurées pour
  échanger des opportunités professionnelles**.

→ Le créneau est réel. Le risque n'est pas l'absence de besoin, c'est la
**masse critique locale** (voir [Enjeux](#4-enjeux)) et le fait que
Timeleft/UnCafé pourraient répliquer la mécanique facilement s'ils
voyaient la traction — la différenciation doit venir du contenu
(structuration autour des tips/opportunités) plus que de la mécanique de
mise en relation.

Sources consultées : Café Contact de l'Emploi, France Travail (coffee
meetings), SNC, Timeleft, UnCafé — recherche web du 2026-09-15.

## 2. Web ou mobile ?

**Décision : commencer par une web app (React), construite dès le départ
pour migrer vers une app React Native (Expo) en phase 2**, une fois la
proposition de valeur validée sur le terrain.

Pourquoi ne pas foncer direct en natif comme Timeleft :

- Le risque principal du projet n'est pas technique, c'est la validation
  de la proposition de valeur et l'amorçage d'une masse critique locale.
  Une web app se déploie en continu, sans review store, ce qui compte
  beaucoup pour itérer vite pendant un pilote sur une seule ville.
- Zéro friction d'installation pour un premier test avec de vrais
  chercheurs d'emploi (public déjà sollicité par de nombreux outils) :
  un lien suffit.
- Une PWA (installable, notifications web push sur Android et iOS
  16.4+) couvre une bonne partie des besoins de rappel de rendez-vous
  sans écrire de code natif.

Pourquoi le mobile natif reste l'objectif à moyen terme :

- L'usage cible (notification "quelqu'un est dispo pour un café près de
  toi aujourd'hui", rappel de rendez-vous, usage nomade) est un usage
  mobile par nature — c'est aussi pour ça que Timeleft et UnCafé sont
  *app-only*.
- Une fois la rétention prouvée, les notifications push natives et une
  UX mobile soignée deviennent un vrai levier de fréquence d'usage.

## 3. Stack technique

Monorepo `pnpm` pour partager types et logique métier entre le web et
(plus tard) le mobile.

```
NoJobTalk/
├─ apps/
│  ├─ web/       # React + Vite + TypeScript + Tailwind (ce dépôt, phase 1)
│  └─ mobile/    # Expo (React Native) — phase 2
└─ packages/
   └─ shared/    # types (zod), client API, logique de matching — phase 2
```

- **Frontend web** : React + Vite + TypeScript + Tailwind CSS,
  [`TanStack Query`](https://tanstack.com/query) pour l'état serveur.
  Déploiement Vercel/Netlify.
- **Frontend mobile (phase 2)** : Expo (React Native) + TypeScript +
  Expo Router + Expo Notifications, même client API que le web.
- **Backend** : [Supabase](https://supabase.com) (Postgres, région UE) —
  choisi plutôt que Firebase pour trois raisons : extension **PostGIS**
  pour les requêtes géographiques ("qui est dispo à moins de 2 km"),
  modèle relationnel qui colle naturellement aux données du produit
  (utilisateurs, rencontres, inscriptions, avis), et **Row Level
  Security** pour cloisonner des données sensibles (statut de
  recherche d'emploi) sans réinventer une couche d'autorisation.
  Auth par lien magique / OTP (pas de mot de passe à gérer par
  l'utilisateur), Realtime pour la présence ("qui est dispo
  maintenant"), Storage pour les avatars.
- **Analytics** : outil respectueux de la vie privée (Plausible ou
  PostHog auto-hébergé) plutôt qu'un tracker publicitaire classique —
  le sujet (chômage) est sensible, voir [Enjeux](#4-enjeux).

## 4. Fonctionnalités du MVP

Deux modes de rencontre, pour reprendre le meilleur de Meetup et de
Timeleft sans forcer l'un ou l'autre :

1. **Table ouverte** (façon Meetup) : quelqu'un propose un lieu et un
   créneau ("jeudi 10h, Café de la Poste"), les autres s'inscrivent.
   Le proposant n'est pas un "organisateur" au sens événementiel — il
   propose juste le point de rendez-vous.
2. **Matching auto** (façon Timeleft, mais sans quiz de personnalité) :
   on renseigne juste sa zone et ses disponibilités, l'algorithme
   regroupe 3 à 5 personnes dispo au même moment dans le même secteur.
   Le lieu de préférence commun est pris en compte s'il est renseigné,
   mais reste facultatif.

Autour de ça :

- Profil minimal : prénom, métier/secteur recherché, zone, 1-2 tips ou
  ressources à partager — l'idée est de mettre en avant ce qu'on
  apporte, pas un CV.
- Un fil récap par rencontre pour noter les pistes/offres partagées,
  afin que la valeur survive à la rencontre elle-même.
- Confiance minimale : email/téléphone vérifié, lieux publics
  uniquement, signalement, avis post-rencontre.
- Pas de compte "entreprise" ou "recruteur" dans le produit : un seul
  type de profil (chercheur d'emploi), pour que la promesse "entre
  pairs, sans recruteur" reste vraie techniquement et pas seulement
  éditorialement.

## 5. Étapes de construction

1. **Cadrage & validation terrain** (1-2 semaines) — cette web app
   (landing + liste d'attente) sert de point de départ. Entretiens
   avec des chercheurs d'emploi, choix d'une ville pilote.
2. **MVP fonctionnel, une seule ville** (4-6 semaines) — auth
   Supabase, profils, mode "table ouverte" uniquement pour commencer
   (plus simple à livrer et à faire confiance qu'un matching auto).
3. **Pilote terrain** (4 semaines) — petite cohorte réelle, mesure du
   taux de présence effective (le vrai indicateur, pas les inscriptions),
   itération rapide sur la UX et la confiance.
4. **V2** — matching automatique façon Timeleft, notifications web
   push, système de réputation léger, extension à d'autres villes.
5. **App mobile (Expo)** une fois la rétention confirmée et le besoin
   de notifications push natif avéré.
6. **Modèle économique** — à trancher avec le terrain : freemium,
   partenariat avec cafés locaux, ou subvention (France Travail,
   collectivités, associations) vu la dimension d'utilité sociale.

## 6. Enjeux

- **Masse critique locale** : un réseau géolocalisé ne vaut rien sans
  une densité suffisante d'utilisateurs par ville/quartier. Amorçage
  probablement nécessaire via des partenariats (associations, missions
  locales, cafés) plutôt que par acquisition pure.
- **Sécurité et confiance dans une rencontre entre inconnus** :
  vérification minimale, lieux publics, modération, charte de
  conduite, signalement — et vigilance sur le risque d'infiltration
  par du démarchage MLM/commercial déguisé en "partage de tips".
- **Sensibilité des données** : le statut de recherche d'emploi est
  une donnée socialement sensible. RGPD pris au sérieux dès le départ
  (hébergement UE, minimisation des données, pas de revente/tracking
  publicitaire).
- **Non-discrimination** : le matching et les profils doivent rester
  neutres vis-à-vis des critères protégés (âge, origine, etc.), y
  compris dans la façon dont les tips/opportunités sont partagés.
- **Churn "positif"** : le succès individuel (trouver un emploi) fait
  partir l'utilisateur — à anticiper dans la rétention (statut
  "alumni"/mentor, parrainage) plutôt que subir.
- **Fiabilité / no-show** : un taux d'absence élevé aux premières
  rencontres tue la confiance très vite ; rappels et un système de
  ponctualité léger sont prioritaires dès le MVP.
- **Responsabilité juridique** : la plateforme met en relation pour une
  rencontre physique — CGU claires sur les limites de responsabilité.
- **Concurrence indirecte** : Timeleft et UnCafé ont déjà la mécanique
  et une base d'utilisateurs ; la différenciation doit rester le
  contenu (structuration autour de l'emploi), pas la fonctionnalité de
  matching en elle-même.

## Démarrer en local

```bash
cd apps/web
pnpm install
pnpm dev
```
