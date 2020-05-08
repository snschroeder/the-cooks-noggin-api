const RecipesService = {
  validateUUID: (id) => id.length === 36 && typeof (id) === 'string',

  getAllRecipes: (db) => db('recipes')
    .select('*'),

  // eslint-disable-next-line camelcase
  getRecipe: (db, id) => db('recipes')
    .select('*')
    .where({ id })
    .first(),

  // eslint-disable-next-line camelcase
  getUserRecipes: (db, user_id) => db.select('*').from('recipe_saves').where({ user_id })
    // eslint-disable-next-line func-names
    .join('recipes', function () {
      this.on('recipes.id', '=', 'recipe_saves.recipe_id');
    }),

  // eslint-disable-next-line camelcase
  addRecipe: (db, name, ingredients, instructions, nutrition, summary, image_url) => db('recipes')
    .insert({
      name,
      ingredients,
      instructions,
      nutrition,
      summary,
      image_url,
    })
    .returning('id'),
};

module.exports = RecipesService;
