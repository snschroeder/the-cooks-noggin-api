/* eslint-disable camelcase */
const express = require('express');
const xss = require('xss');
const RecipesService = require('./recipes-service');
const UsersService = require('../users/users-service');
const { protectedWithJWT } = require('../middleware/auth');

const recipesRouter = express.Router();
const jsonParser = express.json();

recipesRouter
  .route('/all').get(async (req, res) => {
    const recipes = await RecipesService.getAllRecipes(req.app.get('db'));
    if (!recipes) {
      return res.status(400).json({ error: 'sorry, it looks like something went amiss. Please refresh and try again' });
    }
    return res.status(200).json(recipes);
  });


recipesRouter
  .route('/user/:user_id').get(async (req, res) => {
    const { user_id } = req.params;

    if (!RecipesService.validateUUID(user_id)) {
      return res.status(400).json({ error: 'user id is invalid' });
    }

    const user = await UsersService.getUser(req.app.get('db'), user_id);

    if (!user) {
      return res.status(400).json({ error: 'user does not exist' });
    }

    const userRecipes = await RecipesService.getUserRecipes(req.app.get('db'), user_id);
    if (!userRecipes) {
      return res.status(400).json({ error: 'user has no recipes saved' });
    }
    return res.status(200).json(userRecipes);
  });

recipesRouter
  .route('/')
  .post(protectedWithJWT, jsonParser, async (req, res) => {
    let {
      // eslint-disable-next-line prefer-const
      user,
      name,
      ingredients,
      instructions,
      nutrition,
      summary,
      image_url,
    } = req.body;

    if (!name || !ingredients || !instructions || !user) {
      return res.status(400).json({ error: 'invalid data provided' });
    }

    const userSanitization = Object.entries(user);

    for (let i = 0; i < userSanitization.length; i += 1) {
      user[userSanitization[i][0]] = xss(userSanitization[i][1]);
    }

    name = xss(name);
    ingredients = xss(ingredients);
    instructions = xss(instructions);
    nutrition = xss(nutrition);
    summary = xss(summary);
    image_url = xss(image_url);

    const newRecipeId = await RecipesService.addRecipe(req.app.get('db'), name, ingredients, instructions, nutrition, summary, image_url, user.id);
    await RecipesService.saveRecipe(req.app.get('db'), ...newRecipeId, user.id, name);
    return res.status(201).json(newRecipeId);
  });

recipesRouter
  .route('/recipe/:recipe_id').get(async (req, res) => {
    const { recipe_id } = req.params;

    if (!RecipesService.validateUUID(recipe_id)) {
      return res.status(400).json({ error: 'recipe id is invalid' });
    }

    const recipeInfo = await RecipesService.getRecipe(req.app.get('db'), recipe_id);
    if (!recipeInfo) {
      return res.status(400).json({ error: 'recipe does not exist' });
    }
    return res.status(200).json(recipeInfo);
  });

module.exports = recipesRouter;
