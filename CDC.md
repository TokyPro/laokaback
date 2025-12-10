Cahier des Charges - Backend Projet "Laoka"
1. Contexte et Objectifs
Le projet Laoka est une application de planification de repas et de gestion de liste de courses. L'objectif de ce backend est de fournir une API RESTful robuste pour persister les données de l'application (actuellement gérées en local) et permettre une synchronisation multi-supports via une authentification utilisateur.

2. Stack Technique
Les technologies imposées pour ce développement sont :

Langage : Node.js / TypeScript (recommandé pour la type-safety).
Framework Web : Express.js.
ORM : Prisma.
Base de Données : PostgreSQL.
Documentation API : Swagger (OpenAPI).
3. Architecture de la Base de Données (Schéma Prisma Proposé)
La base de données devra gérer les entités suivantes. Voici une proposition de modèles Prisma :

// schema.prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String   // Hashé
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  recipes       Recipe[]
  mealPlans     MealPlan[]
  shoppingItems ShoppingItem[]
}
model Recipe {
  id          String   @id @default(uuid())
  title       String
  image       String?  // URL de l'image
  prepTime    Int      // en minutes
  servings    Int
  tags        String[] // Array de strings (ex: ["facile", "rapide"])
  steps       String[] // Liste des étapes
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  
  ingredients Ingredient[]
  mealPlans   MealPlan[]
}
model Ingredient {
  id        String   @id @default(uuid())
  name      String
  quantity  Float
  unit      String   // Enum ou String simple (g, kg, ml, etc.)
  category  String   // Enum (Legumes, Fruits, etc.)
  
  recipeId  String
  recipe    Recipe   @relation(fields: [recipeId], references: [id], onDelete: Cascade)
}
model MealPlan {
  id        String   @id @default(uuid())
  date      DateTime // ou String "YYYY-MM-DD"
  type      String   // Enum: BREAKFAST, LUNCH, DINNER
  note      String?  // Pour les repas sans recette (ex: "Resto")
  
  recipeId  String?
  recipe    Recipe?  @relation(fields: [recipeId], references: [id])
  
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  
  @@unique([userId, date, type]) // Un seul repas de ce type par jour pour un user
}
model ShoppingItem {
  id        String   @id @default(uuid())
  name      String
  quantity  Float
  unit      String
  category  String
  checked   Boolean  @default(false)
  isManual  Boolean  @default(true) // True = ajouté manuellement, False = généré depuis le plan
  
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  createdAt DateTime @default(now())
}
4. Spécifications Fonctionnelles & Endpoints API
L'API doit exposer les fonctionnalités suivantes, documentées via Swagger.

4.1 Authentification (/auth)
POST /auth/register : Création d'un compte utilisateur.
POST /auth/login : Connexion et récupération du JWT.
GET /auth/me : Récupération du profil courant.
4.2 Gestion des Recettes (/recipes)
GET /recipes : Lister les recettes de l'utilisateur.
GET /recipes/:id : Détails d'une recette.
POST /recipes : Créer une nouvelle recette (avec ingrédients et étapes).
PUT /recipes/:id : Modifier une recette.
DELETE /recipes/:id : Supprimer une recette (et ses ingrédients liés).
4.3 Planning (/planner)
GET /planner : Récupérer le planning (paramètres optionnels startDate, endDate).
POST /planner : Ajouter ou mettre à jour un créneau repas (upsert).
Payload : { date, type, recipeId?, note? }
DELETE /planner/:id : Vider un créneau.
DELETE /planner/clear : Vider tout le planning (ou sur une période).
4.4 Liste de Courses (/shopping)
GET /shopping : Récupérer la liste des courses.
Note : Le backend peut soit stocker toute la liste, soit générer dynamiquement la partie "Recettes" en fonction du planning et fusionner avec les "Items Manuels".
Approche recommandée (Simplifiée) : Tout stocker dans 
ShoppingItem
. Lorsqu'on met à jour le planning, le frontend ou le backend met à jour la liste.
Approche recommandée (Robuste) : GET renvoie l'agrégation de (Ingrédients du Planning - Ingrédients déjà cochés) + (Items Manuels).
POST /shopping : Ajouter un article manuelement.
PATCH /shopping/:id/toggle : Cocher/Décocher un article.
DELETE /shopping/:id : Supprimer un article manuel.
DELETE /shopping/checked : Supprimer tous les articles cochés.
5. Contraintes Non-Fonctionnelles
Sécurité :
Mots de passe hashés (bcrypt ou argon2).
Routes protégées par Middleware JWT (sauf login/register).
Validation :
Validation des entrées (Zod ou Joi) pour éviter les injections et garantir l'intégrité des données.
Documentation :
Swagger UI accessible sur /api-docs.
Evolutivité :
Structure de dossier claire (Controllers, Services, Routes).
6. Structure du Projet Recommandée
src/
  ├── config/         # Config DB, env vars
  ├── controllers/    # Logique de traitement des requêtes
  ├── middlewares/    # Auth, Validation, Error Handling
  ├── routes/         # Définition des endpoints
  ├── services/       # Logique métier (appel Prisma)
  ├── utils/          # Helpers
  └── app.ts          # Point d'entrée Express