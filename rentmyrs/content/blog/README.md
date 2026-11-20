# Blog RentMyRS : règles pour écrire un article

Un article = un fichier JSON ici. Chaque sujet est publié en **paire FR + EN** (deux fichiers, liés par `alt`).
Les fichiers `*.json` sont lus au build par `lib/blog.ts`. `topics.json` est la liste des sujets à traiter.

## Format

```json
{
  "slug": "location-audi-rs3-laval",          // minuscules, tirets, sans accents
  "locale": "fr",                              // "fr" ou "en"
  "alt": "audi-rs3-rental-laval",              // slug de la version dans l'autre langue
  "title": "…",                                // 50 à 70 caractères, mot-clé au début
  "description": "…",                          // 140 à 160 caractères
  "date": "AAAA-MM-JJ",                        // date de publication, ne change jamais
  "updated": "AAAA-MM-JJ",                     // optionnel : dernière mise à jour (enrichisseur)
  "model": "rs3",                              // rs3 | rs5 | rs7 | rsq8 | r8 | null
  "image": "/cars/rs3-1.jpg",                  // une image existante de public/cars/
  "answer": "…",                               // 2-4 phrases, réponse directe avec chiffres (GEO)
  "sections": [{ "h": "…", "p": ["…"], "list": ["…"] }],   // 4 à 6 sections, 700+ mots au total avec la FAQ
  "faq": [["question ?", "réponse"]]           // 3 à 5 questions
}
```

Texte : seulement `**gras**` et `[lien](/chemin)`. Pas de HTML, pas de tiret cadratin.

## Faits (source de vérité)

- Prix, dépôts, puissance : lire https://www.rentmyrs.com/llms.txt (valeurs de l'admin). À défaut, `lib/fleet.ts`.
- Conditions : 25 ans et plus, permis valide, preuve d'assurance, carte de crédit au nom du conducteur pour le dépôt remboursable.
- Réservation : demande sur le site, par texto ou WhatsApp (514 773-8079), confirmée par texto. Aucun paiement en ligne.
- Livraison sur demande : Montréal, Laval, Rive-Nord (Terrebonne, Blainville, Boisbriand, Mirabel, Repentigny, Saint-Jérôme…), Rive-Sud, aéroport YUL. Frais confirmés avec la réservation.
- Hiver : quattro + pneus d'hiver (obligatoires au Québec du 1er décembre au 15 mars).
- Ne jamais inventer : kilométrage inclus, assurance offerte, rabais, avis clients, nombre de clients, adresse physique.

## Liens internes autorisés

`/`, `/en`, pages modèles (`/location-audi-rs3-montreal`, `/en/audi-rs3-rental-montreal`, etc., voir `lib/fleet.ts`),
`/guide-location-audi-rs-montreal`, `/en/audi-rs-rental-guide-montreal`, `/location-audi-rs-rive-nord`,
`/en/audi-rs-rental-north-shore-montreal`, `/blog`, `/en/blog` et les autres articles existants.
Lien externe permis : https://www.exoticrentalsmontreal.com (Lamborghini et autres exotiques).

## Enrichisseur (mise à jour des anciens articles)

Chaque semaine, la paire FR + EN la moins récemment mise à jour (`updated`, sinon `date`) est enrichie :
faits revérifiés contre `lib/fleet.ts`, liens internes vers les articles et pages plus récents (2 à 5 au total),
FAQ complétée jusqu'à 5 questions, réponse directe (`answer`) resserrée avec des chiffres, une section ajoutée si l'article
fait moins de 900 mots. Le `slug`, le `title` et la `date` ne changent jamais ; `updated` prend la date du jour.

## Vérifier avant de publier

`node scripts/check-blog.mjs` puis `npm run build`.
