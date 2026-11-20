# rentmyrs.com

Site de location d'Audi RS (RS3, RS5, RS7, RSQ8) à Montréal, avec les Lamborghini de Exotic Rentals Montreal en vitrine.
App Next.js autonome, séparée du site principal (dossier `rentmyrs/`).

## Pages
- `/` (FR) et `/en` (EN) : accueil, gamme RS, Lamborghini, demande de réservation, FAQ
- `/location-audi-rs3-montreal`, `/en/audi-rs3-rental-montreal`, etc. : une fiche par modèle
- `sitemap.xml` et `robots.txt` avec hreflang FR/EN

## Réservation
Demande seulement, validation manuelle, aucun paiement en ligne.
`POST /api/reservation` (aucun GET) enregistre la demande dans `booking_requests` (même base que le site principal, préfixe `[RentMyRS]` dans la colonne vehicle). La notification de l'équipe reste à brancher (pas d'OpenPhone sur ce site). Anti-spam : pot de miel + limite par IP.

## Modifier le contenu
- Modèles, prix, photos : `lib/fleet.ts` (`dailyRate: null` = « Prix sur demande »)
- Textes FR/EN et FAQ : `lib/dict.ts`
- Téléphone, liens : `lib/site.ts`

## Déployer sur Vercel
1. Nouveau projet Vercel depuis ce repo, **Root Directory = `rentmyrs`**, branche de production `rentmyrs` (ou `main` une fois fusionné).
2. Variable : `POSTGRES_URL` (voir `.env.example`).
3. Ajouter les domaines `rentmyrs.com` et `www.rentmyrs.com` (rentmyrs.com redirige vers www, réglé dans Vercel).

```bash
npm install && npm run dev
```
