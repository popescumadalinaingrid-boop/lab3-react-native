import * as SQLite from "expo-sqlite";

const getDatabase = async () => await SQLite.openDatabaseAsync("CookBook.db");

export const getRecipesAsync = async () => {
  try {
    const db = await getDatabase();

    await db.runAsync(`
      CREATE TABLE IF NOT EXISTS recipes (
        id INTEGER PRIMARY KEY NOT NULL, 
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        area TEXT NOT NULL,
        image_url TEXT NULL,
        instructions TEXT NOT NULL,
        ingredients TEXT NOT NULL
      );`
    );

    return await db.getAllAsync('SELECT * FROM recipes');
  } catch (error) {
    console.log(`An error occurred during recipe extraction: ${error.message}`);
  }
};

export const getRecipeAsync = async (id) => {
  try {
    const db = await getDatabase();

    return await db.getFirstAsync(`SELECT * FROM recipes WHERE id = ?`, id);
  } catch (error) {
    console.log(`An error occurred during recipe extraction: ${error.message}`);
  }
};

export const insertRecipeAsync = async (recipe) => {
  try {
    const db = await getDatabase();

    const params = [
      recipe.name ?? "Untitled",
      recipe.category ?? "Unknown",
      recipe.area ?? "Unknown",
      recipe.image_url ?? "",
      recipe.instructions ?? "",
      recipe.ingredients ?? []
    ];

    return (await db.runAsync(
      `INSERT INTO recipes (name, category, area, image_url, instructions, ingredients)
       VALUES (?, ?, ?, ?, ?, ?)`,
      params
    )).changes > 0;
  } catch (error) {
    console.log("Recipe insert failed:", error.message, error);
    return false;
  }
};

export const deleteRecipeAsync = async (id) => {
  try {
    const db = await getDatabase();
    return (await db.runAsync(`DELETE FROM recipes WHERE id = ?`, id)).changes > 0;
  } catch (error) {
    console.log(`An error occurred during recipe delete: ${error.message}`);
    return false;
  }
};

export const updateRecipeAsync = async (recipe) => {
  try {
    const db = await getDatabase();
    const params = [
      recipe.name,
      recipe.category,
      recipe.area,
      recipe.image_url ?? null,
      recipe.instructions,
      recipe.ingredients ?? [],
      recipe.id
    ];

    return (await db.runAsync(
      `UPDATE recipes SET
        name = ?,
        category = ?,
        area = ?,
        image_url = ?,
        instructions = ?,
        ingredients = ?
      WHERE id = ?`,
      params
    )).changes > 0;
  } catch (error) {
    console.log(`An error occurred during recipe update: ${error.message}`);
  }
};
