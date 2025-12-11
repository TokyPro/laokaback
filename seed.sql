-- Create a placeholder user
-- Note: In a real application, the password would be hashed.
-- For this seed script, we use a plain text password for simplicity.
INSERT INTO "User" ("id", "email", "password", "name", "createdAt", "updatedAt") VALUES
('11111111-1111-1111-1111-111111111111', 'user@laoka.com', 'password123', 'Laoka User', NOW(), NOW());

-- Recipe 1: Romazava
WITH recipe_insert AS (
  INSERT INTO "Recipe" ("id", "title", "prepTime", "servings", "tags", "steps", "origin", "userId", "createdAt", "updatedAt") VALUES
  ('21111111-1111-1111-1111-111111111111', 'Romazava', 105, 4, ARRAY['Malagasy', 'Ragoût', 'Boeuf', 'Brèdes'], ARRAY[
    'Dans un fait-tout, chauffer l''huile à feu vif et faire revenir les cubes de bœuf jusqu''à ce qu''ils soient bien dorés.',
    'Ajouter l''ail, l''oignon, le gingembre, et la tomate concassée. Bien mélanger.',
    'Saler, poivrer et couvrir complètement la viande d''eau (environ 1.5 litres).',
    'Laisser mijoter à feu doux pendant environ 1 heure.',
    'Laver et préparer les brèdes. Les ajouter dans la marmite.',
    'Laisser cuire à feu doux pendant environ 30 minutes supplémentaires.',
    'Servir chaud avec du riz blanc.'
  ], 'Madagascar', '11111111-1111-1111-1111-111111111111', NOW(), NOW())
  RETURNING "id"
)
INSERT INTO "Ingredient" ("id", "name", "quantity", "unit", "category", "recipeId") VALUES
(gen_random_uuid(), 'Boeuf à ragoût', 1, 'kg', 'Viande', (SELECT "id" FROM recipe_insert)),
(gen_random_uuid(), 'Huile de tournesol', 15, 'ml', 'Condiment', (SELECT "id" FROM recipe_insert)),
(gen_random_uuid(), 'Gousse d''ail', 1, 'unité', 'Condiment', (SELECT "id" FROM recipe_insert)),
(gen_random_uuid(), 'Oignon', 1, 'unité', 'Légume', (SELECT "id" FROM recipe_insert)),
(gen_random_uuid(), 'Gingembre frais', 2, 'cm', 'Condiment', (SELECT "id" FROM recipe_insert)),
(gen_random_uuid(), 'Tomate', 1, 'unité', 'Légume', (SELECT "id" FROM recipe_insert)),
(gen_random_uuid(), 'Brèdes mafana', 2, 'paquets', 'Légume', (SELECT "id" FROM recipe_insert)),
(gen_random_uuid(), 'Sel', 1, 'pincée', 'Condiment', (SELECT "id" FROM recipe_insert)),
(gen_random_uuid(), 'Poivre', 1, 'pincée', 'Condiment', (SELECT "id" FROM recipe_insert));

-- Recipe 2: Ravitoto
WITH recipe_insert AS (
  INSERT INTO "Recipe" ("id", "title", "prepTime", "servings", "tags", "steps", "origin", "userId", "createdAt", "updatedAt") VALUES
  ('22222222-2222-2222-2222-222222222222', 'Ravitoto sy Henakisoa', 60, 4, ARRAY['Malagasy', 'Plat principal', 'Porc', 'Manioc'], ARRAY[
    'Faire cuire la viande de porc dans une cocotte remplie d''eau jusqu''à ce qu''elle soit tendre. Égoutter et réserver.',
    'Faire dorer les morceaux de porc dans une cocotte avec un peu d''huile si nécessaire. Saler et poivrer.',
    'Piler l''ail avec un peu de sel. Ajouter le mélange à la viande et remuer.',
    'Verser les feuilles de manioc pilées et un bol d''eau (ou lait de coco) dans la cocotte.',
    'Laisser mijoter à feu doux pendant au moins 30 minutes.',
    'Servir chaud avec du riz blanc.'
  ], 'Madagascar', '11111111-1111-1111-1111-111111111111', NOW(), NOW())
  RETURNING "id"
)
INSERT INTO "Ingredient" ("id", "name", "quantity", "unit", "category", "recipeId") VALUES
(gen_random_uuid(), 'Échine de porc', 500, 'g', 'Viande', (SELECT "id" FROM recipe_insert)),
(gen_random_uuid(), 'Feuilles de manioc pilées (surgelées)', 500, 'g', 'Légume', (SELECT "id" FROM recipe_insert)),
(gen_random_uuid(), 'Gousses d''ail', 3, 'unités', 'Condiment', (SELECT "id" FROM recipe_insert)),
(gen_random_uuid(), 'Lait de coco', 200, 'ml', 'Épicerie', (SELECT "id" FROM recipe_insert)),
(gen_random_uuid(), 'Sel', 1, 'pincée', 'Condiment', (SELECT "id" FROM recipe_insert));

-- Recipe 3: Masikita
WITH recipe_insert AS (
  INSERT INTO "Recipe" ("id", "title", "prepTime", "servings", "tags", "steps", "origin", "userId", "createdAt", "updatedAt") VALUES
  ('33333333-3333-3333-3333-333333333333', 'Masikita', 90, 6, ARRAY['Malagasy', 'Brochette', 'Boeuf', 'Grillade'], ARRAY[
    'Couper le filet de bœuf en dés de taille égale.',
    'Dans un grand bol, mélanger la sauce soja, le miel, l''huile, le sel, l''ail, le gingembre et le poivre.',
    'Ajouter les dés de bœuf à la marinade et bien mélanger.',
    'Laisser mariner la viande pendant au moins 1 heure.',
    'Enfiler les morceaux de viande sur des brochettes.',
    'Faire cuire les brochettes au barbecue ou à la plancha pendant 3 à 5 minutes de chaque côté.',
    'Servir chaud.'
  ], 'Madagascar', '11111111-1111-1111-1111-111111111111', NOW(), NOW())
  RETURNING "id"
)
INSERT INTO "Ingredient" ("id", "name", "quantity", "unit", "category", "recipeId") VALUES
(gen_random_uuid(), 'Filet de bœuf', 1, 'kg', 'Viande', (SELECT "id" FROM recipe_insert)),
(gen_random_uuid(), 'Sauce soja', 1, 'cs', 'Condiment', (SELECT "id" FROM recipe_insert)),
(gen_random_uuid(), 'Miel', 1, 'cs', 'Condiment', (SELECT "id" FROM recipe_insert)),
(gen_random_uuid(), 'Huile d''olive', 1, 'filet', 'Condiment', (SELECT "id" FROM recipe_insert)),
(gen_random_uuid(), 'Ail en poudre', 1, 'cc', 'Condiment', (SELECT "id" FROM recipe_insert)),
(gen_random_uuid(), 'Sel', 1, 'pincée', 'Condiment', (SELECT "id" FROM recipe_insert)),
(gen_random_uuid(), 'Poivre', 1, 'pincée', 'Condiment', (SELECT "id" FROM recipe_insert));
