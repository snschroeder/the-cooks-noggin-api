BEGIN;

  TRUNCATE
  users
  RESTART IDENTITY CASCADE;

INSERT INTO users
  ("username", "password", "id")
VALUES
  (
    'admin',
    -- 'Password1!' using salt of 12
    '$2a$12$wc5vUYU3XuCnSqaLGVzKu.zzrR.2OTKL977bJBayXpT1bnh9qahcm',
    'f80c78fb-ad06-4e86-9761-d44cafe81ee4'
 ),
  (
    'overlord',
    -- 'Password222 using salt of 12
    '$2a$12$CtEpJzgJ.n.9BySjBJxTEObfvtlW6f5/EtgRiFBJzmFc5DatXBSIC',
    'eb81c150-8211-44e5-8913-2444e2bf71f5'
  );

INSERT INTO recipes 
  ("recipe_id", "name", "ingredients", "instructions", "nutrition", "summary")
VALUES
  (
    'bec047e6-8156-4531-b898-cfeb22c71114',
    'Best Brownies Recipe',
    '½ cup butter\n 1 cup white sugar\n 2 eggs\n 1 teaspoon vanilla extract\n ⅓ cup unsweetened cocoa powder\n ½ cup all-purpose flour\n ¼ teaspoon salt\n ¼ teaspoon baking powder',
    'Step 1\n Preheat oven to 350 degrees F (175 degrees C). Grease and flour an 8-inch square pan.\n Step 2\n In a large saucepan, melt 1/2 cup butter. Remove from heat, and stir in sugar, eggs, and 1 teaspoon vanilla. Beat in 1/3 cup cocoa, 1/2 cup flour, salt, and baking powder. Spread  batter into prepared pan.\n Step 3\n Bake in preheated oven for 25 to 30 minutes. Do not  overcook.\n Step 4\n To Make Frosting: Combine 3 tablespoons softened butter, 3 tablespoons cocoa, honey, 1 teaspoon vanilla extract, and 1 cup confectioners sugar. Stir until smooth. Frost brownies while they are still warm.',
    '183 calories; 9 g total fat; 44 mg cholesterol; 110 mg sodium. 25.7 g carbohydrates; 1.8 g protein',
    'prep:\n 25 mins\n cook:\n 35 mins\n total:\n 1 hr\n Servings:\n 16\n Yield:\n 16 brownies\n'
  ),
  (
    '138de9b7-15ca-4c1a-965e-d161eeb6a46f',
    'Chicken Tikka Masala Sauce Recipe',
    '2 tablespoons ghee (clarified butter)\n 1 onion, finely chopped\n 4 cloves garlic, minced\n 1 tablespoon ground cumin\n 1 teaspoon salt\n 1 teaspoon ground ginger\n 1 teaspoon cayenne pepper\n ½ teaspoon ground cinnamon\n ¼ teaspoon ground turmeric\n 1 (14 ounce) can tomato sauce\n 1 cup heavy whipping cream\n 2 teaspoons paprika\n 1 tablespoon white sugar\n 1 tablespoon vegetable oil\n 4 skinless, boneless chicken breast halves, cut into bite-size pieces\n ½ teaspoon curry powder\n ½ teaspoon salt, or to taste (optional)\n 1 teaspoon white sugar, or to taste (optional)',
    'Step 1\n Heat ghee in a large skillet over medium heat and cook and stir onion until translucent, about 5 minutes. Stir in garlic; cook and stir just until fragrant, about 1 minute. Stir cumin, 1 teaspoon salt, ginger, cayenne pepper, cinnamon, and turmeric into the onion mixture; fry until fragrant, about 2 minutes.\n Step 2\n Stir tomato sauce into the onion and spice mixture, bring to a boil, and reduce heat to low. Simmer sauce for 10 minutes, then mix in cream, paprika, and 1 tablespoon sugar. Bring sauce back to a simmer and cook, stirring often, until sauce is thickened, 10 to 15 minutes.\n Step 3\n Heat vegetable oil in a separate skillet over medium heat. Stir chicken into the hot oil, sprinkle with curry powder, and sear chicken until lightly browned but still pink inside, about 3 minutes; stir often. Transfer chicken and any pan juices into the sauce. Simmer chicken in sauce until no longer pink, about 30 minutes; adjust salt and sugar to taste.',
    '328 calories; 23.4 g total fat; 106 mg cholesterol; 980 mg odium. 13.2 g carbohydrates; 17.9 g protein',
    'Recipe Summary\n prep:\n 15 mins\n cook:\n 1 hr 5 mins\n total:\n 1 hr 20 mins\n Servings:\n 6\n'
  );

INSERT INTO recipe_saves
  ("recipe_id", "user_id", "recipe_name", "saved_timestamp")
VALUES
  ('bec047e6-8156-4531-b898-cfeb22c71114', 'f80c78fb-ad06-4e86-9761-d44cafe81ee4', 'Best Brownies Recipe', now()),
  ('138de9b7-15ca-4c1a-965e-d161eeb6a46f', 'eb81c150-8211-44e5-8913-2444e2bf71f5', 'Chicken Tikka Masala Sauce Recipe', now()),
  ('138de9b7-15ca-4c1a-965e-d161eeb6a46f', 'f80c78fb-ad06-4e86-9761-d44cafe81ee4', 'Chicken Tikka Masala Sauce Recipe',now() - '2 days'::INTERVAL);

COMMIT;
