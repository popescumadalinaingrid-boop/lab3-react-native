import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('recipes.db');

export const initDatabase = () => {
  // TODO: Implement database initialization
};

export const insertRecipe = () => {
  // TODO: Implement insert recipe
};

export const getAllRecipes = () => {
  // TODO: Implement get all recipes
};

export const getRecipeById = (id) => {
  // TODO: Implement get recipe by ID
};

export const updateRecipe = () => {
  // TODO: Implement update recipe
};

export const deleteRecipe = (id) => {
  // TODO: Implement delete recipe
};


// Export the database instance for advanced usage
export default db;
