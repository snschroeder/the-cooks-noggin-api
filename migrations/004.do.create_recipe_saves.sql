DROP TABLE IF EXISTS recipe_saves;

CREATE TABLE recipe_saves (
    recipe_id uuid NOT NULL,
    user_id uuid NOT NULL,
    recipe_name TEXT NOT NULL,
    saved_timestamp TIMESTAMP DEFAULT now() NOT NULL
);