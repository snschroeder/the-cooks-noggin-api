/* eslint-disable camelcase */
const express = require('express');
const RecipesService = require('./recipes-service');
const UsersService = require('../users/users-service');

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
  })
  .post(jsonParser, async (req, res) => {
    const { user_id } = req.params;
    const {
      name,
      ingredients,
      instructions,
      nutrition,
      summary,
      image_url,
    } = req.body;

    if (!RecipesService.validateUUID(user_id)) {
      return res.status(400).json({ error: 'user id is invalid' });
    }
    const user = await UsersService.getUser(req.app.get('db'), user_id);

    if (!user) {
      return res.status(400).json({ error: 'user does not exist' });
    }

    if (!name || !ingredients || !instructions) {
      return res.status(400).json({ error: 'invalid recipe provided' });
    }

    const newRecipe = await RecipesService.addRecipe(req.app.get('db'), name, ingredients, instructions, nutrition, summary, image_url);
    return res.status(201).json(newRecipe);
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
