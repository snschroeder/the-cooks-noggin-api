DROP TABLE IF EXISTS recipes;

CREATE TABLE recipes (
    recipe_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    ingredients TEXT NOT NULL,
    instructions TEXT NOT NULL,
    nutrition TEXT,
    summary TEXT,
    image_url TEXT
);